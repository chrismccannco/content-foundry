import type { Metadata } from "next";
import "./globals.css";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";
import PageViewTracker from "./components/PageViewTracker";
import AnalyticsScripts from "./components/AnalyticsScripts";
import { getSettings } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings().catch(() => ({} as Record<string, string>));
  const name = s.site_name || "Chris McCann — Field Notes";
  const description =
    s.site_description ||
    "Consciousness research. Leadership. The gap between what leaders do and what they're carrying when they do it.";
  const base = s.site_url || "https://chrismccann.co";
  return {
    title: { default: name, template: `%s | ${s.site_name || "Field Notes"}` },
    description,
    metadataBase: new URL(base),
    openGraph: { title: name, description, url: base, siteName: s.site_name || name, type: "website", images: [{ url: "/og-image.png", width: 1200, height: 630, alt: name }] },
    twitter: { card: "summary_large_image", title: name, description, images: ["/og-image.png"] },
    robots: { index: true, follow: true },
  };
}

/** Map site_settings brand_* values into :root custom properties (server-rendered, no flash). */
function brandStyle(s: Record<string, string>): string {
  const pairs: [string, string | undefined][] = [
    ["--brand-background", s.brand_background],
    ["--brand-neutral", s.brand_neutral],
    ["--brand-secondary", s.brand_secondary],
    ["--brand-rule", s.brand_rule],
    ["--brand-accent", s.brand_accent],
    ["--brand-font-heading", s.brand_font_heading ? `'${s.brand_font_heading}'` : undefined],
    ["--brand-font-body", s.brand_font_body ? `'${s.brand_font_body}'` : undefined],
    ["--brand-max-width", s.brand_max_width],
  ];
  const body = pairs.filter(([, v]) => v).map(([k, v]) => `${k}:${v};`).join("");
  return `:root{${body}}`;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings().catch(() => ({} as Record<string, string>));
  const fontHeading = (s.brand_font_heading || "DM Sans").replace(/ /g, "+");
  const fontBody = (s.brand_font_body || "EB Garamond").replace(/ /g, "+");
  const fontHref =
    `https://fonts.googleapis.com/css2?family=${fontHeading}:wght@400;500;600;700` +
    `&family=${fontBody}:ital,wght@0,400;0,500;1,400;1,500&display=swap`;

  return (
    <html lang="en">
      <head>
        <AnalyticsScripts />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontHref} rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: brandStyle(s) }} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="fn-site">
        <PageViewTracker />
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
