export type ProductKey = 'velodesk' | 'prism' | 'crelligent' | 'billing' | 'account'
export type TicketProduct = 'velodesk' | 'prism' | 'crelligent' | 'billing' | 'other'

export interface Product {
  key: ProductKey
  name: string
  tagline: string
  logo?: string
  /** CSS colour used for the product's accent */
  accent: string
  /** background behind the logo tile */
  tile: string
  categories: string[]
  site?: string
}

export const PRODUCTS: Product[] = [
  {
    key: 'velodesk',
    name: 'Velodesk',
    tagline: 'Product-market fit scoring for startup founders',
    logo: '/VeloDesk-logo.png',
    accent: '#16a34a',
    tile: '#0B0B0C',
    categories: ['Getting started', 'PMF Score', 'Trials & plans', 'Integrations', 'Troubleshooting'],
    site: 'https://velodesk.crelligent.com',
  },
  {
    key: 'prism',
    name: 'PRISM & Edge',
    tagline: 'Operational intelligence and CEM hardware',
    logo: '/PRISM-logo.png',
    accent: '#7c3aed',
    tile: '#ffffff',
    categories: ['Getting started', 'Devices & connectivity', 'Dashboards & alerts', 'Field support'],
    site: 'https://prism.crelligent.com',
  },
  {
    key: 'crelligent',
    name: 'Crelligent engagements',
    tagline: 'ESRE Diagnostic, Architecture, Build and Evolution',
    logo: '/logo.png',
    accent: '#111827',
    tile: '#ffffff',
    categories: ['How engagements work', 'ESRE OS', 'Foundry', 'Working with us'],
    site: 'https://www.crelligent.com',
  },
  {
    key: 'billing',
    name: 'Billing & payments',
    tagline: 'Invoices, Paystack, currencies and refunds',
    accent: '#b45309',
    tile: '#fffbeb',
    categories: ['Payments', 'Invoices & receipts', 'Subscriptions'],
  },
  {
    key: 'account',
    name: 'Account & security',
    tagline: 'Sign-in, your data and privacy',
    accent: '#0369a1',
    tile: '#f0f9ff',
    categories: ['Sign-in', 'Data & privacy'],
  },
]

export const productByKey = (key: string) => PRODUCTS.find((p) => p.key === key)

export const TICKET_PRODUCTS: { value: TicketProduct; label: string }[] = [
  { value: 'velodesk', label: 'Velodesk' },
  { value: 'prism', label: 'PRISM / Edge (CEM)' },
  { value: 'crelligent', label: 'Crelligent engagement' },
  { value: 'billing', label: 'Billing & payments' },
  { value: 'other', label: 'Something else' },
]

export const TICKET_CATEGORIES: Record<TicketProduct, string[]> = {
  velodesk: ['Question', 'Something is not working', 'Account & sign-in', 'Trial or plan', 'Feature request'],
  prism: ['Device offline', 'Data or dashboard issue', 'Alerts', 'Request a field visit', 'Question'],
  crelligent: ['Engagement question', 'Deliverable or document', 'Schedule a meeting', 'ESRE OS access'],
  billing: ['Payment failed', 'Invoice or receipt', 'Refund', 'Change plan', 'Currency'],
  other: ['General enquiry', 'Partnership', 'Press', 'Feedback'],
}

export const productLabel = (p: string) =>
  TICKET_PRODUCTS.find((t) => t.value === p)?.label ?? p

export const STATUS_LABEL: Record<string, string> = {
  open: 'Open',
  in_progress: 'In progress',
  awaiting_customer: 'Waiting on you',
  resolved: 'Resolved',
  closed: 'Closed',
}
