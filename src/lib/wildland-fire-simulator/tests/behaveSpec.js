import { makeFireBehavior } from '../Wfs.js'
import { makeFireEllipse } from '../Wfs.js'
import { makeFireSize } from '../Wfs.js'
import { makeFuelBed } from '../Wfs.js'
import { makeFuelCatalog } from '../Wfs.js'
import { makeFuelIgnition } from '../Wfs.js'
import { makeFuelModel } from '../Wfs.js'
import { makeLogger } from '../Wfs.js'
import { makeBetaVector, makeBeta6Vector, makePsiVector} from '../Wfs.js'

import { makeFireWeather } from '../Wfs.js'
import { makeFuelCanopy } from '../Wfs.js'
import { makeFuelCuring } from '../Wfs.js'
import { makeFuelMoisture } from '../Wfs.js'

import {Bp6BetaFromHead, Bp6Configs, Bp6FirePosition, Bp6FireTerrain, Bp6FireWeather,
    Bp6FuelCanopy,
    Bp6FuelCuring, Bp6FuelKey, Bp6FuelMoisture, Bp6PsiFromHead
} from './Bp6Inputs.js'

function done(configs) {
    if (configs.logger) {
        const msg = configs.logger.messages
        console.log(`Finished with ${msg.length} messages:`, msg)
    }
    else console.log('There is no Logger.')
}

const div = '\n-------------------------------------------------------------------\n'
console.clear()
console.log(div,'\n\n\nWildfire Simulator', new Date())

//------------------------------------------------------------------------------
// Input object definitions
//------------------------------------------------------------------------------

const configs = {...Bp6Configs}
configs.logger = makeLogger()

// Create fuelMoisture properties based on 'particle' or 'life' inputs
let fuelMoisture = {...Bp6FuelMoisture}
fuelMoisture = makeFuelMoisture({fuelMoisture}, configs)

// Create fuelCuring properties based on 'input' or 'estimated'
let fuelCuring = {...Bp6FuelCuring}
fuelCuring = makeFuelCuring({fuelCuring, fuelMoisture}, configs)

let fuelCanopy = {...Bp6FuelCanopy}
fuelCanopy = makeFuelCanopy({fuelCanopy}, configs)

let fireWeather = {...Bp6FireWeather}
// Need a 'fuelbed'!
fireWeather = makeFireWeather({fireWeather, fuelCanopy, fuelBed:{depth: 1}}, configs)
console.log(fireWeather)
done(configs)
process.exit()

const firePosition = Bp6FirePosition
const fireTerrain = Bp6FireTerrain
const fuelKey = Bp6FuelKey
const betaFromHead = Bp6BetaFromHead
const psiFromHead = Bp6PsiFromHead

//------------------------------------------------------------------------------
// Standards
// - 'makeSomething(inputs, configs) methods take 2 arguments,
//  an 'inputs' object with parameter keys, and a 'configs' object with parameter keys.
//------------------------------------------------------------------------------

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
