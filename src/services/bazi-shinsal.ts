
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

  const shinsal12Names = ["겁살", "재살", "천살", "지살", "년살", "월살", "망신", "장성", "반안", "역마", "육해", "화개"];
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
        note: "최고의 길성, 어려움을 극복하게 함"
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
        note: "학문과 예술에 재능이 있음"
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
        note: "지적 능력이 뛰어나고 교육에 소질"
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
        note: "귀한 대접을 받고 안락한 삶"
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
        note: "강한 기질, 칼을 휘두르는 힘"
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
      note: "강력한 카리스마와 리더십"
    });
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
        note: "강한 에너지, 갑작스러운 변화"
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
      note: "품격이 높고 귀한 인품"
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
      note: "자비롭고 덕망이 높음"
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

  const gongmangBranches = gapJaSun[yearPillar] || [];
  const affectedPillars: string[] = [];
  branches.forEach((b, idx) => {
    if (idx < 3 && gongmangBranches.includes(b)) { // 일지, 월지, 시지 체크
      affectedPillars.push(PILLAR_NAMES[idx]);
    }
  });

  const inChart = affectedPillars.length > 0;
  let note = "";
  let noteEn = "";

  if (!inChart) {
    note = `공망에 해당하는 글자(${gongmangBranches.join(', ')})가 사주 원국에 없으므로 실질적인 공망의 피해나 영향이 거의 없습니다. 다만, 대운이나 세운에서 이 글자가 들어올 때는 해당 시기에 일시적인 지연이나 채워지지 않는 갈증을 느낄 수 있습니다.`;
    noteEn = `The Void branches (${gongmangBranches.join(', ')}) are not present in your natal chart, so their practical negative impact is minimal. However, when these branches appear in your Grand Cycle (Daewun) or Annual Cycle (Sewun), you may experience temporary delays or a sense of unfulfillment during that period.`;
  } else {
    note = `사주 원국의 ${affectedPillars.join(', ')}에 공망이 있어 해당 궁성이나 십성의 기운이 약화되거나 채워지지 않는 갈증을 느낄 수 있습니다.`;
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
