import Link from "next/link";
import { getSettings, getBlogPosts } from "@/lib/cms";

const DEFAULT = {
  heading: "Chris McCann",
  subhead: "Fifteen years leading sales teams.\nStill figuring it out.",
  eyebrow: "Consciousness. Leadership. The gap between them. Twice a month.",
  body:
    "<p>In my early twenties I managed Hooters restaurants. Eventually I was leading go-to-market for SaaS companies. Same job underneath: read the room, set the tone, try not to be the reason people dread Monday stand-ups.</p>" +
    "<p>I got good at the measurable stuff. Forecast calls, SKOs, quarterly reviews. What I didn't track was the energy. One Tuesday a rep closed the biggest deal in company history and the room felt dead. Numbers were right. Everything else was off. I realized the thing that was off was me.</p>",
  cta_eyebrow: "The Field Assessment",
  cta_body: "Eighteen questions. Five minutes. What you're carrying into the room. What the room is doing with it.",
  cta_label: "Take the assessment",
  cta_href: "/field-assessment",
};

export default async function Home() {
  const s = await getSettings().catch(() => ({} as Record<string, string>));
  const posts = (await getBlogPosts().catch(() => [])).slice(0, 4);

  const heading = s.home_heading || DEFAULT.heading;
  const subhead = s.home_subhead || DEFAULT.subhead;
  const eyebrow = s.home_eyebrow || DEFAULT.eyebrow;
  const body = s.home_body || DEFAULT.body;

  return (
    <main className="fn-wrap">
      <section className="fn-hero">
        <h1>{heading}</h1>
        <div className="fn-subhead">
          {subhead.split("\n").map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </div>
        <p className="fn-eyebrow">{eyebrow}</p>
        <form className="fn-signup" action={s.newsletter_action || "/api/subscribe"} method="post">
          <input type="email" name="email" placeholder="Your email" aria-label="Email" required />
          <button type="submit">I&apos;M IN</button>
        </form>
      </section>

      <section className="fn-prose" dangerouslySetInnerHTML={{ __html: body }} />

      {posts.length > 0 && (
        <section className="fn-section">
          <h2>Recent Writing</h2>
          <ul className="fn-postlist">
            {posts.map((p) => (
              <li key={p.slug}><Link href={`/blog/${p.slug}`}>{p.title}</Link></li>
            ))}
          </ul>
          <p className="fn-more"><Link href="/blog">All Field Notes →</Link></p>
        </section>
      )}

      <section className="fn-section">
        <h2>{s.cta_eyebrow || DEFAULT.cta_eyebrow}</h2>
        <p className="fn-prose" style={{ marginBottom: 18 }}>{s.cta_body || DEFAULT.cta_body}</p>
        <p className="fn-more"><Link href={s.cta_href || DEFAULT.cta_href}>{(s.cta_label || DEFAULT.cta_label).toUpperCase()} →</Link></p>
      </section>
    </main>
  );
}
