// =============================================================================
// notify-consultation: e-mails premains.tax@gmail.com about a saved request.
//
// The request is ALWAYS saved in the database first (by the SQL function
// submit_consultation_request). This function only reads it and sends the e-mail,
// so an e-mail failure can never lose a request.
//
// Two ways to call it:
//   1. Website (logged-in user):  POST { "request_id": "<uuid>" }
//        Authorization: Bearer <user session token>
//      -> only works for the caller's OWN request.
//   2. Retry job (you / a scheduler): POST { "retry_pending": true }
//        x-cron-secret: <CRON_SECRET>
//      -> re-sends every request whose e-mail is still pending or failed.
//
// Duplicate protection: claim_request_email() lets exactly one caller send each
// request, and the Resend Idempotency-Key repeats the guarantee at the provider.
//
// Secrets (supabase secrets set ...):  RESEND_API_KEY, CRON_SECRET
// Optional:  NOTIFY_TO, NOTIFY_FROM, ALLOWED_ORIGINS, RESEND_API_URL
// SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are provided by Supabase.
// =============================================================================
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const RESEND_API_URL = Deno.env.get("RESEND_API_URL") ?? "https://api.resend.com/emails";
const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";
const NOTIFY_TO = Deno.env.get("NOTIFY_TO") ?? "premains.tax@gmail.com";
const NOTIFY_FROM = Deno.env.get("NOTIFY_FROM") ?? "PREMAINS INTELLECT LLP <onboarding@resend.dev>";
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ??
  "https://premaints-intellect-llp.vercel.app,https://www.premainsintellect.com,http://localhost:8765")
  .split(",").map((s) => s.trim()).filter(Boolean);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type RequestRow = {
  id: string;
  request_type: "FREE_TRIAL" | "CONSULTATION";
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  service_required: string;
  business_type: string;
  requirements: string;
  additional_information: string | null;
  preferred_date: string | null;
  created_at: string;
};

function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0] ?? "";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info, x-cron-secret",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function json(req: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(req), "Content-Type": "application/json" },
  });
}

const escapeHtml = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );

function buildEmail(r: RequestRow) {
  const isTrial = r.request_type === "FREE_TRIAL";
  const subject = isTrial
    ? "New Free Trial Request – PREMAINS INTELLECT LLP"
    : "New Consultation Request – PREMAINS INTELLECT LLP";
  const submitted = new Date(r.created_at);
  const submittedIst = submitted.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "medium",
  }) + " IST";

  const rows: Array<[string, string]> = [
    ["Request ID", r.id],
    ["Submission type", isTrial ? "FREE TRIAL" : "CONSULTATION"],
    ["Full name", r.full_name],
    ["Email address", r.email],
    ["Phone number", r.phone],
    ["Company name", r.company_name],
    ["Service required", r.service_required],
    ["Business type", r.business_type],
    ["Requirements", r.requirements],
    ["Additional information", r.additional_information || "—"],
  ];
  if (!isTrial) rows.push(["Preferred consultation date", r.preferred_date || "Not specified"]);
  rows.push(["Submitted", `${submittedIst} (${submitted.toISOString()})`]);

  const text = `${subject}\n\n` + rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<!doctype html><html><body style="margin:0;background:#F5F7FA;font-family:Arial,Helvetica,sans-serif;color:#132238">
