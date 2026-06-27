import type { Metadata } from "next";
import { getSettings } from "@/lib/cms";

const DEFAULT_HTML = `
<h1>The Field Assessment</h1>
<p class="fn-lead">Eighteen questions. Five minutes. Two parts.</p>
<p>What you're carrying into the room. What the room is doing with it.</p>
<p>Most leadership assessments measure what you do. This one looks at what you bring before you say a word — and what happens in the space around you once you're in it.</p>
`;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings().catch(() => ({} as Record<string, string>));
  return {
    title: "Field Assessment",
    description: s.page_field_assessment_description ||
      "Eighteen questions. Five minutes. What you're carrying into the room, and what the room is doing with it.",
  };
}

export default async function FieldAssessment() {
  const s = await getSettings().catch(() => ({} as Record<string, string>));
  const html = s.page_field_assessment || DEFAULT_HTML;
  const formAction = s.assessment_action || "";
  return (
    <main className="fn-wrap fn-article">
      <article dangerouslySetInnerHTML={{ __html: html }} />
      {formAction ? (
        <p className="fn-more"><a href={formAction}>START THE ASSESSMENT →</a></p>
      ) : (
        <p className="fn-empty">The interactive assessment is being migrated. Check back shortly.</p>
      )}
    </main>
  );
}
