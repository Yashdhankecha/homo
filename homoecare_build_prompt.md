# Homoecare by Dr. Kruti Desai — Full Stack Web Application Build Prompt

---

## Project Overview

Build a complete, production-ready web application for **"Homoecare by Dr. Kruti Desai"** — a Consultant Homoeopathic Physician. The system has two distinct parts:

1. **Public-facing Patient Website** — a single-page portfolio/landing site for patients
2. **Doctor's Admin Dashboard** — a private login-protected panel for managing bookings, messages, and communications

---

## Brand Identity & Design Language

Extract and follow strictly from the provided branding:

| Token | Value |
|---|---|
| Brand Name | Homoecare by Dr. Kruti Desai |
| Logo | Mortar and pestle with a leaf — sage green, silhouette style |
| Background | Warm off-white / linen — `#EDE8DF` |
| Primary Color | Muted sage green — `#6B7F5E` |
| Text Color | Deep charcoal black — `#1A1A1A` |
| Accent | Darker sage / warm taupe for dividers — `#5A6B4E` |
| Heading Font | Cormorant Garamond or Playfair Display (Google Fonts) |
| Body Font | DM Sans or Lato (Google Fonts) |

**Overall aesthetic:** Organic luxury — natural, calm, trustworthy, and premium. Think Ayurveda spa meets clinical authority. No harsh colors, no neon, no aggressive gradients. Subtle paper grain texture on backgrounds, generous white space, soft drop shadows.

**Animations:** Powered entirely by **GSAP + ScrollTrigger**. Every section has a deliberate entrance choreography. Hover interactions use GSAP `quickTo` for buttery smooth cursor-following effects. No CSS keyframe loops — all motion is GSAP-controlled for maximum precision and performance.

**Image placeholders:** Use `placehold.co` with sage green fill (`6B7F5E`) and appropriate aspect ratios wherever real photos are absent.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + custom CSS variables |
| Components | shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Auth | NextAuth.js (credentials provider) |
| Email | EmailJS (client-side) or Nodemailer (server-side) |
| WhatsApp | `wa.me` deep links — no paid API needed |
| Animation | GSAP 3 + ScrollTrigger plugin + CustomEase plugin |
| Deployment | Vercel (free tier) |
| SEO | Next.js Metadata API + JSON-LD schema |

---

## Folder Structure

```
/
├── app/
│   ├── layout.tsx                  ← Root layout with SEO metadata
│   ├── page.tsx                    ← Patient landing page (single page)
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx            ← Doctor login screen
│   │   ├── dashboard/
│   │   │   └── page.tsx            ← Stats overview
│   │   ├── appointments/
│   │   │   └── page.tsx            ← Booking management table
│   │   ├── messages/
│   │   │   └── page.tsx            ← WhatsApp + Email messaging
│   │   └── settings/
│   │       └── page.tsx            ← Profile & clinic settings
│   └── api/
│       ├── appointments/
│       │   └── route.ts            ← POST new appointment, GET all
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts        ← NextAuth handler
├── components/
│   ├── patient/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── ConsultationDetails.tsx
│   │   ├── Cases.tsx
│   │   ├── Achievements.tsx
│   │   ├── Contact.tsx
│   │   ├── BookingModal.tsx
│   │   └── Footer.tsx
│   └── admin/
│       ├── Sidebar.tsx
│       ├── StatsCard.tsx
│       ├── AppointmentsTable.tsx
│       ├── MessagePanel.tsx
│       └── TemplateSelector.tsx
├── lib/
│   ├── supabase.ts
│   ├── auth.ts
│   ├── whatsapp.ts                 ← wa.me URL builder helpers
│   └── gsap.ts                    ← GSAP + ScrollTrigger registration, CustomEase definitions
├── public/
│   ├── logo.svg                    ← Mortar & pestle SVG (inline-able)
│   ├── og-image.jpg
│   ├── robots.txt
│   └── sitemap.xml
└── styles/
    └── globals.css                 ← CSS variables, grain texture, base resets
```

---

## Part 1 — Public Patient Website (Single Page)

Build as a single scrollable page (`app/page.tsx`) with all sections stacked vertically and smooth anchor-scroll navigation. Every section must have an `id` attribute for nav links.

---

### Navigation Bar

- **Left:** SVG logo (mortar & pestle inline) + "Homoecare by Dr. Kruti Desai" in serif font
- **Center:** Links — Home · About · How I Work · Cases · Achievements · Contact
- **Right:** "Book Appointment" CTA — sage green pill button, opens `<BookingModal />`
- **Behavior:** Sticky top, `backdrop-filter: blur(12px)` + soft shadow appears on scroll (JS scroll listener adds class)
- **Mobile:** Hamburger icon → slide-in drawer from right with all nav links and CTA

---

### Section 1 — Hero / Home Intro

Full viewport height (`min-h-screen`). Patient-first messaging.

**Content:**
- **Headline (large serif, ~72px desktop):** "Healing That Works With Your Body, Not Against It"
- **Subheadline (body font, ~20px):** "Personalized homoeopathic care for chronic and acute conditions — rooted in classical principles, guided by lived experience."
- **CTA Row:** `[Book a Consultation]` (solid sage green) + `[Learn About Homoeopathy]` (ghost outline)
- **Social proof badge** (floating, bottom-left or top-right): `✦ Trusted by 200+ Patients`
- **Background:** Linen `#EDE8DF` with a large soft-opacity (15%) botanical leaf illustration SVG on the right
- **Scroll indicator:** Animated chevron-down arrow at the very bottom center, pulses gently

