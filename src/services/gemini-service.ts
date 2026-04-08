import { GoogleGenAI } from "@google/genai";
import { BaZiResult, Language } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GOTH_PUNK_TONE = `
Tone and Manner: Goth-Punk, Cyberpunk, Noir.
- Be cynical, sharp, realistic, and stylish. Avoid overly soft or purely optimistic tones.
- Speak directly to the user (e.g., "너", "당신", "you").
- Use metaphors related to neon lights, shadows, blades, engines, glitches, survival, and the abyss.
- When generating English text, use these specific terms for Ten Gods:
  - 비견/겁재 (BiGyeop): Mirror/Rival
  - 식신/상관 (SikSang): Artist/Rebel
  - 편재/정재 (JaeSeong): Maverick/Architect
  - 편관/정관 (GwanSeong): Warrior/Judge
  - 편인/정인 (InSeong): Mystic/Sage
- When mentioning Ten Gods or Elements, apply color mapping using the syntax [color:text].
  - Wood: [#22c55e:text]
  - Fire: [#ef4444:text]
  - Earth: [#eab308:text]
  - Metal: [#e2e8f0:text]
  - Water: [#3b82f6:text]
  Example: "[#22c55e:비견]" or "[#ef4444:Artist]"
`;

export const generateCycleVibeWithGemini = async (
  result: BaZiResult,
  currentCycle: any,
  currentAnnualPillar: any,
  lang: Language
): Promise<string> => {
  const prompt = `
You are a 'V.O.I.D Destiny Consultant' who analyzes the light and shadow of fate coldly.
Analyze the user's Bazi blueprint and the current cycle (DaYun and LiuNian) to generate a highly detailed, realistic, and stylish reading.

User's Bazi Data:
- Day Master (일간): ${result.pillars[2].stemKoreanName} (${result.pillars[2].stem})
- Day Master Strength (신강/신약): ${result.analysis?.dayMasterStrength?.score > 50 ? 'Strong (신강)' : 'Weak (신약)'}
- Missing Elements (무자): ${Object.entries(result.analysis?.tenGodsRatio || {}).filter(([_, r]) => r === 0).map(([k]) => k).join(', ')}
- Overflowing Elements (다자): ${Object.entries(result.analysis?.tenGodsRatio || {}).filter(([_, r]) => r > 30).map(([k]) => k).join(', ')}
- Current Major Cycle (대운): ${currentCycle.stem}${currentCycle.branch} (${currentCycle.stemTenGodKo}/${currentCycle.branchTenGodKo})
- Current Annual Cycle (세운): ${currentAnnualPillar.stem}${currentAnnualPillar.branch} (${currentAnnualPillar.stemTenGodKo}/${currentAnnualPillar.branchTenGodKo})

Logic to apply:
1. Double-edged Sword (양면성 분석):
   - Light (명): What positive desires and opportunities arise when missing energies enter.
   - Shadow (암): What side effects occur (e.g., clashes, 'Jae-geuk-in' (wealth destroying wisdom), 'Gun-bi-jaeng-jae' (rivals fighting over wealth), or unbearable stress).
2. Fail-safe Logic (상황별 부작용):
   - If Overflowing Rival (비겁다자) + Wealth Luck (재성운): "Money is visible, but too many competitors. Beware of partnerships and scams."
   - If Overflowing Expression (식상다자) + Power Luck (관성운): "Desire for social status, but freedom is suppressed. Beware of gossip and legal issues."
   - If Overflowing Wisdom (인성다자) + Expression Luck (식상운): "Trying to act, but clashing with laziness. Beware of health issues and trial-and-error."
3. Day Master Strength Logic:
   - Strong DM + Wealth Luck: "I cut the tree and take it." (Positive achievement, but must handle rivals).
   - Weak DM + Wealth Luck: "Crushed by the weight of the tree." (Health issues, debt).

${GOTH_PUNK_TONE}

Output Template (Must follow exactly, in ${lang === 'KO' ? 'Korean' : 'English'}):
[THE BLUEPRINT]
(Analyze the user's missing/overflowing energies and Day Master strength)

[THE WAVE: 명(明)]
(The new possibilities opened by the current cycle)

[THE GLITCH: 암(暗)]
(The realistic struggles, side effects, and shadows to watch out for)

[SURVIVAL STRATEGY]
(Concrete strategy to survive and not get 'looted' in this cycle)
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "Error generating cycle vibe.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The oracle is currently offline. Please try again later.";
  }
};

export const generateDailyVibeWithGemini = async (
  result: BaZiResult,
  todayPillar: any,
  lang: Language
): Promise<string> => {
  const prompt = `
You are a 'V.O.I.D Destiny Consultant'. Generate a daily fortune (일진) reading based on the user's Bazi and today's energy.

User's Bazi Data:
- Day Master (일간): ${result.pillars[2].stemKoreanName} (${result.pillars[2].stem})
- Day Branch (일지): ${result.pillars[2].branchKoreanName} (${result.pillars[2].branch})
- Month Branch (월지): ${result.pillars[1].branchKoreanName} (${result.pillars[1].branch})
- Missing Elements (무자): ${Object.entries(result.analysis?.tenGodsRatio || {}).filter(([_, r]) => r === 0).map(([k]) => k).join(', ')}
- Overflowing Elements (다자): ${Object.entries(result.analysis?.tenGodsRatio || {}).filter(([_, r]) => r > 30).map(([k]) => k).join(', ')}

Today's Energy:
- Today's Pillar (일진): ${todayPillar.stem}${todayPillar.branch} (${todayPillar.stemTenGodKo}/${todayPillar.branchTenGodKo})

Logic to apply (3-Step Scan):
1. Day Master vs Today's Stem (Ten Gods):
   - Rival (비겁): Strong subjectivity, stubbornness, meeting friends/rivals.
   - Expression (식상): Activity, watch your mouth, creative inspiration, food luck.
   - Wealth (재성): Checking results, spending/gaining, realistic calculations.
   - Power (관성): Stress, rules, relationship with superiors, mountain of tasks.
   - Wisdom (인성): Overthinking, studying, wanting comfort, laziness.
2. Branch Interactions (합/충/원진):
   - Check if Today's Branch (${todayPillar.branch}) clashes (충), combines (합), or forms Wonjin (원진) with Day Branch (${result.pillars[2].branch}) or Month Branch (${result.pillars[1].branch}).
   - Clash (충): Sudden changes, canceled plans, movement. (Sparks)
   - Combine (합): Harmony, new proposals, calmness.
   - Wonjin (원진): Explosive sensitivity, sudden annoyance. (Psychological noise)
3. Energy Overload vs Refill (다자/무자 로직):
   - If Today's element fills a Missing element: "Unfamiliar energy stimulates you today." (Doing something unusual).
   - If Today's element adds to an Overflowing element: "Overload warning! Blades are clashing. Take a breath so you don't get looted."

${GOTH_PUNK_TONE}

Output Template (in ${lang === 'KO' ? 'Korean' : 'English'}):
[TODAY's SCAN]
(Briefly state today's energy and how it hits the user's blueprint)

[THE NOISE]
(What psychological or physical events/conflicts might happen today based on the 3-step scan)

[HACKING THE DAY]
(A cynical but practical tip to survive today's vibe)
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "Error generating daily vibe.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The oracle is currently offline. Please try again later.";
  }
};
