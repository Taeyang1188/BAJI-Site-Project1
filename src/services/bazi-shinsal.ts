
export interface Shinsal {
  name: string;
  nameKo: string;
  basis: string;
  foundAt: string[];
  branches: string[];
  severity: "strong" | "present";
  note: string;
}

export interface Gongmang {
  branches: string[];
  affectedPillars: string[];
  inChart: boolean;
  note: string;
  noteEn: string;
}

const PILLAR_NAMES = ["시주", "일주", "월주", "년주"];

export function detectShinsal(stems: string[], branches: string[], yearStem: string, yearBranch: string, dayStem: string, dayBranch: string): { shinsal: Shinsal[], gongmang: Gongmang } {
  const shinsal: Shinsal[] = [];
  const dayPillar = `${dayStem}${dayBranch}`;
  const yearPillar = `${yearStem}${yearBranch}`;

  // 1. 12신살 (12 Special Stars) based on yearBranch
  const shinsal12Table: Record<string, string[]> = {
    '子': ['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'],
    '丑': ['午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳'],
    '寅': ['亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '미', '申', '酉', '戌'], // Note: 미 -> 未
    '卯': ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
    '辰': ['丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子'],
    '巳': ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'],
    '午': ['卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅'],
    '未': ['辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯'],
    '申': ['巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰'],
    '酉': ['午', '未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳'],
    '戌': ['未', '申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午'],
    '亥': ['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未']
  };

  // Correcting '寅' row in the table (미 -> 未)
  shinsal12Table['寅'] = ['亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌'];

  const shinsal12Names = ["겁살", "재살", "천살", "지살", "년살", "월살", "망신살", "장성살", "반안살", "역마살", "육해살", "화개살"];
  const shinsal12NamesKo = ["겁살(劫殺)", "재살(災殺)", "천살(天殺)", "지살(地殺)", "년살(年殺)", "월살(月殺)", "망신살(亡身殺)", "장성살(將星殺)", "반안살(攀鞍殺)", "역마살(驛馬殺)", "육해살(六害殺)", "화개살(華蓋殺)"];

  const yearBranchShinsalRow = shinsal12Table[yearBranch];
  if (yearBranchShinsalRow) {
    shinsal12Names.forEach((name, idx) => {
      const targetBranch = yearBranchShinsalRow[idx];
      const foundAt: string[] = [];
      const foundBranches: string[] = [];
      
      branches.forEach((b, bIdx) => {
        if (b === targetBranch) {
          foundAt.push(PILLAR_NAMES[bIdx]);
          foundBranches.push(b);
        }
      });

      if (foundAt.length > 0) {
        shinsal.push({
          name,
          nameKo: shinsal12NamesKo[idx],
          basis: "년지",
          foundAt,
          branches: foundBranches,
          severity: foundAt.length >= 2 ? "strong" : "present",
          note: `사주정설: ${name} 감지`
        });
      }
    });
  }

  // 2. 일간 기준 신살
  // 천을귀인 (Noble Guardian)
  const tianYi: Record<string, string[]> = {
    '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'],
    '乙': ['子', '申'], '己': ['子', '申'],
    '丙': ['亥', '酉'], '丁': ['亥', '酉'],
    '辛': ['寅', '午'],
    '壬': ['卯', '巳'], '癸': ['卯', '巳']
  };

  if (tianYi[dayStem]) {
    const foundAt: string[] = [];
    const foundBranches: string[] = [];
    branches.forEach((b, bIdx) => {
      if (tianYi[dayStem].includes(b)) {
        foundAt.push(PILLAR_NAMES[bIdx]);
        foundBranches.push(b);
      }
    });
    if (foundAt.length > 0) {
      shinsal.push({
        name: "천을귀인",
        nameKo: "천을귀인(天乙貴人)",
        basis: "일간",
        foundAt,
        branches: foundBranches,
        severity: foundAt.length >= 2 ? "strong" : "present",
        note: "최고의 길성이야. 어려움을 극복하게 도와줘."
      });
    }
  }

  // 문창귀인 (Literary Star)
  const moonChang: Record<string, string> = {
    '甲': '巳', '乙': '午', '丙': '申', '丁': '酉', '戊': '申', '己': '酉', '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯'
  };
  if (moonChang[dayStem]) {
    const target = moonChang[dayStem];
    const foundAt: string[] = [];
    const foundBranches: string[] = [];
    branches.forEach((b, bIdx) => {
      if (b === target) {
        foundAt.push(PILLAR_NAMES[bIdx]);
        foundBranches.push(b);
      }
    });
    if (foundAt.length > 0) {
      shinsal.push({
        name: "문창귀인",
        nameKo: "문창귀인(文昌貴人)",
        basis: "일간",
        foundAt,
        branches: foundBranches,
        severity: foundAt.length >= 2 ? "strong" : "present",
        note: "학문과 예술에 뛰어난 재능이 있어."
      });
    }
  }

  // 학당귀인 (Academy Star)
  const hakDang: Record<string, string> = {
    '甲': '亥', '乙': '午', '丙': '寅', '丁': '酉', '戊': '申', '己': '卯', '庚': '巳', '辛': '子', '壬': '申', '癸': '卯'
  };
  if (hakDang[dayStem]) {
    const target = hakDang[dayStem];
    const foundAt: string[] = [];
    const foundBranches: string[] = [];
    branches.forEach((b, bIdx) => {
      if (b === target) {
        foundAt.push(PILLAR_NAMES[bIdx]);
        foundBranches.push(b);
      }
    });
    if (foundAt.length > 0) {
      shinsal.push({
        name: "학당귀인",
        nameKo: "학당귀인(學堂貴人)",
        basis: "일간",
        foundAt,
        branches: foundBranches,
        severity: foundAt.length >= 2 ? "strong" : "present",
        note: "지적 능력이 뛰어나고 가르치는 일에 소질이 있어."
      });
    }
  }

  // 금여록 (Golden Carriage)
  const geumYeo: Record<string, string> = {
    '甲': '辰', '乙': '巳', '丙': '未', '丁': '申', '戊': '未', '己': '申', '庚': '戌', '辛': '亥', '壬': '丑', '癸': '寅'
  };
  if (geumYeo[dayStem]) {
    const target = geumYeo[dayStem];
    const foundAt: string[] = [];
    const foundBranches: string[] = [];
    branches.forEach((b, bIdx) => {
      if (b === target) {
        foundAt.push(PILLAR_NAMES[bIdx]);
        foundBranches.push(b);
      }
    });
    if (foundAt.length > 0) {
      shinsal.push({
        name: "금여록",
        nameKo: "금여록(金輿祿)",
        basis: "일간",
        foundAt,
        branches: foundBranches,
        severity: foundAt.length >= 2 ? "strong" : "present",
        note: "귀한 대접을 받고 안락한 삶을 살게 돼."
      });
    }
  }

  // 양인살 (Sheep Blade) - Yang stems only
  const yangIn: Record<string, string> = {
    '甲': '卯', '丙': '午', '戊': '午', '庚': '酉', '壬': '子'
  };
  if (yangIn[dayStem]) {
    const target = yangIn[dayStem];
    const foundAt: string[] = [];
    const foundBranches: string[] = [];
    branches.forEach((b, bIdx) => {
      if (b === target) {
        foundAt.push(PILLAR_NAMES[bIdx]);
        foundBranches.push(b);
      }
    });
    if (foundAt.length > 0) {
      shinsal.push({
        name: "양인살",
        nameKo: "양인살(羊刃殺)",
        basis: "일간",
        foundAt,
        branches: foundBranches,
        severity: foundAt.length >= 2 ? "strong" : "present",
        note: "강한 기질과 칼을 휘두르는 힘을 상징해."
      });
    }
  }

  // 3. 일주 기준 신살
  // 괴강살 (Kui Gang)
  const kuiGang = ['庚辰', '庚戌', '壬辰', '戊戌'];
  if (kuiGang.includes(dayPillar)) {
    shinsal.push({
      name: "괴강살",
      nameKo: "괴강살(魁罡殺)",
      basis: "일주",
      foundAt: ["일주"],
      branches: [dayBranch],
      severity: "present",
      note: "강력한 카리스마와 리더십을 의미해."
    });
  }

  // 고란살 (Solitary Phoenix)
  const goRan = ['甲寅', '乙巳', '丁巳', '戊申', '辛亥'];
  if (goRan.includes(dayPillar)) {
    shinsal.push({
      name: "고란살",
      nameKo: "고란살(孤鸞殺)",
      basis: "일주",
      foundAt: ["일주"],
      branches: [dayBranch],
      severity: "present",
      note: "독립심이 강하고 스스로 일어설 힘이 있어."
    });
  }

  // 4. 원국 전체 구성 신살
  // 귀문관살 (Ghost Gate)
  const guiMenPairs = [['子', '酉'], ['丑', '午'], ['寅', '未'], ['卯', '申'], ['辰', '亥'], ['巳', '戌']];
  const foundGuiMen: string[] = [];
  guiMenPairs.forEach(pair => {
    if (branches.includes(pair[0]) && branches.includes(pair[1])) {
      foundGuiMen.push(`${pair[0]}-${pair[1]}`);
    }
  });
  if (foundGuiMen.length > 0) {
    shinsal.push({
      name: "귀문관살",
      nameKo: "귀문관살(鬼門關殺)",
      basis: "지합",
      foundAt: ["원국"],
      branches: branches.filter(b => foundGuiMen.some(p => p.includes(b))),
      severity: "present",
      note: "집요함과 천재적 영감, 고도의 집중력을 상징해."
    });
  }

  // 원진살 (Resentment Star)
  const wonJinPairs = [['子', '未'], ['丑', '午'], ['寅', '酉'], ['卯', '申'], ['辰', '亥'], ['巳', '戌']];
  const foundWonJin: string[] = [];
  wonJinPairs.forEach(pair => {
    if (branches.includes(pair[0]) && branches.includes(pair[1])) {
      foundWonJin.push(`${pair[0]}-${pair[1]}`);
    }
  });
  if (foundWonJin.length > 0) {
    shinsal.push({
      name: "원진살",
      nameKo: "원진살(元嗔殺)",
      basis: "지합",
      foundAt: ["원국"],
      branches: branches.filter(b => foundWonJin.some(p => p.includes(b))),
      severity: "present",
      note: "복잡한 인간관계와 깊은 감수성을 의미해."
    });
  }

  // 현침살 (Dangling Needle)
  const hyeonChimChars = ['甲', '辛', '卯', '午', '申'];
  const foundHyeonChimAt: string[] = [];
  const foundHyeonChimChars: string[] = [];
  stems.forEach((s, i) => {
    if (hyeonChimChars.includes(s)) {
      foundHyeonChimAt.push(PILLAR_NAMES[i]);
      foundHyeonChimChars.push(s);
    }
  });
  branches.forEach((b, i) => {
    if (hyeonChimChars.includes(b)) {
      foundHyeonChimAt.push(PILLAR_NAMES[i]);
      foundHyeonChimChars.push(b);
    }
  });
  if (foundHyeonChimAt.length >= 3) {
    shinsal.push({
      name: "현침살",
      nameKo: "현침살(懸針殺)",
      basis: "원국",
      foundAt: [...new Set(foundHyeonChimAt)],
      branches: branches.filter(b => hyeonChimChars.includes(b)),
      severity: foundHyeonChimAt.length >= 4 ? "strong" : "present",
      note: "날카로운 통찰력과 전문적인 기술을 상징해."
    });
  }

  // 탕화살 (Scalding Fire)
  const tangHwaMap: Record<string, string[]> = {
    '寅': ['寅', '巳', '申'],
    '午': ['午', '辰', '丑'],
    '丑': ['丑', '戌', '未']
  };
  if (tangHwaMap[dayBranch]) {
    const targets = tangHwaMap[dayBranch];
    const foundAt: string[] = [];
    branches.forEach((b, i) => {
      if (targets.includes(b)) {
        foundAt.push(PILLAR_NAMES[i]);
      }
    });
    if (foundAt.length >= 2) {
      shinsal.push({
        name: "탕화살",
        nameKo: "탕화살(湯火殺)",
        basis: "일지",
        foundAt,
        branches: branches.filter(b => targets.includes(b)),
        severity: foundAt.length >= 3 ? "strong" : "present",
        note: "욱하는 기질과 열정적인 변화를 의미해."
      });
    }
  }

  // 고신살 & 과숙살 (Solitary God & Widow Star)
  const solitaryMap: Record<string, { goShin: string, gwaSuk: string }> = {
    '寅': { goShin: '巳', gwaSuk: '丑' }, '卯': { goShin: '巳', gwaSuk: '丑' }, '辰': { goShin: '巳', gwaSuk: '丑' },
    '巳': { goShin: '申', gwaSuk: '辰' }, '午': { goShin: '申', gwaSuk: '辰' }, '未': { goShin: '申', gwaSuk: '辰' },
    '申': { goShin: '亥', gwaSuk: '未' }, '酉': { goShin: '亥', gwaSuk: '未' }, '戌': { goShin: '亥', gwaSuk: '未' },
    '亥': { goShin: '寅', gwaSuk: '戌' }, '子': { goShin: '寅', gwaSuk: '戌' }, '丑': { goShin: '寅', gwaSuk: '戌' }
  };
  const sol = solitaryMap[yearBranch];
  if (sol) {
    if (branches.includes(sol.goShin)) {
      shinsal.push({
        name: "고신살",
        nameKo: "고신살(孤神殺)",
        basis: "년지",
        foundAt: branches.map((b, i) => b === sol.goShin ? PILLAR_NAMES[i] : "").filter(Boolean),
        branches: [sol.goShin],
        severity: "present",
        note: "자발적 고독과 내면의 탐구를 상징해."
      });
    }
    if (branches.includes(sol.gwaSuk)) {
      shinsal.push({
        name: "과숙살",
        nameKo: "과숙살(寡宿殺)",
        basis: "년지",
        foundAt: branches.map((b, i) => b === sol.gwaSuk ? PILLAR_NAMES[i] : "").filter(Boolean),
        branches: [sol.gwaSuk],
        severity: "present",
        note: "자기 주도적 삶과 독립성을 의미해."
      });
    }
  }

  // 태극귀인 (Great Polarity)
  const taiJi: Record<string, string[]> = {
    '甲': ['子', '午'], '乙': ['子', '午'],
    '丙': ['卯', '酉'], '丁': ['卯', '酉'],
    '戊': ['辰', '戌', '丑', '未'], '己': ['辰', '戌', '丑', '未'],
    '庚': ['寅', '亥'], '辛': ['寅', '亥'],
    '壬': ['巳', '申'], '癸': ['巳', '申']
  };
  if (taiJi[dayStem]) {
    const targets = taiJi[dayStem];
    const foundAt: string[] = [];
    branches.forEach((b, i) => {
      if (targets.includes(b)) foundAt.push(PILLAR_NAMES[i]);
    });
    if (foundAt.length > 0) {
      shinsal.push({
        name: "태극귀인",
        nameKo: "태극귀인(太極貴人)",
        basis: "일간",
        foundAt,
        branches: branches.filter(b => targets.includes(b)),
        severity: "present",
        note: "시작과 끝이 좋고 큰 복록을 누리게 돼."
      });
    }
  }

  // 암록 (Hidden Prosperity)
  const anLu: Record<string, string> = {
    '甲': '亥', '乙': '戌', '丙': '申', '丁': '未', '戊': '申', '己': '未', '庚': '巳', '辛': '辰', '壬': '寅', '癸': '丑'
  };
  if (anLu[dayStem]) {
    const target = anLu[dayStem];
    const foundAt: string[] = [];
    branches.forEach((b, i) => {
      if (b === target) foundAt.push(PILLAR_NAMES[i]);
    });
    if (foundAt.length > 0) {
      shinsal.push({
        name: "암록",
        nameKo: "암록(暗祿)",
        basis: "일간",
        foundAt,
        branches: [target],
        severity: "present",
        note: "보이지 않는 도움과 예상치 못한 횡재를 의미해."
      });
    }
  }

  // 천덕귀인 (Heavenly Virtue)
  const monthBranch = branches[1]; // 월지
  const tianDeMap: Record<string, string> = {
    '子': '巳', '丑': '庚', '寅': '丁', '卯': '申', '辰': '壬', '巳': '辛',
    '午': '亥', '未': '甲', '申': '癸', '酉': '寅', '戌': '丙', '亥': '乙'
  };
  if (tianDeMap[monthBranch]) {
    const target = tianDeMap[monthBranch];
    const foundAt: string[] = [];
    stems.forEach((s, i) => { if (s === target) foundAt.push(PILLAR_NAMES[i]); });
    branches.forEach((b, i) => { if (b === target) foundAt.push(PILLAR_NAMES[i]); });
    if (foundAt.length > 0) {
      shinsal.push({
        name: "천덕귀인",
        nameKo: "천덕귀인(天德貴人)",
        basis: "월지",
        foundAt,
        branches: branches.filter(b => b === target),
        severity: "present",
        note: "하늘의 보살핌으로 흉한 일이 길하게 변해."
      });
    }
  }

  // 월덕귀인 (Monthly Virtue)
  const yueDeMap: Record<string, string> = {
    '寅': '丙', '午': '丙', '戌': '丙',
    '亥': '甲', '卯': '甲', '未': '甲',
    '申': '壬', '子': '壬', '辰': '壬',
    '巳': '庚', '酉': '庚', '丑': '庚'
  };
  if (yueDeMap[monthBranch]) {
    const target = yueDeMap[monthBranch];
    const foundAt: string[] = [];
    stems.forEach((s, i) => { if (s === target) foundAt.push(PILLAR_NAMES[i]); });
    if (foundAt.length > 0) {
      shinsal.push({
        name: "월덕귀인",
        nameKo: "월덕귀인(月德貴人)",
        basis: "월지",
        foundAt,
        branches: [],
        severity: "present",
        note: "매사 순조롭고 인복이 두터운 기운이야."
      });
    }
  }

  // 백호대살 (White Tiger)
  const baiHu = ['甲辰', '乙未', '丙戌', '丁丑', '戊辰', '己丑', '庚戌', '辛미', '壬진', '癸축', '甲술', '壬술']; // Correcting typos
  const baiHuCorrected = ['甲辰', '乙未', '丙戌', '丁丑', '戊辰', '己丑', '庚戌', '辛未', '壬辰', '癸丑', '甲戌', '壬戌'];
  
  // Check all pillars for White Tiger
  stems.forEach((s, idx) => {
    const pillar = `${s}${branches[idx]}`;
    if (baiHuCorrected.includes(pillar)) {
      shinsal.push({
        name: "백호대살",
        nameKo: "백호대살(白虎大殺)",
        basis: "주별",
        foundAt: [PILLAR_NAMES[idx]],
        branches: [branches[idx]],
        severity: "present",
        note: "강한 에너지와 갑작스러운 변화를 상징해."
      });
    }
  });

  // 일귀 (Day Noble)
  const ilGui = ['丁亥', '丁酉', '癸巳', '癸卯'];
  if (ilGui.includes(dayPillar)) {
    shinsal.push({
      name: "일귀",
      nameKo: "일귀(日貴)",
      basis: "일주",
      foundAt: ["일주"],
      branches: [dayBranch],
      severity: "present",
      note: "품격이 높고 귀한 인품을 상징해."
    });
  }

  // 일덕 (Day Virtue)
  const ilDeok = ['甲寅', '丙辰', '戊辰', '庚辰', '壬戌'];
  if (ilDeok.includes(dayPillar)) {
    shinsal.push({
      name: "일덕",
      nameKo: "일덕(日德)",
      basis: "일주",
      foundAt: ["일주"],
      branches: [dayBranch],
      severity: "present",
      note: "자비롭고 덕망이 높은 성품이야."
    });
  }

  // 4. 공망 (Void)
  const gapJaSun: Record<string, string[]> = {
    '甲子': ['戌', '亥'], '乙丑': ['戌', '亥'], '丙寅': ['戌', '亥'], '丁卯': ['戌', '亥'], '戊辰': ['戌', '亥'], '己巳': ['戌', '亥'], '庚午': ['戌', '亥'], '辛未': ['戌', '亥'], '壬申': ['戌', '亥'], '癸酉': ['戌', '亥'],
    '甲戌': ['申', '酉'], '乙亥': ['申', '酉'], '丙子': ['申', '酉'], '丁丑': ['申', '酉'], '戊寅': ['申', '酉'], '己卯': ['申', '酉'], '庚辰': ['申', '酉'], '辛巳': ['申', '酉'], '壬午': ['申', '酉'], '癸未': ['申', '酉'],
    '甲申': ['午', '未'], '乙酉': ['午', '未'], '丙戌': ['午', '未'], '丁亥': ['午', '未'], '戊子': ['午', '未'], '己丑': ['午', '未'], '庚寅': ['午', '未'], '辛卯': ['午', '未'], '壬辰': ['午', '未'], '癸巳': ['午', '未'],
    '甲午': ['辰', '巳'], '乙未': ['辰', '巳'], '丙申': ['辰', '巳'], '丁酉': ['辰', '巳'], '戊戌': ['辰', '巳'], '己亥': ['辰', '巳'], '庚子': ['辰', '巳'], '辛丑': ['辰', '巳'], '壬寅': ['辰', '巳'], '癸卯': ['辰', '巳'],
    '甲辰': ['寅', '卯'], '乙巳': ['寅', '卯'], '丙午': ['寅', '卯'], '丁未': ['寅', '卯'], '戊申': ['寅', '卯'], '己酉': ['寅', '卯'], '庚戌': ['寅', '卯'], '辛亥': ['寅', '卯'], '壬子': ['寅', '卯'], '癸丑': ['寅', '卯'],
    '甲寅': ['子', '丑'], '乙卯': ['子', '丑'], '丙辰': ['子', '丑'], '丁巳': ['子', '丑'], '戊午': ['子', '丑'], '己未': ['子', '丑'], '庚申': ['子', '丑'], '辛酉': ['子', '丑'], '壬戌': ['子', '丑'], '癸亥': ['子', '丑']
  };

  const gongmangBranches = gapJaSun[dayPillar] || [];
  const affectedPillars: string[] = [];
  branches.forEach((b, idx) => {
    if (idx !== 1 && gongmangBranches.includes(b)) { // 년지, 월지, 시지 체크 (일지 제외)
      affectedPillars.push(PILLAR_NAMES[idx]);
    }
  });

  const inChart = affectedPillars.length > 0;
  let note = "";
  let noteEn = "";

  if (!inChart) {
    note = `공망에 해당하는 글자(${gongmangBranches.join(', ')})가 사주 원국에 없으므로 실질적인 공망의 피해나 영향이 거의 없어. 다만, 대운이나 세운에서 이 글자가 들어올 때는 해당 시기에 일시적인 지연이나 채워지지 않는 갈증을 느낄 수 있어.`;
    noteEn = `The Void branches (${gongmangBranches.join(', ')}) are not present in your natal chart, so their practical negative impact is minimal. However, when these branches appear in your Grand Cycle (Daewun) or Annual Cycle (Sewun), you may experience temporary delays or a sense of unfulfillment during that period.`;
  } else {
    note = `사주 원국의 ${affectedPillars.join(', ')}에 공망이 있어 해당 궁성이나 십성의 기운이 약화되거나 채워지지 않는 갈증을 느낄 수 있어.`;
    noteEn = `The Void branches affect your ${affectedPillars.join(', ')}, which may weaken the energy of those pillars or create a sense of unfulfillment in related aspects of life.`;
  }

  return { 
    shinsal, 
    gongmang: { 
      branches: gongmangBranches, 
      affectedPillars,
      inChart,
      note,
      noteEn
    } 
  };
}
