import { calculateRelationshipDynamics } from './services/relationship-dynamics-service';

function runTest(uStem: string, uBranch: string, pStem: string, pBranch: string) {
  const userResult: any = {
    pillars: [{title: 'Year'}, { title: 'Day', stem: uStem, branch: uBranch }, {title: 'Month'}, {title: 'Time'}],
    analysis: { gender: 'female', elementRatios: {}, yongshinDetail: {}, tenGodsRatio: {} }
  };
  const partnerResult: any = {
    pillars: [{title: 'Year'}, { title: 'Day', stem: pStem, branch: pBranch }, {title: 'Month'}, {title: 'Time'}],
    analysis: { gender: 'male', elementRatios: {}, yongshinDetail: {}, tenGodsRatio: {} }
  };
  
  const res = calculateRelationshipDynamics(userResult, partnerResult, {}, {}, 'KO');
  console.log(`\n=== Test: ${uStem}${uBranch} vs ${pStem}${pBranch} ===`);
  console.log("Score:", res.syncScore);
  console.log("Temperature:", res.temperature);
  console.log("Gates:", res.gates);
  console.log("Text:\n", res.text);
}

runTest('丙', '午', '壬', '子');
runTest('丙', '子', '辛', '卯');
