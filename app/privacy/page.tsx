import type { Metadata } from "next";
import { getSettings } from "@/lib/cms";

const DEFAULT_HTML = `
<h1>Privacy</h1>
<p>This site collects only what's needed to send Field Notes and understand, in aggregate, how the writing travels. If you subscribe, your email is used to send the newsletter and nothing else. No selling, no sharing.</p>
<p>To unsubscribe, use the link in any email, or write to <a href="mailto:chris@chrismccann.co">chris@chrismccann.co</a>.</p>
`;

export const metadata: Metadata = { title: "Privacy" };

export default async function Privacy() {
  const s = await getSettings().catch(() => ({} as Record<string, string>));
  const html = s.page_privacy || DEFAULT_HTML;
  return (
    <main className="fn-wrap fn-article">
      <article dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
