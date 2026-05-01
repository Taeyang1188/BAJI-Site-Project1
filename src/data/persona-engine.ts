import { BaZiResult } from '../types';

export interface PersonaOption {
  id: string;
  label: string;
}

export interface PersonaNode {
  id: string;
  question?: string;
  options?: PersonaOption[];
  isEnd?: boolean;
  report?: {
    family: string;
    spouse?: string;
    children?: string;
    siblings: string;
    social: string;
    ideal: string;
    trueSelf: string;
    shadow: string;
    advice: string;
  };
}

const defaultOptions: PersonaOption[] = [
  { id: 'yes', label: '예 (인정)' },
  { id: 'no', label: '아니오 (부정)' },
  { id: 'unk', label: '모르겠음' }
];

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

  // Fallback to Geju if ratios are missing or identical
  if (!maxGroup || maxVal === 0) {
    if (geju.includes('비견') || geju.includes('겁재') || geju.includes('록') || geju.includes('인')) return '비겁';
    if (geju.includes('식신') || geju.includes('상관')) return '식상';
    if (geju.includes('재')) return '재성';
    if (geju.includes('관') || geju.includes('살')) return '관성';
    if (geju.includes('인')) return '인성';
    return '비겁'; // Final fallback
  }
  
  return maxGroup;
}

// Data dictionaries
const dmQuestions: Record<string, string> = {
  '甲': '{{target은는}} 남한테 굽히는 걸 죽기보다 싫어하지? 겉으론 맞춰주는 척해도 속으론 "내가 맞고 넌 틀려"라는 고집이 뼈를 관통하고 있잖아.',
  '乙': '분위기 잘 맞추고 유연한 척하지만, 사실 은근슬쩍 상황을 네가 원하는 대로 뒤에서 다 조종하고 있지 않아?',
  '丙': '감정 기복 엄청 심하지? 꽂히면 확 타올랐다가 수틀리면 얼음장처럼 차가워지고 뒤도 안 돌아보는 극단적인 면이 있잖아.',
  '丁': '친절하고 세심해 보이는데, 한 번 눈밖에 나거나 상처받으면 속으로 치밀하게 칼을 갈면서 절대 안 잊어버리는 무서운 집요함이 있지?',
  '戊': '묵직하고 믿음직해 보이지만, 사실 속으론 계산기 존나게 두드리면서 네가 손해 볼 짓은 벽 치고 완벽히 차단하지?',
  '己': '오지랖 넓고 사람들 잘 챙기는 척하지만, 마음속엔 철저하게 "내 사람"과 "그 외의 떨거지들"을 분류하는 무서운 이기심이 있지?',
  '庚': '맺고 끊는 거 엄청 확실하지? 일 못하거나 답답한 인간 곁에 두느니, 차라리 피곤해도 네가 다 총대 메고 쳐내는 성격 아냐?',
  '辛': '어떤 것에도 흠집 나기 싫은 예민함의 끝판왕. 남한테 피해 주기도, 받기도 싫어서 아주 뾰족하게 선 그어놓고 살고 있지?',
  '壬': '바다처럼 다 받아주는 넓은 아량의 소유자인 척하지만, 사실 속으론 사람들의 약점을 치밀하게 꿰뚫어 보고 통제하려 들지?',
  '癸': '겉으론 가장 여리고 순응하는 척 연기하지만, 머리 회전이 엄청나게 빨라서 뒤로 자기 실속은 가장 확실하게 챙기는 눈치 백단이잖아.'
};

const domQuestions: Record<string, string> = {
  '비겁': '네 진짜 성향 베이스는 "비겁(독립/경쟁)"이야. 남들 밑으로 기어들어가는 거 진저리나게 싫어해서 혼자 다 해먹어야 직성이 풀리지 않아?',
  '식상': '네 베이스는 "식상(표현/감정)"이야. 말 조심해야 한다는 거 알면서도, 답답한 꼴 보면 필터 안 거치고 팩폭부터 날리고 보지?',
  '재성': '넌 철저히 "재성(결과/이익)"에 지배당하고 있어. 과정은 1도 안 중요해. 무조건 "그래서 결과가 뭔데? 내 이익이 뭔데?" 이거부터 계산하지?',
  '관성': '넌 "관성(체면/책임)"의 노예야. 욕먹기 싫고 체면 구기는 거 싫어서 속이 썩어 문드러져도 남들 앞에서 완벽한 척 억지로 다 해내지?',
  '인성': '넌 "인성(사유/망상)"이 뇌를 지배했어. 머릿속으론 수백 번 우주 정복했는데 현실에선 피곤해서 침대에 영혼이 박혀있는 결정장애지?'
};

