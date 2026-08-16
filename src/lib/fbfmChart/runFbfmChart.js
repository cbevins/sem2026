import { FbfmChart } from "./FbfmChart.js"
import { getNiceTicks } from "./getNiceTicks.js"

console.log(new Date())
console.log('run.js - Dynamice Fire Behavior Fuel Model Chart')
const t1 = performance.now()
const chart = new FbfmChart()
const t2 = performance.now()
const data = {...chart.data, curedHerb: 1, moistureDead1h: 0.05}
chart.update(data)
const t3 = performance.now()
console.table(chart.results)

data.moistureDead1h = 0.15
chart.update(data)
console.log('new FbfmChart', t2-t1, 'msec')
console.table(chart.results)
console.log('update()', t3-t2, 'msec')

for(let i=1; i<=6; i++) {
const midflameWsrf = 1.83 / Math.log((20 + 0.36 * i) / (0.13 * i))
console.log(i, midflameWsrf)
}
let i = 0.1
const midflameWsrf = 1.83 / Math.log((20 + 0.36 * i) / (0.13 * i))
console.log(i, midflameWsrf)

// let maxRos = 0, maxFli=0, maxFlame=0
// for (let fuel of Object.values(chart.results)) {
//     maxRos = Math.max(maxRos, fuel.rosFpm)
//     maxFli = Math.max(maxFli, fuel.fli)
//     maxFlame = Math.max(maxFlame, fuel.flame)
// }
// console.log('maxRos=',maxRos, 'maxFli=', maxFli, 'maxFlame=', maxFlame)
// console.log('ros ticks =', getNiceTicks(0, maxRos))
// console.log('fli ticks =', getNiceTicks(0, maxFli))
// console.log('flame ticks =', getNiceTicks(0, maxFlame))