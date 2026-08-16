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
