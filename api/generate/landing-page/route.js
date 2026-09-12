import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { ideaTitle, ideaDescription, keyFeatures } = await request.json();

    const systemPrompt = `
      You are a Conversion Copywriter. 
      Generate high-converting landing page copy for the following app idea.
      Return a JSON object with:
      1. Hero Section (Headline, Subheadline, CTA Text)
      2. Problem Section (Title, Description)
      3. Solution Section (Title, Description)
      4. Features Section (Array of 3 features with Title and Description)
      5. FAQ Section (Array of 3 common questions and answers)
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
            name: "landing_page_copy",
            schema: {
              type: "object",
              properties: {
                hero: {
                  type: "object",
                  properties: {
                    headline: { type: "string" },
                    subheadline: { type: "string" },
                    cta: { type: "string" },
                  },
                  required: ["headline", "subheadline", "cta"],
                  additionalProperties: false,
                },
                problem: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                  },
                  required: ["title", "description"],
                  additionalProperties: false,
                },
                solution: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                  },
                  required: ["title", "description"],
                  additionalProperties: false,
                },
                features: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                    },
                    required: ["title", "description"],
                    additionalProperties: false,
                  },
                },
                faq: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      answer: { type: "string" },
                    },
                    required: ["question", "answer"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["hero", "problem", "solution", "features", "faq"],
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
    console.error("Landing page error:", error);
    return Response.json(
      { error: "Failed to generate landing page copy" },
      { status: 500 },
    );
  }
}
