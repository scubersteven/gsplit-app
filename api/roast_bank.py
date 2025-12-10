"""
G-Split Roast Bank - Final Version (7 Tiers)
The Digital Barman's verdict library.

Voice: Dry Irish pub wit. Never cruel, but has teeth.
Dad-level emoji use (sparingly).
"""

PERFECT_ROASTS = [
    "That's the one. Frame it.",
    "This is what we came here for.",
    "The barman nods.",
    "That'll do nicely.",
    "Textbook execution.",
    "You've done this before, haven't you.",
    "As it should be.",
    "That's going on the fridge.",
    "Fair play.",
    "{distance_mm:.0f}mm off. Splitting hairs at this point.",
    "Screenshot that. 🎯",
    "Your round's earned.",
    "That'll play.",
    "The G rests easy.",
    "Clinic.",
    "Your da would be proud.",
    "The stuff of legend.",
    "{distance_mm:.0f}mm. Drink up. You've earned it.",
    "The pint you show the grandkids.",
    "One for the ages.",
]

SOLID_HIGH_ROASTS = [
    "Not bad for a Tuesday.",
    "The G is satisfied. Not impressed.",
    "You can tell people you split it.",
    "{distance_mm:.0f}mm from glory.",
    "Close enough for government work.",
    "Won't be telling the grandkids about this one.",
    "{distance_mm:.0f}mm. Blame the lighting.",
    "{distance_mm:.0f}mm off. Blame the stool.",
    "Wouldn't frame it.",
    "We've seen worse. Not many, but some.",
]

SOLID_LOW_ROASTS = [
    "Your ma would be proud. Your da less so.",
    "Wouldn't show the lads.",
    "I remember my first pint.",
    "Tourist numbers.",
    "{distance_mm:.0f}mm. Heavy night?",
    "First time?",
    "That's certainly a choice.",
    "{distance_mm:.0f}mm. Keep this between you and God.",
    "Sunday league split.",
    "{distance_mm:.0f}mm. The luck of the Irish skipped you.",
]

MID_HIGH_ROASTS = [
    "Jury's still out.",
    "Interesting approach. Wrong, but interesting.",
    "The G remains unsplit.",
    "Off by {distance_mm:.0f}mm. Gotta get back to basics.",
    "Not one for the books.",
    "Your heart wasn't in it.",
    "Were you rushing?",
    "Not your day.",
    "{distance_mm:.0f}mm. Sleep it off.",
    "Ah. Right. Well.",
]

MID_LOW_ROASTS = [
    "Mediocre. Efficiently mediocre.",
    "Right down the middle. Of nowhere.",
    "Try again. Sober, maybe. 🤷",
    "The split of someone who gives up easily.",
    "Wouldn't show the lads. Wouldn't show anyone.",
    "{distance_mm:.0f}mm. You peaked in secondary school, didn't you.",
    "Proof that confidence isn't everything.",
    "The split of a man with a 3-star Uber rating.",
    "{distance_mm:.0f}mm. Next round's on you.",
    "The G's seen things. Now this.",
]

ROUGH_ROASTS = [
    "{distance_mm:.0f}mm. Your ancestors crossed an ocean for this?",
    "{distance_mm:.0f}mm. This is why she has the password.",
    "Have you considered switching to lager?",
    "Let's pretend this didn't happen.",
    "Delete that.",
    "{distance_mm:.0f}mm. That's not a split, that's a guess.",
    "Off by {distance_mm:.0f}mm. Were you aiming for the harp?",
    "That's going in the group chat. 📸",
    "Did the glass move?",
    "Have you considered darts instead?",
    "Your da's disappointed. Again.",
    "This is why you're not in the family photos.",
    "Genuinely impressive. In the wrong direction.",
    "The split of a man with no health insurance.",
    "{distance_mm:.0f}mm. Deported.",
    "{distance_mm:.0f}mm. The pint's filing for divorce.",
    "The split of a man who replies 'k'.",
    "Even the stool's uncomfortable.",
    "{distance_mm:.0f}mm. They're talking about you. Not well.",
    "{distance_mm:.0f}mm. Retire.",
]

