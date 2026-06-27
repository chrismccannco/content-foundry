"use client";

import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";

const PAGES = [
  { key: "home", title: "Home Page", desc: "Your front page — heading, intro paragraphs, and the call to action.", live: "/" },
  { key: "about", title: "About", desc: "The About page.", live: "/about" },
  { key: "retreats", title: "Retreats", desc: "The Retreats page.", live: "/retreats" },
];

export default function SitePagesIndex() {
  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Pages" }]} />
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Pages</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Edit the words on your site. Changes save automatically and go live right away.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {PAGES.map((p) => (
          <div
            key={p.key}
            className="group border border-neutral-200 rounded-xl p-4 hover:border-teal-400 hover:shadow-sm transition flex flex-col"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 group-hover:bg-teal-50 group-hover:text-teal-600 transition">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-neutral-900">{p.title}</h2>
                <p className="text-xs text-neutral-500 mt-0.5">{p.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-neutral-100">
              <Link
                href={`/admin/site-pages/${p.key}`}
                className="text-xs font-medium text-teal-700 hover:text-teal-800"
              >
                Edit
              </Link>
              <a
                href={p.live}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-400 hover:text-neutral-600 flex items-center gap-1"
              >
                View live <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
