import { Solar } from 'lunar-typescript';

const d = new Date("2026-04-24T03:53:46Z");
const upcomingMonths = [];
for(let i=0; i<6; i++) {
    let futureD = new Date(d.getFullYear(), d.getMonth() + i, 15);
    let sol = Solar.fromDate(futureD);
    let lun = sol.getLunar();
    let mGanZhi = lun.getMonthInGanZhiExact(); 
    let mGanZhi2 = lun.getMonthInGanZhi();
    console.log(`Month: ${futureD.getMonth() + 1}, Exact: ${mGanZhi}, Normal: ${mGanZhi2}`);
}
