# support.crelligent.com

Help centre and customer ticket portal for Crelligent, Velodesk and PRISM.
A Next.js app deployed on Vercel as the `crelligent-support` project.

## What it does

- **Help centre**: product hubs (`/velodesk`, `/prism`, `/crelligent`, `/billing`, `/account`), articles (`/articles/[slug]`), search.
- **Contact form** (`/contact`): anyone can raise a request; they get an email confirmation with a reference (`CRL-1001`…).
- **Ticket portal** (`/tickets`): customers sign in with a magic link or Google, see every request sent from their email, reply, resolve or reopen.
- Staff answer tickets in **admin.crelligent.com/tickets**.

## Data (crelligent-db)

| Table | Purpose |
|---|---|
| `support_tickets` | One row per request. RLS: customers read only their own (by user id or verified email). |
| `support_messages` | Thread messages. `internal = true` notes are never visible to customers. |
| `support_articles` | Help articles (markdown). Publicly readable when `published`. |
| `support_staff` | Who can use the admin Tickets page. Server-side only. |

The public site only uses the **publishable key**. All customer writes go through validated `SECURITY DEFINER` functions:
`support_create_ticket` (rate limited to 5/hour per email), `support_customer_reply`, `support_customer_set_status`, `support_article_vote`.

### Managing articles
Edit rows in `support_articles` (Supabase table editor). `body` is markdown, `featured` puts it on the home page, `sort` orders it within its category. Pages refresh within 5 minutes.

### Adding staff
```sql
insert into support_staff (email, name, role) values ('name@crelligent.com', 'Full Name', 'agent');
```
They also need an account on the admin login with that email.

## Environment variables

| Name | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | crelligent-db URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | yes | publishable key (never the secret key) |
| `NEXT_PUBLIC_SITE_URL` | yes | `https://support.crelligent.com` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | for email | same values as the admin app; without them tickets still work but no emails go out |
| `SUPPORT_INBOX` | optional | where new-ticket alerts go (default `support@crelligent.com`) |
| `SUPPORT_FROM` | optional | sender address (default `SMTP_FROM`) |

## Supabase Auth settings (one-time)
- **URL configuration → Redirect URLs**: add `https://support.crelligent.com/auth/callback`.
- **Providers → Google**: enable it for "Continue with Google" (magic links work without it).

## Staff side
Ticket replies and knowledge base editing live in the admin app (`Crelligent/crelligent-admin-app`, admin.crelligent.com), which talks to the same crelligent-db tables.

## Local development
```bash
npm install
npm run dev   # http://localhost:3010
```
