# G-Split Design System
**Single Source of Truth — v2.0 | December 7, 2024**

"The Stout Standard"

---

## Brand Essence

**What we are:**
The all-in-one Guinness app for the extremely online generation. Scoring, maps, logs — everything Guinness, one place.

**The gap we fill:**
Guinness culture is stuck in "da's favorite drink" energy while the people actually ordering it are 22-35 and extremely online. We speak their language.

**What we're NOT:**
- Corporate beer review site
- Stuffy traditional Irish pub aesthetic
- Generic dark mode app
- Serious sommeliers
- Try-hard Gen Z ("fr fr", "slay", "no cap")

**Brand archetype:**
The clever regular at the pub who's chronically online, knows the score, and isn't afraid to call it like it is. Wendy's Twitter energy meets Irish pub wit.

---

## Design Philosophy: Sharp, Not Soft

**We are tech-forward, not playful.**

| Rounded (NOT us) | Square (US) |
|------------------|-------------|
| Duolingo | Linear |
| Headspace | Stripe |
| Fitness apps | Fintech dashboards |
| Playful | Precise |
| Friendly | Authoritative |
| Fun | Serious tool |

**Why sharp fits G-Split:**
- "The digital barman never lies" — precision, not warmth
- AI-powered scoring — tech, not toy
- Internet-native — sharp memes, not soft vibes
- Pub culture — honest, direct, no bullshit

### Border Radius Scale

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `radius-none` | 0px | `rounded-none` | Never use |
| `radius-sm` | 2px | `rounded-sm` | Progress bars, badges, small elements |
| `radius-base` | 4px | `rounded` | Buttons, inputs, chips |
| `radius-md` | 6px | `rounded-md` | Cards, modals, containers |
| `radius-lg` | 8px | `rounded-lg` | Maximum — large cards only |

**The rule:** Nothing rounder than `rounded-lg` (8px). Default to `rounded-sm` or `rounded`.

### Element-Specific Radii

| Element | Radius | Tailwind |
|---------|--------|----------|
| Progress bars | 2px | `rounded-sm` |
| Badges/chips | 2px | `rounded-sm` |
| Buttons | 4px | `rounded` |
| Inputs | 4px | `rounded` |
| Filter pills | 4px | `rounded` |
| Cards | 6px | `rounded-md` |
| Modals | 8px | `rounded-lg` |
| Images in cards | 4px | `rounded` |

**❌ NEVER USE:**
- `rounded-full` on UI elements (only avatars/profile pics)
- `rounded-xl` (12px)
- `rounded-2xl` (16px)
- `rounded-3xl` (24px)

---

## The Pint UI

The app IS a Guinness pint — stout black body, foam cream header, gold accents like the harp logo.

```
┌─────────────────────────────┐
│   FOAM CREAM (#FFF8E7)      │ ← Header (where applicable)
├─────────────────────────────┤
│                             │
│   STOUT BLACK (#1A1A1A)     │ ← Main content
│                             │
│   Content lives here        │
│                             │
├─────────────────────────────┤
│   DEEP BLACK (#0A0A0A)      │ ← Footer/base (glass depth)
└─────────────────────────────┘

ACCENTS:
🥇 Gold: #F7D447 (like the harp logo)
✅ Green: #10B981 (good pours 85%+)
🟠 Amber: #F59E0B (mid pours 60-84%)
❌ Red: #EF4444 (bad pours <60%)
```

---

## Color Palette

### Primary Colors (The Pint)

| Name | Hex | Usage |
|------|-----|-------|
| **Deep Black** | `#0A0A0A` | Darkest shadows, footer, depth |
| **Stout Black** | `#1A1A1A` | Main background, cards |
| **Charcoal** | `#2A2A2A` | Hover states, elevated surfaces |
| **Foam Cream** | `#FFF8E7` | Headers, highlights, special elements |
| **Soft Cream** | `#E8E8DD` | Secondary text, descriptions |
| **Muted Grey** | `#9CA3AF` | Labels, tertiary text |

### Accent Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Harp Gold** | `#F7D447` | Premium accents, borders, icons |
| **Burnished Gold** | `#D4AF37` | Gold hover states, subtle borders |

### Score Colors (NON-NEGOTIABLE)

| Score Range | Color | Hex | Treatment |
|-------------|-------|-----|-----------|
| **85-100%** | Green | `#10B981` | Text + 20% opacity background |
| **60-84%** | Amber | `#F59E0B` | Text + 20% opacity background |
| **0-59%** | Red | `#EF4444` | Text + 20% opacity background |

**Rules:**
- Scores are ALWAYS bold
- Scores are ALWAYS color-coded
- No exceptions

### Color Usage Rules

**Backgrounds:**
- Main pages: `#0A0A0A` (deep black)
- Cards/panels: `#1A1A1A` (stout black) with subtle gold border `rgba(247, 212, 71, 0.2)`
- Elevated elements: `#2A2A2A` (charcoal)

