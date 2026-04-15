import React, { useState } from 'react';

interface ParsedTextProps {
  text: string;
  className?: string;
}

const TOOLTIP_DICTIONARY: Record<string, { ko: string, en: string }> = {
  'Gan-yeo-ji-dong': {
    ko: '간여지동: 천간과 지지가 같은 오행으로 이루어진 기둥. 자아가 강하고 배우자 자리에 자신이 앉아있는 형국이라 배우자와의 갈등이 있을 수 있습니다.',
    en: 'Gan-yeo-ji-dong: A pillar where the Heavenly Stem and Earthly Branch are of the same element. Indicates a strong ego and potential conflict with spouse.'
  },
  '간여지동': {
    ko: '천간과 지지가 같은 오행으로 이루어진 기둥. 자아가 강하고 배우자 자리에 자신이 앉아있는 형국이라 배우자와의 갈등이 있을 수 있습니다.',
    en: 'A pillar where the Heavenly Stem and Earthly Branch are of the same element. Indicates a strong ego and potential conflict with spouse.'
  },
  'up-sang-dae-che': {
    ko: '업상대체: 사주에 내재된 부정적인 기운이나 흉살을 직업이나 활동으로 승화시켜 액운을 피하는 방법입니다.',
    en: 'Up-sang-dae-che: Sublimating negative energies or bad luck inherent in the chart through one\'s profession or activities.'
  },
  '업상대체': {
    ko: '사주에 내재된 부정적인 기운이나 흉살을 직업이나 활동으로 승화시켜 액운을 피하는 방법입니다.',
    en: 'Sublimating negative energies or bad luck inherent in the chart through one\'s profession or activities.'
  },
  '토다매금': {
    ko: '토다매금: 흙이 너무 많아 금(보석)이 묻히는 형국. 재능이 있으나 빛을 보지 못하거나 과도한 보호로 자립심이 약해질 수 있습니다.',
    en: 'To-da-mae-geum: Too much Earth burying the Metal (gem). Indicates hidden talent or weakened independence due to overprotection.'
  },
  'To-da-mae-geum': {
    ko: '토다매금: 흙이 너무 많아 금(보석)이 묻히는 형국. 재능이 있으나 빛을 보지 못하거나 과도한 보호로 자립심이 약해질 수 있습니다.',
    en: 'To-da-mae-geum: Too much Earth burying the Metal (gem). Indicates hidden talent or weakened independence due to overprotection.'
  },
  '군비쟁재': {
    ko: '군비쟁재: 비견/겁재(나와 같은 기운)가 많아 하나의 재성(재물/결과)을 두고 다투는 형국. 금전 손실이나 경쟁이 치열할 수 있습니다.',
    en: 'Gun-bi-jaeng-jae: Many Peer energies competing for a single Wealth energy. Indicates potential financial loss or fierce competition.'
  },
  'Gun-bi-jaeng-jae': {
    ko: '군비쟁재: 비견/겁재(나와 같은 기운)가 많아 하나의 재성(재물/결과)을 두고 다투는 형국. 금전 손실이나 경쟁이 치열할 수 있습니다.',
    en: 'Gun-bi-jaeng-jae: Many Peer energies competing for a single Wealth energy. Indicates potential financial loss or fierce competition.'
  },
  '모다멸자': {
    ko: '모다멸자: 인성(어머니/지원)이 너무 많아 오히려 식상(자식/행동력)을 극하여 자립심을 잃게 만드는 형국입니다.',
    en: 'Mo-da-myeol-ja: Too much Resource (Mother) energy suppressing Output (Child), leading to a loss of independence.'
  },
  'Mo-da-myeol-ja': {
    ko: '모다멸자: 인성(어머니/지원)이 너무 많아 오히려 식상(자식/행동력)을 극하여 자립심을 잃게 만드는 형국입니다.',
    en: 'Mo-da-myeol-ja: Too much Resource (Mother) energy suppressing Output (Child), leading to a loss of independence.'
  },
  '수다목부': {
    ko: '수다목부: 물이 너무 많아 나무가 뿌리를 내리지 못하고 떠내려가는 형국. 정서적 과잉이나 지나친 생각으로 실행력이 떨어질 수 있습니다.',
    en: 'Su-da-mok-bu: Too much Water causing the Wood to float. Indicates lack of execution due to emotional excess or overthinking.'
  },
  '목다화식': {
    ko: '목다화식: 나무(땔감)가 너무 많아 불이 꺼지는 형국. 지나친 지원이나 기대가 오히려 발전을 저해할 수 있습니다.',
    en: 'Mok-da-hwa-sik: Too much Wood (firewood) extinguishing the Fire. Indicates excessive support or expectations hindering progress.'
  },
  '복음': {
    ko: '복음: 일지와 똑같은 글자가 들어오는 시기. 과거에는 흉하게 보았으나, 현대에는 자신의 영역을 확고히 하고 뿌리를 내리는 시기로 봅니다.',
    en: 'Fu-yin: A period where the exact same character as the Day Branch arrives. A time of establishing one\'s domain and taking root.'
  },
  '자형': {
    ko: '자형: 스스로를 형(刑)하는 기운. 내적 갈등이나 자기 검열이 심해질 수 있으나, 이를 극복하면 큰 성장을 이룰 수 있습니다.',
    en: 'Self-Punishment: Energy that punishes oneself. Can cause internal conflict, but overcoming it leads to great growth.'
  },
  '벽갑': {
    ko: '벽갑: 도끼(금)로 통나무(목)를 쪼개어 땔감으로 만드는 형국. 시련과 압박을 통해 잠재력을 현실화하는 과정입니다.',
    en: 'Byeok-gap: Splitting a log (Wood) with an axe (Metal) to make firewood. The process of actualizing potential through trials and pressure.'
  },
  '충': {
    ko: '충(沖): 기운이 서로 강하게 부딪히는 현상. 갈등, 변화, 이동, 분리 등을 의미하며, 낡은 것을 깨고 새로운 것을 시작하는 원동력이 되기도 합니다.',
    en: 'Clash (Chung): A strong collision of energies. Signifies conflict, change, movement, or separation, often acting as a driving force for new beginnings.'
  },
  '일지 형충': {
    ko: '일지 형충: 배우자 자리인 일지에 충(부딪힘)이나 형(형벌/조정)이 들어오는 것. 배우자와의 갈등이나 관계의 변화, 조율이 필요한 시기를 의미합니다.',
    en: 'Day Branch Clash/Punishment: A clash or penalty affecting the Day Branch (Spouse Palace). Indicates potential conflict, change, or a need for adjustment in the relationship.'
  },
  'Day Branch Clash/Punishment': {
    ko: '일지 형충: 배우자 자리인 일지에 충(부딪힘)이나 형(형벌/조정)이 들어오는 것. 배우자와의 갈등이나 관계의 변화, 조율이 필요한 시기를 의미합니다.',
    en: 'Day Branch Clash/Punishment: A clash or penalty affecting the Day Branch (Spouse Palace). Indicates potential conflict, change, or a need for adjustment in the relationship.'
  },
  '진술축미': {
    ko: '진술축미(辰戌丑未): 사주의 지지에 해당하는 네 개의 흙(土) 기운. 계절의 환절기를 의미하며, 고집이 세고 변화무쌍하며 만물을 품고 저장하는 특성이 있습니다.',
    en: 'Jin-Sul-Chuk-Mi (Earth Branches): The four Earth branches representing the change of seasons. Characterized by stubbornness, versatility, and the ability to store and embrace all things.'
  },
  'Earth Branch on Day': {
    ko: '일지 진술축미: 배우자 자리에 흙(土)의 기운이 있는 것. 배우자가 고집이 세거나 속을 알기 어려울 수 있으며, 관계에서 인내심이 필요할 수 있습니다.',
    en: 'Earth Branch on Day: Having an Earth branch in the Spouse Palace. The partner may be stubborn or hard to read, requiring patience in the relationship.'
  },
  '백호/괴강살': {
    ko: '백호/괴강살: 호랑이에게 물려가거나 우두머리가 되는 강렬한 기운. 프로페셔널하고 카리스마가 넘치지만, 기운이 너무 강해 배우자 자리가 불안정해질 수 있습니다.',
    en: 'Baekho/Goegang-sal: Intense energies symbolizing a white tiger or a powerful leader. Highly professional and charismatic, but the strong energy can make the spouse palace unstable.'
  },
  'Baekho/Goegang-sal': {
    ko: '백호/괴강살: 호랑이에게 물려가거나 우두머리가 되는 강렬한 기운. 프로페셔널하고 카리스마가 넘치지만, 기운이 너무 강해 배우자 자리가 불안정해질 수 있습니다.',
    en: 'Baekho/Goegang-sal: Intense energies symbolizing a white tiger or a powerful leader. Highly professional and charismatic, but the strong energy can make the spouse palace unstable.'
  },
  '부성/처성임묘': {
    ko: '부성/처성임묘: 남편(부성)이나 아내(처성)를 뜻하는 글자가 무덤(묘)에 들어가는 형국. 배우자의 건강이 약해지거나 인연이 짧아질 수 있음을 암시하며, 주말부부나 각자의 영역을 존중하는 것으로 액땜(업상대체)할 수 있습니다.',
    en: 'Spouse Star in Tomb: A configuration where the spouse star enters a "tomb" state. Suggests potential health issues or a weak connection with the spouse. Can be mitigated by living apart (e.g., weekend couple) or respecting each other\'s independence.'
  },
  'Spouse Star in Tomb': {
    ko: '부성/처성임묘: 남편(부성)이나 아내(처성)를 뜻하는 글자가 무덤(묘)에 들어가는 형국. 배우자의 건강이 약해지거나 인연이 짧아질 수 있음을 암시하며, 주말부부나 각자의 영역을 존중하는 것으로 액땜(업상대체)할 수 있습니다.',
    en: 'Spouse Star in Tomb: A configuration where the spouse star enters a "tomb" state. Suggests potential health issues or a weak connection with the spouse. Can be mitigated by living apart (e.g., weekend couple) or respecting each other\'s independence.'
  },
  '부성임묘': {
    ko: '부성임묘: 남편을 뜻하는 글자가 무덤(묘)에 들어가는 형국. 남편의 건강이나 운기가 약해질 수 있음을 암시합니다.',
    en: 'Husband Star in Tomb: A configuration where the husband star enters a "tomb" state. Suggests potential health issues or weakened luck for the husband.'
  },
  '처성임묘': {
    ko: '처성임묘: 아내를 뜻하는 글자가 무덤(묘)에 들어가는 형국. 아내의 건강이나 운기가 약해질 수 있음을 암시합니다.',
    en: 'Wife Star in Tomb: A configuration where the wife star enters a "tomb" state. Suggests potential health issues or weakened luck for the wife.'
  }
};

