import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { ideaTitle, ideaDescription, keyFeatures } = await request.json();

    const systemPrompt = `
      You are a CTO and Lead Architect. 
      Suggest a modern, scalable tech stack for the following app idea.
      Provide specific libraries, APIs, and infrastructure choices.
      Return a JSON object with categories: Frontend, Backend, Database, Auth, Hosting, and "Specialized APIs".
    `;

    const userPrompt = `
      Idea: ${ideaTitle}
      Description: ${ideaDescription}
      Key Features: ${keyFeatures.join(", ")}
    `;

    const response = await fetch(
      `${process.env.APP_URL}/integrations/chat-gpt/conversationgpt4`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          json_schema: {
            name: "tech_stack",
            schema: {
              type: "object",
              properties: {
                frontend: { type: "string" },
                backend: { type: "string" },
                database: { type: "string" },
                auth: { type: "string" },
                hosting: { type: "string" },
                specialized_apis: { type: "array", items: { type: "string" } },
              },
              required: [
                "frontend",
                "backend",
                "database",
                "auth",
                "hosting",
                "specialized_apis",
              ],
              additionalProperties: false,
            },
          },
        }),
      },
    );

    const data = await response.json();
    const techStack = JSON.parse(data.choices[0].message.content);

    return Response.json({ techStack });
  } catch (error) {
    console.error("Tech stack error:", error);
    return Response.json(
      { error: "Failed to suggest tech stack" },
      { status: 500 },
    );
  }
}
