# G-Split Product Roadmap
## Post-Score Experience & Gamification Strategy

**Last Updated:** November 21, 2025  
**Status:** Ready to Build

---

## 🎯 Core Philosophy

**Hook users in 5 seconds after score reveal. Make every pour a reason to come back.**

The current experience stops at the score. This roadmap transforms it into an addictive loop:
- Score → Context → Share → Progress → Challenge → Repeat

---

## ✅ Approved Features to Build

### **IMMEDIATE (Post-Score - 0-5 seconds)**

#### 1. Competitive Framing
**What it shows:**
```
Your Score: 36.1%
🏆 Top 1% Today: 98.2%
📊 You Beat: 12% of pours today
⬆️ +24 points to beat the pub average (60%)
```

**Why it works:**
- Instant context - users need to know if they're good or terrible
- Creates immediate goal (beat the average)
- Taps into competitive drive

**Implementation notes:**
- Calculate percentile from today's scores in database
- Show pub-specific average if location available
- Update "top 1%" in real-time


#### 2. Instant Shareability
**What it shows:**
```
[📸 Share to Instagram Stories] ← Pre-filled with image + score overlay
[💬 Challenge a Friend] ← SMS/WhatsApp with "Beat my 36.1%"
[🏆 Post to Leaderboard] ← Pub-specific boards
```

**Why it works:**
- Social validation is MORE addictive than the score itself
- Users want to flex (high scores) or get sympathy (low scores)
- Viral distribution mechanism - friends see it, want to try

**Implementation notes:**
- Generate shareable image: Pint photo + score + "G-Split" branding
- Pre-fill Instagram Stories with image + sticker
- SMS/WhatsApp deep link: "I scored 36.1% on G-Split. Think you can beat me? [link]"
- Leaderboard posting requires account/name

---

### **HOOK (5-10 seconds)**

#### 3. Streak Counter
**What it shows:**
```
🔥 2-Day Streak!
Come back tomorrow to keep it alive
[Set Reminder]
```

**Why it works:**
- Duolingo makes $500M/year with this ONE mechanic
- Loss aversion > gain seeking
- Sunk cost fallacy after 3+ days

**Implementation notes:**
- Track last score date per user
- Streak breaks if >24 hours between scores
- Optional push notification: "Don't break your 5-day streak!"
- Badge rewards at 7, 30, 100, 365 days


#### 4. Progress Bar / Barman Ranks
**What it shows:**
```
BARMAN RANK: Trainee (Level 2)
━━━━━━━━━━━━━━━━━━━━ 36%
🎯 3 more pints to reach "Apprentice"
Unlock: Detailed pour analysis
```

**Rank progression:**
1. **Trainee** (0-4 pints) - "Learning the ropes"
2. **Apprentice** (5-14 pints) - "Getting the hang of it"
3. **Barman** (15-29 pints) - "Respectable pour skills"
4. **Master Barman** (30-49 pints) - "Expert level"
5. **Legend** (50+ pints) - "Hall of Fame"

**Unlocks per rank:**
- Apprentice: Historical score tracking
- Barman: Pub comparison stats
- Master: Custom badge
- Legend: Featured on homepage

**Why it works:**
- RPG progression psychology
- Sunk cost fallacy kicks in after Level 3
- Always a clear next goal

**Implementation notes:**
- XP = number of pints rated (simple)
- Show progress bar to next rank
- Celebrate rank-up with animation
- Display current rank on profile

---

### **RETENTION (10-30 seconds)**

#### 5. Personal Stats Dashboard
**What it shows:**
```
Your Guinness Journey
━━━━━━━━━━━━━━━━━━━━
📊 12 pints rated
📈 Avg score: 42% (+8% this week!)
🏆 Best: 67% (The Temple Bar)
📍 Favorite spot: Brazen Head (5 visits)
🎯 Next milestone: Rate 15 pints → Unlock "Analyst" badge
```