<div style="max-width:640px;margin:24px auto;background:#fff;border:1px solid #E2E8F0;border-radius:10px;overflow:hidden">
<div style="background:#0B1F3A;padding:18px 24px"><div style="color:#C9A24B;font-size:12px;letter-spacing:.12em;font-weight:700">PREMAINS INTELLECT LLP</div>
<div style="color:#fff;font-size:20px;font-weight:700;margin-top:4px">${escapeHtml(subject.split(" – ")[0])}</div></div>
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
${rows.map(([k, v]) => `<tr><td style="padding:10px 24px;border-bottom:1px solid #EDF2F7;width:190px;color:#54647B;font-size:13px;vertical-align:top">${escapeHtml(k)}</td>
<td style="padding:10px 24px;border-bottom:1px solid #EDF2F7;font-size:14px;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`).join("\n")}
</table></div></body></html>`;
  return { subject, text, html };
}

// Sends the e-mail for one request. Never throws: the outcome is recorded on the row.
async function sendForRequest(
  admin: ReturnType<typeof createClient>,
  row: RequestRow,
): Promise<"sent" | "failed" | "skipped"> {
  const { data: claimed, error: claimErr } = await admin.rpc("claim_request_email", { p_id: row.id });
  if (claimErr) {
    console.error("claim failed", row.id, claimErr.message);
    return "failed";
  }
  if (!claimed) return "skipped"; // already sent, or another caller is sending it

  try {
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");
    const { subject, text, html } = buildEmail(row);
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `consultation-${row.id}`,
      },
      body: JSON.stringify({ from: NOTIFY_FROM, to: [NOTIFY_TO], reply_to: row.email, subject, text, html }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
    await admin.from("consultation_requests")
      .update({ email_status: "sent", email_sent_at: new Date().toISOString(), email_last_error: null })
      .eq("id", row.id);
    return "sent";
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("email failed", row.id, message);
    await admin.from("consultation_requests")
      .update({ email_status: "failed", email_last_error: message.slice(0, 500) })
      .eq("id", row.id);
    return "failed";
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });
  if (req.method !== "POST") return json(req, { error: "Method not allowed" }, 405);
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return json(req, { error: "Server is not configured" }, 500);

  let body: { request_id?: string; retry_pending?: boolean } = {};
  try { body = await req.json(); } catch { return json(req, { error: "Invalid JSON" }, 400); }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

  // ---- Mode 2: retry job, protected by a shared secret ----
  if (body.retry_pending) {
    const provided = req.headers.get("x-cron-secret") ?? "";
    if (!CRON_SECRET || provided !== CRON_SECRET) return json(req, { error: "Unauthorized" }, 401);
    const { data, error } = await admin.from("consultation_requests")
      .select("*").in("email_status", ["pending", "failed"])
      .order("created_at", { ascending: true }).limit(25);
    if (error) return json(req, { error: "Could not load pending requests" }, 500);
    // Also pick up requests stuck in "sending" (the function crashed after claiming them).
    // claim_request_email() only lets them be re-claimed once the claim is 10+ minutes old.
    const staleCutoff = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: stuck, error: stuckErr } = await admin.from("consultation_requests")
      .select("*").eq("email_status", "sending").lt("email_claimed_at", staleCutoff)
      .order("created_at", { ascending: true }).limit(25);
    if (stuckErr) return json(req, { error: "Could not load stuck requests" }, 500);
    const results: Record<string, number> = { sent: 0, failed: 0, skipped: 0 };
    for (const row of [...(data ?? []), ...(stuck ?? [])] as RequestRow[]) results[await sendForRequest(admin, row)]++;
    return json(req, { ok: true, ...results });
  }

  // ---- Mode 1: a logged-in user asks for the e-mail of their own request ----
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return json(req, { error: "Not logged in" }, 401);

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser(token);
  if (userErr || !userData?.user) return json(req, { error: "Not logged in" }, 401);

  if (!body.request_id || !UUID_RE.test(body.request_id)) return json(req, { error: "Invalid request_id" }, 400);

  // Reading through the USER's client means row level security guarantees it is their own request.
  const { data: row, error: rowErr } = await userClient.from("consultation_requests")
    .select("*").eq("id", body.request_id).maybeSingle();
  if (rowErr || !row) return json(req, { error: "Request not found" }, 404);

  const status = await sendForRequest(admin, row as RequestRow);
  // The request is saved either way; the caller only learns whether the e-mail went out.
  return json(req, { ok: true, request_saved: true, email: status });
});
