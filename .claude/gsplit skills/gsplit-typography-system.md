# Gsplit Typography System

**Complete Font Specification for Gsplit App**

---

## 🎨 Font Family Stack

### **Font 1: Playfair Display (Display/Headings)**
```css
font-family: 'Playfair Display', serif;
```
**Purpose:** Premium display font for big impact moments  
**Source:** Google Fonts  
**Weights Used:** 700 (Bold) only  
**Italic:** Never  

---

### **Font 2: Inter (Body/Stats/Numbers)**
```css
font-family: 'Inter', -apple-system, system-ui, sans-serif;
```
**Purpose:** Primary content font for scores, stats, body text  
**Source:** Google Fonts  
**Weights Used:** 400 (Regular), 600 (SemiBold), 700 (Bold)  
**Italic:** 400 Regular only (quotes/feedback)  

---

### **Font 3: SF Pro / System (UI/Buttons)**
```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
```
**Purpose:** Native UI elements for fast loading  
**Source:** System fonts (no import needed)  
**Weights Used:** 400 (Regular), 600 (SemiBold), 700 (Bold)  
**Italic:** Never  

---

## 📋 Complete Usage Guide

### **PLAYFAIR DISPLAY (Display Font)**

#### "The Verdict" Header
```css
font-family: 'Playfair Display', serif;
font-weight: 700;
font-size: 36px;      /* Mobile */
font-size: 48px;      /* Desktop */
font-style: normal;
letter-spacing: 0.02em;
line-height: 1.2;
color: #1A1A1A;       /* On foam header */
```

**Usage:**
- "The Verdict" foam header
- Page titles (Home, Map, Log, Survey)
- Hero headings

**Never use for:**
- ❌ Body text
- ❌ Stats or numbers
- ❌ Buttons
- ❌ Italic style

---

### **INTER (Body/Stats/Numbers)**

#### Score Numbers (Big Impact)
```css
font-family: 'Inter', sans-serif;
font-weight: 700;
font-size: 48px;      /* Mobile */
font-size: 80px;      /* Desktop */
font-size: 96px;      /* Extra large displays */
font-style: normal;
letter-spacing: -0.02em;
line-height: 1;
color: #5D9B5D;       /* Score-based: green/amber/red */
text-shadow: none;    /* No glow */
```

**Usage:**
- Main score display (41.9%, 86.9%)
- Score countup animations
- Hero numbers

**Score Colors:**
- 80%+: `#5D9B5D` (Softer green)
- 60-79%: `#E8A849` (Softer amber)
- 0-59%: `#C45C4B` (Softer red)

---

#### Stats & Rankings
```css
font-family: 'Inter', sans-serif;
font-weight: 600;
font-size: 16px;      /* Mobile */
font-size: 20px;      /* Desktop */
font-style: normal;
letter-spacing: 0;
line-height: 1.4;
color: #D4AF37;       /* Gold for rankings */
color: #FFF8E7;       /* Cream for general stats */
```

**Usage:**
- "Top 76% this week"
- "#3 today"
- "Split detected ✓"
- Ranking text
- Competitive context

---

#### Feedback Quotes (Italic)
```css
font-family: 'Inter', sans-serif;
font-weight: 400;
font-size: 18px;      /* Mobile */
font-size: 22px;      /* Desktop */
font-style: italic;   /* ← ONLY place we use italic */
letter-spacing: 0;
line-height: 1.5;
color: #FFF8E7;
```

**Usage:**
- "Decent pour"
- API feedback messages
- Witty commentary
- Always in quotes: "..."

**Rule:** ONLY use italic for feedback quotes, nothing else!

---

#### Body Text (Paragraphs)
```css
font-family: 'Inter', sans-serif;
font-weight: 400;
font-size: 16px;
font-style: normal;
letter-spacing: 0;
line-height: 1.6;
color: #E8E8DD;       /* Soft cream */
```

**Usage:**
- Landing page copy
- Instructions
- Descriptions
- Multi-line content
- Survey questions

---

#### Data Labels (Small Text)
```css
font-family: 'Inter', sans-serif;
font-weight: 600;
font-size: 14px;
font-style: normal;
letter-spacing: 0.05em;
line-height: 1.4;
text-transform: uppercase;
color: #9CA3AF;       /* Muted grey */
```

**Usage:**
- "SCORE:", "SPLIT:", "LOCATION:"
- Form labels
- Section headers (small)
- Metadata labels

---

### **SF PRO / SYSTEM (UI Font)**

#### Primary Buttons
```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
font-weight: 600;
font-size: 16px;
font-style: normal;
letter-spacing: 0;
line-height: 1;
text-transform: none;
```

**Usage:**
- "Share to Instagram 📸"
- "Challenge Friend ⚔️"
- Primary action buttons
- Call-to-action elements

---

#### Secondary Buttons
```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
font-weight: 600;
font-size: 16px;
font-style: normal;
letter-spacing: 0;
line-height: 1;
```

**Usage:**
- "Try Again 🔄"
- "Cancel"
- Secondary actions
- Outline buttons

---

#### Badges (Gamification)
```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
font-weight: 600;
font-size: 14px;
font-style: normal;
letter-spacing: 0;
line-height: 1;
```

**Usage:**
- 🔥 "1 day" (streak badge)
- 🌱 "Rookie" (tier badge)
- Status indicators
- Small UI labels

