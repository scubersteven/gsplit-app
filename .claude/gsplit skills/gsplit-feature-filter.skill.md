---
name: gsplit-feature-filter
description: Feature prioritization framework for GSplit development. Use when deciding what to build next, evaluating feature requests, cutting scope, or debating product direction. Provides ruthless filtering criteria, build phase sequencing, and viral-first principles to maintain focus on growth and retention.
---

# GSplit Feature Filter

## The One Question

**"Does this make users come back or share?"**

If NO → Don't build it.  
If MAYBE → Kill it.  
If YES → Prioritize it.

## Core Product Loop

```
Score → Context → Share → Compete → Repeat
```

**Every feature must serve this loop.**

**Examples:**
- ✅ Instagram Stories share → Serves "Share"
- ✅ Pub leaderboards → Serves "Compete"
- ✅ Streaks → Serves "Repeat"
- ❌ Detailed pour analysis → Breaks flow, doesn't drive retention
- ❌ Educational content → Nice to have, not core loop

## The Build Phases

### Phase 1: Viral Engine (Week 1)
**Goal:** Get users sharing

**Must build:**
1. Instagram Stories share (shareable image generation)
2. Global leaderboard (top 10 today)
3. Streak counter (day tracking)

**Success metric:** 30% share rate

**Why these first:**
- Sharing = growth
- Leaderboards = competitive context
- Streaks = early retention hook

### Phase 2: Progression Loop (Week 2)
**Goal:** Give users sense of progress

**Must build:**
4. XP system + Barman ranks
5. Personal stats dashboard
6. Pub-specific leaderboards

**Success metric:** 50% D7 retention

**Why these second:**
- Ranks = sunk cost fallacy
- Stats = self-improvement narrative
- Pub boards = hyperlocal competition

### Phase 3: Habit Formation (Week 3)
**Goal:** Make it a daily habit

**Must build:**
7. Daily challenges
8. Variable rewards (random surprises)
9. Friend challenges

**Success metric:** 30% users with 7+ day streak

**Why these third:**
- Challenges = reasons to return
- Variable rewards = unpredictability
- Friends = social pressure

## The Filter Framework

### Tier 1: BUILD NOW ✅

**Criteria (ALL must be true):**
1. Serves core loop directly
2. Drives sharing OR retention
3. Can ship in <5 days
4. Can't be easily gamed/cheated
5. Measurable impact

**Examples:**
- Instagram Stories share
- Streak counter
- Pub leaderboards
- Daily challenges

### Tier 2: BUILD LATER 🟡

**Criteria (SOME are true):**
1. Enhances core loop but not essential
2. Improves user experience
3. Requires >5 days to build
4. Nice-to-have, not must-have

**Examples:**
- Historical score trends
- Pub search/filter
- Custom profile badges
- Dark mode

### Tier 3: DON'T BUILD ❌

**Criteria (ANY are true):**
1. Doesn't serve core loop
2. Breaks user flow
3. Easy to cheat/game
4. Feature creep
5. Solves edge case for <5% users

**Examples:**
- Tutorial videos
- Pour technique guides
- Detailed foam analysis
- Time-limited photo challenges (cheating risk)
- "Premium" features before scale

## Decision Tree

```
New Feature Request
       ↓
Does it make users share or come back?
       ↓
    NO → KILL IT
       ↓
    YES ↓
       ↓
Can we build it in <5 days?
       ↓
    NO → DEFER (Tier 2)
       ↓
    YES ↓
       ↓
Can users easily cheat/game it?
       ↓
    YES → KILL IT or REDESIGN
       ↓
    NO ↓
       ↓
BUILD NOW (Tier 1)
```

## Anti-Patterns to Avoid

### 🚫 Feature Creep

**Signs:**
- "Wouldn't it be cool if..."
- "What if we also added..."
- "Users might want..."

**Response:**
- "Does it serve the core loop?"
- "Will it make them share or come back?"
- If NO → Reject immediately

### 🚫 Premature Optimization

**Examples:**
- ❌ Advanced analytics before 1000 users
- ❌ Custom themes before product-market fit
- ❌ API access before viral growth
- ❌ Monetization before retention is proven

**Rule:** Don't optimize what doesn't exist yet.

### 🚫 Edge Case Engineering

**Examples:**
- ❌ Supporting 47 different pub chains
- ❌ Handling users who score 100x per day
- ❌ Building for users without smartphones
- ❌ Accounting for every possible error state

**Rule:** Build for the 95%, ignore the 5%.

### 🚫 Solving Non-Problems

**Examples:**
- ❌ "Users might get confused by..."
- ❌ "What if someone wants to..."
- ❌ "Some users could potentially..."

**Rule:** Solve real problems users actually have, not hypotheticals.

## The "Why Not" Test

**For any feature request, ask:**

