import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const {
      ideaTitle,
      ideaDescription,
      targetAudience,
      problemSolved,
      uniqueValueProp,
    } = await request.json();

    const systemPrompt = `
      You are a world-class startup pitch coach.
      Create a 10-slide pitch deck structure for the following idea.
      For each slide, provide a Title and 3-4 bullet points of content.
      Return a JSON object with an array of slides.
    `;

    const userPrompt = `
      Idea: ${ideaTitle}
      Description: ${ideaDescription}
      Target Audience: ${targetAudience}
      Problem: ${problemSolved}
      Unique Value Prop: ${uniqueValueProp}
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
            name: "pitch_deck",
            schema: {
              type: "object",
              properties: {
                slides: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      content: { type: "array", items: { type: "string" } },
                    },
                    required: ["title", "content"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["slides"],
              additionalProperties: false,
            },
          },
        }),
      },
    );

    const data = await response.json();
    const pitchDeck = JSON.parse(data.choices[0].message.content);

    return Response.json({ pitchDeck });
  } catch (error) {
    console.error("Pitch deck error:", error);
    return Response.json(
      { error: "Failed to generate pitch deck" },
      { status: 500 },
    );
  }
}
