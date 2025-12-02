---
name: gsplit-gamification
description: Psychology and retention mechanics for GSplit gamification features. Use when building streaks, leaderboards, challenges, rewards, progression systems, or any feature designed to drive user retention and engagement. Provides timing strategies, variable reward patterns, and proven psychological hooks.
---

# GSplit Gamification Psychology

## Core Loop

**Score → Context → Share → Progress → Compete → Repeat**

Every feature must serve this loop. If it doesn't make users come back or share, cut it.

## The 5-Second Rule

**Users decide to leave or stay within 5 seconds of seeing their score.**

**What must happen in those 5 seconds:**
1. Context (how good/bad is this score?)
2. Share option (brag or get sympathy)
3. Progress indicator (what's next?)

**Order matters:**
1. Score (big, bold, immediate)
2. Competitive framing (percentile, rank)
3. Share buttons (Instagram + download)
4. Streak counter
5. Progress to next rank

## Psychological Principles

### 1. Loss Aversion > Gain Seeking

**What it means:** People work harder to avoid losing something they have than to gain something new.

**Application:**
- **Streaks** - "🔥 Don't break your 7-day streak"
- **Rank defense** - "You're #3, but #4 is catching up"
- **Limited challenges** - "Ends in 2h 34m"

**Implementation:**
```javascript
// Show streak prominently
if (userStreak >= 3) {
  showStreakBanner({
    days: userStreak,
    message: "Come back tomorrow to keep it alive"
  });
}

// Urgent notification if about to break
if (hoursSinceLastScore >= 20) {
  sendPushNotification({
    title: "🔥 Streak Alert",
    body: `Don't break your ${userStreak}-day streak`
  });
}
```

### 2. Variable Rewards (Slot Machine Effect)

**What it means:** Unpredictable rewards are MORE addictive than predictable ones.

**Application:**
- Random bonus XP (10% chance after any score)
- Surprise badges ("🎁 Lucky Pour!")
- Unexpected leaderboard features
- Random "2x XP Weekend" unlocks

**Implementation:**
```javascript
// After scoring
if (Math.random() < 0.1) { // 10% chance
  const surprises = [
    { type: 'xp', amount: 50, message: '🎁 Bonus XP!' },
    { type: 'badge', id: 'lucky-pour', message: '🎁 Lucky Pour badge!' },
    { type: 'multiplier', duration: '48h', message: '🎁 2x XP Weekend!' }
  ];
  
  showSurprise(surprises[Math.floor(Math.random() * surprises.length)]);
}
```

**Critical:** Keep it rare (10% chance) - too common kills the magic.

### 3. Social Proof & Competition

**What it means:** People want to be better than others, especially people they know or might meet.

**Application:**
- Pub-specific leaderboards (hyperlocal competition)
- "You're #47 today" (creates urgency to climb)
- "House record: 96.8%" (clear target)
- Friend challenges ("Beat my 87%")

**Why hyperlocal works:**
- You might actually meet these people
- Stakes feel real
- Creates in-pub culture

**Implementation:**
```javascript
// Show context immediately after score
const pubRanking = getRankAtPub(score, pubId);
const percentile = getPercentile(score, pubId, 'today');

showCompetitiveContext({
  yourRank: pubRanking,
  percentile: percentile,
  houseRecord: getHouseRecord(pubId),
  topScoreToday: getTopScore(pubId, 'today')
});
```

### 4. Progression Systems (RPG Mechanics)

**What it means:** Clear advancement creates sunk cost fallacy - "I've come this far, can't stop now."

**Application:**
- Barman ranks (Trainee → Apprentice → Barman → Master → Legend)
- XP system (simple: 1 pint = 1 XP)
- Visual progress bars
- Unlockable features per rank

**Critical thresholds:**
- 5 pints: First rank-up (hook them early)
- 15 pints: Sunk cost kicks in
- 30 pints: Serious commitment
- 50 pints: Hardcore users, give them prestige

**Implementation:**
```javascript
const ranks = [
  { name: 'Trainee', min: 0, max: 4, unlock: 'Basic stats' },
  { name: 'Apprentice', min: 5, max: 14, unlock: 'Historical tracking' },
  { name: 'Barman', min: 15, max: 29, unlock: 'Pub comparisons' },
  { name: 'Master Barman', min: 30, max: 49, unlock: 'Custom badge' },
  { name: 'Legend', min: 50, max: Infinity, unlock: 'Homepage feature' }
];

