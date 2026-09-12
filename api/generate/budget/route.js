import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { ideaTitle, ideaDescription } = await request.json();

    const systemPrompt = `
      You are a Startup Consultant and Financial Advisor. 
      Estimate the initial launch budget for the following app idea.
      Provide estimates for:
      1. Development (MVP)
      2. Design & Branding
      3. Marketing & Launch
      4. Infrastructure & Tools (Monthly)
      5. Legal & Admin
      Return a JSON object with "estimates" (array of objects with category, amount_range, and description) and a "total_range".
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
            name: "budget_estimate",
            schema: {
              type: "object",
              properties: {
                estimates: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      category: { type: "string" },
                      amount_range: { type: "string" },
                      description: { type: "string" },
                    },
                    required: ["category", "amount_range", "description"],
                    additionalProperties: false,
                  },
                },
                total_range: { type: "string" },
              },
              required: ["estimates", "total_range"],
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
    console.error("Budget error:", error);
    return Response.json(
      { error: "Failed to generate budget estimate" },
      { status: 500 },
    );
  }
}