**GSAP Animations on page load (Hero entrance timeline):**

```typescript
// components/patient/Hero.tsx
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Botanical SVG draws in first (stroke animation)
    tl.fromTo(".hero-botanical", 
      { opacity: 0, scale: 0.85, rotation: -5 },
      { opacity: 0.15, scale: 1, rotation: 0, duration: 1.8, ease: "power2.out" }
    )
    // Headline chars split and rise
    .from(".hero-headline .char", {
      y: 80,
      opacity: 0,
      stagger: 0.02,
      duration: 0.9,
      ease: "power4.out"
    }, "-=1.2")
    // Subheadline line wipe
    .from(".hero-sub", {
      y: 24,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out"
    }, "-=0.5")
    // CTA buttons pop in with slight scale
    .from(".hero-cta-primary", {
      y: 16,
      opacity: 0,
      scale: 0.95,
      duration: 0.5
    }, "-=0.3")
    .from(".hero-cta-secondary", {
      y: 16,
      opacity: 0,
      scale: 0.95,
      duration: 0.5
    }, "-=0.4")
    // Badge slides in from left
    .from(".hero-badge", {
      x: -30,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.4)"
    }, "-=0.3")
    // Scroll indicator bounces in
    .from(".scroll-indicator", {
      y: -10,
      opacity: 0,
      duration: 0.5
    }, "-=0.2");

    // Scroll indicator infinite bounce loop (GSAP, not CSS)
    gsap.to(".scroll-indicator", {
      y: 8,
      repeat: -1,
      yoyo: true,
      duration: 0.9,
      ease: "sine.inOut",
      delay: 2
    });
  });
  return () => ctx.revert();
}, []);
```

---

### Section 2 — About Dr. Kruti Desai

Two-column layout (desktop) / stacked (mobile):

**Left column:** Doctor photo placeholder — `placehold.co/480x560/6B7F5E/EDE8DF` with rounded corners and a decorative sage green border offset

**Right column:**
- Section label: `✦ About the Doctor` (small caps, sage green)
- Name: `Dr. Kruti Desai` (large serif heading)
- Title: `Consultant Homoeopathic Physician`
- Intro paragraph: "I believe every patient deserves individual attention. Homoeopathy isn't one-size-fits-all — your symptoms, your history, and your story shape every prescription I write. My approach combines classical case-taking with modern understanding of chronic disease patterns."
- **Education timeline (vertical, left-bordered in sage green):**
  - `B.H.M.S (Hons)` — National Institute of Homeopathy, Kolkata
  - `Pursuing M.D. (Hom)` — The Calcutta Homoeopathic Medical College and Hospital, Kolkata
- **Quick contact row:**
  - 📞 `+91 9081660475`
  - ✉️ `krutidesai752@gmail.com`
  - WhatsApp icon → `https://wa.me/919081660475`

---

### Section 3 — Consultation Details ("How I Work")

Section label: `✦ How I Work`

Four info cards in a 2×2 grid (desktop) or stacked (mobile). Each card: sage green icon top, bold title, descriptive body, linen background, rounded corners, hover lift `translateY(-4px)`.

| Card | Icon | Title | Body |
|---|---|---|---|
| 1 | 🖥️ | Consultation Modes | In-Person · Video Call · WhatsApp Consultation |
| 2 | 🕐 | Clinic Timings | Mon–Sat: 10:00 AM – 1:00 PM & 5:00 PM – 8:00 PM |
| 3 | ₹ | Consultation Fee | First Visit: ₹500 · Follow-up: ₹300 (update as needed) |
| 4 | 🌐 | Languages | Gujarati · Hindi · English |

Below the cards: a short paragraph about the consultation process — "Every consultation begins with a detailed case-taking session. Classical homoeopathic principles guide remedy selection. Follow-ups track your progress and refine treatment."

---

### Section 4 — Previous Cases / Conditions Treated

Section label: `✦ Conditions I've Helped Manage`

**Tag cloud / pill grid** of conditions (sage green border pills, hover fills to sage green):

Skin & Hair · Eczema · Psoriasis · Acne · Hair Fall · Dandruff · Allergies · Sinusitis · Rhinitis · Digestive Health · IBS · Acidity · Gastritis · Women's Health · PCOD/PCOS · Menstrual Irregularities · Leucorrhoea · Child Health · Recurrent Infections · Growth Issues · Bedwetting · Chronic Pain · Arthritis · Back Pain · Migraine · Headache · Thyroid Disorders · Stress & Anxiety · Sleep Disorders · Obesity · Diabetes Support

**Below the tag cloud:** 3 anonymized case study cards in a horizontal scroll row:

Each card contains:
- Condition name (bold serif)
- Patient profile: e.g., "Female, 28 yrs"
- Duration: "3 months of constitutional treatment"
- Outcome: "Significant reduction in flare-ups. No recurrence in 6 months."
- Disclaimer line: *Shared with patient's consent. Identifying details removed.*

