"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import Breadcrumbs from "../../components/Breadcrumbs";
import FormSection from "../../components/FormSection";
import AutosaveIndicator from "../../components/AutosaveIndicator";
import RichTextEditor from "../../components/RichTextEditor";
import { useAutosave } from "../../hooks/useAutosave";

type Field = {
  type: "text" | "textarea" | "richtext";
  key: string;
  label: string;
  help?: string;
  rows?: number;
  placeholder?: string;
};
type Group = { title?: string; fields: Field[] };
type PageDef = { title: string; live: string; intro?: string; groups: Group[] };

const PAGE_CONFIG: Record<string, PageDef> = {
  home: {
    title: "Home Page",
    live: "/",
    groups: [
      {
        fields: [
          { type: "text",     key: "home_heading", label: "Heading" },
          { type: "textarea", key: "home_subhead",  label: "Subhead", help: "Each line shows on its own row.", rows: 2 },
          { type: "text",     key: "home_eyebrow",  label: "Eyebrow line (the small line above the email box)" },
          { type: "richtext", key: "home_body",     label: "Intro paragraphs" },
        ],
      },
      {
        title: "Footer call to action",
        fields: [
          { type: "text",     key: "cta_eyebrow", label: "Small heading",  placeholder: "The Field Assessment" },
          { type: "textarea", key: "cta_body",    label: "Text",           rows: 2 },
          { type: "text",     key: "cta_label",   label: "Button label",   placeholder: "Take the assessment" },
          { type: "text",     key: "cta_href",    label: "Button link",    placeholder: "/field-assessment" },
        ],
      },
    ],
  },
  about: {
    title: "About",
    live: "/about",
    groups: [{ fields: [{ type: "richtext", key: "page_about", label: "Page content" }] }],
  },
  retreats: {
    title: "Retreats",
    live: "/retreats",
    groups: [{ fields: [{ type: "richtext", key: "page_retreats", label: "Page content" }] }],
  },
  links: {
    title: "Links",
    live: "/links",
    groups: [
      {
        title: "Profile",
        fields: [
          { type: "text", key: "links_bio", label: "Bio line", placeholder: "Consciousness. Leadership. The gap between them." },
        ],
      },
      {
        title: "Card 1 — update when you publish a new essay",
        fields: [
          { type: "text", key: "links_card_1_label", label: "Label", placeholder: "Latest Field Note" },
          { type: "text", key: "links_card_1_title", label: "Title", placeholder: "The Judge" },
          { type: "text", key: "links_card_1_href",  label: "URL",   placeholder: "/blog/the-judge/" },
        ],
      },
      {
        title: "Card 2",
        fields: [
          { type: "text", key: "links_card_2_label", label: "Label", placeholder: "Free — 5 minutes" },
          { type: "text", key: "links_card_2_title", label: "Title", placeholder: "The Field Assessment" },
          { type: "text", key: "links_card_2_href",  label: "URL",   placeholder: "/field-assessment" },
        ],
      },
      {
        title: "Card 3",
        fields: [
          { type: "text", key: "links_card_3_label", label: "Label", placeholder: "Biweekly" },
          { type: "text", key: "links_card_3_title", label: "Title", placeholder: "Subscribe to Field Notes" },
          { type: "text", key: "links_card_3_href",  label: "URL",   placeholder: "/subscribe" },
        ],
      },
    ],
  },
  subscribe: {
    title: "Subscribe",
    live: "/subscribe",
    groups: [
      {
        fields: [
          { type: "text", key: "subscribe_tagline", label: "Tagline",        placeholder: "The room shifts when you walk in. You know this." },
          { type: "text", key: "subscribe_note",    label: "Secondary note", placeholder: "Twice a month." },
        ],
      },
    ],
  },
};

export default function SitePageEditor() {
  const params = useParams();
  const key = String(params.key || "");
  const def = PAGE_CONFIG[key];

  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data || {});
        setLoaded(true);
      });
  }, []);

  const autoSaveFn = useCallback(async () => {
    if (!loaded) return;
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error("Save failed");
  }, [settings, loaded]);

  const status = useAutosave(autoSaveFn, [settings]);
  const update = (k: string, v: string) => setSettings((p) => ({ ...p, [k]: v }));

  if (!def) {
    return (
      <div className="max-w-2xl">
        <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Pages", href: "/admin/site-pages" }, { label: "Not found" }]} />
        <p className="text-sm text-neutral-500">That page doesn&apos;t exist. <Link href="/admin/site-pages" className="text-teal-700">Back to Pages</Link>.</p>
      </div>
    );
  }

  const renderField = (f: Field) => (
    <div key={f.key} className="mb-5 last:mb-0">
      <label className="block text-xs font-medium text-neutral-500 mb-1">{f.label}</label>
      {f.type === "richtext" ? (
        loaded ? (
          <RichTextEditor content={settings[f.key] || ""} onChange={(html) => update(f.key, html)} />
        ) : (
          <div className="h-32 border border-neutral-200 rounded-lg bg-neutral-50 animate-pulse" />
        )
      ) : f.type === "textarea" ? (
        <textarea
          value={settings[f.key] || ""}
          onChange={(e) => update(f.key, e.target.value)}
          rows={f.rows || 3}
          placeholder={f.placeholder}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      ) : (
        <input
          value={settings[f.key] || ""}
          onChange={(e) => update(f.key, e.target.value)}
          placeholder={f.placeholder}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      )}
      {f.help && <p className="text-xs text-neutral-400 mt-1">{f.help}</p>}
    </div>
  );

  return (
    <div className="max-w-2xl">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Pages", href: "/admin/site-pages" }, { label: def.title }]} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">{def.title}</h1>
          <p className="text-xs text-neutral-400 mt-1">Edits save automatically and go live right away.</p>
        </div>
        <div className="flex items-center gap-4">
          <AutosaveIndicator status={status} />
          <a
            href={def.live}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-400 hover:text-neutral-600 flex items-center gap-1"
          >
            View live <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="space-y-4">
        {def.groups.map((g, i) => (
          <FormSection key={i} title={g.title || def.title}>
            {g.fields.map(renderField)}
          </FormSection>
        ))}
      </div>
    </div>
  );
}
