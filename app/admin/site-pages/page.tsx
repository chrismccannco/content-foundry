"use client";

import Link from "next/link";
import { ExternalLink, FileText, Layers } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";

type Page = { key: string; title: string; desc: string; live: string };

const EDITABLE: Page[] = [
  { key: "home", title: "Home Page", desc: "Your front page — heading, intro paragraphs, and the call to action.", live: "/" },
  { key: "about", title: "About", desc: "The About page.", live: "/about" },
  { key: "retreats", title: "Retreats", desc: "The Retreats page.", live: "/retreats" },
];

const DESIGNED: Page[] = [
  { key: "field-assessment", title: "Field Assessment", desc: "The interactive 18-question assessment.", live: "/field-assessment" },
  { key: "start", title: "Start Here", desc: "The newsletter / assessment / book landing page.", live: "/start" },
  { key: "links", title: "Links", desc: "Your link-in-bio page.", live: "/links" },
  { key: "subscribe", title: "Subscribe", desc: "The standalone subscribe page.", live: "/subscribe" },
];

function Card({ p, editable }: { p: Page; editable: boolean }) {
  return (
    <div className="group border border-neutral-200 rounded-xl p-4 hover:border-teal-400 hover:shadow-sm transition flex flex-col">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 group-hover:bg-teal-50 group-hover:text-teal-600 transition">
          {editable ? <FileText className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-neutral-900">{p.title}</h2>
          <p className="text-xs text-neutral-500 mt-0.5">{p.desc}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-neutral-100">
        {editable ? (
          <Link href={`/admin/site-pages/${p.key}`} className="text-xs font-medium text-teal-700 hover:text-teal-800">
            Edit
          </Link>
        ) : (
          <span className="text-xs text-neutral-300">Designed template</span>
        )}
        <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-400 hover:text-neutral-600 flex items-center gap-1">
          View live <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

export default function SitePagesIndex() {
  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Pages" }]} />
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Pages</h1>
        <p className="text-xs text-neutral-400 mt-1">Edit the words on your site. Changes save automatically and go live right away.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {EDITABLE.map((p) => (<Card key={p.key} p={p} editable />))}
      </div>

      <div className="mt-10 mb-3">
        <h2 className="text-sm font-semibold text-neutral-900">Designed pages</h2>
        <p className="text-xs text-neutral-400 mt-1">Built as fixed templates — the interactive assessment and custom landing pages. Open them here; these are changed in the design, not the text editor.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {DESIGNED.map((p) => (<Card key={p.key} p={p} editable={false} />))}
      </div>
    </div>
  );
}