1. **"Why build this?"**
   - If answer is vague → Kill it
   - If answer is "nice to have" → Defer it
   - If answer is "drives retention/sharing" → Consider it

2. **"Why now?"**
   - If not critical for current phase → Defer it
   - If blocks core functionality → Build it
   - If "would be cool" → Kill it

3. **"Why us?"**
   - If competitor does it better → Reference them, don't build
   - If we can do it uniquely → Consider it
   - If it's table stakes → Build minimal version

## Specific Feature Decisions

### ✅ BUILD

**Instagram Stories Share**
- WHY: Primary viral channel
- WHEN: Phase 1 (Week 1)
- IMPACT: 30% share rate = exponential growth

**Pub Leaderboards**
- WHY: Hyperlocal competition drives retention
- WHEN: Phase 2 (Week 2)
- IMPACT: Creates in-pub culture, repeat visits

**Streak Counter**
- WHY: Proven retention mechanic (Duolingo = $500M/year)
- WHEN: Phase 1 (Week 1)
- IMPACT: 30% of users with 7+ day streaks

**XP/Ranks System**
- WHY: Sunk cost fallacy after Level 3
- WHEN: Phase 2 (Week 2)
- IMPACT: 50% D7 retention

### 🟡 DEFER

**Historical Score Analysis**
- WHY: Doesn't drive immediate retention
- WHEN: After 10K users
- ALTERNATIVE: Show basic stats for now

**Pub Search/Discovery**
- WHY: Users already know which pub they're at
- WHEN: After pub partnerships launch
- ALTERNATIVE: Use location services

**Custom Badges/Icons**
- WHY: Personalization is nice but not viral
- WHEN: After core loop proven
- ALTERNATIVE: Standard badges for achievements

### ❌ DON'T BUILD

**Pour Technique Tutorials**
- WHY: We're scoring, not teaching
- ALTERNATIVE: Link to Guinness official guide

**Detailed Foam Analysis**
- WHY: Breaks simplicity of single score
- ALTERNATIVE: Keep feedback to one-liner

**"Try Guided Mode Now"**
- WHY: Can't ask users to buy another pint immediately
- ALTERNATIVE: Promote guided mode before first attempt

**Time-Limited Challenges with Photo Upload**
- WHY: Too easy to cheat with saved photos
- ALTERNATIVE: Daily challenges without time pressure

**Premium/Pro Features**
- WHY: Monetize after scale, not before
- WHEN: After 50K MAU
- ALTERNATIVE: Focus on free viral growth

## The 80/20 Rule

**80% of impact comes from 20% of features.**

**Our 20%:**
1. Accurate scoring (already built)
2. Instagram sharing
3. Pub leaderboards
4. Streaks

**Everything else is the 80% that delivers 20% of value.**

**Build the 20% first. Ship the 80% later (or never).**

## Competitive Analysis Filter

**When looking at competitors:**

### ❌ Don't Copy Blindly

**Bad reasoning:**
- "Competitor X has feature Y, we should too"
- "Everyone does Z, so we need Z"
- "Industry standard is..."

**Better reasoning:**
- "Users asked for X 47 times"
- "Our analytics show users churn without Y"
- "Z would increase our share rate by 15%"

### ✅ Learn and Differentiate

**Good analysis:**
- What do they do well? (learn from it)
- What do they do poorly? (avoid it)
- What do they NOT do? (opportunity)

**GSplit differentiation:**
- ✅ Brutal honesty (vs sugar-coated feedback)
- ✅ Pub culture (vs generic "leaderboards")
- ✅ Irish wit (vs corporate speak)
- ✅ Simplicity (vs feature bloat)

## User Feedback Filter

**Not all feedback is equal.**

### ✅ Build For

**Feedback from:**
- Users who share their scores (engaged)
- Users with 7+ day streaks (retained)
- Users who visit weekly (habit formed)

### 🟡 Consider From

**Feedback from:**
- Users who scored once (might churn anyway)
- Users who never shared (not in target)
- Users with no location data (limited use case)

### ❌ Ignore From

**Feedback from:**
- Non-users who "heard about it"
- One-time visitors who churned
- Feature tourists who want everything
- People who say "you should add..."

**Exception:** If 10+ similar requests from engaged users → Consider

## The Viral Coefficient

**For every feature, estimate viral coefficient (VC):**

**VC = (Invites sent per user) × (Conversion rate)**

**Target:** VC > 1.0 = exponential growth

**Examples:**
- Instagram share: VC = 0.3 × 0.1 = 0.03 (but high reach)
- Friend challenge: VC = 1.5 × 0.4 = 0.6 (strong)
- Pub leaderboard: VC = 0.0 × 0.0 = 0.0 (retention, not viral)

**Prioritize features with VC > 0.3 or strong retention impact.**

## The Retention Test

