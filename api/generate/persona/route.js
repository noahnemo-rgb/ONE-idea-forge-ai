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
      You are a world-class UX researcher and product strategist.
      Generate 3 detailed user personas for the following app idea.
      
      App Idea: ${idea.title} - ${idea.description}
      
      For each persona, include:
      - Name and Role
      - Demographics (Age, Location, Income)
      - Psychographics (Goals, Pain Points, Tech Savviness)
      - A "Day in the Life" snippet related to the app.
      - Why they would use this specific app.
      
      Return ONLY a valid JSON array of 3 objects.
    `;

    const response = await fetch(`${process.env.APP_URL}/api/ai-proxy`, {
      method: "POST",
      body: JSON.stringify({
        prompt: `Generate user personas for: ${idea.title}`,
        systemPrompt,
        json: true,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate personas");
    }

    const personas = await response.json();
    return Response.json({ personas });
  } catch (error) {
    console.error("Persona generation error:", error);
    return Response.json(
      { error: "Failed to generate personas" },
      { status: 500 },
    );
  }
}