const familyReports: Record<string, string> = {
  '비겁': '가족과 거리를 두는 편견 없는 방관자. 핏줄이라는 이유만으로 희생하려 들지 않으며, 오히려 남보다 더 냉정하고 객관적으로 선을 긋습니다.',
  '식상': '내가 기분 내킬 때만 퍼주는 변덕스러운 산타. 내 방식대로 참견하고 잔소리하며, 가족이 내 뜻대로 움직여주지 않으면 화를 냅니다.',
  '재성': '현실적인 가치로 가족을 평가하는 지점장. 가족 내에서도 암묵적인 서열과 "누가 도움이 되는가"를 무의식적으로 재고 있습니다.',
  '관성': '가족을 위해 내 영혼을 갈아 넣는 노예이자 독재자. 책임감에 억눌려 헌신하지만, 그에 상응하는 인정과 통제권을 요구합니다.',
  '인성': '가족에게만 유독 기대고 징징대는 어른아이. 피곤하고 힘들 때면 외부의 모든 스트레스를 가족에게 배설하거나 유예시켜 버립니다.'
};

const shadowReports: Record<string, string> = {
  '비겁': '아무도 나를 돕지 않고 혼자 남겨질 것이라는 뼛속 깊은 고독감과 두려움.',
  '식상': '내가 내뱉은 말과 행동이 나의 모든 평판을 망칠지도 모른다는 밑도 끝도 없는 불안감.',
  '재성': '내 존재 가치를 "가진 것"으로만 증명할 수 있다는 강박, 빈털터리가 되면 버림받을 거라는 공포.',
  '관성': '사회적 틀에서 벗어나면 즉시 낙오자가 되어 손가락질 받을 것이라는 타인 시선에 대한 극심한 공포증.',
  '인성': '현실에서 아무것도 이룩하지 못한 채 머릿속에서만 살다 죽어버릴지 모른다는 허무주의와 도피욕구.'
};

const siblingReports: Record<string, string> = {
  '비겁': '피를 나눈 형제라도 철저하게 경쟁자로 인식합니다. 겉으로는 동등함을 유지하려 하지만 속으로는 무조건 내가 더 우위에 서야만 직성이 풀립니다.',
  '식상': '형제나 동료를 내 무대 위의 관객이거나 보살펴야 할 하위 존재로 인식합니다. 내가 주도적인 역할을 하며 리드해야 마음이 편안합니다.',
  '재성': '나에게 이익이 되는지, 손해를 끼치는지를 무의식적으로 먼저 잽니다. 쓸데없는 감정 소모를 싫어해 효율이 떨어지면 철저하게 거리를 둡니다.',
  '관성': '도덕과 원칙의 잣대를 들이대며 형제나 동료를 엄격하게 평가합니다. 자기가 가족 내의 올바른 모범이라 자부하며 남의 일탈을 경멸합니다.',
  '인성': '은근히 받기만 하려는 성향이 강히고 의존적입니다. 상대가 나를 양보하고 배려해 주는 것을 당연한 권리처럼 여기며 얄밉게 실속을 챙깁니다.'
};

const socialReports: Record<string, string> = {
  '비겁': '내 가치를 입증하기 위한 살벌한 전쟁터. 누구에게도 굽히기 싫어 겉으로는 여유로운 척하지만 속으로는 패배당하는 것을 끔찍하게 혐오하며 선을 긋습니다.',
  '식상': '내가 주인공이어야 하는 무대. 남들을 웃기고 즐겁게 해주지만 상대방의 리액션이 내 기대에 못 미치면 언제든 얼음장처럼 차갑게 돌변합니다.',
  '재성': '철저한 "기브 앤 테이크" 비즈니스 현장. 사람의 가치를 등급표 매기듯 분류하며, 영양가 없는 만남은 시간 낭비라 치부하고 가차 없이 끊어냅니다.',
  '관성': '내 체면과 평판을 방어하기 위한 방패막. "개념 있는 사람"으로 보이기 위해 속이 썩어 들어가도 가면을 쓴 채 가학적인 완벽주의로 인간관계를 버텨냅니다.',
  '인성': '기 빨리는 에너지 뱀파이어들의 소굴. 사람들과 있어도 언제나 영혼이 반쯤 로그아웃 되어 있으며 불편한 모든 책임을 타인에게 은근슬쩍 떠넘깁니다.'
};

