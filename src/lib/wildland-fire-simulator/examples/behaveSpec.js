/* eslint-disable no-unused-vars */
import { makeBetaVector, makeBeta6Vector, makePsiVector} from '../Wfs.js'
import { makeFireBehavior } from '../Wfs.js'
import { makeFireEllipse } from '../Wfs.js'
import { makeFireSize } from '../Wfs.js'
import { makeFireTerrain } from '../Wfs.js'
import { makeFuelBed } from '../Wfs.js'
import { makeFuelCatalog } from '../Wfs.js'
import { makeFuelIgnition } from '../Wfs.js'
import { makeFuelModel } from '../Wfs.js'
import { makeLogger } from '../Wfs.js'
import { makeWeightedFireBehavior } from '../Wfs.js'

import { makeFireWeather } from '../Wfs.js'
import { makeFuelCanopy } from '../Wfs.js'
import { makeFuelCuring } from '../Wfs.js'
import { makeFuelMoisture } from '../Wfs.js'

import {Bp6BetaFromHead, Bp6Configs, Bp6FirePosition, Bp6FireTerrain, Bp6FireWeather,
    Bp6FuelCanopy, Bp6FuelCuring, Bp6FuelKeys, Bp6FuelMoisture, Bp6ObservedFireBehavior, Bp6PsiFromHead
} from '../tests/Bp6Inputs.js'

function done(configs) {
    if (configs.logger) {
        const msg = configs.logger.messages
        console.log(`Finished with ${msg.length} messages:`, msg)
    }
    else console.log('There is no Logger.')
    process.exit()
}

const div = '\n-------------------------------------------------------------------\n'
console.clear()
console.log(div,'\n\n\nBehavePlus Spec of Wildfire Simulator', new Date())

//------------------------------------------------------------------------------
// The following are input data server functions provided by the client.
// These all return their data objects with values assigned to all required input properties.
//------------------------------------------------------------------------------

function fetchBetaFromHead() { return Bp6BetaFromHead }
function fetchConfigs() { return {...Bp6Configs} }
function fetchFirePosition() { return {...Bp6FirePosition} }
function fetchFireTerrain() { return {...Bp6FireTerrain} }
function fetchFireWeather() { return {...Bp6FireWeather} }
function fetchFuelCanopy() { return {...Bp6FuelCanopy} }
function fetchFuelCuring() { return {...Bp6FuelCuring} }
function fetchFuelKeys() { return {...Bp6FuelKeys} }
function fetchFuelMoisture() { return {...Bp6FuelMoisture} }
function fetchObservedFireBehavior() { return {...Bp6ObservedFireBehavior}}
function fetchPsiFromHead() { return Bp6PsiFromHead }

//------------------------------------------------------------------------------
// Input object definitions
//------------------------------------------------------------------------------

// configs must exist before anything else to enable system settings
const configs = fetchConfigs()
configs.logger = makeLogger()

// fuelCatalog must exist prior to makeFuelModel()
let fuelCatalog = makeFuelCatalog()

// fuelKeys must exist prior to makeFuelModel()
let fuelKeys = fetchFuelKeys()

// Now we can query relevent fuel moisture and curing classes for the selected fuels

// FOR EACH fuelKey1 {...

let fuelModel1 = makeFuelModel({fuelCatalog, fuelKey: fuelKeys.fuelKey1}, configs)
let fuelModel2 = fuelModel1
// Can have 2 fuel models
// IF (configs.fuelModels>1) FOR EACH fuelKey2 {...
if (configs.fuelModel > 1) {
    fuelModel2 = makeFuelModel({fuelCatalog, fuelKey: fuelKeys.fuelKey2}, configs)
}

// fuelMoisture must exist prior to makeFuelCuring() if fuelCuring is 'estimated'
let fuelMoisture = fetchFuelMoisture()
configs.deadFuelMoistureInput = 'particle'
configs.liveFuelMoistureInput = 'particle'
fuelMoisture = makeFuelMoisture({fuelMoisture}, configs)

// IF configs.fuelCuring==='estimated' {...
// FOR EACH moistureLiveHerb {...

// fuelCuring must exist prior to makeFuelBed()
let fuelCuring = fetchFuelCuring()
// fuelCuring properties can be 'input' or 'estimated'
// If 'estimated', then fuelMoisture must already exist
configs.fuelCuringInput = 'estimated'
fuelCuring = makeFuelCuring({fuelCuring, fuelMoisture}, configs)

