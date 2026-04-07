import {BurnMap} from './BurnMap.js'

const burnMap = new BurnMap(100,100)
const row = 0
burnMap.setBurnCode(0, row, BurnMap.unburned)
burnMap.setBurnCode(1, row, BurnMap.burning)
burnMap.setBurnCode(2, row, BurnMap.burned)
burnMap.setBurnCode(3, row, BurnMap.unburnable)

burnMap.setFeatureCode(0, row, 1)
burnMap.setFeatureCode(1, row, 11)
burnMap.setFeatureCode(2, row, 31)
burnMap.setFeatureCode(3, row, 61)

const ar = []
for(let col=0; col<4; col++) {
    const value = burnMap.get(col, row)
    const burnCode = burnMap.getBurnCode(col, row)
    const featureCode = burnMap.getFeatureCode(col, row)
    ar.push({value, burnCode, featureCode})
}
console.table(ar)