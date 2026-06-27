import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts, getSettings } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings().catch(() => ({} as Record<string, string>));
  return {
    title: s.blog_title || "Field Notes",
    description: s.blog_description ||
      "Consciousness. Leadership. The gap between them. Twice a month.",
  };
}

function fmtDate(d: string | null): string {
  if (!d) return "";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "" : dt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function Blog() {
  const posts = await getBlogPosts().catch(() => []);
  return (
    <main className="fn-wrap fn-article">
      <h1>Field Notes</h1>
      <p className="fn-lead">Consciousness. Leadership. The gap between them.</p>
      {posts.length === 0 ? (
        <p className="fn-empty">No notes published yet. They&apos;re on the way.</p>
      ) : (
        <ul className="fn-bloglist">
          {posts.map((p) => (
            <li key={p.slug}>
              <div className="fn-postmeta">{[fmtDate(p.date), p.read_time].filter(Boolean).join(" · ")}</div>
              <h3><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3>
              {p.description && <p>{p.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
