import fs from 'fs';

let content = fs.readFileSync('src/components/DestinyMapSection.tsx', 'utf8');

const oldCode = `                           const getBadgeColor = (name: string) => {
                               if (/천을귀인|골든|크로스 카르마|수화기제|밀물|Double Crown|Elemental Oasis|기적의 조각|운명의 조력|도원결의|재다신약|조후 구원|식신제살|동조|구원자|The Crown|Golden|Savior|Miracle|Destined/.test(name)) return 'yellow';
                               if (/원진|귀문|형살|충돌|충|가치관의 충돌|파괴적|블랙홀|Black Hole|통제불능|과부하|맹독|사약|잠식|독소|Shattered|압박|극멸|Locked|탁해진|꺼져가는|묻혀버린|뿌리 뽑힌|불모지|기생|억압|답답한|파멸적|독|Total Solar Eclipse|Overload|Toxic|Drain|Clash/.test(name)) return 'red';
                               if (/연금술|Alchemist|동량지재|금목상쟁|공망|거울|모순|극성|숙명|창과 방패|통제 상실|반전|Contradiction|Mirror|Risk/.test(name)) return 'green';
                               return 'purple';
                           };`;

const newCode = `                           const getBadgeColor = (name: string) => {
                               if (/천을귀인|골든|크로스 카르마|수화기제|밀물|Double Crown|Elemental Oasis|기적의 조각|운명의 조력|도원결의|재다신약|조후 구원|식신제살|동조|구원자|The Crown|Golden|Savior|Miracle|Destined|정신적 결속|천간합|Spiritual Union|Stem Combination/.test(name)) return 'yellow';
                               if (/원진|귀문|형살|충돌|충|가치관의 충돌|파괴적|블랙홀|Black Hole|통제불능|과부하|맹독|사약|잠식|독소|Shattered|압박|극멸|Locked|탁해진|꺼져가는|묻혀버린|뿌리 뽑힌|불모지|기생|억압|답답한|파멸적|독|Total Solar Eclipse|Overload|Toxic|Drain|Clash/.test(name)) return 'red';
                               if (/연금술|Alchemist|동량지재|금목상쟁|공망|거울|모순|극성|숙명|창과 방패|통제 상실|반전|Contradiction|Mirror|Risk|절대적 화력의 공유|Absolute Firepower|강력한 결속|Strong Bond|Strong Union/.test(name)) return 'green';
                               return 'purple';
                           };`;

if(content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync('src/components/DestinyMapSection.tsx', content);
  console.log('Successfully patched getBadgeColor');
} else {
  console.error('Target content not found in DestinyMapSection.tsx');
  console.log(content.substring(content.indexOf('getBadgeColor'), content.indexOf('getBadgeColor') + 500));
}
