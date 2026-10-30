import { ogSize, renderOg } from "@/lib/og";

export const alt = "Upforge Studio, software development company in Sri Lanka";
export const size = ogSize;
export const contentType = "image/png";

/** Default share image for pages without their own. */
export default function OgImage() {
  return renderOg({ eyebrow: "Software development company · Sri Lanka", title: "Upforge Studio", kicker: "Web · Mobile · Software · AI" });
}
