import { WfsRunner } from './WfsRunner.js'
import { WfsConfigs } from './WfsConfigs.js'
import { sortedTable } from '../src/Wfs.js'

const input = {
    fuelKey1: [10],
    moistureDead1h: [0.05],
    moistureDead10h: [0.07],
    moistureDead100h: [0.09],
    moistureLiveHerb: [0.5],
    moistureLiveStem: [1.5],
    slopeAspect: [180],
    slopeRatio: [0.25],
    windBearingDegrees: [90],
    windSpeed20ft: [880],
    canopyHeight: [40],
    canopyBase: [6],
    canopyCover: [1],
    ignEast: [1000],
    ignNorth: [2000],
    elapsedTime: [60],
    angleFromHead: [45],
}

console.log(new Date())

let configs = {...WfsConfigs}
const wfs = new WfsRunner(configs)

// Nice stack table
const data = []
for(let item of wfs.stack) {
    const [action, subject, goto=''] = item.split(' ')
    data.push({action, subject, goto})
}
sortedTable('EXECUTION STACK', data)
sortedTable('Required Inputs', wfs.requiredInputs)
sortedTable('Required Methods', wfs.requiredMethods)
wfs.execute(input)
