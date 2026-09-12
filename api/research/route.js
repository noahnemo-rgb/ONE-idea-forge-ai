import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ideaTitle, ideaDescription } = await request.json();

    if (!ideaTitle) {
      return Response.json({ error: "Missing ideaTitle" }, { status: 400 });
    }

    // 1. Search for market trends and competitors
    const searchQuery = `market trends and competitors for ${ideaTitle}: ${ideaDescription}`;
    const searchResponse = await fetch(
      `${process.env.APP_URL}/integrations/google-search/search?q=${encodeURIComponent(searchQuery)}`,
    );
    const searchData = await searchResponse.json();

    // 2. Use AI to analyze the search results
    const aiPrompt = `
      Analyze the following market research data for an app idea called "${ideaTitle}".
      Description: ${ideaDescription}
      
      Search Results:
      ${JSON.stringify(searchData.items?.slice(0, 5))}
      
      Provide a concise summary of:
      1. Current Market Trends
      2. Potential Competitors
      3. Market Opportunity
      4. Suggested Next Steps
    `;

    const aiResponse = await fetch(
      `${process.env.APP_URL}/integrations/chat-gpt/chat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: aiPrompt }],
        }),
      },
    );

    const aiData = await aiResponse.json();
    const research =
      aiData.choices?.[0]?.message?.content || "No research data available.";

    return Response.json({ research });
  } catch (error) {
    console.error("Market research error:", error);
    return Response.json(
      { error: "Failed to perform market research" },
      { status: 500 },
    );
  }
}
