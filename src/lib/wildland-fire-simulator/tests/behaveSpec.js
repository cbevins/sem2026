import { makeFireBehavior } from '../Wfs.js'
import { makeFireEllipse } from '../Wfs.js'
import { makeFireSize } from '../Wfs.js'
import { makeFuelBed } from '../Wfs.js'
import { makeFuelCatalog } from '../Wfs.js'
import { makeFuelIgnition } from '../Wfs.js'
import { makeFuelModel } from '../Wfs.js'
import { makeLogger } from '../Wfs.js'
import { makeBetaVector, makeBeta6Vector, makePsiVector} from '../Wfs.js'

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
let betaFromHead = 45
let psiFromHead = 45

let configs = {
    detailLevel: 2,
    logger: null,
    slopeSteepnessInput: 'ratio',        // 'degrees', 'ratio'
    windSpeedInput: 'midflame', // 'midflame', '20ft', '10m'
    limitWindFactor: true,      // limit wind coefficient to 0.9 wind speed / reaction intensity
    limitSpreadRate: true,      // limit max spread rate to effective wind speed
}

//------------------------------------------------------------------------------
// Standards
// - 'makeSomething(inputs, configs) methods take 2 arguments,
//  an 'inputs' object with parameter keys, and a 'configs' object with parameter keys.
//------------------------------------------------------------------------------
const div = '\n-------------------------------------------------------------------\n'
console.clear()
console.log(div,'\n\n\nWildfire Simulator', new Date())

configs.logger = makeLogger()

//------------------------------------------------------------------------------
// Pre-process inputs based on configuration
//------------------------------------------------------------------------------

// Can configure fuel moistures by life category or by particle class

// fuelMoisture = getFuelMoistures({fuelMoisture,}, config)
// Returns an updated fireWeather
// fireWeather = getMidflameWindSpeed({fireWeather, fuelBed, fuelCanopy}, config)
// fireTerrain = getSlopeRatio({fireTerrain, ...more})

//------------------------------------------------------------------------------
// Processing
//------------------------------------------------------------------------------

// Can create a catalog of the 58 standard fire behavior fuel models
// and add custom fuel models to it
const fuelCatalog = makeFuelCatalog(configs)
// const chaparralFuelModel = makeChaparralFuelModel({number: 666, code: 'chaparral', age: 40, type: 'chamise'}, ...more)
// fuelCatalog.add(chaparralFuelModel)

const fuelModel = makeFuelModel({fuelCatalog, fuelKey}, configs)
const fuelBed = makeFuelBed({fuelModel, fuelCuring}, configs)
const fuelIgnition = makeFuelIgnition({fuelBed, fuelMoisture}, configs)
const fireBehavior = makeFireBehavior({fuelBed, fuelIgnition, fireWeather, fireTerrain}, configs)
const fireEllipse = makeFireEllipse({fireBehavior}, configs)
const fireSize = makeFireSize({fireEllipse, firePosition}, configs)

const headVector = makeBetaVector({fireSize, betaFromHead: 0}, configs)
const backVector = makeBetaVector({fireSize, betaFromHead: 180}, configs)
const betaVector = makeBetaVector({fireSize, betaFromHead}, configs)
const beta6Vector = makeBeta6Vector({fireSize, betaFromHead}, configs)
const psiVector = makePsiVector({fireSize, psiFromHead}, configs)
console.log(headVector)
console.log(backVector)
console.log(betaVector)
console.log(beta6Vector)
console.log(psiVector)

console.log(`Finished with ${configs.logger.messages.length} messages:`, configs.logger.messages)