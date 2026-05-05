import { BaZiResult, PersonaNode, PersonaOption } from '../types';

export function getDominantTenGodGroup(result: BaZiResult): string {
  const ratios = result.analysis?.tenGodsRatio || {};
  const geju = result.analysis?.geJu || '';
  
  const extractRatio = (names: string[]) => {
    return Object.entries(ratios).reduce((sum, [k, v]) => {
      if (names.some(name => k.includes(name))) return sum + (v as number);
      return sum;
    }, 0);
  };
  
  const groups = {
    '비겁': extractRatio(['비겁', 'Mirror', '비견', '겁재']),
    '식상': extractRatio(['식상', 'Artist', '식신', '상관']),
    '재성': extractRatio(['재성', 'Maverick', '편재', '정재']),
    '관성': extractRatio(['관성', 'Warrior', '편관', '정관']),
    '인성': extractRatio(['인성', 'Mystic', '편인', '정인']),
  };

  let maxGroup = '';
  let maxVal = 0;
  
  for (const [key, val] of Object.entries(groups)) {
    if (val > maxVal) {
      maxVal = val;
      maxGroup = key;
    }
  }

  if (!maxGroup || maxVal === 0) {
    if (geju.includes('비견') || geju.includes('겁재') || geju.includes('록') || geju.includes('인')) return '비겁';
    if (geju.includes('식신') || geju.includes('상관')) return '식상';
    if (geju.includes('재')) return '재성';
    if (geju.includes('관') || geju.includes('살')) return '관성';
    if (geju.includes('인')) return '인성';
    return '비겁';
  }
  
  return maxGroup;
}

