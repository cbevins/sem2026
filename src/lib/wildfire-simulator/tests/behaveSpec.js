import { FuelModelProcessor } from '../src/FuelModelProcessor.js'
import { makeFuelBed } from '../src/makeFuelBed.js'
import { makeFuelIgnition } from '../src/makeFuelIgnition.js'
import { makeFireBehavior } from '../src/makeFireBehavior.js'
import { makeFireShape } from '../src/makeFireShape.js'
import { makeFireSize } from '../src/makeFireSize.js'
import { makeBetaVector, makeBeta6Vector, makePsiVector } from '../src/makeFireVectors.js'

//------------------------------------------------------------------------------
// Input object definitions
//------------------------------------------------------------------------------

let fuelKey = 10
let fuelCuring = {
    curedHerb: 0.778,
    curedCheatgrass: 0.5            // an example custom fuel curing class
}
let fuelMoisture = {
    moistureDead1h: 0.05,
    moistureDead10h: 0.07,
    moistureDead100h: 0.09,
    moistureLiveHerb: 0.5,
    moistureLiveStem: 1.5,
    moistureLiveCheatgrass: 0.5,    // an example custom fuel moisture class
}
// input to makeFireBehavior(), may be modified by getMidflameWindSpeed()
let fireWeather = {
    airTemp: 95,            // only used by scorch height
    midflameWindSpeed: 880, // required by makeFireBehavior
    windBearing: 90,        // required by makeFireBehavior
    windSource: 180,        // used/created by makeFireWeather
    windSpeed10m: 900,      // used/created by makeFireWeather
    windSpeed20ft: 880,     // used/created by makeFireWeather
}
// input to makeFireWeather
let fuelCanopy = {
    baseHeight: 6,
    bulkDensity: 0.02,
    cover: 1,
    height: 40,
}
// input to makeFireBehavior
let fireTerrain = {
    aspect: 180,
    elevation: 3000,
    slopeDegrees: 14.03624347,
    slopeRatio: 0.25,
    topography: 'ridgetop',
    upslope: 0,
}
let firePosition = {
    elapsedTime: 60,
    ignEast: 0,
    ignNorth: 0
}
// input into makeFireShape (all are present in fireBehavior object)
let observedFireBehavior = { 
    headingSpreadRate: 0,
    bearing: 0,
    lengthWidthRatio: 1,
    flameLength: 0,
}
let degreesFromHead = 45
let more = {
    detailLevel: 2,
    config: {
        slopeInput: 'ratio',        // 'degrees', 'ratio'
        windSpeedInput: 'midflame', // 'midflame', '20ft', '10m'
        limitByRx: true,
        limitByEw: true,
    },
}

//------------------------------------------------------------------------------
// Pre-process inputs based on configuration
//------------------------------------------------------------------------------

// Returns an updated fireWeather
fireWeather = getMidflameWindSpeed({fireWeather, fuelBed, fuelCanopy, ...more})
fireTerrain = getSlopeRatio({fireTerrain, ...more})

//------------------------------------------------------------------------------
// Processing
//------------------------------------------------------------------------------
const div = '\n-------------------------------------------------------------------\n'
console.clear()
console.log(div,'\n\n\nWildfire Simulator', new Date())

const fuelCatalog = new FuelModelProcessor()
const fuelModel = fuelCatalog.get({fuelKey})
const fuelBed = makeFuelBedSpec({fuelModel, fuelCuring, ...more})
const fuelIgnition = makeFuelIgnitionSpec({fuelBed, fuelMoisture, ...more})
const fireBehavior = makeFireBehaviorSpec({fuelBed, fuelIgnition, fireWeather, fireTerrain, ...more})
const fireEllipse = makeFireEllipseSpec({fireBehavior, ...more})
// fireSize has all of fireShape properties as well
const fireSize = makeFireSizeSpec({fireEllipse, firePosition, ...more})
const headVector = makeBetaVectorSpec({fireSize, degreesFromHead: 0, ...more})
const backVector = makeBetaVectorSpec({fireSize, degreesFromHead: 180, ...more})
const betaVector = makeBetaVectorSpec({fireSize, degreesFromHead, ...more})
const beta6Vector = makeBeta6VectorSpec({fireSize, degreesFromHead, ...more})
const psiVector = makePsiVectorSpec({fireSize, degreesFromHead, ...more})
