import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import GalleryGrid from "@/components/GalleryGrid";
import ContactPanel from "@/components/ContactPanel";
import Footer from "@/components/Footer";
import { getGallery } from "@/lib/data";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos and screens from the Upforge studio in Colombo and the software products we build.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const images = await getGallery();
  return (
    <div className="page">
      <PageIntro label="Gallery" lines={["Inside", "the studio"]} kicker={`${images.length} photo${images.length === 1 ? "" : "s"}`} />
      <section className="section"><GalleryGrid images={images} /></section>
      <ContactPanel />
      <Footer />
    </div>
  );
}