**Text:**
- Playfair Display headings: `#FFFFFF` (bright white — exception to cream rule)
- Body text: `#E8E8DD` (soft cream)
- Labels: `#9CA3AF` (muted grey), uppercase, tracking-wide

**Accents:**
- Premium borders: `#F7D447` or `rgba(247, 212, 71, 0.2)` for subtle
- Interactive hover: Gold tint
- Special badges: Foam cream background, dark text

---

## Typography

### Font Stack

**Two fonts. No more.**

| Font | Class | Purpose |
|------|-------|---------|
| **Playfair Display** | `font-display` | Brand moments — logo, page titles, scores, tier names |
| **Inter** | `font-body` | Everything else — buttons, labels, body, navigation |

### Playfair Display Rules

- **Weight:** 700 (Bold) only
- **Color:** `#FFFFFF` (bright white) — always
- **Style:** Never italic
- **Use for:** "The Stout Standard", "Split the G", "My Pints", all scores, tier names (Barman, Legend, etc.)

### Inter Rules

- **Weights:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Color:** Soft cream `#E8E8DD` for body, muted grey `#9CA3AF` for labels
- **Italic:** Only for feedback quotes ("Textbook execution")
- **Use for:** Everything else

### Type Scale

```css
/* Scores (Playfair) */
--score-hero: 96px      /* Result page, huge reveal */
--score-large: 72px     /* Receipt modal */
--score-card: 36px      /* Pint log cards */

/* Headings (Playfair) */
--heading-1: 36px       /* Page titles */
--heading-2: 24px       /* Section titles */

/* Body (Inter) */
--text-lg: 18px         /* Important body text */
--text-base: 16px       /* Default body */
--text-sm: 14px         /* Labels, small text */
--text-xs: 12px         /* Captions, metadata */
```

### CSS Implementation

```css
/* Google Fonts import */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

:root {
  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', -apple-system, system-ui, sans-serif;
}

/* Scores need lining numerals */
.score {
  font-family: var(--font-display);
  font-weight: 700;
  font-variant-numeric: lining-nums;
  color: #FFFFFF;
}
```

---

## Spacing System

**4px base unit.**

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight — between related elements |
| `space-2` | 8px | Close — small padding |
| `space-3` | 12px | Default — most common |
| `space-4` | 16px | Comfortable — cards, buttons |
| `space-6` | 24px | Generous — sections |
| `space-8` | 32px | Spacious — page margins desktop |

**Page margins:**
- Mobile: 16px (`space-4`)
- Desktop: 32px (`space-8`)

**Card padding:** 24px (`space-6`)

**Button padding:** 12px vertical, 24px horizontal

---

## Components

### Cards

```css
/* Standard Card */
background: #1A1A1A;
border: 1px solid rgba(247, 212, 71, 0.2);
border-radius: 6px;
padding: 24px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

/* Premium Card (scores, important content) */
background: #1A1A1A;
border: 2px solid #F7D447;
border-radius: 6px;
padding: 32px;
box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
```

### Buttons

**Primary (main actions — Share, Submit):**
```css
background: #10B981;
color: #0A0A0A;
padding: 12px 24px;
border-radius: 4px;
font-weight: 600;
font-size: 16px;

/* Hover */
transform: scale(1.02);
box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
```

**Secondary (alternative actions — Challenge a Mate):**
```css
background: transparent;
color: #FFF8E7;
border: 2px solid #F7D447;
padding: 12px 24px;
border-radius: 4px;
font-weight: 600;

/* Hover */
background: rgba(247, 212, 71, 0.1);
```

**Ghost (tertiary — text links):**
```css
background: transparent;
color: #E8E8DD;
padding: 12px 24px;
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 4px;

/* Hover */
background: rgba(255, 255, 255, 0.05);
```

### Inputs

```css
background: #2A2A2A;
border: 1px solid rgba(247, 212, 71, 0.3);
border-radius: 4px;
padding: 12px 16px;
color: #FFF8E7;
font-size: 16px;

/* Focus */
border-color: #F7D447;
outline: none;
box-shadow: 0 0 0 3px rgba(247, 212, 71, 0.1);
```

---

## Animations

**Principles:**
- Smooth, confident (300-400ms)
- Ease-out timing
- Never bouncy or playful
- Scale on hover: 1.02x max

```css
/* Standard transition */
transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);

/* Button hover */
transform: scale(1.02);

/* Card hover */
transform: translateY(-2px);
box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
```

---

## Brand Voice

### Core Principles

1. **Brutal Honesty Over False Praise**
   - Never inflate scores or sugarcoat bad pours
   - A 36% score means it's shite — say so wittily, not cruelly

2. **Witty, Not Cringe**
   - Internet-native humor, never forced
   - Irish pub vernacular, not corporate speak
   - If it sounds like LinkedIn, delete it

3. **Direct, Not Verbose**
   - Short sentences. Punchy copy.
   - No marketing fluff or buzzwords

