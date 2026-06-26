import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  try {
    const db = getDb();
    const result = await db.execute("SELECT key, value FROM site_settings WHERE key LIKE 'brand_%'");

    const s: Record<string, string> = {};
    for (const row of result.rows) {
      if (row.key && row.value) s[row.key as string] = row.value as string;
    }

    // Helper: use the tenant value if set, else fall back to the next candidate.
    const v = (key: string, fallback: string) => s[key] || fallback;

    const primary = v('brand_primary', '#1B3A5C');
    const accent = v('brand_accent', '#b8955a');
    const background = v('brand_background', '#f5f2eb');
    const neutral = v('brand_neutral', '#1a1a18');
    const secondary = v('brand_secondary', '#8a8a80');

    const css = `:root {
  /* Brand tokens — edit in the ContentFoundry Brand Hub (site_settings brand_*) */
  --brand-primary:        ${primary};
  --brand-primary-deep:   ${v('brand_primary_deep', primary)};
  --brand-primary-mid:    ${v('brand_primary_mid', primary)};
  --brand-primary-light:  ${v('brand_primary_light', primary)};

  --brand-accent:         ${accent};
  --brand-accent-light:   ${v('brand_accent_light', accent)};
  --brand-accent-wash:    ${v('brand_accent_wash', background)};

  --brand-background:      ${background};
  --brand-background-warm: ${v('brand_background_warm', background)};

  --brand-neutral:         ${neutral};
  --brand-secondary:       ${secondary};
  --brand-secondary-light: ${v('brand_secondary_light', secondary)};
  --brand-rule:            ${v('brand_rule', '#ddd8ce')};

  /* Typography */
  --brand-font-heading: '${v('brand_font_heading', 'Fraunces')}', Georgia, serif;
  --brand-font-body:    '${v('brand_font_body', 'DM Sans')}', -apple-system, sans-serif;

  /* Layout */
  --brand-max-width: ${v('brand_max_width', '1100px')};

  /* Logos */
  --logo-primary:  ${s.brand_logo_primary  ? `url('${s.brand_logo_primary}')` : 'none'};
  --logo-reversed: ${s.brand_logo_reversed ? `url('${s.brand_logo_reversed}')` : 'none'};
  --logo-mark:     ${s.brand_logo_mark     ? `url('${s.brand_logo_mark}')` : 'none'};
}`;

    return new NextResponse(css, {
      headers: {
        'Content-Type': 'text/css; charset=utf-8',
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=120',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Vary': 'Accept-Encoding',
      },
    });
  } catch (err) {
    console.error('brand-css error:', err);
    return new NextResponse('/* error loading brand tokens */', {
      headers: { 'Content-Type': 'text/css' },
      status: 500,
    });
  }
}