const adviceReports: Record<string, string> = {
  '비겁': '네가 속으로 치고 있는 그 영리한 방어벽과 고집, 결국엔 아무도 네 진짜 옆에 남지 않게 만드는 무덤이다. 제발 가끔은 져주면서 살아라.',
  '식상': '너의 그 잘난 팩트 폭격은 타인을 구원하려는 게 아니라 네 통제 본능일 뿐이다. 남 참견할 시간에 빈약한 네 인내심이나 길러라.',
  '재성': '세상을 엑셀 파일로만 보다가 결국 네 장례식장에는 비즈니스 화환만 가득할 거다. 돈으로 살 수 없는 "비효율적인 낭만"을 허용하지 않으면 평생 고립된다.',
  '관성': '세상이 모두 네 잣대처럼 반듯해야 한다는 오만한 강박증이 널 병들게 한다. 남들 눈에 쓰레기처럼 보여도 좋으니, 제발 한 번쯤 숨통 트고 미친 척해봐라.',
  '인성': '겁이 나서 생각만 오만 번 돌리다가 늙어죽을 셈이냐? 완벽한 준비를 빙자한 그 기만적 나태함을 부수고 당장 깨져도 좋으니 현실 밖으로 튀어나와라.'
};

const spouseReportsYes: Record<string, string> = {
  '비겁': '사랑한다는 이유로 상대를 소유물 취급하며 고집을 꺾으려 듭니다. 겉으로는 동등한 파트너 같지만, 스위치가 눌리면 폭군처럼 통제권을 쥐려 발악합니다.',
  '식상': '다정하게 챙겨준다는 명목으로 하나부터 열까지 네 방식대로 잔소리하고 억압하며 숨막히게 만드는, 달콤한 껍데기를 쓴 가스라이팅 전문가입니다.',
  '재성': '관계를 비즈니스 파트너처럼 다루며 실질적인 손익과 조건에 과도하게 집착합니다. 효율을 앞세워 가장 연약하게 보듬어줘야 할 상대의 감정마저 도려내려 듭니다.',
  '관성': '"우리는 완벽한 커플이어야 해"라는 강박으로 상대의 작은 실수에도 도덕적 잣대를 들이대며 끊임없는 지적을 일삼는 숨 막히는 감시관입니다.',
  '인성': '수동적 공격과 고집으로 상대를 조종합니다. 말하지 않아도 다 알아주길 바라는 심보로 입을 한일자로 다물고 침묵 시위를 벌이며 숨막히게 옭아맵니다.'
};

const spouseReportsNo: Record<string, string> = {
  '비겁': '밖에서 잃어버린 자신의 존재감을 만만하게 생각하는 연인 앞에서 징징거리며 폭발시킵니다. "넌 무조건 내 편이잖아"라며 선을 마구 넘나듭니다.',
  '식상': '밖에서는 인싸 놀이 다 하고 들어와 연인 앞에서는 에너지가 고갈된 채, 짜증 섞인 감정 쓰레기통으로 사용하며 "내가 힘드니까 좀 받아줘"를 시전합니다.',
  '재성': '징징거리는 무해한 척을 하면서도 은근슬쩍 가장 값비싼 정신적 위로와 금전적 혜택을 쪽쪽 빨아먹는, 생존 본능만 남은 피도 눈물도 없는 기생충 같은 모습입니다.',
  '관성': '대외적으로는 존경받는 완벽한 사람인데, 연인 앞에서는 바닥 치는 자존감을 드러내며 끊임없이 가스라이팅을 통해 불안감을 위로받으려 징징거립니다.',
  '인성': '숨쉬는 것조차 연인에게 허락을 받을 기세로 책임을 떠넘깁니다. 세상에 홀로 남겨진 비운의 주인공처럼 매달려 상대의 에너지를 끝도 없이 고갈시킵니다.'
};

