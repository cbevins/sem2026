import { FbfmChart } from "./FbfmChart.js"
import {fmt2} from './utils.js'

function getResults(chart) {
    const results = []
    for(let fuelKey of chart.fuelKeys) {
        const fuel = chart.fuel[fuelKey]
        if (fuel.active) {
            results.push({fuelKey,
                ros: fmt2(fuel.fireBehavior.headingSpreadRate),
                fli: fmt2(fuel.fireBehavior.firelineIntensity),
                flame: fmt2(fuel.fireBehavior.flameLength),
            })
        }
    }
    return results
}

console.log(new Date())
console.log('run.js - Dynamice Fire Behavior Fuel Model Chart')
const t1 = performance.now()
const chart = new FbfmChart()
const t2 = performance.now()
const data = {...chart.data, curedHerb: 1, moistureDead1h: 0.05}
chart.update(data)
const t3 = performance.now()
console.table(getResults(chart))

data.moistureDead1h = 0.15
chart.update(data)
console.log('new FbfmChart', t2-t1, 'msec')
console.table(getResults(chart))
console.log('update()', t3-t2, 'msec')
