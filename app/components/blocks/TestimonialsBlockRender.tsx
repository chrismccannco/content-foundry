"use client";

import { useEffect, useState } from "react";
import type { TestimonialsBlockData } from "@/lib/types/blocks";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  quote: string;
  rating: number;
  avatar_url: string | null;
  featured: number;
}

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: 2, marginBottom: 12 }} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill={i < count ? "var(--brand-accent, #2C5F4F)" : "var(--fn-rule, #e5e3df)"}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsBlockRender({ data }: { data: TestimonialsBlockData }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch("/api/testimonials?published=1")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setTestimonials(d);
      })
      .catch(() => {});
  }, []);

  if (testimonials.length === 0) return null;

  const columns = data?.columns ?? 2;

  return (
    <section style={{ padding: "48px 24px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: 24,
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        {testimonials.map((t) => (
          <figure
            key={t.id}
            style={{
              margin: 0,
              padding: 24,
              border: "1px solid var(--fn-rule, #e5e3df)",
              borderRadius: 10,
              background: "var(--brand-background, #fff)",
            }}
          >
            <Stars count={t.rating} />
            <blockquote
              style={{
                margin: 0,
                fontFamily: "var(--fn-serif, Georgia, serif)",
                fontSize: 17,
                lineHeight: 1.5,
                color: "var(--fn-ink, #1a1a1a)",
              }}
            >
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption
              style={{
                marginTop: 16,
                fontFamily: "var(--fn-sans, system-ui, sans-serif)",
                fontSize: 14,
                color: "var(--fn-gray, #666)",
              }}
            >
              <span style={{ fontWeight: 600, color: "var(--fn-ink, #1a1a1a)" }}>{t.name}</span>
              {t.title ? `, ${t.title}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