**Why it works:**
- Self-improvement narrative - "I'm getting better"
- Shows progression over time
- Creates attachment to data/history

**Implementation notes:**
- Store all scores with timestamps and locations
- Calculate rolling averages (week, month, all-time)
- Track pub visits (location data from photos or manual input)
- Show trend arrows (↑ improving, → stable, ↓ declining)


#### 6. Gamified Missions
**What it shows:**
```
Daily Challenges:
☑️ Rate a pint (✓)
☐ Rate in a new pub (0/1) +50 XP
☐ Rate with a friend (0/1) +100 XP

Weekly Quest:
🎯 The Perfect Pour Hunt
Rate 5 pints scoring 85%+
Reward: "Perfectionist" badge + Featured on leaderboard
Progress: 0/5
```

**Challenge types:**
- **Daily:** Simple, achievable (rate 1 pint, new pub, with friend)
- **Weekly:** Harder, specific goals (5x 85%+ scores, 3 different pubs, etc.)
- **Monthly:** Epic quests (20 pints, 10 pubs, climb to top 10 in city)

**Why it works:**
- Always something to do
- Always a reason to come back
- FOMO if they miss a day

**Implementation notes:**
- Reset daily challenges at midnight local time
- Weekly resets on Mondays
- Track challenge progress in real-time
- Push notification when challenge is close to complete


#### 7. Variable Rewards (Random Surprises)
**What it shows:**
```
🎁 Lucky Pour!
You unlocked: Bonus XP Weekend
All scores earn 2x points Sat-Sun

[Claim Bonus]
```

**Surprise types:**
- Bonus XP multipliers
- Rare badges
- Featured on homepage
- Free "Pro Mode" trial
- Early access to new features