---

### Section 5 — Achievements & Recognition

Section label: `✦ Credentials & Milestones`

**Stats row (large serif numbers):**

| Stat | Value |
|---|---|
| Patients Treated | 200+ |
| Conditions Managed | 15+ |
| Years of Study | 6+ |
| Consultation Modes | 3 |

**Achievement cards (timeline or grid):**
- BHMS with Honours — National Institute of Homeopathy, Kolkata
- Currently Pursuing MD (Hom) — Calcutta Homoeopathic Medical College & Hospital
- [Placeholder] Seminar / CME participation
- [Placeholder] Published case studies or research

---

### Section 6 — Contact

Two-column layout:

**Left — Contact Form:**
Fields (all styled with linen bg, sage green focus border):
- Full Name *
- Email Address *
- Phone Number * (with `+91` prefix)
- Subject / Condition (text input)
- Message (textarea, 4 rows)
- `[Send Message]` button — sage green, full width

On submit: POST to `/api/contact` or `EmailJS.send(...)`. Show inline success: "✓ Message sent! Dr. Kruti will respond within 24 hours."

**Right — Contact Info Card:**
- 📞 `+91 9081660475`
- ✉️ `krutidesai752@gmail.com`
- 💬 WhatsApp → `https://wa.me/919081660475`
- 📍 Clinic address placeholder: "Anand / Gujarat, India"
- Google Maps embed placeholder (iframe with `loading="lazy"`)
- Social icons row: WhatsApp · Instagram · Facebook (placeholder hrefs)

---

### Appointment Booking Modal

Triggered by all "Book Appointment" CTAs. Full-screen overlay with centered modal card. Close on backdrop click or ✕ button.

**Form fields:**

| Field | Type | Required |
|---|---|---|
| Full Name | text | Yes |
| Age | number | Yes |
| Gender | select: Male / Female / Other | Yes |
| Phone Number | tel (+91 prefix) | Yes |
| Email Address | email | No |
| Consultation Mode | select: In-Person / Video Call / WhatsApp | Yes |
| Preferred Date | date (min: today) | Yes |
| Preferred Time Slot | select: Morning (10–1) / Evening (5–8) | Yes |
| Chief Complaint | textarea | Yes |
| How did you hear about us? | select: Google / Instagram / WhatsApp / Friend / Other | No |

**On submit:**
- POST to `/api/appointments` → saves to Supabase `appointments` table
- Show success state: "✓ Appointment Requested! Dr. Kruti will confirm via WhatsApp or email within 24 hours."
- Auto-send WhatsApp notification to doctor: `https://wa.me/919081660475?text=New+appointment+request+from+[Name]...`

---

### Footer

Four-column layout (desktop) / stacked (mobile):

- **Col 1:** Logo + tagline: "Healing rooted in nature. Guided by science." + social icons
- **Col 2:** Quick Links — Home · About · Cases · Achievements · Book Appointment
- **Col 3:** Contact — Phone · Email · WhatsApp
- **Col 4:** Disclaimer — "Homoeopathic treatments are complementary. Always consult your primary physician in emergencies."

Bottom bar: `© 2025 Homoecare by Dr. Kruti Desai. All rights reserved.` · `Privacy Policy` · `Terms of Use`

---

## Part 2 — Doctor Admin Dashboard

Accessible at `/admin`. Middleware-protected — redirect to `/admin/login` if no valid session.

---

### Login Page (`/admin/login`)

- Centered card on linen background with logo
- Fields: Email + Password
- `[Login as Doctor]` sage green button
- "Forgot Password?" link (placeholder)
- On success: `router.push('/admin/dashboard')`
- Default credentials: `krutidesai752@gmail.com` / `[set in .env as DOCTOR_PASSWORD]`
- Use NextAuth credentials provider with bcrypt password comparison

---

### Dashboard Layout

Persistent **sidebar** (desktop) / bottom tab bar (mobile):
- Logo + "Admin Panel" label at top
- Nav items: Dashboard · Appointments · Messages · Settings
- Logout button at bottom
- Active route highlighted in sage green

---

### Dashboard Home (`/admin/dashboard`)

**Greeting:** `Good morning, Dr. Kruti 👋` (time-aware)

**Stats cards row (4 cards):**

| Card | Icon | Label | Value Source |
|---|---|---|---|
| 1 | 📅 | Appointments This Month | `COUNT` from Supabase |
| 2 | ⏳ | Pending Confirmations | `WHERE status = 'pending'` |
| 3 | 📋 | Today's Appointments | `WHERE date = today` |
| 4 | 👥 | Total Patients | distinct phone numbers |

**Today's Schedule table:**
Columns: Time · Patient Name · Mode · Complaint · Status · Actions

Action buttons per row: `[Confirm]` `[Reschedule]` `[Complete]` `[Cancel]` `[WhatsApp]`

---

### Appointments Manager (`/admin/appointments`)

Full data table with:

**Columns:** # · Name · Age · Gender · Phone · Email · Mode · Date · Time · Complaint · Status · Booked On · Actions

**Top bar:**
- Status filter tabs: All · Pending · Confirmed · Completed · Cancelled
- Search input (filter by name or phone, client-side)
- Date range picker
- `[Export CSV]` button — downloads filtered results as CSV

