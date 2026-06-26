import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost } from "@/lib/cms";

export const dynamic = "force-dynamic";

function fmtDate(d: string | null): string {
  if (!d) return "";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "" : dt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug).catch(() => null);
  if (!post) return {};
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.description || "",
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug).catch(() => null);
  if (!post) notFound();

  return (
    <main className="fn-wrap fn-article">
      <div className="fn-postmeta">{[fmtDate(post.date), post.read_time].filter(Boolean).join(" · ")}</div>
      <h1>{post.title}</h1>
      {post.description && <p className="fn-lead">{post.description}</p>}
      {Array.isArray(post.sections) && post.sections.map((sec, i) => (
        <section key={i}>
          {sec.heading && <h3>{sec.heading}</h3>}
          {(Array.isArray(sec.body) ? sec.body : [sec.body]).filter(Boolean).map((para, j) => (
            <p key={j}>{para}</p>
          ))}
        </section>
      ))}
      <p className="fn-more"><Link href="/blog">← All Field Notes</Link></p>
    </main>
  );
}
