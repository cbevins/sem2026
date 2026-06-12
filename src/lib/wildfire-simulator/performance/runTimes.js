import { StandardFuelModelCatalog } from "../src/StandardFuelModelCatalog.js";
import { FuelBed } from '../src/FuelBed.js'
import { FuelIgnition } from '../src/FuelIgnition.js'
import { FireBehavior } from '../src/FireBehavior.js'
import { FireEllipse } from '../src/FireEllipse.js'


const catalogGroups = { FBFM13: true, FBFM40: true, LANDFIRE: false, CUSTOM: false, COWN: false}
const catalog = new StandardFuelModelCatalog(catalogGroups)
const modelKeys = Array.from(catalog.catalog.keys())

// Inputs
const inputs = {
    saveProps: 0,   // save just required properties
    // FuelBed()
    curedHerb: 0.778,
    // FuelIgnition()
    moistureDead1h: 0.05,
    moistureDead10h: 0.07,
    moistureDead100h: 0.09,
    moistureLiveHerb: 0.5,
    moistureLiveStem: 1.5,
    // FireBehavior()
    limitSpreadRateByReactionIntensity: true,
    limitSpreadRateByEffWindSpeed: false,
    midflameWindSpeed: 10*88,
    windBearing: 90,
    aspect: 180,
    slopeRatio: 0.25,
}

function runCatalog(reps=10000) {
    const t0 = performance.now()
    let dummy = 0
    for(let rep=0; rep<reps; rep++) {
        for(let modelKey of modelKeys) {
            const fuelModel = catalog.get(modelKey)
            dummy += fuelModel.number
        }
    }
    return performance.now()-t0
}

function runThruFuelBed(reps=10000) {
    const t0 = performance.now()
    let dummy = 0
    for(let rep=0; rep<reps; rep++) {
        for(let modelKey of modelKeys) {
            const fuelModel = catalog.get(modelKey)
            const fuelBed = new FuelBed({fuelModel, ...inputs})
            dummy += fuelBed.depth
        }
    }
    return performance.now()-t0
}

function runThruFuelIgnition(reps=10000) {
    const t0 = performance.now()
    let dummy = 0
    for(let rep=0; rep<reps; rep++) {
        for(let modelKey of modelKeys) {
            const fuelModel = catalog.get(modelKey)
            const fuelBed = new FuelBed({fuelModel, ...inputs})
            const fuelIgnition = new FuelIgnition({fuelBed, ...inputs})
            dummy += fuelIgnition.reactionIntensity
        }
    }
    return performance.now()-t0
}

function runThruFireBehavior(reps=10000) {
    const t0 = performance.now()
    let dummy = 0
    for(let rep=0; rep<reps; rep++) {
        for(let modelKey of modelKeys) {
            const fuelModel = catalog.get(modelKey)
            const fuelBed = new FuelBed({fuelModel, ...inputs})
            const fuelIgnition = new FuelIgnition({fuelBed, ...inputs})
            const fireBehavior = new FireBehavior({fuelIgnition, ...inputs})
            dummy += fireBehavior.headingSpreadRate
        }
    }
    return performance.now()-t0
}

function summarize(data) {
    const results = []
    let tPrev = 0
    for(let d of data) {
        d.added = d.ms - tPrev
        tPrev = d.ms
    }
    const totalTime = data[data.length-1].ms
    for(let d of data) {
        const portion = (d.added / totalTime).toFixed(4)
        results.push({addedTime: d.added.toFixed(2), portion, name: d.name})
    }
    console.table(results)
}

console.log(new Date(), '--------------------------------')
const reps=10000
const pad = 40
console.log(`Running ${reps} repitions of ${modelKeys.length} `
    + `fuel models (${(reps*modelKeys.length).toLocaleString()}):`)
const data = []
let ms = runCatalog(reps)
data.push({ms, name: 'StandardFuelModelCatalog.get()'})
console.log('just StandardFuelModelCatalog.get()'.padEnd(pad), ms)

ms = runThruFuelBed(reps)
data.push({ms, name: 'new FuelBed()'})
console.log('adding new FuelBed()'.padEnd(pad), ms)

ms = runThruFuelIgnition(reps)
data.push({ms, name: 'new FuelIgnition()'})
console.log('adding new FuelIgnition()'.padEnd(pad), ms)

ms = runThruFireBehavior(reps)
data.push({ms, name: 'new FireBehavior()'})
console.log('adding new FireBehavior()'.padEnd(pad), ms)

summarize(data)