import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { ideaTitle, ideaDescription } = await request.json();

    const systemPrompt = `
      You are a Growth Marketing Expert. 
      Create a comprehensive Go-to-Market (GTM) strategy for the first 90 days.
      Return a JSON object with:
      - "phase1": { "title": "Days 1-30: Foundation", "actions": [] }
      - "phase2": { "title": "Days 31-60: Launch & Traction", "actions": [] }
      - "phase3": { "title": "Days 61-90: Scale & Optimization", "actions": [] }
      - "channels": ["List of top 3 marketing channels"]
      - "kpis": ["List of 3 key metrics to track"]
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
            name: "gtm_strategy",
            schema: {
              type: "object",
              properties: {
                phase1: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    actions: { type: "array", items: { type: "string" } },
                  },
                  required: ["title", "actions"],
                },
                phase2: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    actions: { type: "array", items: { type: "string" } },
                  },
                  required: ["title", "actions"],
                },
                phase3: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    actions: { type: "array", items: { type: "string" } },
                  },
                  required: ["title", "actions"],
                },
                channels: { type: "array", items: { type: "string" } },
                kpis: { type: "array", items: { type: "string" } },
              },
              required: ["phase1", "phase2", "phase3", "channels", "kpis"],
              additionalProperties: false,
            },
          },
        }),
      },
    );

    const data = await response.json();
    const gtm = JSON.parse(data.choices[0].message.content);

    return Response.json({ gtm });
  } catch (error) {
    console.error("GTM error:", error);
    return Response.json(
      { error: "Failed to generate GTM strategy" },
      { status: 500 },
    );
  }
}
