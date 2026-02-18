# Go-Live Cheat Sheet (Mortgage MVP)

This is the exact runbook for production launch.
Use it top-to-bottom. Do not skip steps.

## 0) Prerequisites

- Supabase project created
- Stripe account with live mode access
- Vercel project connected to this repo
- Domain/subdomain ready (optional at first)

---

## 1) Security Hardening Status

Already implemented in code:
- `supabase/migrations/202602180006_security_harden_leads_access.sql`
- Dashboard preview query now uses secure RPC: `get_matching_lead_previews`

You still need to apply migrations to your real Supabase database.

---

## 2) Apply Supabase Migrations (Step-by-Step)

### Option A (Recommended now): Supabase SQL Editor

Run these files in order:
1. `supabase/migrations/202602180001_brokers.sql`
2. `supabase/migrations/202602180002_leads.sql`
3. `supabase/migrations/202602180003_leads_broker_preview_policy.sql`
4. `supabase/migrations/202602180004_unlocks.sql`
5. `supabase/migrations/202602180005_lead_status.sql`
6. `supabase/migrations/202602180006_security_harden_leads_access.sql`

How:
- Open Supabase Dashboard -> SQL Editor
- For each file above:
  - paste SQL
  - click Run
  - verify success before next file

### Option B: CLI (if you prefer command line)

Use `npx` (no global install required):

```bash
npx supabase login
npx supabase link --project-ref <YOUR_PROJECT_REF>
npx supabase db push
```

If `db push` fails due to drift, stop and reconcile before proceeding.

---

## 3) Set Production Env Vars (Vercel)

Add in Vercel -> Project -> Settings -> Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `APP_BASE_URL` (e.g. `https://app.yourdomain.com`)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `ADMIN_ROUTE_TOKEN` (random secret string)

Also set matching values in local `.env.local` for testing.

---

## 4) Stripe Setup

1. Create webhook endpoint:
   - URL: `https://<your-domain>/api/stripe/webhook`
2. Subscribe event:
   - `checkout.session.completed`
3. Copy webhook signing secret to:
   - `STRIPE_WEBHOOK_SECRET` in Vercel
4. Confirm product behavior:
   - Refinance unlock = AUD 249.00
   - Self-employed unlock = AUD 399.00

---

## 5) Deploy

```bash
npx vercel --prod
```

Or deploy via Vercel dashboard.

After deploy:
- Check build succeeds
- Confirm environment variables are attached to Production target

---

## 6) Production Smoke Test (Must Pass)

1. Borrower submits refinance quiz -> lead stored
2. Broker A (matching coverage) sees preview
3. Broker B attempts same lead during Broker A checkout -> blocked by lock
4. Broker A pays in Stripe checkout
5. Webhook marks unlock success:
   - `leads.is_unlocked = true`
   - `unlocks` record exists
6. Lead disappears from other brokers
7. Broker A can open `/broker/leads/[leadId]` and sees:
   - full contact info
   - full quiz answers
   - status update works

---

## 7) Admin and Monitoring Checks

- Admin page:
  - `/admin?token=<ADMIN_ROUTE_TOKEN>`
  - verify leads and unlock rows visible
- Vercel logs:
  - no recurring webhook 4xx/5xx
- Stripe webhook logs:
  - events delivered 2xx

---

## 8) Quick Rollback Plan

If payment/unlock fails after go-live:
- Temporarily hide unlock button in dashboard (feature flag or short patch)
- Keep lead preview read-only
- Investigate webhook logs + Supabase RPC errors
- Re-enable unlock after fix verified in production