export function getNextNode(bazi: BaZiResult, targetName: string, answers: Record<string, string>, lang: string = 'KO'): PersonaNode {
  const isKO = lang === 'KO';
  const dmStem = bazi.pillars.find(p => p.title === 'Day')?.stem || bazi.pillars[1]?.stem || '甲';
  const dmElement = bazi.pillars.find(p => p.title === 'Day')?.element || bazi.pillars[1]?.element || 'Wood';
  const strength = bazi.analysis?.dayMasterStrength?.score ?? 50;
  const dom = getDominantTenGodGroup(bazi);
  const ratios = bazi.analysis?.tenGodsRatio || {};
  const gender = bazi.analysis?.gender || 'prefer-not-to-tell';
  
  const getValue = (type: string) => {
    const entry = Object.entries(ratios).find(([k]) => k.includes(type));
    return entry ? (entry[1] as number) : 0;
  };
  const isMu = (type: string) => getValue(type) < 5;
  const isDa = (type: string) => getValue(type) > 35;
  
  const dayBranch = bazi.pillars.find(p => p.title === 'Day')?.branch || bazi.pillars[1]?.branch || '寅';
  const ilju = `${dmStem}${dayBranch}`;
  const ganyeo = ['甲寅', '乙卯', '丙午', '丁巳', '戊辰', '戊戌', '己丑', '己未', '庚申', '辛酉', '壬子', '癸亥'];
  const isGanyeo = ganyeo.includes(ilju);

  const shinsal = bazi.analysis?.shinsal || [];
  const interactions = bazi.analysis?.conflicts || [];
  const isBaekhoGoegang = shinsal.some((s: any) => s.name?.includes('백호') || s.name?.includes('괴강'));
  const isDayClash = interactions.some((c: any) => c.type?.includes('충') && (c.target?.includes('일') || c.involved?.includes('일')));

  const defaultOptions: PersonaOption[] = isKO ? [
    { id: 'yes', label: '맞아, 좀 그래' },
    { id: 'no', label: '그렇진 않아' },
    { id: 'maybe', label: '때에 따라 달라' }
  ] : [
    { id: 'yes', label: 'Exactly' },
    { id: 'no', label: 'Not really' },
    { id: 'maybe', label: 'Depends' }
  ];

  const questionKeys = Object.keys(answers);
  // We want more questions to feel thorough
  const MAX_QUESTIONS = 15;

  if (questionKeys.length === MAX_QUESTIONS - 1 && !answers.q_jung_shadow) {
    let q = "";
    if (dom === '관성' || dom === '재성') {
      q = isKO 
        ? `마지막 질문이야. 남들이 인정하는 '유능하고 책임감 있는 네 모습(가면)'에 치여서, 정작 혼자 있을 때는 도덕이고 사회적 체면이고 다 벗어던진 채 완전히 게으르거나 충동적인 '괴물'로 변하고 싶은 억압된 욕망을 꾹꾹 누르고 살지 않아?`
        : `Last question. Crushed by your 'competent and responsible (mask)', when you're alone, don't you suppress a desire to turn into a completely lazy or impulsive 'monster', throwing away all morality and dignity?`;
    } else {
      q = isKO 
        ? `마지막 질문이야. 남들이 보는 '독특하거나 자유로운 네 모습(가면)' 뒤에, 사실은 그 누구보다 남들에게 '정상적'으로 보이고 싶고 주류 사회에 완벽하게 소속되고 싶어 덜덜 떠는 겁쟁이가 숨어 있지 않아?`
        : `Last question. Behind your 'freethinking or unique (mask)', isn't there a shivering coward hiding who wants more than anything to look 'normal' and belong perfectly to mainstream society?`;
    }
    return { id: 'q_jung_shadow', question: q, difficulty: 5, discrimination: 5, options: defaultOptions };
  }

  const isReportPhase = answers.q_final !== undefined || questionKeys.length >= MAX_QUESTIONS;

  if (isReportPhase) {
    const dayBranch = bazi.pillars.find(p => p.title === 'Day')?.branch || bazi.pillars[1]?.branch || '寅';
    const ilju = `${dmStem}${dayBranch}`;
    
    const computeSyncScore = () => {
      let score = 50;
      for (const [key, val] of Object.entries(answers)) {
        if (['marital', 'children', 'q_final'].includes(key)) continue;
        const isRefute = key.includes('_refute') || key.includes('_pivot');
        if (!isRefute) {
          if (val === 'yes') score += 8;
          else if (val === 'no') score -= 8;
        } else {
          if (val === 'yes') score -= 8;
          else if (val === 'no') score += 8;
        }
      }
      return Math.max(0, Math.min(100, score));
    };
    
    const finalSyncScore = computeSyncScore();
    
    const getSavageTrueSelf = () => {
      // 60 Ilju characteristics - adding more specific ones and grouping by nature
      if (ilju === '甲寅' || ilju === '甲辰' || ilju === '甲戌') return isKO ? "숲을 호령하는 거목의 자존심이 대단하네. 남에게 굽히느니 차라리 부러지는 길을 택하는 그 대쪽같은 고집이 가끔은 스스로를 외롭게 만들지." : "Your pride as a giant tree is immense. That upright stubbornness that would rather break than bend sometimes leaves you lonely.";
      if (ilju === '丁卯' || ilju === '丁酉' || ilju === '丁亥') return isKO ? "다정한 등불 같지만 그 뒤엔 예리한 칼날을 품고 있네. 섬세하고 예술적인 감각이 뛰어나지만, 한 번 틀어지면 누구보다 냉정해지는 반전이 있지. 당신의 '선'을 넘는 순간, 등불은 산불로 변하잖아." : "You're like a warm lantern but hold a sharp blade behind it. Your delicate artistic sense is superb, but you turn colder than anyone once crossed. The moment someone crosses your line, the lantern turns into an inferno.";
      if (ilju === '辛酉' || ilju === '辛未' || ilju === '辛亥') return isKO ? "가장 순도 높은 보석이자 칼날이야. 자신에게도 타인에게도 엄격한 그 완벽주의가 본인을 갉아먹고 있다는 걸 알면서도, 그 '날카로운 품위'를 포기하지 못하는구나." : "You are the purest jewel and blade. You know your perfectionism, strict with yourself and others, eats you away, yet you can't give up that 'sharp dignity'.";
      if (ilju === '丙午' || ilju === '丙辰' || ilju === '丙戌') return isKO ? "한여름의 태양처럼 강렬하지만, 그 열기 뒤에는 아무도 모르는 공허함이 자리 잡고 있네. 늘 밝고 화려해야 한다는 강박이 가끔은 영혼을 태워버리고 있지." : "Intense like the mid-summer sun, but behind that heat lies a void no one knows. The obsession with always being bright and splendid is sometimes burning your soul out.";
      if (ilju === '壬子' || ilju === '壬寅' || ilju === '壬申') return isKO ? "깊은 바다처럼 유연하고 지혜롭지만, 그 속에는 거대한 해일과 같은 욕망을 감추고 있네. 겉으론 허허실실 웃어넘겨도, 속으로는 이미 상대의 모든 것을 파악하고 계산을 마친 무서운 냉정함이 숨어있어." : "Flexible and wise like the deep sea, but hiding desire like a giant tsunami. You smile and brush things off, but internally you've already analyzed and calculated everything about the other person.";
      if (ilju === '戊午' || ilju === '戊申' || ilju === '戊寅') return isKO ? "태산처럼 듬직해 보이지만, 내면은 뜨거운 용암이 끓어오르는 화산 같아. 참고 참다가 한 번 폭발하면 세상 모든 인연을 다 태워버릴 기세네. 그 극단적인 감정의 진폭이 가장 큰 무기이자 약점이야." : "Reliable as a mountain, but your interior is a volcano boiling with hot lava. After enduring, once you explode, you're ready to burn all ties. That extreme emotional amplitude is your greatest strength and weakness.";
      if (ilju === '癸亥' || ilju === '癸卯' || ilju === '癸未') return isKO ? "모든 것을 수용하는 비처럼 다정하지만, 사실은 상대의 마음을 파고들어 본인이 원하는 대로 조종하는 '공감의 기술'을 타고났네. 선한 얼굴 뒤에 숨겨진 그 치밀한 지배욕이 제일 무서운 점이지." : "Sweet like rain that accepts everything, but you're gifted with 'the art of empathy' that penetrates others' hearts to manipulate them as you wish. That meticulous desire for dominance behind a kind face is what's truly scary about you.";
      if (ilju === '庚申' || ilju === '庚辰' || ilju === '庚戌') return isKO ? "거대한 바위나 무쇠 같은 기상이야. 의리라는 명분으로 자신을 포장하지만, 사실은 본인의 체면과 명예를 훼손하는 것은 그 무엇도 용납하지 않는 지독한 자기애의 소유자네." : "Like a giant rock or cast iron. You wrap yourself in the name of loyalty, but in truth, you're a person of intense self-love who tolerates nothing that damages your face or honor.";
      
      // Dynamic fallbacks based on Structure to avoid the "Ordinary person" repetitive line
      if (strength > 75 && dom === '비겁') return isKO ? "자존심이 곧 생명인 너에게 '타협'은 곧 '패배'를 의미하잖아. 세상이 네 중심으로 돌아가야 직성이 풀리는 그 제왕적인 기질이, 가장 화려한 곳에서 스스로를 가장 외로운 사람으로 만들고 있네." : "For you, whose pride is life, 'compromise' means 'defeat'. That kingly nature that needs the world to revolve around you makes you the loneliest person in the most splendid places.";
      if (isDa('식상')) return isKO ? "천재적인 기획력과 표현력을 가졌지만, 정작 네 자신은 '가짜'처럼 느껴지는 순간이 많지? 세상을 향해 쏟아내는 그 화려한 말들이 사실은 깊은 우울을 가리기 위한 소음은 아닌지 돌아봐." : "Gifted with genius planning and expression, yet don't you often feel like a 'fake'? Reflect if the splendid words you pour out are actually noise to mask your deep depression.";
      if (isDa('재성')) return isKO ? "모든 것을 가성비와 효율로 따지는 지독하게 현실적인 감각 뒤에, 사실은 가장 순수한 낭만을 꿈꾸는 어린아이가 갇혀 있네. '돈'과 '성공'이라는 숫자에 네 영혼이 질식하고 있는 건 아닐까?" : "Behind a brutally realistic sense that weighs everything by cost-effectiveness and efficiency, there's a child dreaming of pure romance. Isn't your soul suffocating under the numbers of 'money' and 'success'?";
      if (isDa('관성')) return isKO ? "사회의 규범과 타인의 시선이라는 감옥에서 가장 모범적인 죄수로 살아가고 있네. 그 가면이 너무 완벽해서 이제는 스스로조차 진짜 얼굴이 무엇인지 잊어버린 건 아닐까?" : "You're living as the most exemplary prisoner in the jail of social norms and others' gazes. Is that mask so perfect that now even you've forgotten what your real face looks like?";
      if (isDa('인성')) return isKO ? "생각의 감옥에 갇힌 철학자네. 무언가를 '안다'는 착각이 널 우월하게 만들지만, 실제 삶의 현장에서는 아무것도 바꾸지 못하는 무력함에 괴로워하고 있잖아. 지식은 도피처일 뿐이야." : "A philosopher trapped in a prison of thoughts. The illusion of 'knowing' makes you feel superior, but you suffer from the helplessness of being unable to change anything in actual life. Knowledge is just refuge.";

      return isKO ? "겉으로 보면 참 균형 잡힌 사회인 같지만, 내면에는 '누구도 나를 건드리지 못하게 하겠다'는 강한 공격성과 '모두에게 사랑받고 싶다'는 애정 결핍이 뒤엉켜 있는 복합적인 인격이야." : "On the surface a balanced social being, but internally a complex personality where strong aggression of 'let no one touch me' and an affection deficiency of 'I want to be loved by everyone' are tangled.";
    };

    const getFamilyReport = () => {
      const monthStats = bazi.analysis?.tenGodsRatio || {};
      const isMoStrong = (monthStats['인성'] || 0) > 30;
      const isFaStrong = (monthStats['재성'] || 0) > 30;
      const isBiStrong = (monthStats['비겁'] || 0) > 30;
      const isGwanStrong = (monthStats['관성'] || 0) > 30;
      const isSikStrong = (monthStats['식상'] || 0) > 30;
      
      if (isMoStrong) return isKO ? "부모님(특히 어머니)의 영향력이 네 가치관 깊숙이 박혀 있네. 독립한 성인이 되어서도 그들의 기대치라는 보이지 않는 선을 넘지 못해 고뇌하는 모습이 보여." : "The influence of your parents (especially mother) is deeply embedded in your values. Even as an adult, you struggle with the invisible line of their expectations.";
      if (isFaStrong) return isKO ? "가족 관계에서도 '도리'나 '책임'보다는 '실질적인 도움'이나 '결과'를 더 중요하게 생각하는 경향이 있네. 가끔은 너무 건조한 대화만 오가는 건 아닌지 돌아볼 필요가 있어." : "In family relations, you tend to value 'practical help' or 'results' over 'duty' or 'emotion'. You might need to reflect if your conversations are too dry.";
      if (isBiStrong) return isKO ? "가족이어도 보이지 않는 묘한 경쟁심이 흐르지 않아? 독립심이 강해서 일찍부터 내 영역을 구축했지만, 부모형제와도 선을 명확히 긋는 개인주의적 성향이 강해." : "Even with family, isn't there an invisible, subtle rivalry? Your strong sense of independence made you build your own domain early on, setting clear boundaries even with parents and siblings.";
      if (isGwanStrong) return isKO ? "K-장녀/K-장남이 아니더라도 집안에서 무거운 책임감을 짊어지고 있네. 가장으로서의 압박감 혹은 '내가 똑바로 해야 가정이 평안하다'는 강박이 스스로를 짓누르고 있어." : "Even if you aren't the eldest, you bear a heavy sense of responsibility in the family. The pressure of being the provider or the obsession that 'I must do right for the family to be at peace' is weighing you down.";
      if (isSikStrong) return isKO ? "밖에서는 인싸, 집에서는 에너지 방전 모드네. 타인에겐 다 퍼주면서 가장 가깝고 편안한 가족에게는 본의 아니게 뾰족하고 예민한 모습을 보이고 있을 수 있어." : "A social butterfly outside, but your battery is completely drained at home. While you give everything to others, you might unintentionally be sharp and sensitive to your closest family.";
      
      const dayBranchElements = bazi.pillars.find(p => p.title === 'Day')?.branch || '寅';
      if (['辰', '戌', '丑', '未'].includes(dayBranchElements)) return isKO ? "가족 관계에서 속마음을 잘 드러내지 않네. 혼자서 가족의 크고 작은 문제들을 수습하고 고민을 삭히는 '감정적 쓰레기통' 역할을 하고 있진 않아?" : "You don't reveal your true feelings well in family relations. Aren't you playing the role of an 'emotional trash can', cleaning up big and small family problems and swallowing your own worries?";
      
      return isKO ? "가장 가깝고 편안한 이들에게 본의 아니게 가장 날카로운 말을 내뱉곤 하네. 밖에서 쌓인 긴장을 집에서 해소하려는 습관이 가족들에겐 상처가 될 수 있어." : "You unintentionally spit the sharpest words at those closest to you. Releasing outside tension at home can be hurtful to your family.";
    };

    const getSiblingReport = () => {
      const biGyeanRatio = getValue('비겁');
      if (biGyeanRatio > 35) return isKO ? "형제나 동료는 너에게 자극제인 동시에 피곤한 경쟁자네. 그들에게 느끼는 묘한 우월감이나 열등감은 사실 네 자신을 향한 채찍질일 뿐이야." : "Siblings or colleagues are both stimulants and tiring competitors to you. The strange superiority or inferiority you feel toward them is just a lash toward yourself.";
      if (biGyeanRatio < 5) return isKO ? "사람들 사이에 섞여 있어도 늘 혼자라는 근원적인 고독감을 안고 있네. 형제나 동료에게 기대기보다 스스로 모든 걸 해결해야 한다는 강박이 널 더 외롭게 만들어." : "Even among people, you carry a fundamental loneliness. The obsession that you must solve everything yourself rather than leaning on others makes you lonelier.";
      return isKO ? "동료들 사이에서 꽤 유능하고 쿨한 척하지만, 사실은 그들의 인정 하나하나에 기분이 좌우되는 아주 섬세한 영혼이야." : "You act competent and cool among colleagues, but you're a delicate soul whose mood is dictated by each bit of their recognition.";
    };

    const getIdealSelf = () => {
      if (dom === '식상') return isKO ? "누구의 간섭도 없이 네 천재적인 창의성이 폭발하는 순간, 그리고 그 결과물이 세상을 뒤흔들며 찬사받는 광경을 꿈꾸네." : "You dream of a moment where your genius creativity explodes without interference, and the result is praised globally.";
      if (dom === '재성') return isKO ? "완벽하게 통제되는 자산과 환경 속에서, 네가 설계한 시스템이 한 치의 오차 없이 돌아가는 여유로운 풍요의 상태를 동경하지." : "You long for a state of relaxed abundance where the system you designed runs flawlessly within a perfectly controlled environment.";
      if (dom === '관성') return isKO ? "모두가 네 권위와 명예를 우러러보는 무게감 있는 자리, 그리고 그곳에서 완벽한 품위를 유지하며 인정받는 삶을 갈망하네." : "You crave a life of being recognized for your dignity and honor in a position where everyone looks up to your authority.";
      if (dom === '인성') return isKO ? "누구에게도 침범받지 않는 고요한 지식의 섬, 그리고 그곳에서 네 모든 취향과 통찰이 오롯이 이해받는 순간을 원하잖아." : "You want a serene island of knowledge where no one can intrude, and a moment where all your tastes and insights are fully understood.";
      return isKO ? "강한 자존심만큼이나 당당한 주인공이 되어, 어디서든 네 존재감이 빛나고 모든 이가 네 매력에 압도되는 장면을 꿈꾸지." : "You dream of becoming a confident protagonist whose presence shines everywhere, with everyone overwhelmed by your charm.";
    };

    const getSpouseReport = () => {
      const isMarital = answers.marital && answers.marital !== 'single';
      if (!isMarital) return undefined;

      if (gender === 'male') {
        const jaeRatio = getValue('재성');
        if (jaeRatio > 35) return isKO ? "배우자를 아끼는 마음은 크지만, 때로는 상대를 소유하고 통제하려다 갈등을 빚기도 하겠어. '내 사람'이라는 확신이 집착으로 변하지 않도록 주의해." : "You care for your spouse, but you might clash by trying to possess or control them. Be careful not to let your confidence in them being 'yours' turn into obsession.";
        if (jaeRatio < 5) return isKO ? "배우자의 마음을 읽어내는 데 서툴러서 본의 아니게 상처를 주곤 하지. 무심함이 상대에겐 '방치'로 느껴질 수 있다는 점 잊지 마." : "Clumsy at reading your spouse's heart, you unintentionally hurt them. Remember that your indifference can feel like 'neglect' to them.";
      } else if (gender === 'female') {
        const gwanRatio = getValue('관성');
        if (gwanRatio > 35) return isKO ? "배우자에게 완벽한 모습을 기대하거나, 혹은 그를 통해 자신의 가치를 증명받으려 애쓰고 있네. 상대의 무게감이 너무 커서 네가 지워지지 않게 조심해." : "You expect perfection from your spouse or try to prove your value through them. Don't let their weight erase who you are.";
        if (gwanRatio < 5) return isKO ? "전통적인 관계보다는 각자의 삶을 존중하는 동반자적 관계를 원하지만, 정작 외로울 땐 그 거리감이 널 옥죄기도 해. 적당한 온도 조절이 필요하겠네." : "You want a companionate relationship respecting each other's lives rather than a traditional one, but that distance can choke you when you're lonely.";
      }
      return isKO ? "사랑한다는 핑계로 상대를 통제하려 하거나, 혹은 너무 의존해서 상대의 에너지를 고갈시키고 있는 건 아닌지 돌아봐야 해." : "Reflect on whether you're trying to control them under the guise of love, or exhausting them by being too dependent.";
    };

    const getChildrenReport = () => {
      if (answers.children !== 'yes') return undefined;
      if (gender === 'female') {
        const sikRatio = getValue('식상');
        if (sikRatio > 35) return isKO ? "자녀에게 과도하게 에너지를 쏟으며 네 인생을 투사하고 있네. 아이를 챙기는 정성이 때로는 아이의 독립심을 꺾는 독이 될 수도 있어." : "You're projecting your life by pouring excessive energy into your children. Your care can sometimes turn into a poison that breaks their independence.";
      } else if (gender === 'male') {
        const gwanRatio = getValue('관성');
        if (gwanRatio > 30) return isKO ? "자녀에게 엄격한 기준을 들이대거나 무의식중에 권위를 세우고 있지는 않아? 따뜻한 대화보다 훈육이 먼저 앞서는 건 아닌지 돌아봐." : "Are you applying strict standards or unconsciously asserting authority over your children? Reflect if discipline comes before warm conversation.";
      }
      return isKO ? "아이를 독립된 인격체로 보기보다 네 연장선으로 여기고 있지는 않아? 네 욕망을 아이에게 투영하지 않도록 주의가 필요해." : "Are you viewing your child as an extension of yourself rather than an independent person? Careful not to project your desires onto them.";
    };

    const getSavageShadow = () => {
      if (isDa('인성')) return isKO ? "생각의 감옥에 갇혀 무언가를 '안다'는 착각에 빠지곤 하네. 행동하지 않는 지혜는 결국 너를 고립시킬 뿐이라는 것, 이제는 인정해야지. 너의 그 지적 우월감이 사실은 현실에 부딪히기 두려운 비겁한 도망은 아닐까?" : "You often fall into the illusion of 'knowing' something while trapped in a prison of thoughts. You must admit that wisdom without action will eventually only isolate you. Isn't your intellectual superiority actually a cowardly escape from facing reality?";
      if (isDa('관성')) return isKO ? "타인의 시선이라는 투명한 철장에 갇힌 모범생. 남들의 기대치를 채우느라 네 진짜 욕망은 거세당한 채, 마른 장작처럼 타들어가고 있네. 그렇게 속은 텅 빈 채 껍데기만 화려한 삶을 사는 게 정말 네가 원하던 모습일까?" : "A model student trapped in an invisible cage of others' gazes. Meeting expectations, your true desires are castrated, and you're burning out like dry wood. Is living as a hollow but splendid shell really what you wanted?";
      if (isDa('식상')) return isKO ? "끊임없이 무언가를 쏟아내고 표현하지만, 정작 알맹이는 없는 허언증적인 공허함이 있네. 튀고 싶어 안달 난 그 기질이 네 한계를 드러내는 독이 되고 있다는 사실, 팩트니까 직시해." : "You constantly pour out and express, but there's a pseudo-hallucinatory emptiness with no substance. Face the fact that your itch to stand out is becoming a poison that reveals your shallowness.";
      if (isDa('비겁')) return isKO ? "자신에 대한 애착이 너무 강해서 타인의 존재를 그저 너를 빛나게 해줄 소품 정도로 여기고 있네. 그 지독한 독선이 결국 네 주변에 한 사람도 남지 않게 만들 거야." : "With such strong self-attachment, you treat others as mere props to make you shine. That extreme self-righteousness will eventually leave no one around you.";
      
      return isKO ? "자신이 가장 혐오하는 타인의 모습이 사실은 본인의 가장 깊은 결핍을 비추는 거울이라는 사실을 외면하고 있네. 그 그림자를 수용하지 못하는 한, 영원히 반쪽짜리 인간일 뿐이야." : "You're ignoring the fact that the traits you hate most in others are mirrors of your deepest deficiencies. Unless you accept that shadow, you'll always be just half a person.";
    };

    const getSavageAdvice = () => {
      let advice = "";
      if (strength > 70) {
        advice = isKO ? "너의 그 넘치는 기운이 타인에게는 폭력이 될 수 있어. 가끔은 칼날을 거두고, 무능해 보이는 자들에게도 귀를 기울이는 '낮아짐'의 미학을 좀 배워봐." : "Your overflowing energy can be violence to others. Sometimes withdraw your blade and learn the aesthetics of 'lowering yourself' by listening to those who seem incompetent.";
      } else if (strength < 30) {
        advice = isKO ? "남의 눈치 보느라 정작 네 인생은 실종됐네. 착한 아이 콤플렉스에서 벗어나지 못하면, 평생 타인의 인생을 대신 살아주는 부속품으로 끝날 거야." : "Your life is missing because you're busy reading others. If you don't escape the 'good child' complex, you'll end your life as an accessory living someone else's life.";
      } else {
        advice = isKO ? "네가 쓰고 있는 가면이 너무 무겁다면, 가끔은 그 무게를 내려놓고 숨을 쉬어도 괜찮아. 너는 타인의 기대를 만족시키기 위해 태어난 도구가 아니란 걸 명심해." : "If the mask you wear is too heavy, it's okay to put down that weight and breathe. Keep in mind you weren't born as a tool to satisfy others' expectations.";
      }

      if (bazi.analysis?.conflicts && bazi.analysis.conflicts.length > 0) {
        advice += isKO ? " 특히 내면의 모순이 잦은 구조이니, 스스로를 기만하기보다 그 찌질함조차 기록하고 직시하는 지독한 정직함이 필요해." : " Especially since your structure has frequent internal contradictions, you need brutal honesty to record and face even your cowardice rather than self-deception.";
      }
      return advice;
    };

    const getSocialReport = () => {
      if (dom === '식상') return isKO ? "너의 천재성을 인정받고 싶어 하지만, 정작 타인의 조언은 '구식'이라며 무시하곤 하지. 쿨한 척해도 무관심에는 누구보다 약한 타입이야." : "You want your genius recognized but often dismiss others' advice as 'outdated'. You act cool but are weaker to indifference than anyone.";
      if (dom === '재성') return isKO ? "철저하게 '정'보다는 '리'를 따지는 사회적 인간. 유능해 보이지만 가끔은 너무 계산적인 눈빛이 들통나서 사람들에게 거리감을 줄 때가 있어." : "A social being who strictly follows 'profit' over 'emotion'. You look competent, but sometimes your calculated gaze is found out, creating distance from others.";
      if (dom === '관성') return isKO ? "완벽한 가면을 쓰고 사회생활을 하는 프로지. 예의 바르고 성실하지만, 그 가면 뒤에는 '언제든 모든 관계를 끊고 사라지고 싶다'는 피로감이 잔뜩 쌓여 있어." : "A pro living social life with a perfect mask. You're polite and diligent, but behind that mask lies a fatigue of wanting to 'cut all ties and disappear at any moment'.";
      if (dom === '인성') return isKO ? "지적이거나 신비로운 분위기로 사람들을 매료시키지만, 정작 깊은 속마음은 아무에게도 보여주지 않는 외로운 관찰자야." : "You charm people with an intellectual or mysterious vine, but you're a lonely observer who shows your deepest heart to no one.";
      return isKO ? "강한 자존심 때문에 어디서든 주인공이 되어야 직성이 풀리네. 무시당한다는 느낌을 받으면 그 관계는 가차 없이 정리해버리는 무서운 단호함이 있지." : "Because of strong pride, you must be the protagonist anywhere. You have a decisiveness to mercilessly cut off any relationship where you feel ignored.";
    };

    return {
      id: 'report',
      isEnd: true,
      report: {
        family: getFamilyReport(),
        spouse: getSpouseReport(),
        siblings: getSiblingReport(),
        social: getSocialReport(),
        ideal: getIdealSelf(),
        trueSelf: getSavageTrueSelf(),
        shadow: getSavageShadow(),
        advice: getSavageAdvice(),
        children: getChildrenReport(),
        syncScore: finalSyncScore
      }
    };
  }

  // --- QUESTION FLOW ---

  if (!answers.marital) {
    const questions = isKO ? [
      `진지하게 ${targetName}의 심연을 한번 파헤쳐볼까 해. 혹시 지금 결혼했거나 곁을 지키는 소중한 인연이 있어?`,
      `인생의 파도를 함께 넘고 있는 사람이 있는지 궁금해. 지금 누군가와 함께야, 아니면 혼자만의 항해 중이야?`,
      `${targetName}의 감정 온도는 누구와 함께일 때 가장 뜨거워질까? 지금 배우자나 연인이 있는 상태니?`
    ] : [
      `I'm going to seriously delve into your abyss. Are you currently married or do you have a precious partner?`,
      `I'm curious if there's someone crossing life's waves with you. Are you with someone now, or on a solo voyage?`,
      `At what point does your emotional temperature get highest? Are you currently married or dating?`
    ];
    return {
      id: 'marital',
      question: questions[questionKeys.length % questions.length],
      difficulty: 1,
      discrimination: 1,
      options: isKO ? [
        { id: 'married', label: '결혼했어' },
        { id: 'dating', label: '연애 중' },
        { id: 'single', label: '지금은 솔로' }
      ] : [
        { id: 'married', label: 'Married' },
        { id: 'dating', label: 'Dating' },
        { id: 'single', label: 'Single' }
      ]
    };
  }

  if (!answers.children) {
    return {
      id: 'children',
      question: isKO ? `인생의 무게가 어디로 향하는지 궁금하거든. 혹시 자녀는 있니?` : `I'm curious about where the weight of your life is heading. Do you have children?`,
      options: isKO ? [{ id: 'yes', label: '응, 있어' }, { id: 'no', label: '아니, 없어' }] : [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }]
    };
  }

  // New Relationship-based Dynamic Questions
  if (!answers.q_rel_dyn) {
    let q = "";
    if (gender === 'male' && isDa('재성')) {
      q = isKO ? `책임감이 강한 편이네, 혹시 '내가 이걸 다 책임져야 한다'는 압박감 때문에 가끔은 다 던지고 도망치고 싶다는 위험한 상상을 하곤 하지 않아?` : `You with a strong sense of responsibility, do you ever have dangerous fantasies of wanting to escape because of the pressure to provide for your family?`;
    } else if (gender === 'female' && isDa('관성')) {
      q = isKO ? `남들의 기대를 저버리지 않으려는 완벽주의 뒤에, 사실은 '아무도 나를 찾지 않는 곳으로 사라지고 싶다'는 피로감이 쌓여 있는 것 같은데, 어때?` : `Behind the perfectionism of not letting others down, is there a mounting fatigue that makes you want to 'disappear somewhere where no one finds me'?`;
    } else if (isDa('비겁')) {
      q = isKO ? `주변에 사람은 많지만 정작 마음 깊은 곳을 터놓을 상대는 없어서, 가끔은 가장 친한 친구조차 경쟁자로 느껴져서 씁쓸할 때가 있지 않아?` : `There are many people around, but with no one to share your deepest heart, don't you sometimes feel bitter because even your best friend feels like a competitor?`;
    } else {
      q = isKO ? `타인에게는 관대한 척하지만, 실상은 너만의 아주 깐깐한 '인간관계 합격선'이 있어서 그걸 통과하지 못한 사람들은 가차 없이 끊어내는 편이지?` : `You act generous to others, but in reality, don't you have a very strict 'relationship passing line' and mercilessly screen out those who don't cross it?`;
    }
    return { id: 'q_rel_dyn', question: q, options: defaultOptions };
  }

  if (answers.q_rel_dyn === 'no' && !answers.q_rel_dyn_refute) {
    const q = isKO ? 
      `그렇다면 다행이네! 반대로 생각하면, 너만의 뚜렷한 주관과 멘탈로 빡빡한 인간관계 속에서도 상처받지 않고 묵묵히 제 갈 길을 가는 멘탈갑이라는 뜻이기도 하니까.` : 
      `That's a relief then! Thinking differently, it means you have such an independent mindset that you walk your own path without getting hurt in tough human relations.`;
    return { id: 'q_rel_dyn_refute', question: q, options: defaultOptions };
  }

  if (!answers.q_element) {
    let q = "";
    const element = dmElement;
    if (element === 'Wood') {
      q = isKO ? `나무처럼 생명력 넘치는 너, 새로운 일을 벌이는 건 좋아하지만 끝맺음이 부족해서 '용두사미'가 되어버린 수많은 프로젝트들을 보며 자괴감을 느끼진 않아?` : `You, full of vitality like a tree, love starting new things but often feel frustrated by your many 'dragon head, snake tail' projects that lack closure?`;
    } else if (element === 'Fire') {
      q = isKO ? `불꽃처럼 화려하게 타오르는 너, 남들의 주목을 받지 못하면 견디지 못하는 그 '관종' 기질이 가끔은 스스로를 너무 피곤하게 만들진 않아?` : `You, burning brilliantly like a flame, does that 'attention-seeking' nature that can't stand being ignored sometimes exhaust you?`;
    } else if (element === 'Earth') {
      q = isKO ? `대지처럼 묵묵히 자리를 지키는 너, 사람들이 당연하게 너의 헌신을 바라고 이용할 때, 속으로는 피눈물을 흘리면서도 겉으론 허허실실 웃어주는 거 아니야?` : `You, silently standing your ground like the earth, when people take your dedication for granted and use you, aren't you crying inside while smiling on the outside?`;
    } else if (element === 'Metal') {
      q = isKO ? `날카로운 칼날 같은 너, 남의 실수를 단칼에 베어버리는 그 결벽증적인 정의감이 사실은 주변의 소중한 사람들을 하나둘씩 떠나게 만들고 있다는 생각, 해봤어?` : `You, like a sharp blade, have you ever thought that your obsessive sense of justice, which cuts through others' mistakes, is actually driving away the precious people around you?`;
    } else {
      q = isKO ? `깊은 밤의 호수 같은 너, 남들이 모르는 비밀이 너무 많아서 가끔은 본인조차 자기가 누구인지 가물가물해지는 신비주의의 늪에 빠져 있는 거 아냐?` : `You, like a lake in the deep night, have so many secrets others don't know that you're sometimes lost in a swamp of mysticism where even you forget who you are?`;
    }
    return { id: 'q_element', question: q, options: defaultOptions };
  }

  if (answers.q_element === 'no' && !answers.q_element_refute) {
    let q = "";
    if (dmElement === 'Wood') {
      q = isKO ? 
        `아니라고? 그렇다면 특유의 추진력을 긍정적으로 쓰고 있나 보네. 남들이 주춤할 때 "일단 해보자"며 총대를 메거나, 막막한 상황에서도 기발한 돌파구를 찾아내는 행동대장 역할을 찰떡같이 소화하고 있다는 뜻이겠지?` : 
        `No? Then you must be using your drive positively. While others hesitate, you say "Let's just do it" and take charge, acting as an agile leader who finds clever breakthroughs in stuck situations.`;
    } else if (dmElement === 'Fire') {
      q = isKO ? 
        `오, 그럼 본인의 존재감을 아주 영리하게 쓰는 타입인가 봐. 칙칙하고 어색한 모임에 들어가면 특유의 텐션으로 순식간에 사람들을 무장해제 시키고 분위기를 확 띄우는 '인간 보일러' 역할을 톡톡히 하고 있다는 거네.` : 
        `Oh, then you use your presence smartly. When you enter an awkward gathering, you disarm people with your unique vibe and warm up the atmosphere, playing the role of a 'human heater'.`;
    } else if (dmElement === 'Earth') {
      q = isKO ? 
        `아니구나? 그렇다면 꽤나 속이 깊고 안정적인 사람이란 소리를 듣겠네. 주변 친구들이 '진짜 멘붕'일 때 제일 먼저 너한테 연락해서 속마음을 털어놓을 만큼, 입 무겁고 든든한 '인간 대나무숲' 역할을 하고 있다는 뜻이네.` : 
        `No? Then you must be known as someone stable and deep. It means you act as a reliable 'human bamboo forest' where friends call you first to vent when they are having absolute meltdowns.`;
    } else if (dmElement === 'Metal') {
      q = isKO ? 
        `오, 부정하는 걸 보니 본인의 예리함을 아주 똑똑하게 쓰고 있나 봐. 감정에 휘둘리지 않고 상황의 팩트만 딱 짚어내서, 일 처리나 답답한 인간관계를 아주 깔끔하게 정리해 주는 '사이다 해결사' 매력을 뽐내고 있겠네.` : 
        `Oh, you deny it? You must be using your sharpness smartly. Without being swayed by emotions, you pinpoint the facts and neatly clear up slow workflows or frustrating relationships, showing off a 'refreshing' charm.`;
    } else {
      q = isKO ? 
        `아니라고? 그럼 유연함을 제대로 무기 삼아 쓰고 있네. 어느 그룹에 툭 던져놔도 물 흐르듯 자연스럽게 섞여 들어가고, 겉으로는 나서지 않아도 돌아가는 판을 제일 먼저 간파해 내는 무서운 '눈치 백단'이라는 거네.` : 
        `No? Then you're using flexibility as a proper weapon. Drop you in any group and you blend in like water. Even without stepping up, you're a keen observer who quickly reads how things are flowing.`;
    }
    return { id: 'q_element_refute', question: q, options: defaultOptions };
  }

  // --- NEW COMPLEX QUESTIONS ---
  
  // IRT High Discrimination: Tri-penal Clash (인사신/축술미)
  const isSamhyeong = interactions.some((c: any) => c.type?.includes('삼형'));
  if (isSamhyeong && !answers.q_samhyeong) {
    let q = isKO 
      ? `네 사주에는 남의 생살여탈권을 쥘 만큼 날카롭고 위험한 '삼형살'이 있어. 혹시 너, 타인의 약점을 순식간에 캐치해 내고, 마음만 먹으면 그걸로 상대를 완벽하게 짓밟아버릴 수 있다는 걸 본능적으로 알고 있지 않아?` 
      : `You have the 'Tri-penal clash' meant to hold life-and-death power. Don't you instinctively know you can catch others' weaknesses instantly and emotionally crush them if you wanted to?`;
    return { id: 'q_samhyeong', question: q, difficulty: 5, discrimination: 5, options: defaultOptions };
  }

  if (isSamhyeong && answers.q_samhyeong === 'no' && !answers.q_samhyeong_refute) {
    let q = isKO 
      ? `그 무서운 칼날을 스스로를 향해 겨누거나 활인(타인을 살리는 직업/조언)으로 승화하고 있나 보네. 남을 해치기보다 오히려 네가 총대를 메고 힘든 걸 감당하려는 피곤한 구원자 역할을 하고 있지?`
      : `You must be turning that terrifying blade inward or sublimating it into saving others. Instead of harming others, aren't you playing the tiring savior who takes the bullet?`;
    return { id: 'q_samhyeong_refute', question: q, difficulty: 4, discrimination: 4, options: defaultOptions };
  }

  // Refined Cold Reading (Barnum combined with ILJU)
  if (!answers.q_barnum_ilju) {
    let q = "";
    if (ilju.includes('寅') || ilju.includes('申') || ilju.includes('巳') || ilju.includes('亥')) {
      q = isKO 
        ? `너는 겉보기에 아주 유연하고 남의 말을 잘 듣는 척하지만, 사실 속으로는 이미 너만의 결론을 다 내려놓고 남들이 동의해주기만을 기다리는 '답정너' 기질이 상당히 강하지 않아?`
        : `You look very flexible and act like a good listener, but inside, haven't you already made your conclusions and are just waiting for others to agree?`;
    } else if (ilju.includes('子') || ilju.includes('午') || ilju.includes('卯') || ilju.includes('酉')) {
      q = isKO
        ? `호불호가 속으로 너무 명확해서, 남들이 볼 땐 무난해 보여도 사실 네 마음속 'VIP 라운지'와 '아웃렛'에 배정된 사람이 영원히 바뀌지 않는 극단적 취향의 소유자지?`
        : `Your likes/dislikes are so clear inside that while you look easy-going, the people in your mental 'VIP lounge' vs 'trash bin' never change. You have extreme tastes, right?`;
    } else {
      q = isKO
        ? `대인관계에서 다 품어줄 것처럼 좋은 사람 코스프레를 하지만, 사실 누군가 선을 넘거나 예의가 없으면 속으로 조용하고 확실하게 '손절 장부'에 기록부터 하고 있지?`
        : `You cosplay as a good person who embraces everyone, but softly and surely, if someone crosses a line, you immediately write them down in your 'severance ledger', right?`;
    }
    return { id: 'q_barnum_ilju', question: q, difficulty: 3, discrimination: 4, options: defaultOptions };
  }

  if (isGanyeo && !answers.q_ganyeo_stubborn) {
    let q = "";
    if (ilju === '癸亥') {
      q = isKO ? `겉으로는 유연하고 다 맞추어 주는 것 같지만, 실상은 본인이 옳다고 믿는 일에는 세상 누구보다 지독하고 무서운 고집을 부리는 '외유내강' 타입이지?` : `You act flexible outside, but in reality, you're a 'soft outside, tough inside' type who is more stubborn than anyone when you believe you're right?`;
    } else if (ilju === '庚申' || ilju === '辛酉') {
      q = isKO ? `본인의 논리가 정답이라는 확신이 너무 강해서, 남의 의견을 들을 때 속으로 '참 멍청하네'라고 생각하며 단칼에 베어버리는 독설가 기질이 있지 않아?` : `You're so sure your logic is correct that you often think 'How stupid' while cutting off others' opinions with a sharp tongue, right?`;
    } else {
      q = isKO ? `일지에 비겁을 깔고 있어서 자존심이 곧 생명이라, 누군가 네 주관을 건드리면 앞뒤 안 가리고 폭주하는 경향이 있는데, 스스로도 그 고집이 때로는 피곤하지?` : `With Self in your spouse palace, pride is your life. When someone touches your subjectivity, you tend to go wild regardless. Is that stubbornness tiring even for you?`;
    }
    return { id: 'q_ganyeo_stubborn', question: q, options: defaultOptions };
  }
  
  if (answers.q_ganyeo_stubborn === 'no' && !answers.q_ganyeo_refute) {
    const q = isKO ? 
      `유연하게 대처를 잘 하고 있다는 거네! 주관은 뚜렷하지만, 그걸 겉으로 내세워서 주변과 마찰을 일으키지 않는 세련된 처세술을 터득한 셈인가?` : 
      `So you're coping flexibly! You have clear subjectivities, but you've mastered sophisticated social skills to not show them off and cause friction with your surroundings?`;
    return { id: 'q_ganyeo_refute', question: q, options: defaultOptions };
  }

  if (answers.marital && answers.marital !== 'single' && !answers.q_spouse_palace) {
    let q = "";
    const isEarth = ['辰', '戌', '丑', '未'].includes(dayBranch);
    if (isDayClash) {
      q = isKO ? `일지에 충이 있어 그런지, 배우자와 세상 누구보다 가깝다가도 한순간에 남보다 못한 사이처럼 격렬하게 부딪히는 롤러코스터 같은 관계를 반복하고 있진 않아?` : `With a clash in your spouse palace, do you repeat a rollercoaster relationship—closer than anyone index one moment, worse than strangers the next?`;
    } else if (isBaekhoGoegang) {
      q = isKO ? `배우자 자리에 강한 기운(백호/괴강)이 서려 있네. 그래서인지 파트너를 대할 때 은연중에 압도하려 하거나, 혹은 반대로 아주 강한 상대를 만나 잡혀 살며 갈등을 빚고 있지는 않아?` : `Strong energy (Baekho/Goegang) resides in your spouse palace. Do you try to overwhelm your partner unconsciously, or did you meet a very strong partner and live under their thumb?`;
    } else if (isEarth) {
      q = isKO ? `진술축미, 복잡한 대지의 기운을 일지에 품었네. 배우자와의 관계가 겉으론 평온해 보여도 속으로는 말 못한 원망이나 해소되지 않은 감정의 앙금이 켜켜이 쌓여 있는 것 같은데, 어때?` : `You hold the complex earth energy (Jin-Sul-Chuk-Mi). Relationship looks calm but isn't there a layer of unspoken resentment or unresolved emotional sediment built up inside?`;
    } else {
      q = isKO ? `배우자를 사랑하지만, 가끔은 그 존재 자체가 네 자유를 구속하는 '족쇄'처럼 느껴져서 숨이 막힐 때가 있지 않아?` : `You love your spouse, but doesn't their existence sometimes feel like a 'shackle' restricting your freedom, making it hard to breathe?`;
    }
    return { id: 'q_spouse_palace', question: q, options: defaultOptions };
  }

  if (answers.q_spouse_palace === 'no' && !answers.q_spouse_refute) {
    const q = isKO ? 
      `다행이네. 그만큼 네가 파트너와의 차이를 있는 그대로 인정하고, 적당한 독립성을 유지하면서 아주 건강한 거리두기를 잘해내고 있다는 거니까.` : 
      `That's fortunate. It means you accept your partner's differences as they are and maintain healthy distance while keeping proper independence.`;
    return { id: 'q_spouse_refute', question: q, options: defaultOptions };
  }

  if (!answers.q_bigeob_dyn) {
    const bibean = getValue('비견');
    const geobjae = getValue('겁재');
    let q = "";
    if (geobjae > 20) {
      q = isKO ? `사주에 겁재의 기운이 강하네. 타인을 믿기보다 '언젠가 내 것을 뺏어갈 존재'로 무의식적으로 경계하며, 그래서 차라리 내가 먼저 뺏거나 이겨야 한다는 조급함이 있지 않아?` : `Geobjae energy is strong. Rather than trusting others, you unconsciously guard against them as 'beings who will steal mine one day', leading to an urgency to steal or win first?`;
    } else if (bibean > 25) {
      q = isKO ? `비견이 강한 너, 친구나 동료가 잘되면 진심으로 축하하기보다 '나도 저만큼 해야 하는데'라는 묘한 경쟁심 때문에 스스로를 끊임없이 채찍질하며 피곤하게 살고 있지?` : `Strong in Bigean, you tire yourself out by constantly lashing yourself with competitive thoughts like 'I should do as well' rather than pure celebration for colleagues?`;
    } else {
      q = isKO ? `주변 사람들에게 꽤 젠틀하게 대하지만, 사실 그 속마음엔 '내 영역에 선 넘지 마'라는 차갑고 단호한 바리케이트가 쳐져 있는 거 맞지?` : `You're quite gentle to others, but inside, isn't there a cold, firm barricade saying 'Don't cross the line into my territory'?`;
    }
    return { id: 'q_bigeob_dyn', question: q, options: defaultOptions };
  }

  if (answers.q_bigeob_dyn === 'no' && !answers.q_bigeob_refute) {
    const q = isKO ? 
      `아니라고? 그렇다면 경쟁심이나 경계심에 에너지를 쓰기보다는, 온전히 너의 성장에 그 에너지를 다 쏟아붓고 있는 엄청난 마이웨이의 소유자인가 보네.` : 
      `No? Then rather than spending energy on competitiveness or vigilance, you must be a tremendous "my way" owner who pours all that energy wholly into your own growth.`;
    return { id: 'q_bigeob_refute', question: q, options: defaultOptions };
  }

  if (!answers.q_family_dyn) {
    const monthInteractions = interactions.filter((c: any) => c.involved?.includes('월') || c.target?.includes('월'));
    const hasConflict = monthInteractions.length > 0;
    let q = "";
    if (hasConflict) {
      q = isKO ? `가족궁인 월지에 형(刑)이나 충(沖)의 기운이 엿보이네. 그래서인지 가족이라는 이름의 굴레가 때로는 발목을 잡는 족쇄처럼 느껴져서, 멀리 떠나버리고 싶다는 충동을 느낀 적 있지?` : `Month palace (family) shows conflict (Hyeong/Chung). Does the yoke of family sometimes feel like a shackle holding you back, making you want to leave it all behind?`;
    } else {
      q = isKO ? `가족들에게는 듬직하고 예의 바른 자식/형제인 척하지만, 사실 그들의 기대치에 맞춰주느라 네 진짜 꿈이나 색깔은 이미 바래버린 거 아냐?` : `You act like a reliable and polite child/sibling to your family, but has your true dream or color already faded while trying to meet their expectations?`;
    }
    return { id: 'q_family_dyn', question: q, options: defaultOptions };
  }

  if (answers.q_family_dyn === 'no' && !answers.q_family_refute) {
    const q = isKO ? 
      `참 부럽다. 가족이라는 울타리 안에서 너만의 독립적인 자아를 잃지 않고, 감정적으로 휘둘리지 않을 만큼 튼튼한 멘탈을 구축했다는 증거 아닐까?` : 
      `I envy you. Isn't that proof you've built a strong enough mentality not to be emotionally swayed, without losing your independent self inside the family fence?`;
    return { id: 'q_family_refute', question: q, options: defaultOptions };
  }

  if (!answers.q1_refrig) {
    return {
      id: 'q1_refrig',
      question: isKO ? `예를 들어보자. 네가 냉장고에 아껴둔 음식을 누군가 상의 없이 먹어버렸다면, 겉으로는 "괜찮아" 해도 속으론 '어떻게 예의가 없지?' 하고 꽤 오랫동안 그 사람을 체크리스트에 올려두는 편이지?` : `Let's take an example. If someone ate your saved food in the fridge without asking, you might say "it's fine" while internally keeping that person on a checklist for quite some time, thinking 'How could they be so rude?', right?`,
      options: defaultOptions
    };
  }

  if (answers.q1_refrig === 'no' && !answers.q1_pivot) {
    return {
      id: 'q1_pivot',
      question: isKO ? `그렇다면 너는 남들이 사소한 실수를 하더라도 쿨하게 넘겨줄 수 있는, 사람에 대한 포용력과 여유가 꽤나 깊은 대인배인가 봐?` : `Then you must be a broad-minded person with deep tolerance and composure towards others, coolly letting their minor mistakes slide?`,
      options: defaultOptions
    };
  }

  if (!answers.q2_strength) {
    let q = "";
    if (strength > 70) {
      q = isKO ? `네 사주 에너지가 워낙 당당하고 강한 편이라 그런지, 가끔은 본의 아니게 네 확신이 타인에겐 강요처럼 느껴질 수 있다는 생각, 해본 적 있어?` : `Your BaZi energy is so confident and strong that I wonder if you've ever thought your convictions might unintentionally feel like coercion to others?`;
    } else if (strength < 30) {
      q = isKO ? `기운이 참 섬세하고 고운데, 그래서인지 남들의 사소한 표정 하나에도 혼자 수십 가지 시나리오를 쓰며 속앓이를 하곤 하진 않아?` : `Your energy is so delicate and fine, but I wonder if that leads you to write dozens of mental scenarios and suffer alone over even a minor look from someone else?`;
    } else {
      q = isKO ? `적당히 유연하고 균형 잡힌 척하지만, 사실은 결정적인 순간에 내가 손해 볼까 봐 한발 뒤로 물러나서 상황을 관망하는 여우 같은 면이 있지?` : `You act flexibly and balanced, but isn't there a foxy side of you that steps back and watches the situation for fear of losing out at critical moments?`;
    }
    return { id: 'q2_strength', question: q, options: defaultOptions };
  }

  if (answers.q2_strength === 'no' && !answers.q2_strength_refute) {
    const q = isKO ? 
      `그렇다면 자기 객관화가 아주 잘 되어 있나 보네. 상황에 맞춰 힘을 빼고 줄 줄 아는, 에너지 컨트롤의 진정한 고수라는 이야기잖아?` : 
      `Then your self-objectification must be very well established. Doesn't that mean you're a true master of energy control who knows how to relax and exert force depending on the situation?`;
    return { id: 'q2_strength_refute', question: q, options: defaultOptions };
  }

  if (!answers.q3_groupchat) {
    return {
      id: 'q3_groupchat',
      question: isKO ? `단체 대화방에서 네 말에만 반응이 없으면, 겉으론 바빠서 못 봤겠지 싶어도 속으로는 '걔가 나한테 서운한 게 있나?' 하고 은근히 신경 쓰는 편이지?` : `In a group chat, if there's no reaction only to your message, you might act like they're just busy, but don't you secretly get bothered thinking, 'Is there something they're upset about with me?'`,
      options: defaultOptions
    };
  }

  if (answers.q3_groupchat === 'no' && !answers.q3_groupchat_refute) {
    const q = isKO ? 
      `타인의 반응에 일희일비하지 않는다는 거네. 누가 내 말을 듣든 말든 내 중심이 꽉 잡혀 있어서, 타인의 인정보다 내 만족이 더 중요한 강철 멘탈이 확실하네.` : 
      `So you aren't swayed by others' reactions. Your center is so solid whether people listen or not; you definitely have a mind of steel where self-satisfaction is more important than others' recognition.`;
    return { id: 'q3_groupchat_refute', question: q, options: defaultOptions };
  }

  if (!answers.q4_dom) {
    let q = "";
    if (dom === '식상') {
      q = isKO ? `아이디어가 샘솟는 식상 스타일이네. 그래서인지 네 방식이 아닌 누군가의 간섭을 받을 때, '네가 뭘 안다고' 하는 반항심이 욱하고 올라올 때 있지 않아?` : `You're an idea-springing 'Output' style. I wonder if you ever feel a surge of rebellion, thinking 'What do you know?', when you're interfered with by someone who's not doing it your way?`;
    } else if (dom === '재성') {
      q = isKO ? `결과를 중시하는 현실적인 면모가 강해 보여. 모든 관계나 일에서 '이게 나한테 실질적으로 도움이 될까?'를 무의식적으로 먼저 계산하곤 하지?` : `You seem to have a strong realistic side that values results. In every relationship or task, don't you unconsciously calculate 'Will this actually be helpful to me?' first?`;
    } else if (dom === '관성') {
      q = isKO ? `사회적인 명예와 성취에 관심이 많지? 그래서인지 남들에게 빈틈없는 모습만 보여주려다 보니, 진짜 네 솔직한 고민을 털어놓을 곳이 없어서 외로울 때가 있을 거야.` : `You're quite interested in social honor and achievement, aren't you? Because you try to show only a flawless side to others, you must have moments of loneliness because you have no place to share your truly honest concerns.`;
    } else if (dom === '인성') {
      q = isKO ? `생각이 참 깊고 아는 게 많네. 하지만 가끔은 그 수많은 정보와 생각들이 꼬리에 꼬리를 물어서, 정작 행동해야 할 타이밍을 놓치고 후회할 때 있지 않아?` : `You have deep thoughts and know a lot. But I wonder if you ever regret missing the timing for action because those countless information and thoughts keep circling in your head?`;
    } else {
      q = isKO ? `네 자존심과 주체성이 정말 대단해. 누군가에게 지는 건 죽기보다 싫고, 특히 '너는 누구보다 못해'라는 비교를 당할 때면 속에서 불이 나지 않아?` : `Your pride and autonomy are truly amazing. You hate losing more than death, and especially when compared as 'you're not as good as someone else', doesn't it feel like a fire is starting inside you?`;
    }
    return { id: 'q4_dom', question: q, options: defaultOptions };
  }

  if (answers.q4_dom === 'no' && !answers.q4_dom_refute) {
    const q = isKO ? 
      `오, 한쪽으로 치우칠 수 있는 너의 강한 성향을 의식적으로 조절해서, 여러 상황에 맞게 밸런스를 절묘하게 맞추며 살아가는 융통성 끝판왕인 걸까?` : 
      `Oh, are you the ultimate master of flexibility, consciously controlling your strong tendencies to exquisitely balance things out according to various situations?`;
    return { id: 'q4_dom_refute', question: q, options: defaultOptions };
  }

  if (!answers.q5_envy) {
    return {
      id: 'q5_envy',
      question: isKO ? `가까운 지인이 잘됐다는 소식에 진심으로 축하해주면서도, 한편으론 '나보다 못한 녀석인데 어떻게?' 같은 아주 미묘한 훼방꾼 같은 마음이 스친 적 없어?` : `While sincerely congratulating a close acquaintance on their success, haven't you ever had a very subtle, meddling thought like 'How could someone who's not as good as me achieve that?'`,
      options: defaultOptions
    };
  }

  if (answers.q5_envy === 'no' && !answers.q5_envy_refute) {
    const q = isKO ? 
      `질투 대신 온전히 타인의 성공을 빌어줄 수 있는 그릇이구나. 타인과 나를 분리해서 바라볼 줄 아는 그 평정심 덕분에 주변 평판도 무척 좋겠어.` : 
      `You have the capacity to genuinely wish for others' success instead of feeling envious. Thanks to that equanimity of separating yourself from others, your reputation around you must be great.`;
    return { id: 'q5_envy_refute', question: q, options: defaultOptions };
  }

  if (answers.marital && answers.marital !== 'single' && !answers.q6_mask) {
    return {
      id: 'q6_mask',
      question: isKO ? `가장 가까운 사람 앞에서는 밖에서의 쿨한 모습은 온데간데없고, 말도 안 되는 고집을 부리거나 아이처럼 투정 부리는 너를 발견하고 놀랄 때 있지?` : `In front of those closest to you, are you ever surprised to find the cool persona from outside vanish, replaced by you being incredibly stubborn or whining like a child?`,
      options: defaultOptions
    };
  }

  if (answers.q6_mask === 'no' && !answers.q6_mask_refute) {
    const q = isKO ? 
      `가까운 사람에게도 한결같은 모습을 보여줄 수 있다니. 감정 기복에 휘둘리지 않고 항상 일정한 온도를 유지하는, 아주 성숙하고 안정적인 파트너의 표본인가 보네.` : 
      `To be able to show a consistent side even to those closest to you... You must be the epitome of a very mature and stable partner who maintains a constant temperature without being swayed by mood swings.`;
    return { id: 'q6_mask_refute', question: q, options: defaultOptions };
  }

  if (!answers.q7_temp) {
    const isHot = (getValue('Fire') + getValue('Wood')) > 55;
    const isCold = (getValue('Water') + getValue('Metal')) > 55;
    let q = "";
    if (isHot) {
      q = isKO ? `마음속에 불을 품고 살아가네. 그래서인지 한번 꽂히면 앞뒤 안 가리고 달려들다가 금방 식어버리거나, 욱하는 성격 때문에 소중한 걸 망친 적 있지 않아?` : `You live with a fire in your heart. Don't you ever run into things head-on once you're hooked, only to cool off quickly or ruin something precious because of a sudden temper?`;
    } else if (isCold) {
      q = isKO ? `냉철하고 이성적이지만 가끔은 너무 차가워서 스스로조차 외롭게 만들 때가 있지? 감정에 휘둘리기보다 완벽한 논리를 찾으려다 보니 인맥이 좁아지는 느낌 안 들어?` : `You're cool-headed and rational, but aren't there moments when you're so cold it makes even yourself feel lonely? Doesn't it feel like your social circle is narrowing as you seek perfect logic rather than being swayed by emotions?`;
    } else {
      q = isKO ? `평화주의자처럼 보이지만 사실은 갈등이 생기는 게 귀찮아서 적당히 좋은 게 좋은 거라며 회피하는 경향이 있는 거 아냐?` : `You look like a pacifist, but don't you actually have a tendency to avoid conflicts because they're bothersome, acting as if everything is fine?`;
    }
    return { id: 'q7_temp', question: q, options: defaultOptions };
  }

  if (answers.q7_temp === 'no' && !answers.q7_temp_refute) {
    const q = isKO ? 
      `뜨겁게 타오를 때와 차갑게 식혀야 할 때를 기가 막히게 조절할 줄 아는구나. 주변 상황의 분위기를 읽고 그에 맞춰 언제든 온도를 바꾸는 카멜레온 같은 매력이 있네.` : 
      `You know how to beautifully control when to burn hot and when to cool down. You have a chameleon-like charm that reads the atmosphere and changes your temperature accordingly.`;
    return { id: 'q7_temp_refute', question: q, options: defaultOptions };
  }

  if (!answers.q8_imbalance) {
    let q = "";
    if (isMu('재성')) {
      q = isKO ? `사주에 재성 기운이 약한 편이네. 그래서인지 눈앞의 이득보다는 당장의 감정이나 명분이 더 중요해서 나중에 '아, 그때 돈 좀 챙길걸' 하고 뒤늦게 후회하곤 하지?` : `Wealth energy seems slightly weak in your chart. Is it because of that that immediate emotions or causes are more important than profit, leading to late regrets like 'Oh, I should've taken some money then'?`;
    } else if (isMu('인성')) {
      q = isKO ? `인성이 부족하면 깊게 고민하기보다 일단 지르고 보는 성격이 되기 쉽거든. '생각 좀 하고 살라'는 소리, 은근히 자주 듣는 편 아니야?` : `When Resource is lacking, it's easy to become the type who acts first and thinks later. Don't you secretly hear people say 'Try thinking a bit more' quite often?`;
    } else {
      q = isKO ? `자신은 누구보다 객관적이라고 믿지만, 사실은 보고 싶은 것만 보고 믿고 싶은 것만 믿는 아주 지독한 편향성을 가지고 있는 거 아니야?` : `You believe you're more objective than anyone, but aren't you actually holding a severe bias, only seeing what you want to see and believing what you want to believe?`;
    }
    return { id: 'q8_imbalance', question: q, options: defaultOptions };
  }

  if (answers.q8_imbalance === 'no' && !answers.q8_imbalance_refute) {
    const q = isKO ? 
      `결핍에 휘둘리지 않는 멘탈이네! 오히려 부족한 점을 쿨하게 인정하고 다른 강점들로 100% 커버해버리는, 전략적인 노력파에 가깝구나?` : 
      `A mentality not swayed by deficiencies! You must be more of a strategic hard-worker who coolly admits shortcomings and covers them 100% with other strengths?`;
    return { id: 'q8_imbalance_refute', question: q, options: defaultOptions };
  }

  if (!answers.q9_mirror) {
    return {
      id: 'q9_mirror',
      question: isKO ? `지금까지 내 질문들을 들으면서 '어? 이걸 어떻게 알았지?' 싶은 소름 돋는 순간이 최소 한 번은 있었지? 사실 네 사주 데이터는 네 영혼의 지문 같은 거니까.` : `While listening to my questions so far, was there at least one chilling moment where you thought, 'Wait, how did you know this?' In truth, your BaZi data is like a fingerprint of your soul.`,
      options: defaultOptions
    };
  }

  if (answers.q9_mirror === 'no' && !answers.q9_mirror_refute) {
    const q = isKO ? 
      `어쩌면 너 자신이 스스로에 대해 워낙 깊게 파악하고 있어서, 내 말들이 전부 이미 네가 생각하고 고민했던 범주 안에 있어서 새삼스럽지 않다는 뜻이겠네?` : 
      `Perhaps it means you've grasped yourself so deeply that everything I say is already within the realm of what you've thought and worried about, so nothing is surprising?`;
    return { id: 'q9_mirror_refute', question: q, options: defaultOptions };
  }

  if (!answers.q_final) {
    return {
      id: 'q_final',
      question: isKO ? `이제 마지막이야. 과연 네가 평생 외면해온 너의 진짜 '그림자'를 마주할 준비가 됐을까? 내가 보여줄 리포트는 생각보다 아플 수도 있어.` : `This is the last one. Are you truly ready to face the 'shadow' you've been avoiding all your life? The report I'm about to show might be more painful than you think.`,
      options: isKO ? [
        { id: 'yes', label: '준비됐어, 보여줘' },
        { id: 'no', label: '조금 무섭지만 궁금해' },
        { id: 'maybe', label: '살살 말해줘' }
      ] : [
        { id: 'yes', label: 'I\'m ready' },
        { id: 'no', label: 'I\'m scared but curious' },
        { id: 'maybe', label: 'Speak gently' }
      ]
    };
  }

  return { 
    id: 'final_fallback', 
    isEnd: true, 
    report: { 
      trueSelf: isKO ? "평가 중..." : "Evaluating...", 
      shadow: "...", 
      advice: "...", 
      family: "...", 
      siblings: "...", 
      social: "...", 
      ideal: "..." 
    } 
  };
}