**Row actions:**
- `Confirm` → updates `status = 'confirmed'` in Supabase + auto-sends WhatsApp to patient
- `Reschedule` → opens modal with date/time pickers
- `Cancel` → confirmation prompt → updates status
- `Complete` → marks done
- `WhatsApp` → opens `wa.me` with pre-filled confirmation message
- `Email` → opens email modal with pre-filled template

**Supabase `appointments` table schema:**

```sql
create table appointments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  age integer,
  gender text,
  phone text not null,
  email text,
  mode text not null,             -- 'in-person' | 'video' | 'whatsapp'
  preferred_date date not null,
  preferred_time text not null,   -- 'morning' | 'evening'
  complaint text,
  source text,                    -- how they heard about us
  status text default 'pending'   -- 'pending' | 'confirmed' | 'completed' | 'cancelled'
);
```

---

### Messaging System (`/admin/messages`)

Two tabs: **WhatsApp** and **Email**

#### WhatsApp Tab

Patient search dropdown (search by name or phone).

**Pre-built templates (expandable accordion):**

```
Appointment Confirmed:
"Dear [Name], your appointment with Dr. Kruti Desai is confirmed for [Date] at [Time Slot]. Mode: [Mode]. Please be available 5 minutes early. For queries, reply to this message. – Homoecare 🌿"

Appointment Reminder:
"Dear [Name], a gentle reminder for your appointment tomorrow with Dr. Kruti Desai at [Time Slot]. Please confirm your availability. – Homoecare 🌿"

Follow-up:
"Dear [Name], hope you're feeling better! Please share any updates on your condition so Dr. Kruti can track your progress. – Homoecare 🌿"

Custom:
[Open textarea] + [Send via WhatsApp button]
```

Each template: `[Use Template]` button → pre-fills message → `[Open WhatsApp]` button builds `wa.me/91{phone}?text={encoded_message}` and opens in new tab.

#### Email Tab

Patient search dropdown.

**Template picker:** Confirmation / Reminder / Follow-up / Custom

Pre-filled:
- **To:** patient email
- **Subject:** auto-generated (e.g., "Your appointment with Dr. Kruti Desai is confirmed")
- **Body:** template with `[Name]`, `[Date]`, `[Time]` tokens replaced

`[Send via Gmail]` → builds `mailto:` link and opens mail client
`[Send via EmailJS]` → fires EmailJS template directly (requires EmailJS integration)

**Message Log table:**
Columns: Patient Name · Phone · Message Type · Sent Via · Date Sent · Status (Sent / Failed)

---

### Settings Page (`/admin/settings`)

**Clinic Info (editable form, saved to Supabase `settings` table):**
- Clinic name, address, consultation hours, consultation fees
- `[Save Changes]` button

**Change Password:**
- Current password, new password, confirm new password
- `[Update Password]` → NextAuth credential update

**Notification Preferences:**
- Toggle: Email alert for new bookings
- Toggle: Auto-WhatsApp notification for new bookings
- Toggle: Daily schedule summary (morning digest)

---

## SEO Implementation

Apply to `app/layout.tsx` using Next.js Metadata API:

```typescript
export const metadata: Metadata = {
  title: "Homoecare by Dr. Kruti Desai | Consultant Homoeopathic Physician",
  description: "Book a consultation with Dr. Kruti Desai, BHMS (Hons), pursuing MD (Hom). Expert homoeopathic treatment for skin, allergies, women's health, children, and chronic conditions. Online & in-person consultations available.",
  keywords: [
    "homoeopathic doctor",
    "homeopathy consultant",
    "Dr Kruti Desai",
    "online homeopathy consultation",
    "BHMS doctor",
    "homoeopathy for PCOD",
    "homoeopathy for skin",
    "Gujarat homeopathy doctor",
    "Kolkata homeopathy",
    "Homoecare"
  ],
  openGraph: {
    title: "Homoecare by Dr. Kruti Desai",
    description: "Personalized homoeopathic care for chronic and acute conditions.",
    url: "https://homoecare.in",
    siteName: "Homoecare",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Homoecare by Dr. Kruti Desai",
    description: "Personalized homoeopathic care for chronic and acute conditions.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://homoecare.in" },
};
```

**JSON-LD Structured Data (in `<head>` of `app/page.tsx`):**

```json
{
  "@context": "https://schema.org",
  "@type": "Physician",
  "name": "Dr. Kruti Desai",
  "medicalSpecialty": "Homeopathic Medicine",
  "description": "Consultant Homoeopathic Physician offering in-person, video, and WhatsApp consultations.",
  "telephone": "+919081660475",
  "email": "krutidesai752@gmail.com",
  "url": "https://homoecare.in",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "Gujarat",
    "addressCountry": "IN"
  },
  "availableService": {
    "@type": "MedicalTherapy",
    "name": "Homoeopathic Consultation"
  }
}
```

**`public/robots.txt`:**

```
User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://homoecare.in/sitemap.xml
```

**`public/sitemap.xml`:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://homoecare.in/</loc>
    <lastmod>2025-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

**Accessibility & Performance:**
- All images: meaningful `alt` text
- All interactive elements: keyboard focusable, `aria-label` where needed
- Images below fold: `loading="lazy"`
- Hero assets: `<link rel="preload">` in `<head>`
- Lighthouse targets: 95+ Performance · 100 Accessibility · 100 SEO · 100 Best Practices

