import * as fs from 'fs';
import { resolve } from 'path';

let dataStr = fs.readFileSync(resolve('src/data/ilju-dataset.ts'), 'utf-8');

dataStr = dataStr.replace(
  /"ko": "가차 없는 억압 속에서도 미친 듯이 뿌리를 뻗치며 구조물 자체를 부식시키는 끈질긴 생명력의 반역자"/,
  '"ko": "가차 없는 억압 속에서도 콘크리트를 뚫고 자라나 결국 구조물을 부수고 마는 끈질긴 생명력의 독초"'
);
dataStr = dataStr.replace(
  /"ko": "불타는 집행관"/g,
  '"ko": "불타는 은빛 가시"'
);
dataStr = dataStr.replace(
  /"ko": "지독한 압박이 도리어 당신을 눈부시게 세공합니다. 서늘한 이성과 치명적 독기를 숨긴 채 적재적소에 파고드는 승부사입니다."/g,
  '"ko": "지독한 압박이 도리어 당신을 눈부시게 세공합니다. 바위 틈새에서 가장 날카롭게 자라난 은빛 가시처럼 치명적인 자리를 파고듭니다."'
);
dataStr = dataStr.replace(
  /"ko": "결코 섞이지 않는 불과 물의 모순을 무기로 삼아, 매혹적이고 기만적으로 판을 흔드는 처세술의 스나이퍼입니다."/g,
  '"ko": "결코 섞이지 않는 불과 물의 극한 모순을 이겨내고, 예측할 수 없이 은밀하게 목표를 타격하는 심연의 난초입니다."'
);
dataStr = dataStr.replace(
  /"ko": "차가운 파괴자"/g,
  '"ko": "서늘한 독가시"'
);
dataStr = dataStr.replace(
  /"ko": "동토의 집행관"/g,
  '"ko": "혹한의 바위산"'
);
dataStr = dataStr.replace(
  /"ko": "수줍고 예민한 미소 뒤에, 철저히 조율된 타겟 스코프와 가차 없는 독을 감춘 매혹적인 스나이퍼"/g,
  '"ko": "수줍고 여린 모습 뒤에, 독을 머금고 은밀하게 바위 틈새로 파고드는 날카로운 난초"'
);
dataStr = dataStr.replace(
  /"ko": "거대하고 과묵한 암벽 아래서 가장 치명적이고 은밀한 정보\(수맥\)를 조종하는 속을 알 수 없는 마스터"/g,
  '"ko": "거대하고 과묵한 암벽 아래서 가장 치명적이고 은밀하게 물결을 일으키는 짙은 심연"'
);
dataStr = dataStr.replace(
  /"ko": "절대적 파괴자"/g,
  '"ko": "초원의 들불"'
);
dataStr = dataStr.replace(
  /"ko": "은밀한 반역자"/g,
  '"ko": "가시 돋친 덩굴"'
);

fs.writeFileSync(resolve('src/data/ilju-dataset.ts'), dataStr, 'utf-8');
console.log('Fixed V5 tones');
