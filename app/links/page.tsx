import type { Metadata } from "next";
import { getSettings } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Chris McCann",
  description: "Field Notes — consciousness, leadership, the gap between them. Essays for leaders in tech and sales who sense something is off but can't name it.",
  robots: { index: false },
  openGraph: {
    title: "Chris McCann",
    description: "Field Notes — consciousness, leadership, the gap between them.",
    url: "https://chrismccann.co/links/",
    siteName: "Field Notes by Chris McCann",
    images: [{ url: "https://chrismccann.co/images/og-default.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chris McCann",
    description: "Field Notes — consciousness, leadership, the gap between them.",
    images: ["https://chrismccann.co/images/og-default.png"],
  },
};

const BK = "#1a1a1a";
const WH = "#faf9f7";
const GR = "#666";
const LG = "#e8e6e2";
const AC = "#2C5F4F";
const SERIF = "'EB Garamond', Georgia, serif";
const SANS  = "'DM Sans', -apple-system, sans-serif";

const DEFAULT = {
  bio:           "Consciousness. Leadership. The gap between them.",
  card_1_label:  "Latest Field Note",
  card_1_title:  "Field Notes",
  card_1_href:   "/blog/",
  card_2_label:  "Free — 5 minutes",
  card_2_title:  "The Field Assessment",
  card_2_href:   "/field-assessment",
  card_3_label:  "Biweekly",
  card_3_title:  "Subscribe to Field Notes",
  card_3_href:   "/subscribe",
};

export default async function LinksPage() {
  const s = await getSettings().catch(() => ({} as Record<string, string>));

  const bio   = s.links_bio || DEFAULT.bio;
  const cards = [1, 2, 3].map((n) => ({
    label: s[`links_card_${n}_label`] || DEFAULT[`card_${n}_label` as keyof typeof DEFAULT],
    title: s[`links_card_${n}_title`] || DEFAULT[`card_${n}_title` as keyof typeof DEFAULT],
    href:  s[`links_card_${n}_href`]  || DEFAULT[`card_${n}_href`  as keyof typeof DEFAULT],
  }));

  return (
    <main id="main-content" style={{ maxWidth: 480, margin: "0 auto", padding: "2rem 2rem 4rem" }}>
      {/* Profile */}
      <div style={{ textAlign: "center", padding: "2.5rem 0 2rem" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 64, height: 64, background: BK, color: WH,
          fontFamily: SERIF, fontSize: "1.35rem", fontWeight: 500,
          borderRadius: 3, marginBottom: "1rem", letterSpacing: "-0.5px",
        }}>CM</div>
        <div style={{ fontFamily: SANS, fontSize: "1rem", fontWeight: 600, letterSpacing: "0.04em", color: BK, marginBottom: "0.4rem" }}>
          Chris McCann
        </div>
        <p style={{ fontFamily: SERIF, fontSize: "0.95rem", fontStyle: "italic", color: GR, lineHeight: 1.5, maxWidth: 320, margin: "0 auto" }}>
          {bio}
        </p>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {cards.map((card, i) => (
          <a key={i} href={card.href} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "1.1rem 1.4rem", border: `1px solid ${LG}`,
            textDecoration: "none", color: BK,
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontFamily: SANS, fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: AC }}>
                {card.label}
              </span>
              <span style={{ fontFamily: SERIF, fontSize: "1.05rem", fontStyle: "italic", color: BK, lineHeight: 1.3 }}>
                {card.title}
              </span>
            </div>
            <span style={{ fontFamily: SANS, fontSize: "0.9rem", color: GR, flexShrink: 0, marginLeft: "1rem" }}>→</span>
          </a>
        ))}
      </div>

      <hr style={{ border: "none", borderTop: `1px solid ${LG}`, margin: "2rem 0" }} />
      <p style={{ textAlign: "center", fontFamily: SANS, fontSize: "0.75rem" }}>
        <a href="/" style={{ color: LG, textDecoration: "none" }}>chrismccann.co</a>
      </p>
    </main>
  );
}