export function getNextNode(bazi: BaZiResult, targetName: string, answers: Record<string, string>): PersonaNode {
  // Parsing some basic stuff from bazi
  const dmStem = bazi.pillars[2]?.stem || '甲';
  const dmBranch = bazi.pillars[2]?.branch || '자';
  
  const dmStrengthScore = bazi.analysis?.dayMasterStrength?.score ?? 50;
  const isStrong = dmStrengthScore >= 50;

  const conflicts = bazi.analysis?.conflicts || [];
  const hasConflict = conflicts.length > 0;

  const dom = getDominantTenGodGroup(bazi);

  const yongShen = bazi.analysis?.yongShen || '도움';
  const idealTexts: Record<string, string> = {
    '목': '모든 제약에서 벗어나 나만의 길을 개척하고 성장하는 자유로운 선구자',
    '화': '스포트라이트를 한 몸에 받으며 세상의 중심에서 빛나고 지배하는 1인자',
    '토': '어떤 풍파에도 흔들리지 않고 모두가 내 발밑에서 평온하게 굴러가는 완벽한 안정감',
    '금': '감정에 휘둘리지 않고 모든 것을 완벽하게 결단하여 누구도 범접할 수 없는 차가운 기계',
    '수': '모든 비밀과 지혜를 통달하여 뒤에서 세상을 쥐락펴락하는 무소불위의 조종자'
  };
  const idealKey = Object.keys(idealTexts).find(k => yongShen.includes(k)) || '수';

  // Construct spouse text
  let spouseText = undefined;
  if (answers.marital !== 'single') {
    spouseText = answers.q_spouse === 'yes' ? spouseReportsYes[dom] : spouseReportsNo[dom];
  }

  // Construct children text
  let childrenText = undefined;
  if (answers.children === 'yes') {
    childrenText = '자녀를 내 인생의 연장선이나 트로피로 억압하려는 무의식이 숨어있습니다. 방목하는 척하지만 결정적인 순간에는 자신의 콤플렉스를 투사해 숨막히게 통제하려 들거나 자녀의 실패를 깊은 수치상처로 받아들입니다.';
  }

  // If all questions are answered, return the final persona report
  if (answers.q_shadow) {
    const familyBase = familyReports[dom] || familyReports['비겁'];
    const familyText = isStrong 
      ? familyBase.replace('방관자', '지배적 관찰자').replace('어른아이', '독선적 보호자')
      : familyBase.replace('방관자', '눈치 보는 외톨이').replace('산타', '애정 결핍 방랑자');

    const socialBase = socialReports[dom] || socialReports['비겁'];
    const socialText = isStrong
      ? socialBase + ' 주변을 압도하려는 기운 때문에 사람들이 당신의 눈치를 보게 만듭니다.'
      : socialBase + ' 상처받지 않기 위해 먼저 선을 긋지만, 사실은 누군가 먼저 다가오길 갈구하는 모순이 있습니다.';

    const adviceBase = adviceReports[dom] || adviceReports['비겁'];
    const adviceText = adviceBase + (hasConflict ? ' 특히 지금처럼 감정의 격랑이 심할 땐 제발 입부터 닫는 연습을 해라.' : ' 너무 무난하게 살려고 발버둥 치는 게 네 인생의 가장 큰 리스크다.');

    return {
      id: 'report',
      isEnd: true,
      report: {
        family: familyText,
        spouse: spouseText,
        children: childrenText,
        siblings: siblingReports[dom] || siblingReports['비겁'],
        social: socialText,
        ideal: idealTexts[idealKey],
        trueSelf: `${dmQuestions[dmStem] ? dmQuestions[dmStem].replace('{{target은는}} ', '').replace('?', '.') : '자기 자신을 가장 사랑하면서도 가장 혐오하는 모순적 존재.'}`,
        shadow: shadowReports[dom] || shadowReports['인성'],
        advice: adviceText
      }
    };
  }

  // Step 1: marital status
  if (!answers.marital) {
    return {
      id: 'marital',
      question: `먼저, ${targetName}의 무의식과 페르소나를 더 깊게 해부하기 위해 확인해볼게. 현재 결혼을 했거나 만나는 연인이 있어?`,
      options: [
        { id: 'married', label: '결혼했음 (배우자 있음)' },
        { id: 'dating', label: '연애 중 (연인 있음)' },
        { id: 'single', label: '솔로 (연인 없음)' }
      ]
    };
  }

  // Step 2: children status
  if (!answers.children) {
    return {
      id: 'children',
      question: `그렇구나. 그럼 행동 패턴의 강력한 변수가 될 수 있는 "자녀"는 있어?`,
      options: [
        { id: 'yes', label: '자녀 있음' },
        { id: 'no', label: '자녀 없음' }
      ]
    };
  }

  // Step 3: Day Master Core (Based on the DM Stem)
  if (!answers.q_dm) {
    return {
      id: 'q_dm',
      question: dmQuestions[dmStem] || dmQuestions['甲'],
      options: defaultOptions
    };
  }

  // Step 4: Strength Check
  if (!answers.q_strength) {
    const question = isStrong 
      ? `사주의 타고난 기운(일간)이 꽤 강하네. 너 겉으로는 남들 의견 묻는 척하지만 속으론 '어차피 내 맘대로 할 건데 굳이 왜 묻지?' 라고 생각하는 답정너 기질 심하지 않아?`
      : `사주의 기운을 보니 주변 환경에 영향을 많이 받는 예민보스네. 남들 눈치 안 본다고 쿨한 척 허세 부리면서도, 사실 밤에 누우면 '아까 그 사람 반응이 왜 그랬지?' 하고 이불킥하잖아.`;

    return {
      id: 'q_strength',
      question: question,
      options: defaultOptions
    };
  }

  // Step 5: Day Branch - Deep psychological traits using JiJi
  if (!answers.q_branch) {
    const isDohwa = ['자', '오', '묘', '유'].includes(dmBranch);
    const isYeokma = ['인', '신', '사', '해'].includes(dmBranch);
    // 화개: '진', '술', '축', '미' 
    let question = `일지(나의 내면 자리)에 화개(고독/사색) 기운이 짙게 깔려있네. 겉으론 사람들과 잘 어울리며 웃고 떠들지만, 사실 속으론 '다들 참 가볍다'고 생각하며 아무도 못 들어오는 너만의 딥한 지하 벙커에 숨어있지?`;
    
    if (isDohwa) {
      question = `너의 숨겨진 기운을 보니 일지에 도화(시선집중)가 깔려있네. 솔직히 남들이 적당히 우쭈쭈 해주며 관심 안 가져주면 은근히 서운하면서도, 막상 대놓고 나대기는 부끄러워하는 관종 아냐?`;
    } else if (isYeokma) {
      question = `너의 숨겨진 기운을 보니 일지에 역마(활동/변화)가 꿈틀대고 있어. 가만히 있으면 좀쑤시고 매너리즘에 빠져서, 여기저기 들쑤시고 다니며 판 다 벌려놓고 뒷수습은 슬쩍 남한테 미루는 타입 아냐?`;
    }

    return {
      id: 'q_branch',
      question: question,
      options: defaultOptions
    };
  }

  // Step 6: Dominant Trait
  if (!answers.q_dom) {
    const prefix = answers.q_dm === 'yes' ? '역시 내 데이터가 맞네. 게다가 ' : '아닐리가 없는데. 여튼 뼈대부터 하나하나 까볼게. ';
    return {
      id: 'q_dom',
      question: prefix + (domQuestions[dom] || domQuestions['비겁']),
      options: defaultOptions
    };
  }

  // Step 6.5: Element Balance Check
  if (!answers.q_element) {
    const elementRatios = bazi.analysis?.elementRatios || {};
    const overflow = Object.entries(elementRatios).find(([_, r]) => (r as number) > 40);
    const missing = Object.entries(elementRatios).find(([_, r]) => (r as number) === 0);
    
    let question = `오행의 흐름을 보니 에너지가 꽤 치우쳐 있네. 사실 넌 남들한텐 여유로운 척하지만, 실상은 아주 사소한 일에도 변덕이 심해서 스스로 피곤하게 만드는 스타일이지?`;
    if (overflow) {
      const el = overflow[0].split('(')[0];
      const elMsgs: Record<string, string> = {
        'Wood': '나무(木)의 기운이 너무 강해. 의욕만 앞서서 판만 존나게 벌려놓고, 정작 마무리는 흐지부지해서 주변 사람들 발암 걸리게 하는 타입 아냐?',
        'Fire': '불(火)의 기운이 폭발직전이야. 감정 조절 안 돼서 홧김에 내뱉은 말로 다 타버리게 만들고 나중에 혼자 후회하며 자책하는 거 일상이지?',
        'Earth': '흙(土)의 기운이 너무 무거워. 생각만 존나게 많고 행동으로 옮기기는 싫어서, 기회가 와도 "귀찮아" 한마디로 다 날려버리는 게으른 완벽주의자지?',
        'Metal': '금(金)의 기운이 날이 바짝 서 있어. 너 스스로한테도 타인한테도 너무 엄격해서, 숨 쉴 틈 없이 조여대다가 결국 관계 다 끊어먹는 칼잡이잖아.',
        'Water': '물(水)의 기운이 너무 깊어. 속을 도저히 알 수가 없어. 겉으론 웃고 있어도 속으론 음흉하게 딴생각하거나, 우울의 늪에 빠지면 답도 없이 잠수 타지?'
      };
      question = elMsgs[el] || question;
    } else if (missing) {
      question = `사주에 특정 기운이 아예 결여되어 있네. 그래서 넌 특정 상황만 되면 브레이크가 안 걸리고 제어 불능 상태가 돼서 남들이 보기에 "쟤 왜 저래?" 싶은 눈빛 받게 되는 거 아냐?`;
    }

    return {
      id: 'q_element',
      question: question,
      options: defaultOptions
    };
  }

  // Step 7: Conflicts / Clashes Check
  if (!answers.q_conflict) {
    const question = hasConflict
      ? `데이터를 더 파고드니까 충/형(충돌과 깨짐)의 에너지가 보이네. 너 평소엔 멘탈 좋은 척, 평온한 척하지만, 스위치 한 번 잘못 눌리면 눈 돌아서 판 다 엎어버리는 시한폭탄 같은 똘끼 장착하고 있지?`
      : `에너지 흐름이 꽤 평탄하게 이어지네. 근데 너는 그 평탄함 속에서 평화를 느끼기보단, '나만 너무 무난하게 무색무취로 사는 거 아닌가?' 하는 묘한 뒤쳐짐이나 강박에 시달리지 않아?`;
    
    return {
      id: 'q_conflict',
      question: question,
      options: defaultOptions
    };
  }

  // Step 8: Spouse Check (Skip if single)
  if (answers.marital !== 'single' && !answers.q_spouse) {
    return {
      id: 'q_spouse',
      question: `마지막으로 인간관계의 끝인 배우자궁(일지)을 볼게. 넌 연인 앞에서는 바운더리를 지키겠다며 무의식적으로 상대를 심하게 통제하려 들거나, 반대로 너무 방심해서 존나게 기대고 징징거리는 감정 쓰레기통으로 쓰지?`,
      options: defaultOptions
    };
  }

  // Step 9: Shadow Check
  if (!answers.q_shadow) {
    return {
      id: 'q_shadow',
      question: `정말 마지막 팩트폭격이야. 네 무의식의 가장 밑바닥, 사실 넌 다 귀찮고 모든 걸 리셋해서 아무도 모르는 곳으로 잠수 타고 싶은 욕망이 끓어오르는데, 남들에게 '무책임한 도망자'로 낙인 찍히는 그 알량한 체면 때문에 꾸역꾸역 버티고 있는 거 아니야?`,
      options: defaultOptions
    };
  }

  // Fallback return if we reach here (should not happen if q_shadow handles the end)
  return {
    id: 'report_fallback',
    isEnd: true,
    report: {
      family: familyReports[dom] || familyReports['비겁'],
      spouse: spouseText,
      children: childrenText,
      siblings: siblingReports[dom] || siblingReports['비겁'],
      social: socialReports[dom] || socialReports['비겁'],
      ideal: idealTexts[idealKey],
      trueSelf: `${dmQuestions[dmStem] ? dmQuestions[dmStem].replace('{{target은는}} ', '').replace('?', '.') : '자기 자신을 가장 사랑하면서도 가장 혐오하는 모순적 존재.'}`,
      shadow: shadowReports[dom] || shadowReports['인성'],
      advice: adviceReports[dom] || adviceReports['비겁']
    }
  };
}