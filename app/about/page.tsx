import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/cms";

const DEFAULT_HTML = `
<h1>The short version</h1>
<p>I've spent twenty-five years leading teams. The last fifteen in SaaS, building and scaling go-to-market organizations in emerging tech categories. Before that, I managed restaurants. Opened Boston Chicken stores in the mid-nineties as a twenty-year-old. Ran a Hooters, where fifty front-of-house staff and fifty kitchen workers taught me more about group dynamics than any psychology class would. The job was the same one I have now, just without the laptops. Read the room. Set the tone.</p>
<p>The answer was never on a clipboard. It was never in the pipeline either.</p>
<p>The mistake I made was thinking managing and leading were the same thing. I operated that way for years, optimizing things that didn't need optimizing while ignoring what was actually happening in the room.</p>
<p>Collective intelligence turns out to be less about who's in the room and more about what's happening between them. Teams sync physiologically. Brain activity aligns during real communication. The research exists. What's missing is the practice.</p>
<p>The deeper I went into what creates that field, the more I had to turn the lens on myself. What happens when twelve people are in a room together. What's happening inside the person leading it.</p>
<p>Co-authoring a book with <a href="https://drwarter.com">Dr. Carlos Warter</a> (Park Street Press, spring 2027) on the nature of the field itself — what it is, how to sense it, and what it means for how humans organize, decide, and evolve.</p>
<p><a href="/blog">Field Notes</a> is where I work through the questions before the book has answers for them.</p>
<h2>The Field Assessment</h2>
<p>Eighteen questions. Five minutes. Two parts. What you're carrying into the room. What the room is doing with it.</p>
`;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings().catch(() => ({} as Record<string, string>));
  return {
    title: "About",
    description: s.page_about_description ||
      "Fifteen years leading corporate sales teams. Co-authoring a book on consciousness and leadership with Dr. Carlos Warter.",
  };
}

export default async function About() {
  const s = await getSettings().catch(() => ({} as Record<string, string>));
  const html = s.page_about || DEFAULT_HTML;
  return (
    <main className="fn-wrap fn-article">
      <article dangerouslySetInnerHTML={{ __html: html }} />
      <p className="fn-more"><Link href="/field-assessment">TAKE THE ASSESSMENT →</Link></p>
    </main>
  );
}
