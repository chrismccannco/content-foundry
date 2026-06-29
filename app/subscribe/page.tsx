import type { Metadata } from "next";
import { getSettings, getBlogPosts } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Subscribe — Field Notes",
  description: "Field Notes by Chris McCann. Consciousness, leadership, and the gap between them. Two essays a month.",
  openGraph: {
    title: "Subscribe — Field Notes",
    description: "Field Notes by Chris McCann. Consciousness, leadership, and the gap between them. Two essays a month.",
    url: "https://chrismccann.co/subscribe/",
    siteName: "Field Notes by Chris McCann",
    images: [{ url: "https://chrismccann.co/images/og-default.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Subscribe — Field Notes",
    description: "Field Notes by Chris McCann. Consciousness, leadership, and the gap between them. Two essays a month.",
    images: ["https://chrismccann.co/images/og-default.png"],
  },
};

const BK = "#1a1a1a";
const WH = "#faf9f7";
const GR = "#666";
const LG = "#e8e6e2";
const AC = "#2C5F4F";
const RD = "#c0392b";
const SERIF = "'EB Garamond', Georgia, serif";
const SANS  = "'DM Sans', -apple-system, sans-serif";

export default async function SubscribePage() {
  const s     = await getSettings().catch(() => ({} as Record<string, string>));
  const posts = (await getBlogPosts().catch(() => [])).slice(0, 3);

  const tagline = s.subscribe_tagline || "The room shifts when you walk in. You know this.";
  const note    = s.subscribe_note    || "Twice a month.";

  return (
    <main id="main-content">
      {/* Hero */}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "4rem 2rem 2rem", textAlign: "center" }}>
        <div style={{ fontFamily: SANS, fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: AC, marginBottom: "1.25rem" }}>
          Field Notes
        </div>
        <p style={{ fontFamily: SERIF, fontSize: "1.2rem", fontStyle: "italic", color: GR, lineHeight: 1.6, marginBottom: "0.75rem" }}>
          {tagline}
        </p>
        <p style={{ fontFamily: SERIF, fontSize: "1rem", fontStyle: "italic", color: GR, opacity: 0.7, marginBottom: "2rem" }}>
          {note}
        </p>

        <form id="subscribeForm" style={{ display: "flex", gap: 0, maxWidth: 380, width: "100%", margin: "0 auto 1rem" }}>
          <input
            type="email" id="subEmail" required placeholder="Your email" aria-label="Email address"
            style={{ flex: 1, padding: "13px 16px", fontFamily: SANS, fontSize: "0.9rem", border: `1px solid ${LG}`, borderRight: "none", background: WH, color: BK, outline: "none", minWidth: 0 }}
          />
          <button type="submit" id="subBtn"
            style={{ padding: "13px 24px", fontFamily: SANS, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", background: BK, color: WH, border: `1px solid ${BK}`, cursor: "pointer" }}>
            I&apos;m in
          </button>
        </form>
        <div id="subSuccess" style={{ fontFamily: SANS, fontSize: "0.85rem", color: AC,  marginTop: "0.75rem", display: "none" }}>You&rsquo;re in. Check your inbox.</div>
        <div id="subError"   style={{ fontFamily: SANS, fontSize: "0.85rem", color: RD, marginTop: "0.75rem", display: "none" }}>Something went wrong. Try again.</div>
      </div>

      {/* Recent essays — auto-populated from CMS */}
      {posts.length > 0 && (
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 2rem 3rem" }}>
          <div style={{ fontFamily: SANS, fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: GR, marginBottom: "1.25rem", paddingTop: "2rem", borderTop: `1px solid ${LG}` }}>
            Recent essays
          </div>
          {posts.map((p) => (
            <div key={p.slug} style={{ marginBottom: "0.9rem" }}>
              <a href={`/blog/${p.slug}/`} style={{ fontFamily: SERIF, fontSize: "1.05rem", fontStyle: "italic", color: BK, textDecoration: "none" }}>
                <span style={{ color: GR, marginRight: "0.5rem" }}>→</span>{p.title}
              </a>
            </div>
          ))}
        </div>
      )}

      <script dangerouslySetInnerHTML={{ __html: `(function(){
  var f=document.getElementById('subscribeForm');
  if(!f)return;
  f.addEventListener('submit',async function(e){
    e.preventDefault();
    var email=(document.getElementById('subEmail')||{}).value||'';
    email=email.trim();if(!email)return;
    var btn=document.getElementById('subBtn');
    var orig=btn?btn.textContent:'';if(btn){btn.textContent='...';btn.disabled=true;}
    try{
      var res=await fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email})});
      if(res.ok){f.style.display='none';document.getElementById('subSuccess').style.display='block';}
      else{if(btn){btn.textContent=orig;btn.disabled=false;}document.getElementById('subError').style.display='block';}
    }catch(err){if(btn){btn.textContent=orig;btn.disabled=false;}document.getElementById('subError').style.display='block';}
  });
})();` }} />
    </main>
  );
}