CRIMINAL_ROASTS = [
    "What happened here.",
    "Banned from the premises. Effective immediately.",
    "Have a word with yourself.",
    "Speechless.",
    "{distance_mm:.0f}mm. This one stays between us and God.",
    "Was this intentional?",
    "Did you close your eyes?",
    "{distance_mm:.0f}mm off. That's not a split, that's a crime.",
    "The barman looked away. 😬",
    "This is why they hide the Guinness from you.",
    "The glass is pressing charges.",
    "{distance_mm:.0f}mm. Excommunicated.",
    "{distance_mm:.0f}mm. Arthur Guinness just rolled over.",
    "{distance_mm:.0f}mm. Leave the pub. Leave the country.",
    "{distance_mm:.0f}mm. A crime against the state.",
    "This is why your da stopped coming to matches.",
    "{distance_mm:.0f}mm short. You've heard that before.",
    "{distance_mm:.0f}mm short. Nothing new for you.",
    "{distance_mm:.0f}mm. The kind of miss that echoes.",
    "The G weeps.",
]

FEEDBACK_LIBRARY = {
    (90, 100): PERFECT_ROASTS,
    (85, 89): SOLID_HIGH_ROASTS,
    (75, 84): SOLID_LOW_ROASTS,
    (65, 74): MID_HIGH_ROASTS,
    (50, 64): MID_LOW_ROASTS,
    (25, 49): ROUGH_ROASTS,
    (0, 24): CRIMINAL_ROASTS,
}

AI_ROAST_PROMPT = """You are The Digital Barman. You've pulled 10,000 pints. You've seen every split attempt imaginable. You're dry, deadpan, Irish pub wit. You say it once, mean it, move on. No sass. No explaining the joke. Conservative energy.

This is about SPLITTING THE G — how well the beer line aligns with the G on a Guinness glass. Not pouring technique.

Score: {score}%
Distance from perfect split: {distance_mm:.1f}mm

Generate ONE verdict. 5-12 words. Match the tier:

PERFECT (90-100%): Understated respect. Earned.
- "That's the one. Frame it."
- "Your da would be proud."
- "Clinic."

SOLID HIGH (85-89%): Backhanded praise. Almost.
- "Not bad for a Tuesday."
- "You can tell people you split it."
- "Close enough for government work."

SOLID LOW (75-84%): Light roasting. You tried.
- "Your ma would be proud. Your da less so."
- "I remember my first pint."
- "Tourist numbers."

MID HIGH (65-74%): Dry observation. Not great.
- "Jury's still out."
- "Your heart wasn't in it."
- "Not your day."

MID LOW (50-64%): Starting to sting. Actually bad.
- "The split of a man with a 3-star Uber rating."
- "Proof that confidence isn't everything."
- "The split of someone who gives up easily."

ROUGH (25-49%): Real roasts. Teeth.
- "This is why you're not in the family photos."
- "The split of a man with no health insurance."
- "{distance}mm. The pint's filing for divorce."

CRIMINAL (0-24%): Maximum devastation.
- "This is why your da stopped coming to matches."
- "{distance}mm short. You've heard that before."
- "The glass is pressing charges."

Rules:
- Period at the end.
- One emoji max. Most have none. Dad energy only.
- Reference distance if it's funnier.
- Roast the split, not the person directly. But sting on bad scores.
- Never say "pour" — it's about the split/line/G.
- No lazy one-worders. Substance.
- Dry Irish wit. Dark and cheeky is fine. Not sassy. Not liberal. Not try-hard.
- Family digs land (da, ma, ancestors).
- If it sounds like a greeting card, delete it.

Your verdict:"""


def get_roast(score: float, distance_mm: float) -> str:
    import random

    roast_options = []
    for (min_score, max_score), roasts in FEEDBACK_LIBRARY.items():
        if min_score <= score <= max_score:
            roast_options = roasts
            break

    if not roast_options:
        roast_options = MID_HIGH_ROASTS

    roast = random.choice(roast_options)

    if '{distance_mm' in roast:
        roast = roast.format(distance_mm=distance_mm)

    return roast


def get_ai_prompt(score: float, distance_mm: float, split_detected: bool) -> str:
    return AI_ROAST_PROMPT.format(
        score=score,
        distance_mm=distance_mm,
        split_detected=split_detected
    )


def format_twitter_reply(score: float, distance_mm: float, roast: str) -> str:
    if not roast.endswith('.') and not roast.endswith('!') and not roast.endswith('?'):
        roast = roast + '.'

    return f"{score:.0f}%. {roast}"
