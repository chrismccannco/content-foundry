import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getSettings } from "@/lib/cms";
import JsonLd from "@/app/components/JsonLd";

export const dynamic = "force-dynamic";

const AUTHOR = "Chris McCann";

function fmtDate(d: string | null): string {
  if (!d) return "";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "" : dt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

async function siteBase(): Promise<string> {
  const s = await getSettings().catch(() => ({} as Record<string, string>));
  return (s.site_url || "https://chrismccann.co").replace(/\/$/, "");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug).catch(() => null);
  if (!post) return {};
  const url = `/blog/${slug}`;
  const title = post.meta_title || post.title;
  const description = post.meta_description || post.description || "";
  const img = post.og_image || post.featured_image || undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: post.date || undefined,
      modifiedTime: post.updated_at || post.date || undefined,
      authors: [AUTHOR],
      ...(img ? { images: [img] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(img ? { images: [img] } : {}),
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug).catch(() => null);
  if (!post) notFound();
  const base = await siteBase();
  const url = `${base}/blog/${slug}`;
  const img = post.og_image || post.featured_image || undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description || post.meta_description || "",
    datePublished: post.date || undefined,
    dateModified: post.updated_at || post.date || undefined,
    author: { "@type": "Person", name: AUTHOR, url: base },
    publisher: { "@type": "Person", name: AUTHOR, url: base },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    ...(img ? { image: img.startsWith("http") ? img : `${base}${img}` } : {}),
    isPartOf: { "@type": "Blog", "@id": `${base}/blog#blog`, name: "Field Notes" },
  };

  return (
    <main className="fn-wrap fn-article">
      <JsonLd data={jsonLd} />
      <div className="fn-postmeta">{[fmtDate(post.date), post.read_time].filter(Boolean).join(" · ")}</div>
      <h1>{post.title}</h1>
      {post.description && <p className="fn-lead">{post.description}</p>}
      {Array.isArray(post.sections) && post.sections.map((sec, i) => (
        <section key={i}>
          {sec.heading && <h3>{sec.heading}</h3>}
          <div dangerouslySetInnerHTML={{ __html: Array.isArray(sec.body) ? sec.body.join("") : String(sec.body || "") }} />
        </section>
      ))}
      <p className="fn-more"><Link href="/blog">← All Field Notes</Link></p>
    </main>
  );
}