---

#### Navigation
```css
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
font-weight: 600;
font-size: 14px;
font-style: normal;
letter-spacing: 0;
line-height: 1;
```

**Usage:**
- Menu items
- Tab labels
- Navigation links

---

## 🎯 Font Size Scale

### Mobile Sizes
```
Hero Display:     36px  (Playfair Display)
Score (Large):    48px  (Inter Bold)
Score (Medium):   32px  (Inter Bold)
Headings:         24px  (Inter SemiBold)
Body:             16px  (Inter Regular)
Stats:            16px  (Inter SemiBold)
Feedback:         18px  (Inter Regular Italic)
Buttons:          16px  (SF Pro SemiBold)
Badges:           14px  (SF Pro SemiBold)
Labels:           14px  (Inter SemiBold)
Small Text:       12px  (Inter Regular)
```

### Desktop Sizes
```
Hero Display:     48px  (Playfair Display)
Score (XL):       96px  (Inter Bold)
Score (Large):    80px  (Inter Bold)
Score (Medium):   48px  (Inter Bold)
Headings:         32px  (Inter SemiBold)
Body:             16px  (Inter Regular)
Stats:            20px  (Inter SemiBold)
Feedback:         22px  (Inter Regular Italic)
Buttons:          16px  (SF Pro SemiBold)
Badges:           14px  (SF Pro SemiBold)
Labels:           14px  (Inter SemiBold)
```

---

## 📦 Google Fonts Import

Add to `index.html` in `<head>`:

```html
<!-- Preconnect for performance -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Font imports: Playfair Display 700 + Inter 400,400i,600,700 -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

**What this imports:**
- Playfair Display: 700 (Bold)
- Inter: 400 (Regular), 400 Italic, 600 (SemiBold), 700 (Bold)

---

## 🎨 CSS Variables

Add to `src/index.css`:

```css
:root {
  /* Font Families */
  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', -apple-system, system-ui, sans-serif;
  --font-ui: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  
  /* Font Weights */
  --weight-regular: 400;
  --weight-semibold: 600;
  --weight-bold: 700;
  
  /* Font Sizes (Mobile) */
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 32px;
  --text-4xl: 36px;
  --text-5xl: 48px;
  --text-6xl: 60px;
  --text-7xl: 80px;
  --text-8xl: 96px;
}
```

---

## 🚫 Never Do This

**Playfair Display:**
- ❌ Never use italic
- ❌ Never use for body text
- ❌ Never use for numbers
- ❌ Never use weights other than 700

**Inter:**
- ❌ Never italic except for feedback quotes
- ❌ Never use 700 Bold for body paragraphs
- ❌ Never use for buttons

**SF Pro / System:**
- ❌ Never use italic
- ❌ Never use for headings
- ❌ Never use for score numbers

**General:**
- ❌ Never mix italic + bold together
- ❌ Never use more than 2 font weights in one element
- ❌ Never use all caps on Playfair Display

---

## ✅ Usage Examples

### Results Page Score Card
```
"The Verdict"           → Playfair Display 700, 48px
"Decent pour"           → Inter 400 Italic, 22px
41.9%                   → Inter 700, 80px, color-coded
Top 76% this week       → Inter 600, 20px, gold
Split detected ✓        → Inter 600, 16px, cream
Share to Instagram 📸   → SF Pro 600, 16px
🔥 1 day                → SF Pro 600, 14px
🌱 Rookie               → SF Pro 600, 14px
```

### Landing Page
```
"Settle It"             → Playfair Display 700, 48px
"The Digital Barman"    → Inter 600, 24px
Body copy               → Inter 400, 16px
"Score Your Pour"       → SF Pro 600, 16px (button)
```

### Instagram Share Image
```
"The Verdict"           → Playfair Display 700, 32px
86.9%                   → Inter 700, 36px
"Decent pour"           → Inter 400 Italic, 18px
Top 11% this week       → Inter 600, 14px
Split: ✅ Detected      → Inter 400, 12px
gsplit.app              → Inter 400, 12px
```

---

## 📊 Font Performance

**Load Times:**
- Playfair Display 700: ~15KB
- Inter (4 styles): ~60KB
- SF Pro / System: 0KB (native)

**Total:** ~75KB for all custom fonts

**Optimization:**
- Use `font-display: swap` for faster rendering
- Preconnect to Google Fonts CDN
- System fonts for UI = zero latency

---

## 🎯 Quick Reference

| Element | Font | Weight | Size (Mobile) | Size (Desktop) | Italic? |
|---------|------|--------|---------------|----------------|---------|
| "The Verdict" | Playfair | 700 | 36px | 48px | ❌ |
| Score Numbers | Inter | 700 | 48px | 80-96px | ❌ |
| Stats/Rankings | Inter | 600 | 16px | 20px | ❌ |
| Feedback Quotes | Inter | 400 | 18px | 22px | ✅ |
| Body Text | Inter | 400 | 16px | 16px | ❌ |
| Data Labels | Inter | 600 | 14px | 14px | ❌ |
| Primary Buttons | SF Pro | 600 | 16px | 16px | ❌ |
| Badges | SF Pro | 600 | 14px | 14px | ❌ |

---

**Remember:** Consistency is key! These exact specifications ensure a cohesive, professional brand across all touchpoints. Never deviate without good reason. 🎨
