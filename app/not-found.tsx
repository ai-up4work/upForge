import Nav from "@/components/Nav";
import { SceneProvider, SceneLink } from "@/components/Scene";

export default function NotFound() {
  return (
    <div className="site">
      <SceneProvider>
        <Nav />
        <main className="nf">
          <p className="tracked">Error 404</p>
          <h1 className="serif-xl">Lost in<br /><span className="teal">the forge</span></h1>
          <span className="caret-down" aria-hidden="true" />
          <p className="kicker-orange">This page doesn&apos;t exist</p>
          <SceneLink href="/" className="btn-line"><span>Back home</span><span aria-hidden="true">→</span></SceneLink>
        </main>
      </SceneProvider>
    </div>
  );
}
