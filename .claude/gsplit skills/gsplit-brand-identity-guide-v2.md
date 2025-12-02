# Gsplit Brand Identity Guide

**"The Stout Standard"**

Internet-native • Witty • Irish • Tech-savvy • Young but not try-hard

---

## 🎯 Brand Essence

**What we are:**
The all-in-one Guinness app for the extremely online generation. Scoring, reviews, maps, logs - everything Guinness, one place. We're the stout standard.

**The gap we fill:**
Guinness culture is stuck in "da's favorite drink" energy while the people actually ordering it are 22-35 and extremely online. We speak their language.

**What we're not:**
- Corporate beer review site
- Stuffy traditional Irish pub aesthetic
- Generic dark mode app
- Serious sommeliers
- Trying too hard to be young (no "fr fr", no "slay")

**Brand archetype:**
The clever regular at the pub who's chronically online, knows the score, and isn't afraid to call it like it is. Think Wendy's Twitter energy meets Irish pub wit.

---

## 🏆 Competitive Positioning

**The all-in-one advantage:**
Other apps do ONE thing. We do everything:
- Scoring (splittheg.dev does this)
- Reviews (scattered across Yelp, Google)
- Maps (Guinness Map does this)
- Personal logs (nobody does this well)

**Gsplit = the only app that does it all.**

**vs The Guinness Map:**
- They catalog pubs → We judge pours AND catalog pubs
- They're comprehensive → We're competitive and comprehensive
- They're informational → We're entertaining

**vs Split the G Dev:**
- They score → We score + review + map + log
- They're functional → We're fun
- They're solo → We're social
- They're a tool → We're a brand with personality

**Our unfair advantage:**
The X rating bot. Nobody else is doing this. People submit pours, we roast them publicly with AI-generated wit. Engagement that builds itself.

---

## 📱 Social Media Strategy

### Platform Priority

| Platform | Priority | Why |
|----------|----------|-----|
| **X** | #1 | Fastest to post, most reactive, lowest production barrier. The bot alone carries the account. Our voice is built for X. |
| **Instagram** | #2 | Visual product, existing Guinness community, Reels repurpose well. Necessary for credibility. |
| **TikTok** | #3 | Highest potential reach but highest effort. Add once rhythm is established on X + IG. |

### Content Philosophy

**We're Sleeper, not Hootsuite.**

Sleeper energy:
- Reactive, not scheduled
- Responds to what happened TODAY
- Quote tweets with one-word destruction
- Templates that become inside jokes
- Self-aware about being an app

What this requires:
- AI agents monitoring Reddit, Discord, X, Instagram for trends
- Speed: trend detected → post live in under 2 hours (48 hours = dead meme)
- Repeatable formats ready to deploy
- Brand voice so locked in that anyone can execute

### Content Mix (All from @gsplit)

| Type | % of Content | Example |
|------|--------------|---------|
| Memes | 40% | Guinness culture, pub humor, trending formats |
| Commentary | 25% | Reacting to viral pours, pub drama, discourse |
| Product | 20% | Score reveals, user reposts, feature drops |
| Culture | 15% | Irish pub moments, stout takes, internet crossovers |

**The brand IS the personality.** One account. One voice. No separation between "brand content" and "personality content."

### The X Rating Bot

**The concept:**
People @ us or reply with their pint photo. Gsplit responds with a score + one-line roast. Public. Brutal. Funny. Shareable.

**Why it works:**
1. User does the work - they submit, we react
2. Inherently shareable - people screenshot their rating
3. Creates FOMO - others see it, want to get rated
4. Builds authority - we become THE account that judges pours
5. Content engine - every submission is potential content

**Example interactions:**

```
@guinnesshead420: @gsplit rate my pour
[photo of mid pour]

@gsplit: 71%. Not bad for a Tuesday.
```

```
@dublinlad: @gsplit who won?
[photo of two pints]

@gsplit: Left: 84%. Right: 61%. It's not even close.
```

**Pipeline:**
```
@gsplit mention with image
    ↓
Pull image via X API
    ↓
Send to Gsplit scoring backend
    ↓
Get score
    ↓
Send score to Claude API → generates roast
    ↓
Reply: "[Score]%. [Roast]"
```

---

## 🎨 Visual Identity

### Color Palette

**The "Pint UI" Concept:**
The app IS a Guinness pint - stout black body, foam cream top, gold accents like the harp logo.

**Primary Colors (The Pint)**

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

**Score Colors (CRITICAL - Non-negotiable):**
- **80-100%:** `#00B140` (Kelly Green) text + 20% green background
- **60-79%:** `#FFA500` (Golden Orange) text + 20% orange background
- **0-59%:** `#D40003` (Pure Red) text + 20% red background
- Always bold, always huge, always centered

---

## ✏️ Typography

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

---

## 🗣️ Brand Voice

### Core Identity

**Gsplit is "The Stout Standard"** - the definitive authority on Guinness culture for the extremely online generation.

### Personality Traits

**Witty, not cringe**
- ✅ "Back to basics"
- ✅ "Absolute cinema"
- ✅ "That's a pour"
- ❌ "OMG amazing!!! 🎉🎉🎉"
- ❌ "You're doing great sweetie!"
- ❌ "fr fr no cap"
- ❌ "slay"

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

**Internet-native, not forced**
- ✅ "Absolute cinema" (meme-aware)
- ✅ Dry wit, subtle references
- ✅ Self-aware about being an app
- ❌ "fr fr no cap" (trying too hard)
- ❌ Excessive emojis
- ❌ LinkedIn energy

