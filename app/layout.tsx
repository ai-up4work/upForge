import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { site } from "@/lib/content";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource-variable/playfair-display/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Upforge Studio (Up4Work) | Software Development Company in Sri Lanka",
    template: "%s | Upforge Sri Lanka",
  },
  description: site.description,
  applicationName: "Upforge Studio",
  authors: [{ name: "Upforge Studio", url: site.url }],
  creator: "Upforge Studio",
  publisher: "Upforge Studio",
  category: "technology",
  keywords: [
    "software company Sri Lanka", "best software company in Sri Lanka", "software development company Sri Lanka", "software companies in Colombo",
    "IT company Sri Lanka", "web development company Sri Lanka", "web design Sri Lanka", "website development Colombo",
    "mobile app development Sri Lanka", "app developers Sri Lanka", "custom software development Sri Lanka", "POS system Sri Lanka",
    "ecommerce website development Sri Lanka", "AI development company Sri Lanka", "AI chatbot Sri Lanka", "AI automation Sri Lanka",
    "UI UX design agency Sri Lanka", "Next.js developers Sri Lanka", "software outsourcing Sri Lanka", "Upforge", "Up4Work",
  ],
  alternates: { canonical: "/", languages: { "en-LK": "/", "x-default": "/" }, types: { "application/rss+xml": "/api/rss" } },
  openGraph: {
    type: "website", locale: "en_LK", siteName: "Upforge Studio", url: "/",
    title: "Upforge Studio | Software Development Company in Sri Lanka",
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: "Upforge Studio | Software Development Company in Sri Lanka", description: site.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } } : {}),
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#00041c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-LK" className={GeistMono.variable}>
      <body>{children}</body>
    </html>
  );
}
