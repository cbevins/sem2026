/* eslint-disable no-unused-vars */
// -----------------------------------------------------------------------------
// Wildfire Simulation Library Processors
// -----------------------------------------------------------------------------
import { FuelModelProcessor } from '../src/FuelModelProcessor.js'
import { makeFuelBed } from '../src/makeFuelBed.js'
import { makeFuelIgnition } from '../src/makeFuelIgnition.js'
import { makeFireBehavior } from '../src/makeFireBehavior.js'
import { makeFireShape } from '../src/makeFireShape.js'
import { makeFireSize } from '../src/makeFireSize.js'
import { makeBetaVector, makeBeta6Vector, makePsiVector } from '../src/makeFireVectors.js'

const div = '\n-------------------------------------------------------------------\n'

function log(n, name, inputs, outputs) {
    console.log(div,`\n${n} - ${name} inputs`, inputs)
    console.log(`\n${n} - ${name} outputs`, outputs)
    return outputs
}

function makeFuelBedSpec(inputs={}){
    const pod = makeFuelBed(inputs)
    return log(2, 'makeFuelBed', inputs, pod)
}

function makeFuelIgnitionSpec(inputs={}) {
    const pod = makeFuelIgnition(inputs)
    return log(3, 'makeFuelIgnition', inputs, pod)
}

function makeMidflameWind(inputs={}) {
    console.log(div, '\n4 - makeMidflameWind inputs', inputs)
    let pod = {
        midflameWindSpeed: inputs.prevailingWind.windSpeed20ft,
        windBearing: inputs.prevailingWind.windBearing
    }
    console.log('\n4 - makeMidflameWind outputs', pod)
    return pod
}

function makeSlope(inputs={}) {
    console.log(div, '\n5 - makeSlope inputs', inputs)
    let pod = {
        aspect: inputs.terrain.aspect,
        slopeRatio: inputs.terrain.slopeRatio
    }
    console.log('\n5 - makeSlope outputs', pod)
    return pod
}

function makeFireBehaviorSpec(inputs) {
    const outputs = makeFireBehavior(inputs)
    return log(6, 'makeFireBehavior', inputs, outputs)
}

function makeFireShapeSpec(inputs={}) {
    const outputs = makeFireShape(inputs)
    return log(7, 'makeFireShape', inputs, outputs)
}

function makeFireSizeSpec(inputs={}) {
    const outputs = makeFireSize(inputs)
    return log(8, 'makeFireSize', inputs, outputs)
}

function makeBetaVectorSpec(inputs={}) {
    const outputs = makeBetaVector(inputs)
    return log(9, 'makeBetaVector', inputs, outputs)
}

function makeBeta6VectorSpec(inputs={}) {
    const outputs = makeBeta6Vector(inputs)
    return log(10, 'makeBeta6Vector', inputs, outputs)
}

function makePsiVectorSpec(inputs={}) {
    const outputs = makePsiVector(inputs)
    return log(11, 'makePsiVector', inputs, outputs)
}

// -----------------------------------------------------------------------------
// Example client data servers
// -----------------------------------------------------------------------------

function fetchFuelKey() {
    return 10
}
function fetchFuelCuring() {
    return { curedHerb: 0}
}
function fetchFuelMoisture() {
    return {
        moistureDead1h: 0.05,
        moistureDead10h: 0.05,
        moistureDead100h: 0.05,
        moistureLiveHerb: 0.5,
        moistureLiveStem: 1.5,
        moistureCheatgrass: 0.05,   // can define moisture classes for custom fuels
    }
}
function fetchFuelCanopy() {
    return {
        cover: 1,
        baseHeight: 6,
        height: 40,
        bulkDensity: 0.02,
    }
}
function fetchPrevailingWind() {
    return {
        windBearing: 90,
        windSource: 180,
        windSpeed20ft: 880,
        windSpeed10m: 900,
    }
}
function fetchMidflameWind() {
    return {
        windBearing: 90,
        midflameWindSpeed: 880
    }
}
function fetchTerrain() {
    return {
        aspect: 180,
        slopeRatio: 0.25,
        slopeDegrees: 14.03624347,
        elevation: 3000,
        topography: 'ridgetop',
    }
}
function fetchElapsedTime() {
    return 60
}
function fetchFireBehavior(fire) {
    return {
        headingSpreadRate: fire.headingSpreadRate,
        bearing: fire.bearing,
        lengthWidthRatio: fire.lengthWidthRatio,
        flameLength: fire.flameLength,
    }
}
function fetchIgnitionPoint() {
    return {ignEast: 100, ignNorth: 100}
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
console.clear()
console.log(div,'\n\n\nWildfire Simulator', new Date())

const fuelCatalog = new FuelModelProcessor()

const more = {detailLevel: 2}
const fuelKey = fetchFuelKey()
const fuelModel = fuelCatalog.get({fuelKey})
const fuelCuring = fetchFuelCuring()
const fuelBed = makeFuelBedSpec({fuelModel, fuelCuring, ...more})

const fuelMoisture = fetchFuelMoisture()
const fuelIgnition = makeFuelIgnitionSpec({fuelBed, fuelMoisture, ...more})

const prevailingWind = fetchPrevailingWind()
const fuelCanopy = fetchFuelCanopy()
const midflameWind = makeMidflameWind({prevailingWind, fuelBed, fuelCanopy}) // ensure windBearing, midflameWindSpeed
// const midflameWind = fetchMidflameWind()
const terrain = fetchTerrain()
const slope = makeSlope({terrain})  // ensure aspect, slopeRatio
const fireBehavior = makeFireBehaviorSpec({fuelBed, fuelIgnition, midflameWind, slope,
    limitByRx: true, limitByEw: true, ...more})

// If stand-alone call fetchFireBehavior(),
// If linked, use the makeFireBehavior() object
const observedFireBehavior = fetchFireBehavior(fireBehavior)
const fireShape = makeFireShapeSpec({fireBehavior: observedFireBehavior, ...more})

const elapsedTime = fetchElapsedTime()
const ignitionPoint = fetchIgnitionPoint()
const fireSize = makeFireSizeSpec({fireShape, elapsedTime, ignitionPoint, ...more})

const headVector = makeBetaVectorSpec({fireShape, fireSize, betaFromHead: 0, ...more})
const backVector = makeBetaVectorSpec({fireShape, fireSize, betaFromHead: 180, ...more})
const betaVector = makeBetaVectorSpec({fireShape, fireSize, betaFromHead: 45, ...more})
const beta6Vector = makeBeta6VectorSpec({fireShape, fireSize, betaFromHead: 45, ...more})
const psiVector = makePsiVectorSpec({fireShape, fireSize, psiFromHead: 45, ...more})
