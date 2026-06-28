import type { MetadataRoute } from "next";
import { getBlogPosts, getSettings } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const s = await getSettings().catch(() => ({} as Record<string, string>));
  const base = (s.site_url || "https://chrismccann.co").replace(/\/$/, "");
  const routes = ["", "/blog", "/about", "/retreats", "/field-assessment", "/start", "/subscribe", "/privacy"];
  const staticEntries: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.7,
  }));
  const posts = await getBlogPosts().catch(() => []);
  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return [...staticEntries, ...postEntries];
}
