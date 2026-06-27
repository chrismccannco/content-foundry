import type { Metadata } from "next";
import { getSettings } from "@/lib/cms";

export const dynamic = "force-dynamic";

const DEFAULT_HTML = `
<h1>Private Retreats</h1>
<p class="fn-lead">With Chris McCann and Dr. Carlos Warter.</p>
<p>This is inner work for people who've stopped pretending the résumé is the whole story.</p>
<p><a href="https://drwarter.com">Carlos</a> is a physician, psychiatrist, and author who's spent fifty years studying consciousness and what it means to actually pay attention. I spent fifteen years leading corporate sales teams before I noticed the thing I was optimizing around was never on the dashboard. Together we work with what's happening inside the person, not the persona.</p>
<p>What you're carrying that nobody asked you to carry. Why the version of you everyone sees is different from the one that shows up when nobody's watching. Where you actually are versus where you thought you'd be by now.</p>
<p>Some of it will be uncomfortable in ways that surprise you. Most of what matters happens in the space between the sessions, in conversations that weren't scheduled and silences that weren't awkward.</p>
<h3>Who shows up</h3>
<p>People who've done the right things. Built the career, the family, the life that checks every box they drew for themselves at thirty. Figured it would feel different when they got there. It doesn't.</p>
<p>People who already know the difference between consuming an experience and being changed by one.</p>
<h3>What changes</h3>
<p>A shift at home, at work, in the ordinary moments that used to run on autopilot. Most people who come through can't explain it. They just know the weight they were carrying wasn't theirs to begin with.</p>
<h3>Format</h3>
<p>Up to twelve people. Three to five days. No agenda distributed in advance. Locations have included Latin America, the US, and Europe.</p>
<p>If any of this landed, <a href="mailto:chris@chrismccann.co">write me</a>.</p>
`;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings().catch(() => ({} as Record<string, string>));
  return {
    title: "Retreats",
    description: s.page_retreats_description ||
      "Private leadership retreats with Chris McCann and Dr. Carlos Warter. Small group. 3-5 days. By application.",
  };
}

export default async function Retreats() {
  const s = await getSettings().catch(() => ({} as Record<string, string>));
  const html = s.page_retreats || DEFAULT_HTML;
  return (
    <main className="fn-wrap fn-article">
      <article dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
