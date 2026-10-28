import Nav from "@/components/Nav";
import FloatingCta from "@/components/FloatingCta";
import SmoothScroll from "@/components/SmoothScroll";
import { SceneMain, SceneProvider } from "@/components/Scene";
import JsonLd from "@/components/JsonLd";
import { organization, website } from "@/lib/seo";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site">
      <JsonLd data={[organization(), website()]} />
      <SmoothScroll />
      <a href="#main" className="skip">Skip to content</a>
      <SceneProvider>
        <Nav />
        <SceneMain>
          <main id="main">{children}</main>
        </SceneMain>
        <FloatingCta />
      </SceneProvider>
    </div>
  );
}
