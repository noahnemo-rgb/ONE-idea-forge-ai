import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    const {
      prompt,
      models,
      creativeMode = "balanced",
      isPro: bodyIsPro,
    } = await request.json();

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    let userId = null;
    let isPro = bodyIsPro || false; // Trust the body flag (e.g. from mobile RevenueCat check)
    let credits = 0;

    if (userEmail) {
      // 1. Get or create user in our app's users table
      const [user] = await sql`
        SELECT id, subscription_status, credits, last_credit_reset 
        FROM users WHERE email = ${userEmail}
      `;

      if (user) {
        userId = user.id;
        // If bodyIsPro is true, we trust it (mobile), otherwise check DB (web/stripe)
        isPro =
          isPro ||
          user.subscription_status === "pro" ||
          user.subscription_status === "active";

        // Credit reset logic (daily)
        const now = new Date();
        const lastReset = new Date(user.last_credit_reset);
        const isNewDay = now.toDateString() !== lastReset.toDateString();

        if (isNewDay) {
          credits = 3;
          await sql`
            UPDATE users SET credits = 3, last_credit_reset = NOW() 
            WHERE id = ${userId}
          `;
        } else {
          credits = user.credits;
        }
      } else {
        // Create user if they don't exist in our table yet
        const [newUser] = await sql`
          INSERT INTO users (email, subscription_status, credits, last_credit_reset)
          VALUES (${userEmail}, 'free', 3, NOW())
          RETURNING id, credits
        `;
        userId = newUser.id;
        credits = 3;
      }
    }

    // 2. Check limits
    if (!isPro && credits <= 0 && userId) {
      return Response.json(
        {
          error: "Daily limit reached",
          limitReached: true,
        },
        { status: 403 },
      );
    }

    // 3. Prepare the refined system prompt
    const modeInstructions = {
      conservative:
        "Focus on low-risk, proven business models and incremental improvements to existing solutions. Prioritize technical feasibility and clear monetization.",
      disruptive:
        "Focus on high-risk, high-reward 'moonshot' ideas. Think about how to completely change an industry or create a new one. Prioritize unique value propositions and massive scale.",
      niche:
        "Focus on highly specific, underserved markets or micro-communities. Prioritize deep problem-solving for a small but passionate audience.",
      balanced:
        "A mix of innovation and practicality. Focus on solid business fundamentals with a unique twist.",
    };

    const systemPrompt = `
      You are an expert startup consultant, venture capitalist, and product strategist.
      
      Your goal is to transform a simple user seed into a high-fidelity, validated app concept.
      
      ### CREATIVE MODE: ${creativeMode.toUpperCase()}
      ${modeInstructions[creativeMode] || modeInstructions.balanced}
      
      ### INSTRUCTIONS:
      1. **Internal Analysis (Chain of Thought)**: Before generating the final JSON, internally analyze:
         - The current market landscape for the seed idea.
         - Specific underserved niches or "blue ocean" opportunities.
         - Potential technical hurdles and how to overcome them.
         - The most viable path to first $1k MRR.
      
      2. **Output Requirements**:
         - Be specific, not generic. Avoid "a platform for X". Instead, describe "A specialized AI-driven workflow for Y".
         - Ensure the monetization strategy is realistic for the target audience.
         - The "unique_value_prop" must be a "killer feature" or a significant shift in user experience.
      
      3. **JSON Format**: Return ONLY a valid JSON object with this structure:
      {
        "title": "App Name",
        "description": "A compelling one-sentence elevator pitch.",
        "target_audience": "Detailed description of the primary user persona.",
        "problem_solved": "The specific, painful problem this app eliminates.",
        "unique_value_prop": "The 'unfair advantage' or unique angle that beats competitors.",
        "key_features": ["Feature 1: Brief description", "Feature 2: Brief description", "Feature 3: Brief description"],
        "monetization_strategies": ["Primary: e.g., $19/mo SaaS", "Secondary: e.g., Marketplace fee"],
        "technical_feasibility": "Detailed assessment (High/Medium/Low) + MVP tech stack suggestion.",
        "market_validation_hints": "Specific trends (e.g., 'Rise of remote work') or competitor weaknesses.",
        "scores": {
          "market_size": 1-10,
          "build_difficulty": 1-10,
          "monetization_potential": 1-10
        }
      }
    `;

    // 4. Orchestrate multi-model calls
    // We'll simulate the calls to different providers.
    // In a real implementation, you'd use the provided userApiKeys or system keys.

    const generateFromModel = async (modelName) => {
      // This is where you'd call OpenAI, Anthropic, etc.
      // For this demo, we'll use a single AI integration if available,
      // or mock the multi-model behavior by calling the primary AI with different "personalities".

      const response = await fetch(`${process.env.APP_URL}/api/ai-proxy`, {
        method: "POST",
        body: JSON.stringify({
          prompt: `Model: ${modelName}. User Seed: ${prompt}`,
          systemPrompt,
          json: true,
        }),
      });

      if (!response.ok) return null;
      return await response.json();
    };

    // Query 3 models (simulated)
    const selectedModels = models || [
      "gpt-4o",
      "claude-3-sonnet",
      "gemini-pro",
    ];
    const results = await Promise.all(
      selectedModels.map((m) => generateFromModel(m)),
    );

    const validResults = results.filter((r) => r !== null);

    // 5. Save to DB and decrement credits
    if (userId && validResults.length > 0) {
      if (!isPro) {
        await sql`UPDATE users SET credits = credits - 1 WHERE id = ${userId}`;
      }

      for (const idea of validResults) {
        await sql`
          INSERT INTO ideas (
            user_id, prompt, title, description, target_audience, 
            problem_solved, unique_value_prop, key_features, 
            monetization_strategies, technical_feasibility, 
            market_validation_hints, scores, model_source, creative_mode
          ) VALUES (
            ${userId}, ${prompt}, ${idea.title}, ${idea.description}, 
            ${idea.target_audience}, ${idea.problem_solved}, 
            ${idea.unique_value_prop}, ${JSON.stringify(idea.key_features)}, 
            ${JSON.stringify(idea.monetization_strategies)}, 
            ${idea.technical_feasibility}, ${idea.market_validation_hints}, 
            ${JSON.stringify(idea.scores)}, ${idea.model_source || "ai"}, ${creativeMode}
          )
        `;
      }
    }

    return Response.json({
      ideas: validResults,
      remainingCredits: isPro ? "unlimited" : credits - 1,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return Response.json(
      { error: "Failed to generate ideas" },
      { status: 500 },
    );
  }
}
