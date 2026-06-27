import Link from "next/link";
import { getSettings } from "@/lib/cms";

type NavItem = { label: string; href: string };
const DEFAULT_NAV: NavItem[] = [
  { label: "Field Notes", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Retreats", href: "/retreats" },
  { label: "Field Assessment", href: "/field-assessment" },
  { label: "Privacy", href: "/privacy" },
];
const DEFAULT_SOCIAL: NavItem[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/chrismccannco/" },
  { label: "Instagram", href: "https://www.instagram.com/chrismccann.co/" },
  { label: "X", href: "https://x.com/chrismccanco" },
  { label: "Send a Note", href: "mailto:chris@chrismccann.co" },
];

function parse(json: string | undefined, fallback: NavItem[]): NavItem[] {
  if (!json) return fallback;
  try { const p = JSON.parse(json); return Array.isArray(p) && p.length ? p : fallback; } catch { return fallback; }
}

export default async function SiteFooter() {
  const s = await getSettings().catch(() => ({} as Record<string, string>));
  const nav = parse(s.footer_items, DEFAULT_NAV);
  const social = parse(s.social_items, DEFAULT_SOCIAL);
  const owner = s.site_name || "Chris McCann";
  const year = new Date().getFullYear();
  return (
    <footer className="fn-footer">
      <div className="fn-wrap">
        <span className="fn-navlinks">
          {nav.map((n) => (<Link key={n.href} href={n.href}>{n.label}</Link>))}
        </span>
        <div className="fn-social">
          {social.map((n) => (<a key={n.href} href={n.href}>{n.label}</a>))}
        </div>
        <div style={{ marginTop: 16 }}>© {year} {owner}</div>
      </div>
    </footer>
  );
}
