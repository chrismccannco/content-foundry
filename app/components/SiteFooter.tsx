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

export default async function SiteFooter() {
  const s = await getSettings();
  let nav: NavItem[] = DEFAULT_NAV;
  if (s.footer_items) {
    try { const parsed = JSON.parse(s.footer_items); if (Array.isArray(parsed) && parsed.length) nav = parsed; } catch {}
  }
  const owner = s.site_name || "Chris McCann";
  const year = new Date().getFullYear();
  return (
    <footer className="fn-footer">
      <div className="fn-wrap">
        <span className="fn-navlinks">
          {nav.map((n) => (<Link key={n.href} href={n.href}>{n.label}</Link>))}
        </span>
        <div>© {year} {owner}</div>
      </div>
    </footer>
  );
}
