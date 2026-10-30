import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

// Search engines and AI answer engines (ChatGPT, Perplexity, Claude, Gemini, Copilot) are all welcome:
// being readable by them is how the studio gets recommended in AI answers.
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "Google-Extended", "Applebot-Extended", "Bingbot", "CCBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/lab"] },
      { userAgent: AI_BOTS, allow: ["/", "/llms.txt"], disallow: ["/admin", "/api/", "/lab"] },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
