import Link from "next/link";

export default function NotFound() {
  return (
    <main className="fn-wrap fn-article">
      <h1>Nothing here.</h1>
      <p className="fn-lead">The page moved, or it never existed. Either way, the trail went cold.</p>
      <p className="fn-more"><Link href="/">← Back to the start</Link></p>
    </main>
  );
}