---

## Environment Variables (`.env.local`)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000

# Doctor credentials
DOCTOR_EMAIL=krutidesai752@gmail.com
DOCTOR_PASSWORD_HASH=bcrypt_hashed_password

# EmailJS (optional)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## GSAP Animation System — Complete Specification

Install: `npm install gsap`  
GSAP Club plugins (ScrollTrigger, SplitText, CustomEase) are free with GSAP 3 core for most use cases. Register all plugins in `lib/gsap.ts` and import that file once in `app/layout.tsx`.

---

### `lib/gsap.ts` — Central Registration File

```typescript
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);

// Brand custom eases
CustomEase.create("homoEase", "M0,0 C0.16,1 0.3,1 1,1");         // soft organic bounce
CustomEase.create("homoReveal", "M0,0 C0.25,0.1 0.25,1 1,1");    // classic content reveal
CustomEase.create("homoSnap", "M0,0 C0.6,0 0.4,1.4 1,1");        // snappy card pop

// Global ScrollTrigger defaults
ScrollTrigger.defaults({
  toggleActions: "play none none reverse",
  start: "top 85%",
});

export { gsap, ScrollTrigger, CustomEase };
```

---

### Navbar GSAP Animations

```typescript
// components/patient/Navbar.tsx
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    // Initial navbar entrance
    gsap.from(".nav-logo", { x: -30, opacity: 0, duration: 0.7, ease: "homoReveal", delay: 0.2 });
    gsap.from(".nav-link", {
      y: -16, opacity: 0, stagger: 0.08, duration: 0.5,
      ease: "homoReveal", delay: 0.4
    });
    gsap.from(".nav-cta", { scale: 0.85, opacity: 0, duration: 0.6, ease: "homoSnap", delay: 0.8 });

    // Scroll-based navbar background
    ScrollTrigger.create({
      start: "top -60px",
      onEnter: () => gsap.to(".navbar", {
        backgroundColor: "rgba(237,232,223,0.92)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 2px 24px rgba(0,0,0,0.08)",
        duration: 0.4
      }),
      onLeaveBack: () => gsap.to(".navbar", {
        backgroundColor: "transparent",
        backdropFilter: "blur(0px)",
        boxShadow: "none",
        duration: 0.4
      }),
    });
  });
  return () => ctx.revert();
}, []);
```

---

### About Section GSAP ScrollTrigger

```typescript
// components/patient/About.tsx
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    // Photo slides in from left with parallax feel
    gsap.from(".about-photo-wrap", {
      x: -60,
      opacity: 0,
      duration: 1.1,
      ease: "homoEase",
      scrollTrigger: { trigger: ".about-photo-wrap", start: "top 80%" }
    });

    // Decorative border offset animates separately
    gsap.from(".about-photo-border", {
      x: -20, y: -20, opacity: 0, duration: 1.4, ease: "power3.out",
      scrollTrigger: { trigger: ".about-photo-wrap", start: "top 80%" }
    });

    // Section label first
    gsap.from(".about-label", {
      y: 20, opacity: 0, duration: 0.5, ease: "homoReveal",
      scrollTrigger: { trigger: ".about-label", start: "top 88%" }
    });

    // Name + title cascade
    gsap.from([".about-name", ".about-title"], {
      y: 40, opacity: 0, stagger: 0.15, duration: 0.8, ease: "homoReveal",
      scrollTrigger: { trigger: ".about-name", start: "top 85%" }
    });

    // Paragraph reveals line by line (SplitText alternative: wrap each line in span)
    gsap.from(".about-para", {
      y: 24, opacity: 0, duration: 0.7, ease: "homoReveal",
      scrollTrigger: { trigger: ".about-para", start: "top 88%" }
    });

    // Education timeline items draw in one by one
    gsap.from(".edu-item", {
      x: 30, opacity: 0, stagger: 0.2, duration: 0.7, ease: "homoEase",
      scrollTrigger: { trigger: ".edu-timeline", start: "top 82%" }
    });

    // Timeline left border grows downward
    gsap.from(".edu-timeline-line", {
      scaleY: 0, transformOrigin: "top center", duration: 0.8, ease: "power2.inOut",
      scrollTrigger: { trigger: ".edu-timeline", start: "top 82%" }
    });

    // Contact row icons bounce in
    gsap.from(".contact-icon-item", {
      scale: 0, opacity: 0, stagger: 0.12, duration: 0.5, ease: "homoSnap",
      scrollTrigger: { trigger: ".contact-icon-row", start: "top 90%" }
    });
  });
  return () => ctx.revert();
}, []);
```

---

### Consultation Cards GSAP ScrollTrigger

