import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { ideaTitle, ideaDescription } = await request.json();

    const systemPrompt = `
      You are a skeptical Venture Capitalist (VC) and Product Critic. 
      Provide a "stress test" feedback for the following app idea.
      Be brutally honest but constructive.
      Return a JSON object with:
      - "skeptic_view": "The main reason this might fail"
      - "critical_questions": ["3 tough questions an investor would ask"]
      - "potential_pivots": ["2 alternative directions if the main idea fails"]
      - "score_out_of_10": number
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
            name: "feedback_simulator",
            schema: {
              type: "object",
              properties: {
                skeptic_view: { type: "string" },
                critical_questions: {
                  type: "array",
                  items: { type: "string" },
                },
                potential_pivots: { type: "array", items: { type: "string" } },
                score_out_of_10: { type: "number" },
              },
              required: [
                "skeptic_view",
                "critical_questions",
                "potential_pivots",
                "score_out_of_10",
              ],
              additionalProperties: false,
            },
          },
        }),
      },
    );

    const data = await response.json();
    const feedback = JSON.parse(data.choices[0].message.content);

    return Response.json({ feedback });
  } catch (error) {
    console.error("Feedback error:", error);
    return Response.json(
      { error: "Failed to simulate feedback" },
      { status: 500 },
    );
  }
}