**For every feature, estimate retention impact:**

**Retention metric: D7 retention**

**Examples:**
- Streaks: +15% D7 retention (huge)
- Ranks: +10% D7 retention (strong)
- Stats dashboard: +3% D7 retention (moderate)
- Custom theme: +0% D7 retention (zero impact)

**Prioritize features with +5% or higher D7 impact.**

## The Build vs Buy Decision

### Build

**When:**
- Core to product differentiation
- Simple to implement (<5 days)
- No good existing solutions

**Examples:**
- Scoring algorithm (core differentiator)
- Pub leaderboards (unique to us)
- Brand-specific UI

### Buy/Use Existing

**When:**
- Commodity feature
- Complex to build (>2 weeks)
- Good existing solutions

**Examples:**
- Authentication (use Firebase/Auth0)
- Push notifications (use Firebase)
- Analytics (use Mixpanel/Amplitude)
- Payment processing (use Stripe, when we monetize)

### Link/Reference

**When:**
- Nice to have, not core
- Others do it better
- Distraction from core loop

**Examples:**
- Pour technique guides → Link to Guinness.com
- Pub finder → Link to Google Maps
- Beer education → Link to Wikipedia

## The Minimum Viable Feature

**For any feature, ask: "What's the 10% version?"**

**Examples:**

**Full Feature:** Custom profile with avatar, bio, links, stats
**10% MVP:** Username + total pints scored

**Full Feature:** Advanced analytics with charts, trends, comparisons
**10% MVP:** 3 numbers: Avg score, best score, total pints

**Full Feature:** Social network with follows, feeds, comments
**10% MVP:** Friend challenges via link share

**Build the 10% first. Add 90% only if needed.**

## Real-World Examples

### Example 1: "Add pour technique videos"

**Filter:**
- Serves core loop? NO (we score, not teach)
- Makes users share? NO
- Makes users return? NO
- Decision: **DON'T BUILD**
- Alternative: Link to Guinness official guide

### Example 2: "Add Instagram Stories share"

**Filter:**
- Serves core loop? YES (sharing)
- Makes users share? YES (it's literally sharing)
- Makes users return? Indirectly (friends see it)
- Can ship in <5 days? YES
- Can be gamed? NO
- Decision: **BUILD NOW (Phase 1)**

### Example 3: "Add happy hour challenges"

**Filter:**
- Serves core loop? YES (retention)
- Makes users return? YES (time pressure)
- Can ship in <5 days? YES
- Can be gamed? **YES** (upload old photos)
- Decision: **DON'T BUILD**
- Alternative: Daily challenges without time limits

### Example 4: "Add custom themes"

**Filter:**
- Serves core loop? NO (cosmetic)
- Makes users share? NO
- Makes users return? NO
- Nice to have? YES
- Decision: **DEFER (Tier 2)**
- When: After 50K users request it

### Example 5: "Add detailed foam analysis"

**Filter:**
- Serves core loop? NO (breaks simplicity)
- Makes users share? NO (too complex)
- Makes users return? NO
- Requested by users? NO
- Decision: **DON'T BUILD**
- Keep: Single score + witty feedback

## The Ruthless Cutting Process

**Every sprint, ask:**

1. **"What can we cut?"**
   - Features not being used (<10% adoption)
   - Features that don't drive metrics
   - Complexity that slows us down

2. **"What can we simplify?"**
   - Reduce clicks/taps
   - Remove unnecessary options
   - Streamline core flow

3. **"What can we automate?"**
   - Manual processes
   - Repetitive tasks
   - Admin overhead

**Example:**
- Cut: 5-point rating system → Simple thumbs up/down
- Simplify: 3-step survey → 1-step "Rate your Guinness"
- Automate: Pub detection → Use GPS, not manual input

## The Shipping Velocity Rule

**Ship weekly, not monthly.**

**Why:**
- Faster feedback loops
- More experiments
- Higher morale
- Better learnings

**How:**
- Build 10% MVPs
- Cut scope ruthlessly
- Ship incomplete features with "Coming soon" flags
- Iterate based on real usage

**Don't wait for perfect. Ship and improve.**

## Final Checklist

**Before building any feature:**

1. ✅ Does it make users share or come back?
2. ✅ Can we ship it in <5 days?
3. ✅ Can we measure its impact?
4. ✅ Is it in current build phase?
5. ✅ Can't be easily gamed/cheated?
6. ✅ Serves core loop (Score → Share → Compete → Repeat)?
7. ✅ Won't break existing flow?
8. ✅ Solves real problem (not hypothetical)?

**If ANY answer is NO → Don't build it (yet).**

---

**Remember: GSplit's job is to settle pub debates, not be a Swiss Army knife.**

**Every feature should have ONE purpose: Make users come back or make users share.**

**Everything else is noise.**
