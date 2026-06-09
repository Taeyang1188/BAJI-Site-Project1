import fs from 'fs';

let content = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf8');

const oldLine1 = `if ((uSikSang > 30 && pJaeSeong > 30) || (pSikSang > 30 && uJaeSeong > 30)) { const i = uSikSang > 30 ? "당신의 아이디어" : "상대의 아이디어"; const m = uJaeSeong > 30 ? "당신의 현실 감각" : "상대의 현실 감각"; gates.push({ name: isKO ? "💼 [창과 방패] 비즈니스 콤비" : "💼 [Spear and Shield] Business Combo", desc: isKO ? i+"와 "+m+"가 만나 실질적 성과를 냅니다." : "Ideas meet realistic senses to produce results." }); gateBonus += 15; }`;
const newLine1 = `if ((uSikSang > 30 && pJaeSeong > 30) || (pSikSang > 30 && uJaeSeong > 30)) { const i = uSikSang > 30 ? "당신의 아이디어" : "상대방의 아이디어"; const m = uJaeSeong > 30 ? "당신의 현실 감각" : "상대방의 현실 감각"; gates.push({ name: isKO ? "💼 [창과 방패] 비즈니스 콤비" : "💼 [Spear and Shield] Business Combo", desc: isKO ? i+"와 "+m+"가 만나 실질적 성과를 냅니다." : "Ideas meet realistic senses to produce results." }); gateBonus += 15; }`;

const oldLine2 = `if (Math.abs(uYang - pYang) > 25) { const l = uYang > pYang ? "당신" : "상대"; const s = uYang > pYang ? "상대" : "당신"; gates.push({ name: isKO ? "⚖️ [극성 조화] 추진체와 키잡이" : "⚖️ [Polarity Harmony] Lead and Support", desc: isKO ? l+"이 폭발력 있는 엔진이라면, "+s+"는 방향을 잡는 키잡이입니다." : "One is the engine, the other the steering wheel." }); gateBonus += 10; }`;
const newLine2 = `if (Math.abs(uYang - pYang) > 25) { const l = uYang > pYang ? "당신" : "상대방"; const s = uYang > pYang ? "상대방" : "당신"; gates.push({ name: isKO ? "⚖️ [극성 조화] 추진체와 키잡이" : "⚖️ [Polarity Harmony] Lead and Support", desc: isKO ? l+"이 폭발력 있는 엔진이라면, "+s+"는 방향을 잡는 키잡이입니다." : "One is the engine, the other the steering wheel." }); gateBonus += 10; }`;

const oldLine3 = `if (!isSameGender && uGender === 'female' && pGender === 'male' && !uWeak && pWeak) { gates.push({ name: isKO ? "🔄 [역할 반전] 보호하는 사자" : "🔄 [Role Reversal] The Protector", desc: isKO ? "당신이 이 관계의 든든한 뼈대(양)를 지탱하고 상대가 그 위에서 꽃피우는 구조입니다." : "You are the solid foundation supporting his growth." }); gateBonus += 10; }`;
const newLine3 = `if (!isSameGender && uGender === 'female' && pGender === 'male' && !uWeak && pWeak) { gates.push({ name: isKO ? "🔄 [역할 반전] 보호하는 사자" : "🔄 [Role Reversal] The Protector", desc: isKO ? "당신이 이 관계의 든든한 뼈대(양)를 지탱하고 상대방이 그 위에서 꽃피우는 구조입니다." : "You are the solid foundation supporting his growth." }); gateBonus += 10; }`;


if (content.includes(oldLine1)) content = content.replace(oldLine1, newLine1);
if (content.includes(oldLine2)) content = content.replace(oldLine2, newLine2);
if (content.includes(oldLine3)) content = content.replace(oldLine3, newLine3);

fs.writeFileSync('src/services/relationship-dynamics-service.ts', content);
console.log("minor patches done");
