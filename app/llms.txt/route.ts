import { getBlogPosts, getSettings } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  const s = await getSettings().catch(() => ({} as Record<string, string>));
  const base = (s.site_url || "https://chrismccann.co").replace(/\/$/, "");
  const name = s.llms_title || "Chris McCann — Field Notes";
  const tagline =
    s.llms_tagline ||
    s.site_description ||
    "Consciousness, leadership, and the gap between what leaders do and what they're carrying when they do it.";
  const intro =
    s.llms_intro ||
    "Chris McCann writes about consciousness, leadership, and the field between people. Fifteen years leading sales teams. Co-authoring a book with Dr. Carlos Warter (Park Street Press, spring 2027). Field Notes is where the questions get worked through before the book has answers for them.";

  const posts = (await getBlogPosts().catch(() => [])) as Array<{
    slug: string;
    title: string;
    description?: string;
  }>;

  const essayLines = posts
    .map((p) => {
      const d = (p.description || "").replace(/\s+/g, " ").trim();
      return `- [${p.title}](${base}/blog/${p.slug})${d ? ` — ${d}` : ""}`;
    })
    .join("\n");

  const pages = [
    ["Home", "/", "Essays on consciousness, leadership, and the field between people."],
    ["About", "/about", "Twenty-five years leading teams, fifteen in SaaS. The work behind the writing."],
    ["Field Notes", "/blog", "The full essay archive."],
    ["The Field Assessment", "/field-assessment", "Eighteen questions, two parts, five minutes — what you carry into a room and what the room does with it."],
    ["Retreats", "/retreats", "Small-group work on presence and the field."],
    ["Start Here", "/start", "A newsletter, a five-minute assessment, and a book in progress."],
    ["Subscribe", "/subscribe", "Two essays a month."],
  ]
    .map(([label, path, desc]) => `- [${label}](${base}${path}) — ${desc}`)
    .join("\n");

  const body = `# ${name}

> ${tagline}

${intro}

## Essays

${essayLines}

## Pages

${pages}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
