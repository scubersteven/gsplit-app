# Gsplit Brand Identity Guide

**"The Digital Barman"**

Internet-native • Witty • Irish • Tech-savvy • Classy but edgy

---

## 🎯 Brand Essence

**What we are:**
The definitive authority on Guinness pour quality. We settle pub debates with technology, wit, and brutal honesty.

**What we're not:**
- Corporate beer review site
- Stuffy traditional Irish pub
- Generic dark mode app
- Serious sommeliers

**Brand archetype:**
The clever regular at the pub who's seen it all, knows the score, and isn't afraid to call it like it is.

---

## 🎨 Visual Identity

### Color Palette

**The "Pint UI" Concept:**
Think of the app as a literal Guinness pint - stout black body, foam cream top, gold accents like the harp logo. Every interface element references this visual metaphor.

**Primary Colors (Main App - The Pint)**

```
Deep Black      #0A0A0A     █████     Darkest shadows, depth
Stout Black     #1A1A1A     █████     Main background, cards (the beer)
Foam Cream      #FFF8E7     █████     Headers, text, top bars (the foam)
Harp Gold       #FFD700     █████     Premium accents, borders (the logo)
```

**Functional Colors (Score-Driven)**

```
Kelly Green     #00B140     █████     Success, 80%+ scores
Golden Orange   #FFA500     █████     Medium, 60-79% scores  
Pure Red        #D40003     █████     Poor, <60% scores
```

**Secondary Colors (Temple Bar Accent - Use Together)**

```
Burgundy Red    #8B1A1A     █████     Deep pub aesthetic
Brass Gold      #B8860B     █████     Worn metal, vintage fixtures
Rich Black      #1A1A1A     █████     Backdrop for Temple Bar elements
```

**When to Use Temple Bar Colors:**
- Pub-specific pages (location details)
- Irish heritage sections
- Leaderboard "house" elements
- Always use burgundy + brass together for cohesion
- Never mix with primary Kelly Green/Pure Red (different aesthetic)

**Color Usage Rules:**

**The Pint UI Structure:**
- **Top sections (foam):** `#FFF8E7` - Headers, navigation, top bars
- **Main content (stout):** `#1A1A1A` - Background, cards, content areas
- **Depth (shadows):** `#0A0A0A` - Darkest areas, shadows, overlays
- **Accents (harp):** `#FFD700` - Premium highlights, borders, special elements

**Text Hierarchy:**
- Headings: `#FFF8E7` (Foam Cream), bold
- Body: `#FFF8E7` at 90% opacity, regular
- Labels: `#FFF8E7` at 60% opacity, uppercase, semibold
- Interactive: `#FFD700` (Harp Gold) → darker on hover

**Score Colors (CRITICAL - Non-negotiable):**
- **80-100%:** `#00B140` (Kelly Green) text + 20% green background
- **60-79%:** `#FFA500` (Golden Orange) text + 20% orange background
- **0-59%:** `#D40003` (Pure Red) text + 20% red background
- Always bold, always huge, always centered

**Temple Bar Palette (Use Sparingly):**
- Only for pub-specific features
- `#8B1A1A` (Burgundy) + `#B8860B` (Brass) always together
- On `#1A1A1A` (Rich Black) backgrounds
- Creates vintage Irish pub aesthetic
- Never mix with primary Kelly Green/Pure Red

---

## ✍️ Typography

**Font Stack:**
```css
font-family: 
  -apple-system, 
  BlinkMacSystemFont, 
  "SF Pro Display",
  "Segoe UI", 
  "Roboto", 
  "Helvetica Neue", 
  Arial, 
  sans-serif;
```

**Type Scale:**

```
Hero Scores      128px    font-weight: 900 (black)
Large Scores     96-120px font-weight: 800 (extra bold)
Page Titles      36-48px  font-weight: 700 (bold)
Section Titles   24-30px  font-weight: 700 (bold)
Body Large       18-20px  font-weight: 400 (regular)
Body Default     16px     font-weight: 400 (regular)
Small Text       14px     font-weight: 600 (semibold)
Captions         12px     font-weight: 500 (medium)
```

**Typography Rules:**

**Scores:**
- ALWAYS bold (font-weight 800-900)
- Tight letter-spacing (-2px for 100px+)
- Color-coded (green/amber/red)
- Never italicized

**Headings:**
- Bold (font-weight 700)
- `Warm White` color
- Tight tracking (`tracking-tight`)
- Short, punchy (max 5 words)

**Body Text:**
- Regular weight
- `Soft Cream` color
- Line-height 1.6
- Max 60 characters per line