**Trigger conditions:**
- Random (10% chance after any score)
- Milestone (every 10th pint)
- Special occasions (St. Patrick's Day, pub anniversaries)

**Why it works:**
- Unpredictable rewards = slot machine effect
- HIGHLY addictive
- Creates excitement around every score

**Implementation notes:**
- 10% random chance after score
- Show celebratory animation
- Track claimed rewards in user profile
- Don't overdo it - keep it special

---

### **SOCIAL (Competition)**

#### 8. Live Pub-Specific Leaderboards
**What it shows:**
```
📍 The Temple Bar - Live Rankings
━━━━━━━━━━━━━━━━━━━━
🥇 @guinnessking - 94.2% (2h ago)
🥈 @pintmaster - 89.1% (today)
🥉 @barfly_dublin - 87.3% (today)
...
#47 YOU - 36.1% (just now) ⬇️

💪 Beat the house record: 96.8%
Set by @legend_27 on Nov 3rd

[View Full Board] [Challenge Top 3]
```

**Leaderboard types:**
- **Global:** All-time best scores worldwide
- **Today:** Best scores in last 24 hours
- **This Week:** Best scores in last 7 days
- **Pub-Specific:** Best scores at this specific location
- **City:** Best scores in your city
- **Friends:** Your friends only

**Why it works:**
- Hyperlocal competition - you might actually run into these people
- Defending your spot creates urgency
- "I can beat that" mentality
- Social proof - see real people scoring high

**Implementation notes:**
- Detect pub from photo metadata or manual input
- Allow anonymous posting or username
- Show time of score for recency
- "Challenge" button sends friend request / DM
- Update in real-time as new scores come in
- House record persists across all time

---

## 🚀 Priority Build Order

### **Phase 1: Viral Engine (Week 1)**
**Goal:** Get users sharing and competing

1. **Share to Instagram Stories** ⭐ CRITICAL
   - Pre-filled image with score overlay
   - One-tap share
   - Branded template

2. **Basic Global Leaderboard**
   - Top 10 scores today
   - Your position
   - Simple, clean UI

3. **Streak Counter**
   - Track days in a row
   - Show on results page
   - "Come back tomorrow" CTA

**Success metric:** 30% of users share their score

---

### **Phase 2: Progression Loop (Week 2)**
**Goal:** Give users a sense of progress

4. **XP System + Barman Ranks**
   - 5 rank tiers
   - Visual progress bar
   - Rank-up celebrations

5. **Personal Stats Dashboard**
   - Total pints
   - Average score
   - Best score + location
   - Trends

6. **Pub-Specific Leaderboards**
   - Location-based rankings
   - House records
   - Local competition

**Success metric:** 50% of users return within 7 days

---

### **Phase 3: Habit Formation (Week 3)**
**Goal:** Make it a daily habit

7. **Daily Challenges**
   - 3 simple challenges per day
   - XP rewards
   - Push notifications

8. **Variable Rewards**
   - Random surprises (10% chance)
   - Rare badges
   - Keeps it unpredictable

9. **Friend Challenges**
   - "Beat my score" links
   - Head-to-head competitions
   - Social pressure

**Success metric:** 30% of users have 7+ day streak

---

## 📊 Key Metrics to Track

**Engagement:**
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Retention (D1, D7, D30)
- Average scores per user per week

**Viral:**
- Share rate (% who share after scoring)
- Friend invites sent
- Instagram Stories views

**Progression:**
- Average Barman rank
- % of users with 7+ day streak
- Challenge completion rate

**Competition:**
- Leaderboard views
- Pub check-ins
- Head-to-head challenges initiated

---

## 🎨 UX/UI Notes

**Results Page Layout (Priority Order):**
1. Score (big, bold, green)
2. Competitive framing (your percentile)
3. Share buttons (Instagram + Challenge Friend)
4. Streak counter
5. Progress to next rank
6. Personal best / improvement
7. Leaderboard preview (top 3)
8. Daily challenge status
9. "Rate Another" CTA

**Design principles:**
- Green = good scores (80%+)
- Amber = okay scores (60-80%)
- Red = poor scores (<60%)
- Use Irish pub aesthetic (dark wood, gold accents)
- Keep it punchy and witty, never boring
- Celebrate wins, joke about failures

---

## 🚫 What We're NOT Building (For Now)

**Rejected Ideas:**
- ❌ "Try guided mode now" - Can't ask people to buy another pint immediately
- ❌ Time-limited challenges with photo upload - Too easy to cheat with saved photos
- ❌ Monetization features - Focus on growth first

**Why:**
- Users typically buy one pint at a time
- Can't control when they're in a pub
- Cheating breaks trust in leaderboards
- Money comes after we have scale

---

## 🎯 Success Definition

**30 Days After Launch:**
- 10,000+ pints scored
- 40% share rate
- 50% D7 retention
- Top 3 pubs have active leaderboard competition
- 1,000+ users with 7+ day streaks

**If we hit these numbers, we've built something addictive.**

---

## 📝 Technical Implementation Notes

**Backend Requirements:**
- User accounts (simple - just username/email)
- Score storage with timestamps + location
- Leaderboard calculation (global + pub-specific)
- Streak tracking
- XP/rank system
- Challenge progress tracking
- Push notification system

**Frontend Requirements:**
- Results page redesign
- Stats dashboard
- Leaderboard views
- Instagram Stories share integration
- Share link generation
- Animations for rank-ups and rewards

**Infrastructure:**
- Railway backend (already deployed)
- Vercel frontend (already deployed)
- Database: PostgreSQL or Firebase
- Push notifications: Firebase Cloud Messaging
- Analytics: Mixpanel or Amplitude

---

## 🚀 Next Steps

**Right Now:**
1. Start with Instagram Stories share feature
2. Design the shareable image template
3. Build basic global leaderboard
4. Add streak counter to results page

**This Week:**
1. Complete Phase 1 (viral engine)
2. Test with 10 friends
3. Measure share rate
4. Iterate based on feedback

**Next Week:**
1. Build Phase 2 (progression loop)
2. Launch to 100 beta users
3. Monitor retention metrics
4. Add pub partnerships

---

**Let's make people addicted to rating their Guinness. 🍺**