```typescript
// components/patient/ConsultationDetails.tsx
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    // Section label wipe
    gsap.from(".work-label", {
      y: 20, opacity: 0, duration: 0.5,
      scrollTrigger: { trigger: ".work-label", start: "top 88%" }
    });

    // Cards fan in with stagger — slight y + scale
    gsap.from(".consult-card", {
      y: 50, opacity: 0, scale: 0.94, stagger: 0.12,
      duration: 0.75, ease: "homoSnap",
      scrollTrigger: { trigger: ".consult-cards-grid", start: "top 80%" }
    });

    // Card icons spin-in separately
    gsap.from(".consult-card-icon", {
      rotation: -180, scale: 0, opacity: 0,
      stagger: 0.12, duration: 0.6, ease: "back.out(2)",
      scrollTrigger: { trigger: ".consult-cards-grid", start: "top 80%" }
    });

    // Hover interactions via GSAP (not CSS)
    document.querySelectorAll(".consult-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, { y: -6, boxShadow: "0 16px 40px rgba(107,127,94,0.18)", duration: 0.25, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { y: 0, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", duration: 0.3, ease: "power2.inOut" });
      });
    });

    // Process paragraph fades in below cards
    gsap.from(".work-process-para", {
      y: 24, opacity: 0, duration: 0.7,
      scrollTrigger: { trigger: ".work-process-para", start: "top 88%" }
    });
  });
  return () => ctx.revert();
}, []);
```

---

### Cases / Conditions Section GSAP ScrollTrigger

```typescript
// components/patient/Cases.tsx
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    // Tag cloud pills scatter in — each from random slight offset
    gsap.from(".condition-pill", {
      scale: 0.6, opacity: 0,
      stagger: { amount: 0.8, from: "random" },
      duration: 0.45, ease: "homoSnap",
      scrollTrigger: { trigger: ".condition-pill-grid", start: "top 82%" }
    });

    // Case cards slide up with stagger
    gsap.from(".case-card", {
      y: 60, opacity: 0, stagger: 0.15, duration: 0.8, ease: "homoEase",
      scrollTrigger: { trigger: ".case-cards-row", start: "top 82%" }
    });

    // Horizontal scroll hint for case cards (mobile: animate cards sideways)
    // On desktop: parallax drift on case cards
    document.querySelectorAll(".case-card").forEach((card, i) => {
      gsap.to(card, {
        y: i % 2 === 0 ? -12 : 12,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        }
      });
    });

    // Pill hover fill animation
    document.querySelectorAll(".condition-pill").forEach((pill) => {
      pill.addEventListener("mouseenter", () => {
        gsap.to(pill, {
          backgroundColor: "#6B7F5E", color: "#EDE8DF",
          scale: 1.06, duration: 0.2, ease: "power2.out"
        });
      });
      pill.addEventListener("mouseleave", () => {
        gsap.to(pill, {
          backgroundColor: "transparent", color: "#1A1A1A",
          scale: 1, duration: 0.25, ease: "power2.inOut"
        });
      });
    });
  });
  return () => ctx.revert();
}, []);
```

---

### Achievements Section — Counting Numbers Animation

```typescript
// components/patient/Achievements.tsx
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    // Section label
    gsap.from(".achieve-label", {
      y: 20, opacity: 0, duration: 0.5,
      scrollTrigger: { trigger: ".achieve-label", start: "top 88%" }
    });

    // Stat numbers count up when scrolled into view
    const stats = [
      { selector: ".stat-patients", end: 200, suffix: "+" },
      { selector: ".stat-conditions", end: 15, suffix: "+" },
      { selector: ".stat-years", end: 6, suffix: "+" },
      { selector: ".stat-modes", end: 3, suffix: "" },
    ];

    stats.forEach(({ selector, end, suffix }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: end,
        duration: 2.2,
        ease: "power2.out",
        onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; },
        scrollTrigger: { trigger: el, start: "top 85%", once: true }
      });
    });

    // Stat labels fade in below numbers
    gsap.from(".stat-label", {
      y: 16, opacity: 0, stagger: 0.1, duration: 0.6,
      scrollTrigger: { trigger: ".stats-row", start: "top 82%" }
    });

    // Achievement cards reveal from bottom with clip-path wipe
    gsap.from(".achieve-card", {
      clipPath: "inset(100% 0% 0% 0%)",
      y: 20, opacity: 0, stagger: 0.15, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: ".achieve-cards-grid", start: "top 82%" }
    });
  });
  return () => ctx.revert();
}, []);
```

---

### Contact Section GSAP ScrollTrigger

```typescript
// components/patient/Contact.tsx
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    // Left form slides in from left
    gsap.from(".contact-form-col", {
      x: -50, opacity: 0, duration: 1, ease: "homoEase",
      scrollTrigger: { trigger: ".contact-section", start: "top 78%" }
    });

    // Right info card slides in from right
    gsap.from(".contact-info-col", {
      x: 50, opacity: 0, duration: 1, ease: "homoEase",
      scrollTrigger: { trigger: ".contact-section", start: "top 78%" }
    });

    // Form fields stagger reveal
    gsap.from(".form-field", {
      y: 20, opacity: 0, stagger: 0.08, duration: 0.5,
      scrollTrigger: { trigger: ".contact-form-col", start: "top 82%" }
    });

    // Submit button pops in last
    gsap.from(".form-submit-btn", {
      scale: 0.9, opacity: 0, duration: 0.5, ease: "homoSnap",
      scrollTrigger: { trigger: ".form-submit-btn", start: "top 90%" }
    });

    // Contact info items stagger in
    gsap.from(".contact-info-item", {
      x: 24, opacity: 0, stagger: 0.1, duration: 0.6,
      scrollTrigger: { trigger: ".contact-info-col", start: "top 82%" }
    });

    // Input focus GSAP micro-interaction
    document.querySelectorAll(".form-input").forEach((input) => {
      input.addEventListener("focus", () => {
        gsap.to(input, { scale: 1.01, duration: 0.2, ease: "power2.out" });
      });
      input.addEventListener("blur", () => {
        gsap.to(input, { scale: 1, duration: 0.2 });
      });
    });
  });
  return () => ctx.revert();
}, []);
```