**Labels:**
- Uppercase
- Semibold (font-weight 600)
- `Muted Grey` color
- Wide letter-spacing (1-2px)
- Used for: "SCORE:", "SPLIT:", "FEEDBACK:"

---

## 🗣️ Brand Voice

### Personality Traits

**Witty, not cringe**
- ✅ "Back to basics"
- ✅ "That's a pour"
- ✅ "Absolute cinema"
- ❌ "OMG amazing!!! 🎉🎉🎉"
- ❌ "You're doing great sweetie!"

**Direct, not verbose**
- ✅ "Try again"
- ✅ "Not bad for a Tuesday"
- ❌ "We're thrilled to inform you..."
- ❌ "Your journey to perfection..."

**Confident, not apologetic**
- ✅ "36.1% - Practice makes perfect"
- ✅ "Top 11% today"
- ❌ "Sorry, but your score..."
- ❌ "Unfortunately..."

**Irish pub vernacular, not corporate**
- ✅ "Guinness" (full name)
- ✅ "Pub", "Barman", "Pour"
- ✅ "Settle it"
- ❌ "Beverage", "Consumer"
- ❌ "Leverage", "Synergy"

**Internet-native, not forced**
- ✅ "Absolute cinema" (meme-aware)
- ✅ Dry wit, subtle references
- ❌ "fr fr no cap" (trying too hard)
- ❌ Excessive emojis

### Tone by Context

**Results Page:**
- Confident judgment
- One-line feedback
- No explanation needed
- Example: "Textbook execution" or "Maybe next time"

**Competition/Leaderboards:**
- Competitive but not aggressive
- Facts over emotions
- Example: "#3 today" or "Top 11%"

**Challenges:**
- Motivating without being pushy
- Loss aversion acceptable
- Example: "🔥 5-day streak" or "Don't break it"

**Errors:**
- Helpful, not condescending
- Direct instruction
- Example: "Hold steady" or "Need more light"

**Sharing:**
- Brag-worthy for high scores
- Self-deprecating for low scores
- Example: "87% at Temple Bar 🍺" or "36% but trying again"

### Forbidden Words/Phrases

**Never use:**
- Beverage, drink, consumer
- Journey, experience, ecosystem
- Leverage, synergy, optimize
- "Amazing!!!", "OMG!", "Slay!"
- "We're thrilled to...", "Congratulations on..."
- Corporate buzzwords

**Always use:**
- Guinness (full name)
- Gsplit (no hyphen)
- Pint, pour, split
- Pub, barman
- Settle it

---

## 🎭 Design Principles

### 1. "The Pint UI" - Core Visual Metaphor

**The app IS a Guinness pint:**

```
┌─────────────────────┐
│   FOAM (#FFF8E7)    │ ← Headers, navigation, top sections
├─────────────────────┤
│                     │
│   STOUT (#1A1A1A)   │ ← Main content, cards, body
│                     │
│   Content lives     │
│   in the stout      │
│                     │
├─────────────────────┤
│ GOLD ACCENTS (#FFD700) ← Harp logo elements, highlights
└─────────────────────┘
```

**What this means:**
- Every page follows this structure
- Top = Foam (light, cream)
- Middle = Stout (dark, rich)
- Accents = Gold (like the harp)
- Users subconsciously see a pint

**Implementation:**
- Headers/nav bars: Foam cream backgrounds
- Content areas: Stout black backgrounds
- Premium borders: Harp gold
- Score badges: Green/Orange/Red overlays on stout

### 2. "Guinness Label Meets Modern App"

**What this means:**
- Premium materials (gold, dark aesthetics)
- Timeless, sophisticated
- BUT with modern app smoothness
- Clean, not cluttered

**Visual examples:**
- Gold borders on premium elements (like Guinness label)
- Dark near-black backgrounds (like stout)
- Foam cream text (like the head)
- But: smooth animations, modern spacing

### 3. "Confident Authority"

**What this means:**
- We're THE definitive source
- Bold, declarative statements
- No hedging or apologizing
- Clear visual hierarchy

