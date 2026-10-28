import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Upforge Studio, Software Company in Sri Lanka",
    short_name: "Upforge",
    description: "Websites, apps, business software and AI tools built in Colombo, Sri Lanka.",
    start_url: "/",
    display: "standalone",
    background_color: "#00041c",
    theme_color: "#00041c",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
