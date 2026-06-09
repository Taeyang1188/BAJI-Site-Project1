import fs from 'fs';

let content = fs.readFileSync('src/data/ilju-dataset.ts', 'utf8');

// Replacements
content = content.replace(/"신비주의 뱀파이어"/g, '"심오한 구도자"');
content = content.replace(/"Mystic Cyber-Vampire"/g, '"Mystic Seeker"');

content = content.replace(/"네온 불빛조차 닿지 않는 지하 세계에서/g, '"한 줄기 빛조차 닿지 않는 심해에서');

content = content.replace(/"용광로 속에서 담금질되는 은빛 사이보그"/g, '"용광로 속에서 맹렬히 담금질되는 명검"');

content = content.replace(/"차디찬 해커"/g, '"냉철한 승부사"');

content = content.replace(/"사이버틱한 결벽주의자"/g, '"결벽증적 완벽주의자"');
content = content.replace(/"Crystal Assassin"/g, '"Crystal Purist"');

content = content.replace(/"칠흑 같은 호수 위를 비추는 네온사인"/g, '"칠흑 같은 호수 위를 비추는 은은한 등대"');

content = content.replace(/"차가운 금속 제국을 정복하려는 강박적 해커"/g, '"차가운 금속의 벽을 뚫고 뿌리내리려는 강박적 개척자"');

content = content.replace(/"차가운 면도날 위에 피어난 네온빛 덩굴"/g, '"차가운 바위 위에 피어난 끈질긴 덩굴"');

content = content.replace(/"정교한 사이보그"/g, '"섬세한 승부사"');
content = content.replace(/"Delicate Assassin"/g, '"Delicate Strategist"');

content = content.replace(/네온 덩굴들 사이에서/g, '가시덩굴들 사이에서');
content = content.replace(/해커의 밤/g, '은둔의 밤');

content = content.replace(/"A beautifully fragile flower growing directly out of a sterile, razor-sharp surgical blade. An aesthetic of painful perfection, balancing on the edge of destruction."/g, '"A resilient flower blooming over cold stones, projecting an aesthetic of sharp perfection."');
content = content.replace(/"무자비한 기계 도시에 홀로 뿌리내린 채, 가장 날카롭고 서늘한 생명력을 내뿜는 신경질적 미학자"/g, '"서늘한 현실 위에 뿌리내린 채, 흔들림 없이 가장 예리한 생명력을 뽐내는 고고한 미학자"');


// Also Mu-in (戊寅) update according to the user: '태산을 지키는 영험한 호랑이' "A mystical tiger guarding a great mountain"
content = content.replace(/"Untamed Sovereign"/g, '"Mystical Guardian"');
content = content.replace(/"A massive, unmoving mountain surrounded by a chaotic, roaring jungle filled with predators\. Extreme, stoic stubbornness clashing with wild, violent energy\."/g, '"A mystical tiger guarding a great mountain. Noble, fierce, yet anchored to unwavering stability."');
content = content.replace(/"약육강식의 야생 정글 한가운데 솟아오른 웅장하고 미동조차 없는 거대 바위산"/g, '"태산을 지키는 영험한 호랑이"');


fs.writeFileSync('src/data/ilju-dataset.ts', content, 'utf8');
