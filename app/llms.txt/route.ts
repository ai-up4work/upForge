import { site } from "@/lib/content";
import { services } from "@/lib/services";
import { getPosts, getProjects } from "@/lib/data";

export const revalidate = 3600;

/** llms.txt: a plain summary of the studio for AI assistants and answer engines. */
export async function GET() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts({ limit: 20 })]);
  const u = (p: string) => `${site.url}${p}`;
  const body = `# Upforge Studio (formerly Up4Work)

> ${site.description} Based in Colombo, Sri Lanka; works with clients in Sri Lanka and worldwide.

- Company type: software development company / digital product studio
- Location: Colombo, Western Province, Sri Lanka
- Contact: ${site.email}${site.phone ? ` · ${site.phone}` : ""} · ${u("/contact")}
- Also known as: Upforge, Up4Work
- Engagement: fixed quotes, weekly demos, client owns 100% of the code

## Services
${services.map((s) => `- [${s.name}](${u(`/services/${s.slug}`)}): ${s.description}`).join("\n")}

## Projects
${projects.map((p) => `- [${p.title}](${u(`/work/${p.slug}`)}): ${p.description}`).join("\n")}

## Journal
${posts.map((p) => `- [${p.title}](${u(`/blog/${p.slug}`)}): ${p.description}`).join("\n")}

## Key pages
- [About](${u("/about")})
- [Work](${u("/work")})
- [Gallery](${u("/gallery")})
- [Contact](${u("/contact")})
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