**Irish pub vernacular, not corporate**
- ✅ "Guinness" (full name)
- ✅ "Pub", "Barman", "Pour"
- ✅ "Pint"
- ❌ "Beverage", "Consumer"
- ❌ "Leverage", "Synergy"

### Tone by Context

**Results Page:**
- Confident judgment
- One-line feedback
- No explanation needed
- Example: "Textbook execution" or "Maybe next time"

**X Bot Replies:**
- Quick, brutal, funny
- Score + roast in one line
- Shareable format
- Example: "71%. Not bad for a Tuesday."

**Instagram:**
- Visual-first, copy-second
- Let the score/image speak
- No hashtag spam (#gsplit only)

**Competition/Leaderboards:**
- Competitive but not aggressive
- Facts over emotions
- Example: "#3 today" or "Top 11%"

**Errors:**
- Helpful, not condescending
- Direct instruction
- Example: "Hold steady" or "Need more light"

### Forbidden Words/Phrases

**Never use:**
- Beverage, drink, consumer
- Journey, experience, ecosystem
- Leverage, synergy, optimize
- "Amazing!!!", "OMG!", "Slay!"
- "We're thrilled to...", "Congratulations on..."
- "fr fr", "no cap", "bussin"
- Corporate buzzwords

**Always use:**
- Guinness (full name)
- Gsplit (no hyphen, lowercase 's')
- Pint, pour, split
- Pub, barman
- The Stout Standard (tagline)

---

## 📝 Messaging Framework

**Primary Tagline:**
"The Stout Standard"

**Secondary Taglines:**
- "Everything Guinness"
- "The Digital Barman"

**Value props:**
- All-in-one (scoring + reviews + maps + logs)
- Definitive scoring (not subjective opinion)
- Internet-native wit (not boring numbers)
- For the extremely online (not your da's app)

**Call-to-actions:**
- "Score Your Pour" (not "Get Started")
- "Rate It" (not "Submit")
- "Challenge a Mate" (not "Invite Friend")
- "Try Again" (not "Retry")

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

### 2. "Internet-Native Wit"

**What this means:**
- Understands meme culture
- Self-aware, dry humor
- Never forced or cringe
- Clever without trying too hard
- References land for 22-35 year olds

### 3. "Confident Authority"

**What this means:**
- We're THE definitive source
- Bold, declarative statements
- No hedging or apologizing
- Clear visual hierarchy
- HUGE scores (120px+)

---

## 🚫 Brand Don'ts

**Visual:**
- ❌ Pure white (#FFFFFF) text - use Foam Cream (#FFF8E7)
- ❌ Mid-tone greys - high contrast only
- ❌ Pastel colors - bold, saturated only
- ❌ Playful/bouncy animations
- ❌ Rounded corners > 16px (not bubbly)
- ❌ Multiple fonts

**Voice:**
- ❌ Corporate buzzwords
- ❌ Excessive emojis (1-2 max)
- ❌ Apologizing for low scores
- ❌ Explaining the scoring unsolicited
- ❌ Questions in feedback
- ❌ Try-hard Gen Z slang ("fr fr", "slay", "no cap")

**Tone:**
- ❌ LinkedIn energy
- ❌ Guilt trips ("Are you sure you want to leave?")
- ❌ Fake scarcity ("Only 3 spots left!")
- ❌ False praise ("Amazing job!")
- ❌ Boomer humor
- ❌ "Your da" energy

---

## ✅ Brand Checklist

**Before shipping ANY content:**

**Voice:**
- [ ] Would you post this from a personal account without cringing?
- [ ] Is it under 10 words? (for feedback)
- [ ] Does it avoid corporate speak?
- [ ] Does it avoid try-hard slang?
- [ ] Is it confident, not apologetic?

**Visual:**
- [ ] Uses the Pint UI color structure
- [ ] Score is color-coded correctly
- [ ] Typography hierarchy is clear
- [ ] Gold accents are subtle

**Social:**
- [ ] Would Sleeper post something like this?
- [ ] Is it reactive to something current? (if meme)
- [ ] Does it make people want to share?
- [ ] Is it shareable without context?

---

## 🎨 Usage Examples

### Good Examples

**Score Feedback:**
- ✅ "Perfect split. Absolute cinema."
- ✅ "Not bad for a Tuesday."
- ✅ "Back to basics."

**X Bot Replies:**
- ✅ "71%. Not bad for a Tuesday."
- ✅ "84% vs 61%. It's not even close."
- ✅ "93%. Now that's a pour."
- ✅ "47%. We've seen worse. Not many, but some."

**Instagram Captions:**
- ✅ "93% 🎯" (let the image speak)
- ✅ "Rate yours → gsplit.app"
- ✅ "The standard has been set."

### Bad Examples

**Score Feedback:**
- ❌ "Congratulations on your achievement!"
- ❌ "OMG amazing!!! 🎉🎉🎉"
- ❌ "You're doing great sweetie!"
- ❌ "That pour is bussin fr fr"

**Social Captions:**
- ❌ "We're SO excited to announce..."
- ❌ "Tag a friend who needs this! 👇👇👇"
- ❌ "#guinness #beer #pub #ireland #stout #pour #perfect #goals"

---

**Remember: Gsplit is the stout standard. Internet-native. Brutally honest. Witty without trying. We're for the 22-35 year olds who love Guinness but hate the boomer marketing around it.**

**Every post, every pixel, every interaction should feel like that.**
