import nodemailer from 'nodemailer'
import { productLabel } from './products'

/**
 * Ticket notification emails (sent over the same SMTP account as the admin app).
 * If the SMTP_* variables are not set, sending is skipped and logged: tickets still work.
 */
const env = (name: string) => (process.env[name] || '').trim().replace(/^["']|["']$/g, '')

const SITE = env('NEXT_PUBLIC_SITE_URL') || 'https://support.crelligent.com'
const INBOX = env('SUPPORT_INBOX') || 'support@crelligent.com'

const smtpReady = () => Boolean(env('SMTP_HOST') && env('SMTP_USER') && env('SMTP_PASS'))

let transporter: nodemailer.Transporter | null = null
function getTransporter() {
  if (!transporter) {
    const port = parseInt(env('SMTP_PORT') || '587')
    transporter = nodemailer.createTransport({
      host: env('SMTP_HOST'),
      port,
      secure: port === 465,
      auth: { user: env('SMTP_USER'), pass: env('SMTP_PASS') },
    })
  }
  return transporter
}

const FROM = () => `"Crelligent Support" <${env('SUPPORT_FROM') || env('SMTP_FROM') || INBOX}>`

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const C = {
  ink: '#111827',
  text: '#1F2937',
  muted: '#6B7280',
  line: '#E5E7EB',
  page: '#F3F4F6',
  panel: '#F9FAFB',
}
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
// The five bands of the Crelligent mark, as a thin top rule.
const BANDS = ['#EF4444', '#F59E0B', '#22C55E', '#3B82F6', '#A855F7']

function layout(opts: { preheader: string; heading: string; intro: string; quote?: string; cta?: { label: string; href: string }; footnote?: string }) {
  const bands = BANDS.map((c) => `<td height="4" style="background:${c};font-size:0;line-height:0;">&nbsp;</td>`).join('')
  const quote = opts.quote
    ? `<tr><td style="padding:0 32px 8px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.panel};border:1px solid ${C.line};border-radius:8px;"><tr><td style="padding:16px 18px;font:14px/1.6 ${FONT};color:${C.text};white-space:pre-wrap;">${esc(opts.quote)}</td></tr></table></td></tr>`
    : ''
  const cta = opts.cta
    ? `<tr><td style="padding:16px 32px 8px;"><a href="${opts.cta.href}" style="display:inline-block;background:${C.ink};color:#ffffff;text-decoration:none;font:600 14px/1 ${FONT};padding:13px 20px;border-radius:8px;">${esc(opts.cta.label)}</a></td></tr>`
    : ''
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:${C.page};">
<span style="display:none;max-height:0;overflow:hidden;">${esc(opts.preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};"><tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${C.line};">
<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${bands}</tr></table></td></tr>
<tr><td style="padding:24px 32px 4px;font:600 13px/1 ${FONT};letter-spacing:.08em;text-transform:uppercase;color:${C.muted};">Crelligent Support</td></tr>
<tr><td style="padding:10px 32px 6px;font:600 22px/1.3 ${FONT};color:${C.ink};">${esc(opts.heading)}</td></tr>
<tr><td style="padding:4px 32px 16px;font:15px/1.6 ${FONT};color:${C.text};">${opts.intro}</td></tr>
${quote}${cta}
<tr><td style="padding:24px 32px 28px;font:12px/1.6 ${FONT};color:${C.muted};border-top:1px solid ${C.line};">${opts.footnote ?? ''}${opts.footnote ? '<br><br>' : ''}Crelligent &amp; Company Limited · Lagos, Nigeria · <a href="${SITE}" style="color:${C.muted};">support.crelligent.com</a></td></tr>
</table></td></tr></table></body></html>`
}

async function send(to: string, subject: string, html: string, text: string, replyTo?: string) {
  if (!smtpReady()) {
    console.warn(`[email] SMTP not configured; skipped "${subject}" to ${to}`)
    return false
  }
  try {
    await getTransporter().sendMail({ from: FROM(), to, subject, html, text, replyTo: replyTo || INBOX })
    return true
  } catch (e) {
    console.error('[email] send failed:', e instanceof Error ? e.message : e)
    return false
  }
}

export interface TicketMail {
  ref: string
  email: string
  name?: string | null
  company?: string | null
  product: string
  category?: string | null
  subject: string
  body: string
}

/** Confirmation to the customer + notification to the support inbox. */
export async function sendTicketCreated(t: TicketMail) {
  const link = `${SITE}/tickets/${t.ref}`
  const hello = t.name ? `Hi ${esc(t.name.split(' ')[0])},` : 'Hello,'
  const customerHtml = layout({
    preheader: `We've received your request ${t.ref}.`,
    heading: `We've got it: ${t.ref}`,
    intro: `${hello}<br><br>Thanks for getting in touch about <strong>${esc(productLabel(t.product))}</strong>. Your request is logged and someone from our team will reply, usually within one business day (Lagos time, Monday–Friday).<br><br>You can follow the conversation and reply any time from the support portal by signing in with <strong>${esc(t.email)}</strong>.`,
    quote: `${t.subject}\n\n${t.body}`,
    cta: { label: 'View your request', href: link },
    footnote: `Reference: ${t.ref}. Keep this number if you write to support@crelligent.com.`,
  })
  const customerText = `We've received your request ${t.ref}.\n\nSubject: ${t.subject}\n\n${t.body}\n\nFollow it at ${link} (sign in with ${t.email}).\n\nCrelligent Support`

  const staffHtml = layout({
    preheader: `${t.ref} · ${productLabel(t.product)} · ${t.subject}`,
    heading: `New ticket ${t.ref}`,
    intro: `<strong>${esc(t.name || t.email)}</strong>${t.company ? ` (${esc(t.company)})` : ''} · ${esc(t.email)}<br>${esc(productLabel(t.product))}${t.category ? ` · ${esc(t.category)}` : ''}`,
    quote: `${t.subject}\n\n${t.body}`,
    cta: { label: 'Open in admin', href: 'https://admin.crelligent.com/tickets' },
  })
  const staffText = `New ticket ${t.ref} from ${t.name || ''} <${t.email}>\n${productLabel(t.product)} / ${t.category || ''}\n\n${t.subject}\n\n${t.body}`

  await Promise.all([
    send(t.email, `[${t.ref}] We've received your request`, customerHtml, customerText),
    send(INBOX, `[${t.ref}] ${productLabel(t.product)}: ${t.subject}`, staffHtml, staffText, t.email),
  ])
}

/** Tells the support inbox a customer replied on an existing ticket. */
export async function sendCustomerReplied(t: { ref: string; email: string; subject: string; body: string }) {
  const html = layout({
    preheader: `${t.email} replied on ${t.ref}`,
    heading: `New reply on ${t.ref}`,
    intro: `<strong>${esc(t.email)}</strong> replied to “${esc(t.subject)}”.`,
    quote: t.body,
    cta: { label: 'Open in admin', href: 'https://admin.crelligent.com/tickets' },
  })
  await send(INBOX, `[${t.ref}] Customer reply: ${t.subject}`, html, `${t.email} replied on ${t.ref}:\n\n${t.body}`, t.email)
}
