import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Cloudinary + any https image an admin pastes by URL
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  serverExternalPackages: ["mongoose", "cloudinary"],
  // fonts read from disk by the social-share image routes
  outputFileTracingIncludes: { "/**/opengraph-image*": ["./lib/og-fonts/**", "./public/images/**"], "/**/twitter-image*": ["./lib/og-fonts/**", "./public/images/**"] },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      { source: "/admin", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
