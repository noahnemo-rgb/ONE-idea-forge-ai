import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { ideaTitle, ideaDescription } = await request.json();

    const systemPrompt = `
      You are a Market Research Analyst. 
      Identify 4-5 direct or indirect competitors for the following app idea.
      For each competitor, provide:
      1. Name
      2. Their core value proposition
      3. Their primary weakness compared to this new idea
      4. A "Market Position" (e.g., "Premium", "Mass Market", "Niche", "Legacy")
      Return a JSON object with a "competitors" array.
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
            name: "competitor_map",
            schema: {
              type: "object",
              properties: {
                competitors: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      value_prop: { type: "string" },
                      weakness: { type: "string" },
                      market_position: { type: "string" },
                    },
                    required: [
                      "name",
                      "value_prop",
                      "weakness",
                      "market_position",
                    ],
                    additionalProperties: false,
                  },
                },
              },
              required: ["competitors"],
              additionalProperties: false,
            },
          },
        }),
      },
    );

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return Response.json(result);
  } catch (error) {
    console.error("Competitor map error:", error);
    return Response.json(
      { error: "Failed to generate competitor map" },
      { status: 500 },
    );
  }
}
