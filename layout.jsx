import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>IdeaForge | AI Startup Idea Generator & Validator</title>
        <meta
          name="description"
          content="Generate, validate, and document high-quality startup ideas using multiple AI models. Get market scores, monetization strategies, and technical specs instantly."
        />
        <meta
          name="keywords"
          content="AI startup ideas, app generator, business validator, GPT-4 startup, Claude 3 business, startup specs, market validation"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ideaforge.ai" />
        <meta
          property="og:title"
          content="IdeaForge | AI Startup Idea Generator & Validator"
        />
        <meta
          property="og:description"
          content="Turn your sparks into validated startups. Generate high-quality, actionable app ideas using multiple leading AI models."
        />
        <meta
          property="og:image"
          content="https://raw.createusercontent.com/ad090e6e-0a7f-4f97-84dc-20f0e351c82f/"
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://ideaforge.ai" />
        <meta
          property="twitter:title"
          content="IdeaForge | AI Startup Idea Generator & Validator"
        />
        <meta
          property="twitter:description"
          content="Turn your sparks into validated startups. Generate high-quality, actionable app ideas using multiple leading AI models."
        />
        <meta
          property="twitter:image"
          content="https://raw.createusercontent.com/ad090e6e-0a7f-4f97-84dc-20f0e351c82f/"
        />

        <link
          rel="icon"
          href="https://raw.createusercontent.com/ad090e6e-0a7f-4f97-84dc-20f0e351c82f/"
        />
      </head>
      <body className="antialiased">
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
