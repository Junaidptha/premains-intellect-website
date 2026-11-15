# Supabase setup: Free Trial / Consultation system

Project: `milyscsniqhlisfhahzm` (https://milyscsniqhlisfhahzm.supabase.co)

## What is in this folder

| Path | Purpose |
|---|---|
| `migrations/20261114000000_consultation_system.sql` | Tables, trigger, row level security, the atomic submit function |
| `functions/notify-consultation/index.ts` | Edge Function: e-mails `premains.tax@gmail.com` through Resend |
| `config.toml` | Supabase CLI settings (links the project, sets function options) |

The website side is `login.html`, `enquiry.html`, `js/auth.js`, `js/login.js`,
`js/consultation.js` and the Supabase block in `js/data/config.js`.

## One-time setup (in this order)

### 1. Create the database objects
Neither table exists on the project yet (checked), so this is a clean install. Either:

* **SQL Editor:** open Supabase Dashboard -> SQL Editor, paste the whole migration file, Run. It is safe to run twice.
* **CLI:** `supabase link --project-ref milyscsniqhlisfhahzm` then `supabase db push`.

Then check Table Editor: `profiles` and `consultation_requests` exist and both show the **RLS enabled** badge.

### 2. Authentication settings (Dashboard -> Authentication)
* **URL Configuration -> Site URL:** `https://premaints-intellect-llp.vercel.app` (or your own domain).
* **Redirect URLs:** add `https://premaints-intellect-llp.vercel.app/login.html` and
  `https://premaints-intellect-llp.vercel.app/enquiry.html` (plus the same for any custom domain).
  Confirmation e-mails send people back to `login.html`.
* **Providers -> Email:** keep "Confirm email" ON; set the minimum password length to 8.
* **Production e-mail sending:** Supabase's built-in mailer allows only a few e-mails per hour.
  Under Project Settings -> Authentication -> SMTP, connect a real SMTP provider (Resend SMTP works) so
  confirmation e-mails always arrive.

### 3. Resend (the e-mail provider)
1. Create an account at resend.com and an **API key**.
2. **Verify your sending domain** (for example `premainsintellect.com`) under Domains.
   Until you do, Resend's test sender `onboarding@resend.dev` can only deliver to the e-mail address
   that owns the Resend account, so notifications to `premains.tax@gmail.com` will fail unless that
   is the Resend account e-mail.

### 4. Secrets and deploy the Edge Function
```bash
supabase link --project-ref milyscsniqhlisfhahzm
supabase secrets set RESEND_API_KEY=re_xxxxxxxx
supabase secrets set CRON_SECRET=$(openssl rand -hex 24)        # note it down: used by the retry job
supabase secrets set NOTIFY_FROM="PREMAINS INTELLECT LLP <notifications@YOUR-VERIFIED-DOMAIN>"
# optional:
supabase secrets set NOTIFY_TO=premains.tax@gmail.com            # default already
supabase secrets set ALLOWED_ORIGINS="https://premaints-intellect-llp.vercel.app,https://www.premainsintellect.com"
supabase functions deploy notify-consultation
```
`SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are provided to the function
automatically. They never go in the website code.

### 5. Retry job (so a failed e-mail is never forgotten)
Every request is saved first; the e-mail is a second step. If it fails, the request keeps
`email_status = 'failed'` and is re-sent by this call (each request is e-mailed at most once):
```bash
curl -X POST "https://milyscsniqhlisfhahzm.supabase.co/functions/v1/notify-consultation" \
  -H "Content-Type: application/json" -H "x-cron-secret: YOUR_CRON_SECRET" \
  -d '{"retry_pending": true}'
```
Run it by hand, or schedule it every 10-15 minutes (Dashboard -> Integrations -> Cron, or any scheduler).

### 6. Deploy the website
`vercel --prod`. The Content-Security-Policy in `vercel.json` already allows the Supabase project URL.

## Reading the requests
Dashboard -> Table Editor -> `consultation_requests` (newest first). `email_status` shows
`sent`, `pending` or `failed` (see `email_last_error`).

## Security notes
* The browser only ever has the **publishable** key. Never put a `secret` or `service_role` key in the website.
* Users can only READ their own rows. All writes go through `submit_consultation_request()`; there is no
  direct insert/update/delete on `consultation_requests`, and users cannot change `free_trial_used`.
* The one-free-trial rule is a unique partial index plus a row lock inside that function, so two
  simultaneous requests can never both succeed.
