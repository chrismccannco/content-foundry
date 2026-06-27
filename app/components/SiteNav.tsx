import Link from "next/link";
import { getSettings } from "@/lib/cms";

type NavItem = { label: string; href: string };
const DEFAULT_NAV: NavItem[] = [
  { label: "Field Notes", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Retreats", href: "/retreats" },
  { label: "Field Assessment", href: "/field-assessment" },
];

export default async function SiteNav() {
  const s = await getSettings();
  let nav: NavItem[] = DEFAULT_NAV;
  if (s.nav_items) {
    try { const parsed = JSON.parse(s.nav_items); if (Array.isArray(parsed) && parsed.length) nav = parsed; } catch {}
  }
  const logo = s.site_logo_text || "CM";
  return (
    <nav className="fn-nav">
      <Link href="/" className="fn-logo">{logo}</Link>
      <span className="fn-navlinks">
        {nav.map((n) => (<Link key={n.href} href={n.href}>{n.label}</Link>))}
      </span>
    </nav>
  );
}
