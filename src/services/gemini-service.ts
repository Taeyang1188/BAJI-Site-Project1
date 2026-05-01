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

CRITICAL INSTRUCTION FOR ENGLISH READINGS:
When writing in English, you MUST NOT use traditional Bazi terminology such as 'Wealth', 'Power', 'Resource', 'Expression', or 'Companion'. Instead, you MUST strictly use the V.O.I.D. system terms provided below:
- Wealth -> Maverick/Architect
- Power -> Warrior/Judge
- Resource -> Mystic/Sage
- Expression -> Artist/Rebel
- Companion -> Mirror/Rival

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

CRITICAL INSTRUCTION FOR ENGLISH READINGS:
When writing in English, you MUST NOT use traditional Bazi terminology such as 'Wealth', 'Power', 'Resource', 'Expression', or 'Companion'. Instead, you MUST strictly use the V.O.I.D. system terms provided below:
- Wealth -> Maverick/Architect
- Power -> Warrior/Judge
- Resource -> Mystic/Sage
- Expression -> Artist/Rebel
- Companion -> Mirror/Rival

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

export const generatePersonaTestWithGemini = async (
  result: BaZiResult,
  targetName: string,
  lang: Language
): Promise<any> => {
  const isKo = lang === 'KO';
  const name = targetName || (isKo ? '당신' : 'You');
  
  const prompt = `
You are a 'V.O.I.D Destiny Consultant' conducting a psychological test based on Bazi data.
You need to generate a 3-phase question sequence and a final report in JSON format.

User's Bazi Data:
- Day Pillar (일주): ${result.pillars[2].stem}${result.pillars[2].branch} (${result.pillars[2].stemKoreanName} 일간)
- Month Branch (월지): ${result.pillars[1].branch}
- Strongest Ten God (가장 강한 십성): ${
    Object.entries(result.analysis?.tenGodsRatio || {}).sort((a,b) => b[1]-a[1])[0]?.[0] || '균형'
  }
- Missing Elements (무자): ${Object.entries(result.analysis?.tenGodsRatio || {}).filter(([_, r]) => r === 0).map(([k]) => k).join(', ')}
- Overflowing Elements (다자): ${Object.entries(result.analysis?.tenGodsRatio || {}).filter(([_, r]) => r > 30).map(([k]) => k).join(', ')}

Follow this logic for generating the JSON:
- Maintain an 'Observer POV': Act like a system that already knows their exact destiny. You are not asking to figure them out, you are holding up a mirror to their fate. 
- Phase 1 (Core Identity / Day Pillar attack): Start strongly by poking at their Day Pillar and Month Branch character. e.g. "Looking at your data, you seem polite and heavy, but you actually hate when people tell you what to do, right?"
  - routeAYes: Piercing confirmation of their self-awareness.
  - routeBNo: If they say 'No', use their other Bazi trait (e.g. cold/hot elements, Ten Gods) to throw a 'positive bypass'. e.g. "Ah, so your thick social mask is working well. Or maybe that cold rationality is hiding your pride." (Do NOT just say "you are wrong", interpret their denial through their Bazi).
  - routeCUnk: Cynical but relatable situational example.
- Phase 2 (Behavioral Check): Target their Strongest Ten God. e.g. If rules/power is strong, "When someone says nonsense in a group chat, your logical circuits want to crush them with facts, right? The data says so."
  - routeAYes: Confirmation
  - routeBNo: Same as Phase 1, interpret their 'No' as either a mask or another Bazi trait taking over.
  - routeCUnk: Situational example
- Phase 3 (Deep Shadow Strike): Hit their psychological weak spot based on missing elements or overall balance. Provide a deep, dark inner truth. e.g. "Despite acting strong, the data shows an emptiness. Do you sometimes feel trapped in your own fortress?"

Report: Synthesis based on the persona. 
- trueNature: Short phrase (e.g. "A lonely tiger wearing a cat mask")
- socialMask: Short phrase
- advice: Cynical but warm advice from the V.O.I.D. system.

Output purely a valid JSON string (no markdown formatting) matching this structure exactly in ${isKo ? 'Korean' : 'English'}, replacing {{target}} with the provided name and using natural conversational tone:
{
  "title": "String (Cluster title)",
  "phases": [
    {
      "question": "String",
      "routeAYes": { "text": "String" },
      "routeBNo": { "text": "String" },
      "routeCUnk": { "text": "String" }
    }
  ],
  "report": {
    "trueNature": "String",
    "socialMask": "String",
    "advice": "String"
  }
}
Note: phases array MUST contain Exactly 3 objects.
Use the name '${name}' directly in the text (if Korean, append proper suffixes naturally, e.g., ${name}은/는).
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    const resultText = response.text || "{}";
    return JSON.parse(resultText);
  } catch (error) {
    console.error("Gemini API Error in Persona:", error);
    return null;
  }
};