**Visual examples:**
- HUGE scores (120px+, can't miss them)
- Bold headings
- Definitive color-coding (green/amber/red)
- Premium gold accents (we're legit)

### 3. "Pub Culture + Tech Precision"

**What this means:**
- Irish pub warmth (gold, cream, dark wood)
- But measured by technology (precise scores)
- Balance tradition and innovation

**Visual examples:**
- Gold accents (traditional)
- But precise percentages (tech)
- Emoji icons (modern)
- But Irish terminology (traditional)

### 4. "Internet-Native Wit"

**What this means:**
- Understands meme culture
- Self-aware, dry humor
- Never forced or cringe
- Clever without trying too hard

**Visual examples:**
- "Absolute cinema" (meme-literate)
- Minimal copy, maximum impact
- Subtle Easter eggs
- No corporate speak

---

## 📐 Spacing & Layout

**Base Unit:** 4px

```
Space-1    4px      Tight (between related elements)
Space-2    8px      Close (small padding)
Space-3    12px     Default (common gaps)
Space-4    16px     Comfortable (cards, buttons)
Space-6    24px     Generous (sections)
Space-8    32px     Spacious (page margins)
Space-12   48px     Large (hero sections)
Space-16   64px     XL (major separations)
```

**Usage:**
- Card padding: 24px (space-6)
- Button padding: 16px horizontal, 12px vertical
- Section gaps: 32px (space-8)
- Page margins: 16px mobile, 32px desktop
- Stack spacing: 16px between elements

---

## 🎨 Component Patterns

### Cards

**Standard Card:**
```
Background: #1a1a1a (Rich Black)
Border: 1px solid rgba(212, 175, 55, 0.2) (Subtle gold)
Border-radius: 12px
Padding: 24px
Shadow: 0 4px 6px rgba(0, 0, 0, 0.3)
```

**Premium Card (Important Content):**
```
Background: #1a1a1a
Border: 2px solid #D4AF37 (Satin Gold)
Border-radius: 12px
Padding: 32px
Shadow: 0 8px 16px rgba(0, 0, 0, 0.4)
```

### Buttons

**Primary (Main Actions):**
```
Background: #10B981 (Precision Green)
Color: #0A0A0A (Near Black text)
Padding: 12px 24px
Border-radius: 8px
Font-weight: 600
Font-size: 16px
Hover: scale(1.02) + shadow
```

**Secondary (Alternative Actions):**
```
Background: transparent
Color: #F5F5F0 (Warm White)
Border: 2px solid #D4AF37 (Satin Gold)
Padding: 12px 24px
Border-radius: 8px
Font-weight: 600
Hover: background rgba(212, 175, 55, 0.1)
```

**Ghost (Tertiary):**
```
Background: transparent
Color: #E8E8DD (Soft Cream)
Border: 1px solid rgba(255, 255, 255, 0.2)
Padding: 12px 24px
Border-radius: 8px
Hover: background rgba(255, 255, 255, 0.05)
```

### Icons

**Style:**
- Use Lucide React icons
- Size: 20-24px for buttons, 16-18px inline
- Color: `Warm White` default, `Satin Gold` for premium
- Stroke width: 2px

**Common Icons:**
- 🔍 Magnifying glass (score)
- ✅/❌ Check/X (split detected)
- 💬 Speech bubble (feedback)
- 📍 Map pin (location)
- 🔥 Flame (streak)
- 🏆 Trophy (leaderboard)
- ⚔️ Crossed swords (challenge)
- 📸 Camera (photo)

---

## 🖼️ Visual Motifs

### Irish Pub Aesthetic

**Subtle, never overwhelming:**
- Celtic knot patterns at 3-5% opacity (background texture)
- Guinness harp watermark (10% opacity, bottom corner)
- Dark wood grain texture (2-3% opacity, adds warmth)
- Gold metallic accents (borders, highlights)

**Usage:**
- Use sparingly - don't overdo Irish stereotypes
- Keep it classy, not kitschy
- Subtle nods, not in-your-face

### Premium Touches

**Gold Accents:**
- Important borders (cards, modals)
- Hover states
- Badge backgrounds
- Divider lines
- Top 3 leaderboard entries

**Shadows & Depth:**
- Layered shadows for premium feel
- Score glow effects (matching color at 30% opacity)
- Elevation on hover (2-4px translate)
- Never flat - always some dimension

**Animations:**
- Smooth, confident (300-400ms)
- Ease-out timing
- Scale on hover (1.02x max)
- Fade-in for reveals
- Never bouncy or playful

---

## 📱 Platform-Specific Guidelines

### Instagram Stories (1080x1920)

**Layout:**
- Pint photo: 60% (hero)
- Score card: 40% (bottom)
- Pure black background (#000000, not near-black)
- Use brighter colors (Bright Green/Amber/Red)

**Typography:**
- Score: 120-140px (HUGE)
- Feedback: 28-36px italic
- Labels: 18-24px semibold
- All text needs subtle black text-shadow for legibility

**Goal:**
- Scroll-stopping
- Instant read
- Brag-worthy

### Web App (Responsive)

**Mobile (320-639px):**
- Single column
- Score visible above fold (no scrolling)
- 16px page margins
- 56px minimum touch targets

**Desktop (1024px+):**
- Max width 1200px, center-aligned
- 32px page margins
- Side-by-side layouts where appropriate

---

## 🚫 Brand Don'ts

**Visual:**
- ❌ Pure white (#FFFFFF) text - use Foam Cream (#FFF8E7)
- ❌ Mid-tone greys - stick to near-black or foam cream (high contrast)
- ❌ Pastel colors - bold, saturated only
- ❌ Mixing Temple Bar colors with Kelly Green/Pure Red (different aesthetics)
- ❌ Playful/bouncy animations
- ❌ Rounded corners > 16px (not bubbly)
- ❌ Multiple fonts
- ❌ Gradients on text
- ❌ Box-shadows > 40px blur

**Voice:**
- ❌ Corporate buzzwords
- ❌ Excessive emojis (1-2 max)
- ❌ Apologizing for low scores
- ❌ Explaining the scoring unsolicited
- ❌ Questions in feedback
- ❌ Over-formatting (bold/italic everywhere)

**Tone:**
- ❌ Cringe slang ("fr fr", "slay")
- ❌ Guilt trips ("Are you sure you want to leave?")
- ❌ Fake scarcity ("Only 3 spots left!")
- ❌ False praise ("Amazing job!")

---

## ✅ Brand Checklist

**Before shipping ANY design:**

**Visual:**
- [ ] Uses Guinness color palette
- [ ] Has proper spacing (4px increments)
- [ ] Typography scale is correct
- [ ] Color-coded scores are accurate
- [ ] Gold accents are subtle
- [ ] Shadows provide depth

**Voice:**
- [ ] Sounds like "The Digital Barman"
- [ ] Direct, not verbose
- [ ] Witty, not cringe
- [ ] Irish pub vernacular
- [ ] No corporate speak

**Interaction:**
- [ ] Animations are smooth (300-400ms)
- [ ] Hover states are clear
- [ ] Touch targets are 44x44px minimum
- [ ] Loading states indicated

**Brand:**
- [ ] Feels premium and Irish
- [ ] Not generic dark mode
- [ ] Confident, not playful
- [ ] Internet-native, not corporate

---

## 🎯 Brand Positioning

**One-line pitch:**
"The definitive authority on Guinness pour quality - we settle pub debates with tech and wit."

**Competitive positioning:**

**vs The Guinness Map:**
- They catalog pubs → We judge pours
- They're comprehensive → We're competitive
- They're informational → We're entertaining

**vs Split the G Dev:**
- They score → We settle it
- They're functional → We're fun
- They're solo → We're social

**Gsplit is:**
The place where Guinness culture meets internet culture, where traditional pub debates get modern precision, where you don't just rate a pour - you prove you're better than your mate.

---

## 📝 Messaging Framework

**Taglines:**
- "Settle It" (primary)
- "The Digital Barman"
- "The Official Gsplit Score"

**Value props:**
- Definitive scoring (not subjective opinion)
- Competitive leaderboards (not just personal tracking)
- Witty feedback (not boring numbers)
- Irish pub culture (not corporate beer reviews)

**Call-to-actions:**
- "Score Your Pour" (not "Get Started")
- "Settle It" (not "Try It")
- "Challenge Friend" (not "Invite")
- "Attempt Another Split" (not "Try Again")

---

## 🎨 Usage Examples

### Good Examples

**Score Feedback:**
- ✅ "Perfect split. Absolute cinema."
- ✅ "Not bad for a Tuesday."
- ✅ "Back to basics."

**Competitive Context:**
- ✅ "#3 today"
- ✅ "Top 11%"
- ✅ "House record: 96.8%"

**Buttons:**
- ✅ "Share to Instagram 📸"
- ✅ "Challenge Friend ⚔️"
- ✅ "Try Again 🔄"

### Bad Examples

**Score Feedback:**
- ❌ "Congratulations on your achievement!"
- ❌ "OMG amazing!!! 🎉🎉🎉"
- ❌ "You're doing great sweetie!"

**Competitive Context:**
- ❌ "You beat 89% of pours"
- ❌ "#3 out of 47 attempts today"
- ❌ "Your ranking has improved"

**Buttons:**
- ❌ "Get Started"
- ❌ "Unlock Your Potential"
- ❌ "Continue Your Journey"

---

**Remember: Gsplit is the clever, confident regular at the pub who's seen everything, knows the score, and isn't afraid to call it straight. We're premium but not pretentious, witty but not cringe, tech-savvy but not cold.**

**Every pixel, every word, every interaction should feel like that.**
