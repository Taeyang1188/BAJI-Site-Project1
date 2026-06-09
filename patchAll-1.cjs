const fs = require('fs');
const file = 'src/components/BaZiResultPage.tsx';
let code = fs.readFileSync(file, 'utf8');

// For level == 'full'
code = code.replace(
  /detailTxtKo = '두 글자 혹은 세 글자의 조화가 완벽하게 결합되었습니다\. 이로 인해 사주의 주된 기류가 이 주파수로 정렬되어, 견고한 동맹적 가치, 사회적 목적 완수, 일관된 방향성 및 뚜렷한 리더십이 탄탄한 근간을 이루며 작동하고 있습니다\.';/g,
  "detailTxtKo = `두 글자 혹은 세 글자의 조화(${remoteBranchesStr})가 완벽하게 결합되었습니다. 이로 인해 사주의 주된 기류가 이 주파수로 정렬되어, 견고한 동맹적 가치, 사회적 목적 완수, 일관된 방향성 및 뚜렷한 리더십이 탄탄한 근간을 이루며 작동하고 있습니다.`;"
);
code = code.replace(
  /detailTxtEn = 'The complete combination exists in your chart, aligning your path with strong collaborative values, solid goals, and consistent leadership\.';/g,
  "detailTxtEn = `The complete combination (${remoteBranchesStrEn}) exists in your chart, aligning your path with strong collaborative values, solid goals, and consistent leadership.`;"
);

// For level == 'half' (this is where the user specifically pointed out)
code = code.replace(
  /detailTxtKo = '합의 핵심 왕지\(왕을 상징하는 자오묘유\)를 포함한 두 글자가 결합하여 엔진 축이 힘차게 돌아가고 있습니다\. 향후 대운이나 세운에서 나머지 한 글자가 더해지면 강력하고 폭발적인 기세의 창조적 행보와 시너지가 전면에 펼쳐지게 됩니다\.';/g,
  "detailTxtKo = `합의 핵심 왕지(왕을 상징하는 자오묘유)를 포함한 두 글자(${remoteBranchesStr})가 결합하여 엔진 축이 힘차게 돌아가고 있습니다. 향후 대운이나 세운에서 나머지 한 글자가 더해지면 강력하고 폭발적인 기세의 창조적 행보와 시너지가 전면에 펼쳐지게 됩니다.`;"
);
code = code.replace(
  /detailTxtEn = 'Crucial partial combination is active\. When the complementing element arrives in transits, highly vibrant expansion and opportunities will be unlocked\.';/g,
  "detailTxtEn = `Crucial partial combination (${remoteBranchesStrEn}) is active. When the complementing element arrives in transits, highly vibrant expansion and opportunities will be unlocked.`;"
);

// For level == 'clash_full' > isClash
code = code.replace(
  /detailTxtKo = \`가장 인접한 두 기둥의 지지가 서로를 정면으로 충돌\(\$\{actualName\}\)하여/g,
  "detailTxtKo = `가장 인접한 두 기둥의 지지(${remoteBranchesStr})가 서로를 정면으로 충돌(${actualName})하여"
);

// For level == 'clash_full' > isHyeong
code = code.replace(
  /사주원국에서 강력하게 매칭된 형살\(\$\{actualName\}\)의 압박과 조율 능력이 직접 작동하고 있습니다\./g,
  "사주원국에서 강력하게 매칭된 형살(${remoteBranchesStr}, ${actualName})의 압박과 조율 능력이 직접 작동하고 있습니다."
);

// For level == 'clash_full' > isPa
code = code.replace(
  /미세한 조정과 수정을 상징하는 파살\(\$\{actualName\}\)이 강력히 발현되어 있습니다\./g,
  "미세한 조정과 수정을 상징하는 파살(${remoteBranchesStr}, ${actualName})이 강력히 발현되어 있습니다."
);

// For level == 'clash_full' > isHae
code = code.replace(
  /방해 요소나 대인관계의 피로감을 다스리는 해살\(\$\{actualName\}\)의 주파수가 위치합니다\./g,
  "방해 요소나 대인관계의 피로감을 다스리는 해살(${remoteBranchesStr}, ${actualName})의 주파수가 위치합니다."
);


// For level == 'clash_half' > isClash
code = code.replace(
  /한 기둥을 건너뛰어 성립한 격충\(\$\{actualName\}\) 또는 중간 수준의 마찰입니다\./g,
  "한 기둥을 건너뛰어 성립한 격충(${remoteBranchesStr}, ${actualName}) 또는 중간 수준의 마찰입니다."
);

// For level == 'clash_half' > isHyeong
code = code.replace(
  /일부 지지가 맞춰져 성립한 형살\(\$\{actualName\}\)의 조율 주파수가 감지됩니다\./g,
  "일부 지지가 맞춰져 성립한 형살(${remoteBranchesStr}, ${actualName})의 조율 주파수가 감지됩니다."
);

// For level == 'clash_half' > isPa
code = code.replace(
  /기 흘러가는 과정에 얽힌 파살\(\$\{actualName\}\)의 보정 기능이 작동하고 있습니다\./g,
  "기 흘러가는 과정에 얽힌 파살(${remoteBranchesStr}, ${actualName})의 보정 기능이 작동하고 있습니다."
);

// For level == 'clash_half' > isHae
code = code.replace(
  /영역 간의 경계를 짓는 해살\(\$\{actualName\}\)의 정진력이 흐릅니다\./g,
  "영역 간의 경계를 짓는 해살(${remoteBranchesStr}, ${actualName})의 정진력이 흐릅니다."
);


// For level === 'remote' (etc) > isHyeong
code = code.replace(
  /멀리 떨어져서 작용하는 원격 형살\(\$\{actualName\}\)입니다\./g,
  "멀리 떨어져서 작용하는 원격 형살(${remoteBranchesStr}, ${actualName})입니다."
);
code = code.replace(
  /두 기둥 건너 원격으로 위치한 보정용 파살\(\$\{actualName\}\)입니다\./g,
  "두 기둥 건너 원격으로 위치한 보정용 파살(${remoteBranchesStr}, ${actualName})입니다."
);
code = code.replace(
  /원격으로 배치된 해살\(\$\{actualName\}\)의 기운이 감지됩니다\./g,
  "원격으로 배치된 해살(${remoteBranchesStr}, ${actualName})의 기운이 감지됩니다."
);


fs.writeFileSync(file, code);
console.log('done modifying interactions texts');