---

### Booking Modal GSAP Animations

```typescript
// components/patient/BookingModal.tsx

// Open animation
const openModal = () => {
  setIsOpen(true);
  gsap.set(".modal-overlay", { display: "flex" });
  const tl = gsap.timeline();
  tl.fromTo(".modal-overlay", { opacity: 0 }, { opacity: 1, duration: 0.3 })
    .fromTo(".modal-card",
      { scale: 0.88, y: 40, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: "homoSnap" }, "-=0.1"
    )
    .from(".modal-field", {
      y: 16, opacity: 0, stagger: 0.05, duration: 0.4, ease: "homoReveal"
    }, "-=0.2");
};

// Close animation
const closeModal = () => {
  const tl = gsap.timeline({ onComplete: () => setIsOpen(false) });
  tl.to(".modal-card", { scale: 0.9, y: 30, opacity: 0, duration: 0.35, ease: "power3.in" })
    .to(".modal-overlay", { opacity: 0, duration: 0.2 }, "-=0.1");
};

// Success state morph
const showSuccess = () => {
  const tl = gsap.timeline();
  tl.to(".modal-form", { opacity: 0, y: -20, duration: 0.35 })
    .fromTo(".modal-success",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "homoSnap" }
    );
};
```

---

### Footer GSAP ScrollTrigger

```typescript
// components/patient/Footer.tsx
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    // Footer columns stagger up
    gsap.from(".footer-col", {
      y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: "homoEase",
      scrollTrigger: { trigger: "footer", start: "top 90%" }
    });

    // Social icons pop in with spring
    gsap.from(".social-icon", {
      scale: 0, rotation: -30, opacity: 0,
      stagger: 0.08, duration: 0.5, ease: "back.out(2)",
      scrollTrigger: { trigger: ".social-icon-row", start: "top 92%" }
    });

    // Divider line grows from left
    gsap.from(".footer-divider", {
      scaleX: 0, transformOrigin: "left center", duration: 1, ease: "power2.inOut",
      scrollTrigger: { trigger: ".footer-divider", start: "top 95%" }
    });
  });
  return () => ctx.revert();
}, []);
```

---

### Global Parallax Scrolling — Botanical Decorations

Apply to all decorative SVG leaf elements placed in section backgrounds:

```typescript
// In app/page.tsx or a dedicated ParallaxLayer component
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    // Each botanical SVG deco moves at different parallax speeds
    gsap.utils.toArray(".parallax-deco").forEach((el: any, i) => {
      const speed = 0.08 + i * 0.04;  // 0.08 → 0.20 range
      gsap.to(el, {
        y: () => -(window.innerHeight * speed),
        ease: "none",
        scrollTrigger: {
          trigger: el.closest("section"),
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });
    });

    // Subtle rotation on large hero botanical
    gsap.to(".hero-botanical", {
      rotation: 8,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 2,
      }
    });
  });
  return () => ctx.revert();
}, []);
```

---

### Smooth Scroll — Lenis Integration

Use **Lenis** for buttery smooth native-feel scroll that integrates perfectly with GSAP ScrollTrigger:

```typescript
// app/layout.tsx or a SmoothScrollProvider component
import Lenis from "@studio-freight/lenis";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

useLayoutEffect(() => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    smoothWheel: true,
  });

  // Connect Lenis to GSAP ScrollTrigger
  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  return () => {
    lenis.destroy();
    gsap.ticker.remove((time) => { lenis.raf(time * 1000); });
  };
}, []);
```

Install: `npm install @studio-freight/lenis`

---

### Nav Link Active Highlight on Scroll

Highlight the active nav link as user scrolls through sections:

```typescript
// components/patient/Navbar.tsx
useLayoutEffect(() => {
  const sections = ["hero", "about", "how-i-work", "cases", "achievements", "contact"];

  sections.forEach((id) => {
    ScrollTrigger.create({
      trigger: `#${id}`,
      start: "top center",
      end: "bottom center",
      onEnter: () => setActiveSection(id),
      onEnterBack: () => setActiveSection(id),
    });
  });

  // Animate the active indicator underline
  // (a <span className="nav-underline"> absolutely positioned below nav links)
  // moves with GSAP quickTo for instant responsiveness
  const moveUnderline = gsap.quickTo(".nav-underline", "x", { duration: 0.3, ease: "power3.out" });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("mouseenter", (e) => {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      moveUnderline(rect.left);
    });
  });
}, []);
```

---

### Button Magnetic Hover Effect (GSAP quickTo)

Apply to all primary CTA buttons for a premium magnetic pull effect:

```typescript
// hooks/useMagneticHover.ts
import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

