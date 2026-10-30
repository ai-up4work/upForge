import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import GalleryGrid from "@/components/GalleryGrid";
import ContactPanel from "@/components/ContactPanel";
import Footer from "@/components/Footer";
import { getGalleryWithProjects } from "@/lib/data";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Gallery: Project Screens & Studio Photos",
  description: "Screens from websites, apps and software built by Upforge in Sri Lanka, plus photos from our Colombo studio. Filter by project.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const images = await getGalleryWithProjects();
  return (
    <div className="page">
      <PageIntro label="Gallery" lines={["Studio", "& project", "gallery"]} kicker={`${images.length} photo${images.length === 1 ? "" : "s"}`} />
      <section className="section"><GalleryGrid images={images} /></section>
      <ContactPanel />
      <Footer />
    </div>
  );
}