// Show progress to next rank
const currentRank = getRank(userXP);
const nextRank = ranks[ranks.indexOf(currentRank) + 1];
const progress = (userXP - currentRank.min) / (nextRank.min - currentRank.min);

showProgressBar({
  current: currentRank.name,
  next: nextRank?.name,
  progress: progress,
  pintsToNext: nextRank.min - userXP
});
```

### 5. Instant Gratification

**What it means:** Dopamine hits must be immediate, not delayed.

**Application:**
- Score appears instantly (no loading screens)
- Share buttons are ONE tap
- Rank updates in real-time
- Progress bars animate smoothly

**Never:**
- Make users wait for results
- Require account creation before sharing
- Hide scores behind surveys
- Delay gratification for arbitrary reasons

### 6. FOMO (Fear of Missing Out)

**What it means:** Limited-time opportunities create urgency.

**Application (CAREFUL - Easy to Abuse):**
- Time-limited challenges (weekly quests)
- Daily challenge resets at midnight
- "Top score today" (resets daily)

**NOT for GSplit (Cheating Concerns):**
- ❌ "Score 80%+ in next hour for bonus"
- ❌ "Happy hour challenges" (can fake timestamps)
- ❌ Photo-based time challenges (can use old photos)

**Why:** Users can cheat by uploading pre-scored photos or taking photos of already-split pints.

## Feature-Specific Guidelines

### Streaks

**Psychology:** Loss aversion + habit formation

**Implementation rules:**
1. Show streak counter after 2+ days
2. Push notification at 20 hours since last score
3. Celebrate milestones (7, 30, 100, 365 days)
4. NEVER break streaks for technical issues

**Display logic:**
```javascript
if (streak >= 7) {
  showProminently(); // Top of results page
  addBadge('🔥 Hot streak');
} else if (streak >= 2) {
  showNormal(); // Below score card
}
```

### Leaderboards

**Psychology:** Social proof + competition + status

**Types to show:**
1. **Global Today** - Aspirational (top 10 worldwide)
2. **Pub-Specific** - Achievable (you vs locals)
3. **Friends** - Personal (you vs mates)

**Display priority:**
1. Pub-specific (if location shared)
2. Friends (if connected)
3. Global (always show)

**Critical elements:**
- Your rank (even if #847)
- Top 3 (gold/silver/bronze icons)
- House record with timestamp
- Real usernames/handles (builds credibility)

**Anti-gaming measures:**
- Flag suspicious patterns (10x 95%+ scores)
- Moderate usernames
- Time-decay older scores

### Challenges

**Psychology:** Goals + rewards + variety

**Types:**
- **Daily:** Simple, always achievable
  - Rate 1 pint (+10 XP)
  - Rate at new pub (+50 XP)
  - Rate with friend (+100 XP)

- **Weekly:** Harder, specific goals
  - Rate 5 pints (+200 XP)
  - Score 85%+ 3 times (+badge)
  - Visit 3 different pubs (+badge)

- **Monthly:** Epic quests
  - Rate 20 pints (+500 XP)
  - Top 10 in your city (+featured)
  - Perfect 100% score (+legendary badge)

**Implementation:**
```javascript
const dailyChallenges = [
  { id: 'daily-score', task: 'Rate 1 pint', reward: 10, completed: false },
  { id: 'daily-new-pub', task: 'Rate at new pub', reward: 50, completed: false },
  { id: 'daily-friend', task: 'Rate with friend', reward: 100, completed: false }
];

// Reset at midnight local time
if (isNewDay()) {
  resetDailyChallenges();
}
```

### Progress Bars

**Psychology:** Visual motivation + clear goals

**Rules:**
- Always show next milestone
- Never show "100% complete" without next step
- Animate fills smoothly (dopamine hit)
- Use green for progress, gold for completion

**Example:**
```
BARMAN RANK: Apprentice (Level 2)
━━━━━━━━━━━━━━━━━━━━ 36%
🎯 3 more pints to reach "Barman"
```

### Variable Rewards

**Psychology:** Unpredictability = addiction

**Implementation:**
```javascript
// After score submission
const roll = Math.random();

