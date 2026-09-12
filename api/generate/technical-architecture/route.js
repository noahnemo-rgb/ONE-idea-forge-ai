import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { ideaTitle, ideaDescription } = await request.json();

    const systemPrompt = `
      You are a Senior Software Architect. 
      Design a detailed technical architecture for the following app idea.
      Focus on database schema and API structure.
      Return a JSON object with:
      - "database_schema": [ { "table": "name", "columns": ["col1 type", "col2 type"] } ]
      - "api_endpoints": [ { "path": "/api/v1/...", "method": "GET/POST", "description": "..." } ]
      - "architecture_notes": "Brief explanation of the architectural pattern (e.g., Microservices, Monolith, Serverless)"
    `;

    const userPrompt = `
      Idea: ${ideaTitle}
      Description: ${ideaDescription}
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
            name: "technical_architecture",
            schema: {
              type: "object",
              properties: {
                database_schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      table: { type: "string" },
                      columns: { type: "array", items: { type: "string" } },
                    },
                    required: ["table", "columns"],
                  },
                },
                api_endpoints: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      path: { type: "string" },
                      method: { type: "string" },
                      description: { type: "string" },
                    },
                    required: ["path", "method", "description"],
                  },
                },
                architecture_notes: { type: "string" },
              },
              required: [
                "database_schema",
                "api_endpoints",
                "architecture_notes",
              ],
              additionalProperties: false,
            },
          },
        }),
      },
    );

    const data = await response.json();
    const architecture = JSON.parse(data.choices[0].message.content);

    return Response.json({ architecture });
  } catch (error) {
    console.error("Architecture error:", error);
    return Response.json(
      { error: "Failed to generate technical architecture" },
      { status: 500 },
    );
  }
}