// fuelCanopy must exist prior to makeFireWeather() if estimating midflame reduction factor
let fuelCanopy = fetchFuelCanopy()
configs.canopyHeightInputs = 'height-base'  // 'height-base', 'height-ratio', height-length', 'length-base', 'length-ratio', 'base-ratio'
fuelCanopy = makeFuelCanopy({fuelCanopy}, configs)

// fuelBed must exist prior to makeFuelIgnition(), makeFireWeather(), and makeFireBehavior()
// fuelBed has no configurable parameters
let fuelBed1 = makeFuelBed({fuelModel: fuelModel1, fuelCuring}, configs)

// FOR EACH deadMoisture1h, deadMoisture10h, deadMoisture100h, liveMoistureHerb, liveMoistureStem...

// fuelIgnition must exist prior to makeFireBehavior()
// fuelIgnition has no configurable parameters
let fuelIgnition1 = makeFuelIgnition({fuelBed: fuelBed1, fuelMoisture}, configs)

// fireWeather must exist prior to calling makeFireBehavior()
let fireWeather = fetchFireWeather()
configs.midflameReductionInput = 'estimated'
configs.midflameWindSpeedInput = 'input'
fireWeather = makeFireWeather({fireWeather, fuelCanopy, fuelBed: fuelBed1}, configs)

// fireTerrain must exist prior to calling makeFireBehavior()
let fireTerrain = fetchFireTerrain()
configs.slopeSteepnessInput = 'ratio'   // 'degrees', 'ratio', 'map'
fireTerrain = makeFireTerrain({fireTerrain}, configs)

// fireBehavior may be linked to fireEllipse, fireSpotting, fireCrowning, fireMortality
configs.fuelModels = 1
configs.limitWindFactor = true  // limit wind coefficient to 0.9 wind speed / reaction intensity
configs.limitSpreadRate = true  // limit max spread rate to effective wind speed
let fireBehavior1 = makeFireBehavior({fuelBed: fuelBed1, fuelIgnition: fuelIgnition1,
    fireWeather, fireTerrain}, configs)

let fuelBed2 = fuelBed1
let fuelIgnition2 = fuelIgnition1
let fireBehavior2 = fireBehavior1
let fireBehavior = fireBehavior1
if (configs.fuelModel > 1) {
    configs.fuelModelWeighting = 'arithmetic'
    fuelBed2 =  makeFuelBed({fuelModel: fuelModel2, fuelCuring}, configs)
    fuelIgnition2 = makeFuelIgnition({fuelBed: fuelBed2, fuelMoisture}, configs)
    fireBehavior2 = makeFireBehavior({fuelBed: fuelBed2, fuelIgnition: fuelIgnition2,
        fireWeather, fireTerrain}, configs)
    // FOR EACH fuelKeys.fuelCover1
    fireBehavior = makeWeightedFireBehavior({fireBehavior1, fireBehavior2}, configs)
}

// fireEllipse may be stand-alone or linked to fireBehavior
configs.linkBehaviorEllipse = true
if (! configs.linkBehaviorEllipse)
    fireBehavior = fetchObservedFireBehavior()
let fireEllipse = makeFireEllipse({fireBehavior}, configs)

// firePosition must exist prior to calling makeFireSize()
// firePosition has no configurable parameters
// NOTE that fireSize includes all its fireEllipse properties
let firePosition = fetchFirePosition()
const fireSize = makeFireSize({fireEllipse, firePosition}, configs)

// Example of determining fire behavior along various vectors from the ignition point
configs.includeFlameLength = true
configs.includeScorchHeight = true
const betaFromHead = fetchBetaFromHead()
const psiFromHead = fetchPsiFromHead()

const headVector = makeBetaVector({fireSize, fireWeather, betaFromHead: 0}, configs)
const backVector = makeBetaVector({fireSize, fireWeather, betaFromHead: 180}, configs)
const betaVector = makeBetaVector({fireSize, fireWeather, betaFromHead}, configs)
const beta6Vector = makeBeta6Vector({fireSize, fireWeather, betaFromHead}, configs)
const psiVector = makePsiVector({fireSize, fireWeather, psiFromHead}, configs)
console.log(headVector)
console.log(backVector)
console.log(betaVector)
console.log(beta6Vector)
console.log(psiVector)

// const stringKeys = fuelCatalog.getStringKeys()
// console.log('Moisture Classes', fuelCatalog.getMoistureClasses(stringKeys))
// console.log('Curing Classes', fuelCatalog.getCuringClasses(stringKeys))
done(configs)