const TooltipWrapper: React.FC<{ term: string, children: React.ReactNode }> = ({ term, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const info = TOOLTIP_DICTIONARY[term];
  
  if (!info) return <>{children}</>;

  return (
    <span 
      className="relative inline-block border-b border-dashed border-white/50 cursor-help"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-black/90 border border-white/10 rounded-lg text-xs text-white/80 z-50 shadow-xl pointer-events-none">
          <span className="block font-bold text-white mb-1">{term}</span>
          <span className="block mb-1">{info.ko}</span>
          <span className="block text-white/50">{info.en}</span>
        </span>
      )}
    </span>
  );
};

export const ParsedText: React.FC<ParsedTextProps> = ({ text, className = "" }) => {
  const elements: React.ReactNode[] = [];
  let i = 0;
  let currentText = '';
  let keyCount = 0;

  if (!text) return null;

  // Pre-process text to wrap known terms in [tooltip:term]
  let processedText = text;
  try {
    Object.keys(TOOLTIP_DICTIONARY).forEach(term => {
      // Use regex to replace terms not already inside brackets
      const regex = new RegExp(`(?<!\\[[^\\]]*)\\b${term}\\b(?!\\s*\\])`, 'gi');
      // For Korean terms which might not have word boundaries
      const koRegex = new RegExp(`(?<!\\[[^\\]]*)${term}(?!\\s*\\])`, 'g');
      
      if (/[a-zA-Z]/.test(term)) {
        processedText = processedText.replace(regex, `[tooltip:${term}]`);
      } else {
        processedText = processedText.replace(koRegex, `[tooltip:${term}]`);
      }
    });
  } catch (e) {
    // Fallback for older browsers that don't support variable-length lookbehinds
    processedText = text;
  }

  while (i < processedText.length) {
    if (processedText[i] === '[') {
      // Find the matching closing bracket for this specific opening bracket
      let bracketCount = 1;
      let j = i + 1;
      let endBracketIndex = -1;
      
      while (j < processedText.length) {
        if (processedText[j] === '[') bracketCount++;
        else if (processedText[j] === ']') bracketCount--;
        
        if (bracketCount === 0) {
          endBracketIndex = j;
          break;
        }
        j++;
      }

      if (endBracketIndex !== -1) {
        const tagContent = processedText.substring(i + 1, endBracketIndex);
        
        if (tagContent.startsWith('delay:')) {
          if (currentText) {
            elements.push(<span key={keyCount++}>{currentText}</span>);
            currentText = '';
          }
          i = endBracketIndex + 1;
          continue;
        }
        
        if (tagContent.startsWith('tooltip:')) {
          if (currentText) {
            elements.push(<span key={keyCount++}>{currentText}</span>);
            currentText = '';
          }
          const term = tagContent.substring(8);
          elements.push(
            <TooltipWrapper key={keyCount++} term={term}>
              {term}
            </TooltipWrapper>
          );
          i = endBracketIndex + 1;
          continue;
        }

        const colonIndex = tagContent.indexOf(':');
        if (colonIndex !== -1) {
          if (currentText) {
            elements.push(<span key={keyCount++}>{currentText}</span>);
            currentText = '';
          }
          const color = tagContent.substring(0, colonIndex);
          const content = tagContent.substring(colonIndex + 1);
          
          // Recursively parse content in case of nested tags
          elements.push(
            <span key={keyCount++} style={{ color }}>
              <ParsedText text={content} />
            </span>
          );
          
          i = endBracketIndex + 1;
          continue;
        }
      }
    }
    currentText += processedText[i];
    i++;
  }
  
  if (currentText) {
    elements.push(<span key={keyCount++}>{currentText}</span>);
  }

  return <span className={`whitespace-pre-wrap ${className}`}>{elements}</span>;
};