if (roll < 0.05) { // 5% - Rare legendary
  showSurprise('legendary', 'Featured on homepage this week!');
} else if (roll < 0.15) { // 10% - Common bonus
  showSurprise('xp', '+50 Bonus XP');
}
```

**Reward tiers:**
- 5% chance: Legendary (homepage feature, rare badges)
- 10% chance: Common (bonus XP, multipliers)
- 85% chance: Nothing (keeps it special)

## Timing Strategies

### When to Show What

**Immediately (0-2 seconds):**
- Score
- Competitive percentile
- Share buttons

**Quick (2-5 seconds):**
- Streak counter
- Progress bar
- Personal best comparison

**Secondary (5-10 seconds):**
- Leaderboard preview
- Daily challenge status
- Next milestone

**Tertiary (10+ seconds):**
- Full leaderboard view
- Stats dashboard
- Historical trends

### When to Send Notifications

**Push notifications (use sparingly):**
- Streak about to break (20 hours since last score)
- Knocked off leaderboard (within 1 hour of losing position)
- Friend beat your score
- Weekly challenge ending soon
- New house record at your favorite pub

**Never spam:**
- Max 1 notification per day
- Respect "Do Not Disturb" hours
- Allow opt-out per type

## What NOT to Do

### ❌ Dark Patterns (Never Use)

**Fake scarcity:**
- ❌ "Only 3 spots left!" (when unlimited)
- ❌ Artificial timers on permanent features

**Deceptive defaults:**
- ❌ Pre-checked "Share to social media"
- ❌ Hidden costs or subscriptions

**Forced actions:**
- ❌ "Must share to see score"
- ❌ "Create account to continue"

**Guilt trips:**
- ❌ "Are you sure you want to leave?"
- ❌ Sad animations when closing app

### ❌ Annoying Practices (Avoid)

**Notification spam:**
- ❌ Daily "We miss you" messages
- ❌ Multiple reminders for same thing

**Feature creep:**
- ❌ Adding features that break core loop
- ❌ Complexity for complexity's sake

**Over-explanation:**
- ❌ Tutorial overlays for obvious actions
- ❌ Tooltips on every element

## Success Metrics

**Track these to validate mechanics:**

**Engagement:**
- Daily Active Users (DAU)
- Scores per user per week (target: 2+)
- Time between scores (target: <7 days)

**Retention:**
- D1 retention (target: 60%+)
- D7 retention (target: 40%+)
- D30 retention (target: 20%+)

**Viral:**
- Share rate (target: 30%+)
- Instagram Story shares (target: 20%+)
- Friend invites (target: 1 per user)

**Progression:**
- % users with streak 7+ (target: 30%)
- Average Barman rank (target: Apprentice)
- Challenge completion rate (target: 40%+)

**Competition:**
- Leaderboard views per score (target: 50%+)
- Pub check-ins (target: 60%+ with location)

## A/B Testing Framework

**Test systematically:**

**Streak Mechanics:**
- Control: Show after 2 days
- Variant: Show after 1 day
- Measure: Retention D7

**Share CTA:**
- Control: "Share My Score"
- Variant: "Flex Your Score"
- Measure: Share rate

**Progress Bar:**
- Control: "3 more pints to Barman"
- Variant: "67% to Barman"
- Measure: Return rate

**Always:**
- Test one variable at a time
- Run for minimum 1000 users
- Statistical significance > opinions

## Implementation Checklist

**Before building any gamification feature:**

1. ✅ Does it serve the core loop?
2. ✅ Does it make users come back?
3. ✅ Is timing optimized (5-second rule)?
4. ✅ Can it be gamed/cheated easily?
5. ✅ Is reward frequency appropriate?
6. ✅ Does it respect user time/attention?
7. ✅ Can we track its effectiveness?

**If any answer is NO, reconsider or redesign.**

## Final Principles

**Good gamification:**
- Respects user time
- Provides real value
- Creates genuine competition
- Celebrates real achievement
- Builds habits, not addiction

**Bad gamification:**
- Manipulates through guilt
- Creates artificial scarcity
- Rewards meaningless actions
- Exploits psychology unethically

**GSplit is about settling pub debates and tracking pour skills. Every mechanic should serve that core purpose.**

---

**Build features users want to use, not features that trick them into using.**