4. **Confident Authority**
   - We're THE stout standard
   - No apologetic language ("maybe", "possibly")

5. **Internet-Native, Not Try-Hard**
   - We know the memes, we don't force them
   - Sleeper energy, not social media manager energy

### Score Feedback Examples

**85%+ (Good):**
- "Perfect split. Absolute cinema."
- "Now that's a pour."
- "Textbook execution."
- "That'll do nicely."

**60-84% (Mid):**
- "Not bad for a Tuesday."
- "Getting there."
- "Room for improvement, but respectable."
- "You've poured worse."

**<60% (Bad):**
- "Back to basics."
- "Maybe next time."
- "That's certainly a choice."
- "We've seen worse. Not many, but some."

### CTA Copy

**✅ USE:**
- "Split the G"
- "Rate Your Guinness"
- "Challenge a Mate"
- "Try Again"
- "G'wan Then"
- "The full verdict"

**❌ NEVER USE:**
- "Score Your Pour"
- "Get Started"
- "Submit"
- "Retry"
- "Invite Friend"
- "We're thrilled to announce..."

### Word Choices

**✅ USE:**
- Guinness (full name)
- Gsplit (lowercase 's', no hyphen)
- Pint, pour, split
- Pub, barman
- Mate

**❌ NEVER USE:**
- Beverage, drink, consumer
- Journey, experience, ecosystem
- Leverage, synergy, optimize
- fr fr, no cap, bussin, slay

---

## Page-Specific Patterns

### Results Page Hierarchy

1. **Score** — HUGE (72-96px), Playfair, color-coded, center
2. **Feedback quote** — Italic, soft cream
3. **Context line** — `🔥 1 day • 📍 Temple Bar • Top 8%`
4. **Photo** — Gold border, smaller than score
5. **Share to Instagram** — Green primary button
6. **Challenge a Mate** — Gold secondary button
7. **Rate this Pint / Try Again** — Text links

### Leaderboard Rows

```css
/* Top 3 (podium) */
background: linear-gradient(135deg, rgba(247, 212, 71, 0.2), rgba(247, 212, 71, 0.05));
border: 2px solid #F7D447;

/* Regular entries */
background: #1A1A1A;
border: 1px solid rgba(255, 255, 255, 0.1);

/* Your entry */
background: rgba(16, 185, 129, 0.1);
border: 2px solid #10B981;
```

### Pub Cards (Maps Page)

- Pub name: Bold, white
- Star rating: ⭐ emoji (not icon)
- Top Split: 🏆 emoji + score (green) + @username
- "Uncharted" for pubs with no scores

---

## Responsive Breakpoints

```css
--mobile: 0px       /* Default, 320px+ */
--tablet: 640px     /* Small tablets */
--desktop: 1024px   /* Desktops */
--wide: 1280px      /* Large screens */
```

**Mobile (320-639px):**
- Single column
- 16px page margins
- Score: 72px
- Touch targets: 44px minimum

**Tablet (640-1023px):**
- 2-column where appropriate
- 24px page margins
- Score: 80px

**Desktop (1024px+):**
- Max content width: 1200px
- 32px page margins
- Score: 96px

---

## Don'ts

### Visual Don'ts
- ❌ Pure white (#FFFFFF) for body text — use soft cream
- ❌ Mid-tone greys — high contrast only
- ❌ Bouncy/playful animations
- ❌ Rounded corners > 8px (`rounded-lg` is max)
- ❌ `rounded-full` on UI elements (only avatars)
- ❌ `rounded-xl`, `rounded-2xl`, `rounded-3xl` — too soft
- ❌ Multiple fonts beyond Playfair + Inter
- ❌ Gradients on text
- ❌ Box-shadows > 40px blur

### Voice Don'ts
- ❌ Corporate buzzwords
- ❌ Excessive emojis (1-2 max)
- ❌ Questions in feedback ("Did you try your best?")
- ❌ Apologizing for low scores
- ❌ Try-hard Gen Z slang
- ❌ LinkedIn energy
- ❌ Boomer humor

---

## Quick Reference

### Hex Codes (Copy-Paste)

```
Deep Black:     #0A0A0A
Stout Black:    #1A1A1A
Charcoal:       #2A2A2A
Foam Cream:     #FFF8E7
Soft Cream:     #E8E8DD
Muted Grey:     #9CA3AF
Harp Gold:      #F7D447
Burnished Gold: #D4AF37
Score Green:    #10B981
Score Amber:    #F59E0B
Score Red:      #EF4444
```

### Fonts (Copy-Paste)

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

### Score Thresholds

```
85-100% → Green (#10B981)
60-84%  → Amber (#F59E0B)
0-59%   → Red (#EF4444)
```

---

**Remember: We're designing a premium Irish pub experience in app form. Sophisticated, confident, timeless. The Stout Standard.**

*Last updated: December 7, 2024*
