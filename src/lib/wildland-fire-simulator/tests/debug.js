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
} from './Bp6Inputs.js'

let configs = {...Bp6Configs}
configs.logger = makeLogger()

let fuelCatalog = makeFuelCatalog(configs)

let fuelMoisture = {...Bp6FuelMoisture}
fuelMoisture = makeFuelMoisture({fuelMoisture}, configs)

let fuelCuring = {...Bp6FuelCuring}
fuelCuring = makeFuelCuring({fuelCuring, fuelMoisture}, configs)

let fuelModel = makeFuelModel({fuelCatalog, fuelKey: 124}, configs)
let fuelBed = makeFuelBed({fuelModel, fuelCuring}, configs)

// do not pass a fuelMoisture
let fuelIgnition = makeFuelIgnition({fuelBed}, configs)
console.log(fuelIgnition)
