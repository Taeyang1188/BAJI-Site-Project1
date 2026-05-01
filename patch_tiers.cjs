const fs = require('fs');
const content = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf8');

const regexIsTier1 = /const isTier1 = \(name: string\) => \{[^\}]+\};/g;
const newIsTier1 = `const isTier1 = (name: string) => {
                return name.includes('파멸적') || name.includes('맹독') || name.includes('파괴적') || 
                       name.includes('크로스 카르마') || name.includes('Black Hole') || 
                       name.includes('매혹적인 덫') || name.includes('폭주하는 엔진') || 
                       name.includes('구속') || name.includes('Shattered Glass') ||
                       name.includes('동갑이라서 더 답답한') || name.includes('희생적 합성') || 
                       name.includes('Slow Poison') || name.includes('정화') || 
                       name.includes('위험하지만 매력적인') || name.includes('The Alchemist') ||
                       name.includes('골든 에너지') || name.includes('사약의 완성') || name.includes('맹독성 주입') ||
                       name.includes('심연의 연금술');
            };`;

const regexIsTier2 = /const isTier2 = \(name: string\) => \{[^\}]+\};/g;
const newIsTier2 = `const isTier2 = (name: string) => {
                return name.includes('형살') || name.includes('에너지 협력') || name.includes('에너지 공명') || 
                       name.includes('충') || name.includes('The Great') || name.includes('The Deep') || 
                       name.includes('The Iron') || name.includes('정신적 결속') || name.includes('주파수 동조') || 
                       name.includes('창과 방패') || name.includes('극성 조화') || name.includes('이성적인 모순') ||
                       name.includes('운명의 조력') || name.includes('기적의 조각') || name.includes('에너지 과부하') ||
                       name.includes('희생의 제단');
            };`;

let newContent = content.replace(regexIsTier1, newIsTier1);
newContent = newContent.replace(regexIsTier2, newIsTier2);

if (newContent !== content) {
    fs.writeFileSync('src/services/relationship-dynamics-service.ts', newContent);
    console.log('TIER_PATCH_SUCCESS');
} else {
    console.log('TIER_PATTERN_NOT_FOUND');
}
