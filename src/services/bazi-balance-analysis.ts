
import { Language } from '../types';

export interface BalanceWarning {
  title: string;
  titleEn: string;
  description: string;
  enDescription: string;
  type: 'warning' | 'danger';
  element: string;
}

export const calculateBalanceWarnings = (
  elementRatios: Record<string, number>,
  tenGodsRatio: Record<string, number>,
  dmElement: string,
  lang: Language
): BalanceWarning[] => {
  const warnings: BalanceWarning[] = [];

  const getRatio = (ko: string, en: string, altEn?: string) => {
    for (const [key, val] of Object.entries(tenGodsRatio)) {
      if (key.includes(ko) || key.includes(en) || (altEn && key.includes(altEn))) return val;
    }
    return 0;
  };

  const cycle = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const dmIdx = cycle.indexOf(dmElement);

  const getColor = (el: string) => {
    const colors: Record<string, string> = {
      'Wood': '#22c55e',
      'Fire': '#ef4444',
      'Earth': '#eab308',
      'Metal': '#94a3b8',
      'Water': '#3b82f6'
    };
    return colors[el] || '#ffffff';
  };

  const woodCol = getColor('Wood');
  const fireCol = getColor('Fire');
  const earthCol = getColor('Earth');
  const metalCol = getColor('Metal');
  const waterCol = getColor('Water');

  // Sik-sang (Output) color
  const artistEl = cycle[(dmIdx + 1) % 5];
  const artistCol = getColor(artistEl);
  // Jae-seong (Wealth) color
  const wealthEl = cycle[(dmIdx + 2) % 5];
  const wealthCol = getColor(wealthEl);
  // Gwan-seong (Power) color
  const gwanEl = cycle[(dmIdx + 3) % 5];
  const gwanCol = getColor(gwanEl);
  // In-seong (Resource) color
  const inSeongEl = cycle[(dmIdx + 4) % 5];
  const inSeongCol = getColor(inSeongEl);

  // 1. Inverse Overcoming (부역/反侮)
  // Wood overcomes Earth, but too much Earth breaks Wood (토다목절 土多木折)
  if (elementRatios['Earth'] >= 60 && elementRatios['Wood'] <= 15) {
    const description = dmElement === 'Metal'
      ? `[${earthCol}:흙(土)]이 너무 많아 당신의 결과물인 [${woodCol}:나무(木)]가 뿌리 내릴 곳이 없군요. 억지로 땅을 파헤치려([${metalCol}:金]) 하기보다, [${woodCol}:나무(木)]로 흙을 소통시키거나([${woodCol}:소토]), 유연한 [${waterCol}:수(水)] 기운으로 땅을 적셔([${waterCol}:윤토]) 나무가 스스로 자라게 해야 합니다. 실력을 쌓아([${artistCol}:식상]) 돈([${wealthCol}:재성])을 벌라는 뜻이죠.`
      : `[${earthCol}:흙(土)]이 너무 단단하고 많아 [${woodCol}:나무(木)] 뿌리가 뻗지 못하고 부러지는 형국이야. 주변의 완고한 환경이나 고집 때문에 본인의 성장이 정체되기 쉬우니, 유연함을 기르고 [${waterCol}:수(水)]나 [${woodCol}:목(木)]의 기운으로 흙을 다스려야 해.`;
    
    const enDescription = dmElement === 'Metal'
      ? "Earth is so heavy that your results (Wood) have no place to take root. Don't try to force your way through with Metal; instead, use Wood to loosen the soil or flexible Water energy to moisten the earth and let the wood grow naturally. This means building skills (Output) to earn wealth (Wealth)."
      : "Earth is too thick and hard for Wood roots to spread, causing them to snap. Your growth may be stagnant due to stubborn environments; cultivate flexibility and use Water or Wood to manage the Earth.";

    warnings.push({
      title: '토다목절(토多木折)',
      titleEn: 'Earth-Heavy Wood-Snap',
      description,
      enDescription,
      type: 'warning',
      element: 'Earth'
    });
  }
  // Earth overcomes Water, but too much Water washes away Earth (수다토붕 水多土崩)
  if (elementRatios['Water'] >= 60 && elementRatios['Earth'] <= 15) {
    warnings.push({
      title: '수다토붕(수多土崩)',
      titleEn: 'Water-Heavy Earth-Collapse',
      description: `거센 [${waterCol}:물살(水)]에 제방인 [${earthCol}:흙(土)]이 터져나가는 형국이야. [${wealthCol}:재물]이나 조직의 기반이 붕괴되기 쉬우니까, [${woodCol}:나무(木)]를 심어 물을 흡수하거나 더 단단한 [${earthCol}:흙]으로 제방을 쌓아야 해.`,
      enDescription: 'Excessive Water causes the Earth embankment to burst. Financial or organizational foundations may collapse; plant Wood to absorb water or reinforce with stronger Earth.',
      type: 'warning',
      element: 'Water'
    });
  }
  // Water overcomes Fire, but too much Fire dries up Water (화다수증 火多수蒸)
  if (elementRatios['Fire'] >= 60 && elementRatios['Water'] <= 15) {
    const description = dmElement === 'Water'
      ? `당신([${waterCol}:水])의 기운이 너무 강한 [${fireCol}:열기(火)]에 증발하고 있습니다. 억지로 맞서려 하기보다, [${metalCol}:금(金)]의 기운으로 자신을 보호하고 열기를 식히는 지혜가 필요합니다. 감정에 휩쓸리지 않도록 냉정함을 유지하세요.`
      : `[${fireCol}:불(火)]이 너무 강해 [${waterCol}:물(水)]이 순식간에 증발하여 사라지는 형국이야. 감정이 격해지기 쉽고 자신을 통제할 이성이 무력화될 수 있으니, 억지로 물을 끌어오면 폭발(왕신충발)하니, [${metalCol}:금(金)]을 통해 열기를 밖으로 빼내는 '설기'에만 집중해.`;
    
    const enDescription = dmElement === 'Water'
      ? "Your energy (Water) is evaporating due to intense heat (Fire). Instead of forcing a confrontation, use Metal energy to protect yourself and cool the heat. Maintain composure and avoid being swept away by emotions."
      : "Strong Fire evaporates Water instantly. Emotions may flare and self-control may be neutralized; instead of forcing Water, stabilize with Earth or drain energy with Metal.";

    warnings.push({
      title: '화다수증(火多수蒸)',
      titleEn: 'Fire-Heavy Water-Steam',
      description,
      enDescription,
      type: 'warning',
      element: 'Fire'
    });
  }
  // Fire overcomes Metal, but too much Metal dulls Fire (금다화식 金多火熄)
  if (elementRatios['Metal'] >= 60 && elementRatios['Fire'] <= 15) {
    warnings.push({
      title: '금다화식(金多火熄)',
      titleEn: 'Metal-Heavy Fire-Extinguish',
      description: `[${metalCol}:쇠 덩어리(金)]가 너무 많아 작은 [${fireCol}:촛불(火)]이 열기를 뺏기고 꺼지는 형국이야. 본인의 열정이 현실의 벽에 부딪혀 빛을 잃기 쉬우니까, 더 강한 의지를 불태우거나 [${woodCol}:목(木)]으로 불길을 도와야 해.`,
      enDescription: 'Too much Metal extinguishes a small Fire by stealing its heat. Your passion may fade against the walls of reality; ignite stronger will or help the fire with Wood.',
      type: 'warning',
      element: 'Metal'
    });
  }
  // Metal overcomes Wood, but too much Wood breaks Metal (목다금결 木多金缺)
  if (elementRatios['Wood'] >= 60 && elementRatios['Metal'] <= 15) {
    warnings.push({
      title: '목다금결(목多金缺)',
      titleEn: 'Wood-Heavy Metal-Dull',
      description: `단단한 [${woodCol}:나무(木)]가 너무 많아 [${metalCol}:도끼(金)]의 날이 무뎌지고 이가 빠지는 형국이야. 추진력은 좋으나 마무리가 약하고 결단력을 상실하기 쉬우니까, [${fireCol}:화(火)]로 나무를 정리하거나 더 날카로운 판단력이 필요해.`,
      enDescription: 'Too much hard Wood dulls and chips the Metal axe. You may have strong drive but weak follow-through and loss of decisiveness; organize the wood with Fire or use sharper judgment.',
      type: 'warning',
      element: 'Wood'
    });
  }

  // 2. Excessive Resource Side Effects (인성 과다)
  const inSeongRatio = getRatio('인성', 'Mystic', 'Sage');
  if (inSeongRatio > 50) {
    if (dmElement === 'Wood') {
      warnings.push({
        title: '수다목부(水多목腐)',
        titleEn: 'Water-Heavy Wood-Rot',
        description: `[${woodCol}:나무(木)]에 [${waterCol}:물(水)]을 너무 많이 주어 뿌리가 썩고 둥둥 떠다니는 형국이야. 생각만 많고 실행력이 없으며 한곳에 정착하지 못할 수 있으니까, [${earthCol}:흙(土)]으로 물을 막고 현실적인 행동에 나서야 해.`,
        enDescription: 'Too much Water causes Wood roots to rot and float. You may overthink without action or stability; block water with Earth and take realistic action.',
        type: 'danger',
        element: 'Water'
      });
    } else if (dmElement === 'Metal') {
      warnings.push({
        title: '토다매금(土多埋金)',
        titleEn: 'Earth-Heavy Metal-Burial',
        description: `거대한 흙더미 속에 묻힌 고고한 보석의 형상입니다. 당신의 재능이 빛나지 않는 건 게으름 때문이 아니라, 너무 깊이 숨어있기 때문이죠. [${waterCol}:수(水)]의 기운으로 당신을 씻어내어 세상에 드러내세요. 당신의 [${artistCol}:표현력(식상)]이 곧 당신의 가치입니다.`,
        enDescription: 'A noble gem buried under a massive pile of earth. Your talents aren\'t shining not because of laziness, but because they are hidden too deep. Use Water to wash yourself and reveal your value to the world; your expression is your value.',
        type: 'danger',
        element: 'Earth'
      });
    } else if (dmElement === 'Earth') {
      warnings.push({
        title: '화다토초(火多土焦)',
        titleEn: 'Fire-Heavy Earth-Scorch',
        description: `뜨거운 열기에 당신의 [${earthCol}:대지(土)]가 갈라지고 불모지가 된 형국입니다. 조급함은 독이 되니, [${metalCol}:금(金)]의 기운으로 열기를 식히고 [${waterCol}:수(水)]의 기운으로 메마른 땅을 적셔야 합니다. 여유를 갖고 내실을 기하세요.`,
        enDescription: 'Your land (Earth) is cracked and barren due to intense heat. Impatience is poison; use Metal to cool the heat and Water to moisten the dry land. Take your time and focus on inner stability.',
        type: 'danger',
        element: 'Fire'
      });
    } else if (dmElement === 'Water') {
      warnings.push({
        title: '금다수탁(金多水濁)',
        titleEn: 'Metal-Heavy Water-Turbid',
        description: `[${metalCol}:바위(金)]가 너무 많아 [${waterCol}:물(水)]이 맑게 흐르지 못하고 탁해진 형국이야. 모성애 과잉이나 주변의 과도한 간섭으로 인해 본인의 판단력이 흐려질 수 있으니까, [${woodCol}:나무(木)]로 기운을 빼고 주관을 뚜렷이 해야 해.`,
        enDescription: 'Too much Metal muddies the Water flow. Excessive interference or over-protection may cloud your judgment; drain energy with Wood and establish clear views.',
        type: 'danger',
        element: 'Metal'
      });
    }
  }

  // 3. Excessive Output Side Effects (식상 과다)
  const sikSangRatio = getRatio('식상', 'Artist', 'Output');
  const gwanSeongRatio = getRatio('관성', 'Warrior', 'Power');
  if (sikSangRatio > 40 && gwanSeongRatio < 10) {
    warnings.push({
      title: '제살태과(制殺太過)',
      titleEn: 'Excessive Control of Power',
      description: `나를 표현하는 [${artistCol}:기운(식상)]이 너무 강해 나를 통제할 법과 규칙([${gwanCol}:관성])을 아예 없애버린 형국이야. 안하무인 격으로 행동하거나 조직 부적응으로 고립될 수 있으니까, [${inSeongCol}:인성(Wisdom)]으로 자신을 절제해야 해.`,
      enDescription: 'Output is so strong it obliterates Rules/Power. You may act recklessly or struggle to adapt to organizations; use Wisdom to discipline yourself.',
      type: 'danger',
      element: 'Wood'
    });
  }

  // 4. Hwa-Da-Geum-Yong (火多金鎔) - Special case for Metal
  if (elementRatios['Fire'] > 50 && (dmElement === 'Metal' || elementRatios['Metal'] > 15)) {
    warnings.push({
      title: '화다금용(火多金鎔)',
      titleEn: 'Fire-Heavy Metal-Melting',
      description: `[${fireCol}:불(火)]의 열기가 너무 뜨거워 [${metalCol}:금(金)]이 형체를 잃고 녹아내리는 형국이야. 본인의 재능이나 결과물이 과도한 열정이나 주변의 압박에 의해 사라질 수 있으니까, 반드시 [${waterCol}:수(水)] 기운으로 열기를 식혀야 해.`,
      enDescription: 'Intense Fire melts Metal away. Your talents or results may vanish due to excessive passion or pressure; you must cool the heat with Water.',
      type: 'danger',
      element: 'Fire'
    });
  }
  return warnings;
};
