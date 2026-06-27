import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Beehiiv publication + band-specific automations (carried over from the original site)
const PUBLICATION_ID = "pub_e500b531-8dc6-42b7-85f7-fa7476b5c964";
const BAND_AUTOMATION_MAP: Record<string, string> = {
  autopilot: "aut_2b65f90d-c0d8-4e6e-8878-eeea0c0216ca",
  paying_attention: "aut_8a517822-666c-4953-82a1-d0804b928684",
  holding_the_field: "aut_378ef9a8-3163-4dd2-b375-4d6f33466e2b",
};

export async function POST(req: NextRequest) {
  const API_KEY = process.env.BEEHIIV_API_KEY;
  if (!API_KEY) {
    console.error("BEEHIIV_API_KEY not set");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const result_band = typeof body.result_band === "string" ? body.result_band : "";
  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const validBands = ["autopilot", "paying_attention", "holding_the_field"];
  const isAssessment = !!result_band && validBands.includes(result_band);

  try {
    // Step 1: subscribe to the publication
    const subRes = await fetch(
      `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          utm_source: isAssessment ? "field-assessment" : "homepage",
          utm_medium: isAssessment ? result_band : "organic",
          utm_campaign: isAssessment ? "assessment-results" : "homepage",
          reactivate_existing: true,
          send_welcome_email: !isAssessment,
        }),
      }
    );

    if (!subRes.ok) {
      const errText = await subRes.text();
      console.error("Beehiiv subscription error:", subRes.status, errText);
      return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
    }

    // Step 2: enroll in the band-specific automation
    if (isAssessment && BAND_AUTOMATION_MAP[result_band]) {
      const automationId = BAND_AUTOMATION_MAP[result_band];
      const autoRes = await fetch(
        `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/automations/${automationId}/subscribers`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      if (!autoRes.ok) {
        console.error("Automation enrollment error:", autoRes.status, await autoRes.text());
        // Non-fatal: subscriber is added even if automation enrollment fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
