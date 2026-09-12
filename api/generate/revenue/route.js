import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { idea } = await request.json();

    if (!idea) {
      return Response.json({ error: "Idea is required" }, { status: 400 });
    }

    const systemPrompt = `
      You are a startup CFO and financial modeler.
      Generate a 12-month revenue simulation for the following app idea.
      
      App Idea: ${idea.title} - ${idea.description}
      Monetization: ${JSON.stringify(idea.monetization_strategies)}
      
      Provide:
      1. A breakdown of 3 pricing tiers (Basic, Pro, Enterprise).
      2. Projected growth metrics (User acquisition, Churn rate, ARPU).
      3. A month-by-month revenue projection for the first year (as an array of 12 numbers).
      4. Key assumptions made for this model.
      
      Return ONLY a valid JSON object with these keys:
      {
        "tiers": [{"name": "Tier Name", "price": "$X/mo", "features": []}],
        "metrics": {"acquisition": "X users/mo", "churn": "X%", "arpu": "$X"},
        "projections": [100, 250, ...],
        "assumptions": ["Assumption 1", "Assumption 2"]
      }
    `;

    const response = await fetch(`${process.env.APP_URL}/api/ai-proxy`, {
      method: "POST",
      body: JSON.stringify({
        prompt: `Generate revenue model for: ${idea.title}`,
        systemPrompt,
        json: true,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate revenue model");
    }

    const revenueModel = await response.json();
    return Response.json({ revenueModel });
  } catch (error) {
    console.error("Revenue simulation error:", error);
    return Response.json(
      { error: "Failed to generate revenue model" },
      { status: 500 },
    );
  }
}
