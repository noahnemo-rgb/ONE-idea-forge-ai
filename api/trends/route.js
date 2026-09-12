export async function GET() {
  // In a real app, this might scrape or call a trends API
  // For now, we'll return some curated trending niches
  const trends = [
    {
      id: 1,
      topic: "AI-Powered Micro-SaaS",
      category: "Tech",
      source: "Market Trends",
    },
    {
      id: 2,
      topic: "Sustainable E-commerce",
      category: "Retail",
      source: "Consumer Reports",
    },
    {
      id: 3,
      topic: "Remote Team Wellness",
      category: "HR",
      source: "Workplace Trends",
    },
    {
      id: 4,
      topic: "Personalized Learning Paths",
      category: "EdTech",
      source: "Education Trends",
    },
    {
      id: 5,
      topic: "Hyper-local Delivery Networks",
      category: "Logistics",
      source: "Urban Trends",
    },
  ];

  return Response.json({ trends });
}