export function useMagneticHover(strength = 0.35) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      xTo((e.clientX - cx) * strength);
      yTo((e.clientY - cy) * strength);
    };

    const onLeave = () => {
      xTo(0); yTo(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return ref;
}

// Usage in Hero.tsx:
// const btnRef = useMagneticHover(0.3);
// <button ref={btnRef} className="hero-cta-primary">Book a Consultation</button>
```

---

### Performance & Accessibility Rules for GSAP

- Always wrap all GSAP code in `gsap.context(() => { ... })` and return `ctx.revert()` for cleanup — prevents memory leaks in Next.js App Router
- Use `ScrollTrigger.refresh()` after any dynamic content load or window resize
- Respect `prefers-reduced-motion`: wrap all non-essential animations in a check:

```typescript
// lib/gsap.ts — add this helper
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Usage:
if (!prefersReducedMotion()) {
  gsap.from(".consult-card", { y: 50, opacity: 0, ... });
} else {
  gsap.set(".consult-card", { opacity: 1 }); // just make visible instantly
}
```

- All GSAP `useLayoutEffect` hooks must be inside `"use client"` components
- Use `gsap.set()` to initialize hidden states (not CSS `opacity: 0`) to avoid FOUC
- `ScrollTrigger.kill()` on all triggers in cleanup if not using `ctx.revert()`

---

### Additional Package Installs

```bash
npm install gsap @studio-freight/lenis
```

Update deliverables checklist to include GSAP:

---

## Deliverables Checklist

### Patient Website
- [ ] Sticky navbar with smooth scroll + mobile hamburger
- [ ] Hero section with headline, CTAs, social proof badge, scroll indicator
- [ ] About section with education timeline and contact info
- [ ] Consultation details cards (mode, timing, fee, language)
- [ ] Conditions treated tag cloud + 3 anonymized case cards
- [ ] Achievements stats row + credential cards
- [ ] Contact section with form + info card + maps placeholder
- [ ] Appointment booking modal with full form + success state
- [ ] Footer with links, disclaimer, copyright
- [ ] `lib/gsap.ts` — plugin registration + CustomEase definitions
- [ ] Lenis smooth scroll connected to GSAP ScrollTrigger ticker
- [ ] Hero entrance GSAP timeline (botanical → chars → sub → CTAs → badge → scroll indicator)
- [ ] Hero scroll indicator infinite GSAP bounce loop
- [ ] Navbar: logo + links + CTA entrance timeline
- [ ] Navbar: scroll-based background blur via ScrollTrigger
- [ ] Navbar: active section highlight + underline quickTo magnetic indicator
- [ ] About: photo + border offset slide-in from left
- [ ] About: name/title cascade + paragraph reveal
- [ ] About: education timeline line `scaleY` draw + items stagger
- [ ] Consultation: cards fan-in with stagger + icon spin-in
- [ ] Consultation: GSAP hover lift (not CSS) on cards
- [ ] Cases: pills scatter-in with `stagger: { from: "random" }`
- [ ] Cases: horizontal parallax scrub on case cards
- [ ] Cases: pill hover fill via GSAP (not CSS)
- [ ] Achievements: counting number animation with GSAP `onUpdate`
- [ ] Achievements: achievement cards `clipPath` wipe reveal
- [ ] Contact: left col slides from left, right col from right simultaneously
- [ ] Contact: form fields stagger reveal + input focus micro-interaction
- [ ] Modal: open/close timeline with scale + fade
- [ ] Modal: success state morph animation
- [ ] Footer: columns stagger + social icons spring-in + divider line grow
- [ ] Global parallax on all `.parallax-deco` botanical SVG elements
- [ ] Magnetic hover hook (`useMagneticHover`) on all primary CTA buttons
- [ ] `prefers-reduced-motion` guard on all non-essential animations
- [ ] Mobile responsive at all breakpoints (320px → 1440px)
- [ ] Grain texture overlay on linen background
- [ ] Cormorant Garamond + DM Sans typography

### Admin Dashboard
- [ ] Login page with credential auth (NextAuth)
- [ ] Protected routes (middleware redirect)
- [ ] Dashboard with stats cards + today's schedule
- [ ] Appointments table with filters, search, date range, export CSV
- [ ] Confirm / Reschedule / Cancel / Complete actions → Supabase updates
- [ ] WhatsApp messaging with 4 pre-built templates + custom
- [ ] Email messaging with template picker + mailto / EmailJS
- [ ] Message log table
- [ ] Settings page — clinic info, password change, notification prefs
- [ ] Sidebar nav (desktop) / bottom tabs (mobile)

### SEO & Technical
- [ ] Full Metadata API tags in layout.tsx
- [ ] JSON-LD Physician schema in page.tsx
- [ ] robots.txt — disallow /admin
- [ ] sitemap.xml
- [ ] Semantic HTML throughout (main, section, article, header, footer)
- [ ] alt text on all images
- [ ] Preload hero assets
- [ ] Lazy load below-fold images
- [ ] Supabase tables: appointments, settings, message_log
- [ ] .env.local with all required variables
- [ ] Vercel deployment config (vercel.json or zero-config)

---

*Build this step by step. Start with the patient website (`app/page.tsx` + all components), then the Supabase schema, then the admin dashboard. Use shadcn/ui for admin table and form components. Use raw Tailwind + CSS variables for the patient-facing site to keep it fast and custom.*
