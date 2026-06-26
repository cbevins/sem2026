// Simplest declarative procedural approach to modeling surface fire
import * as Wfs from '../src/Wfs.js'

const logger = Wfs.makeLogger()
const log = logger.log

let propsLevel = 2
let fuelCatalog = Wfs.makeFuelCatalog()

let fuelKey = 10
let fuelModelPod = Wfs.makeFuelModel(fuelCatalog, fuelKey,
    log, propsLevel)

let curedHerb = 0.778
let fuelCuringPod = Wfs.makeFuelCuring(curedHerb, [['curedCheatgrass', 0.5]],
    log, propsLevel)
console.log('fuelCuringPod:', fuelCuringPod)

let fuelBedPod = Wfs.makeFuelBed(fuelModelPod, fuelCuringPod, log, propsLevel)

let moistureDead1h = 0.05
let moistureDead10h = 0.05
let moistureDead100h = 0.05
let moistureLiveHerb = 0.5
let moistureLiveStem = 1.5
let fuelMoisturePod = Wfs.makeFuelMoisture(moistureDead1h, moistureDead10h, moistureDead100h,
    moistureLiveHerb, moistureLiveStem, [['moistureCheatgrass', 0.05]],
    log, propsLevel)
console.log('fuelMoisturePod:', fuelMoisturePod)

let fuelIgnitionPod = Wfs.makeFuelIgnition(fuelBedPod, fuelMoisturePod, log, propsLevel)

let midflameWindSpeed = 880
let windBearing = 90
let slopeRatio = 0.25
let aspect = 180
let limitWindFactor = true
let limitSpreadRate = true
let fireBehaviorPod = Wfs.makeFireBehavior(fuelBedPod, fuelIgnitionPod,
    midflameWindSpeed, windBearing, slopeRatio, aspect,
    limitWindFactor, limitSpreadRate,
    log, propsLevel)

let fireEllipsePod = Wfs.makeFireEllipse(fireBehaviorPod,
    log, propsLevel)

let elapsedTime = 60
let ignEast = 1000
let ignNorth = 2000
let ignX = 0
let ignY = 0
let fireSizePod = Wfs.makeFireSize(fireEllipsePod, elapsedTime, ignEast, ignNorth,
    ignX, ignY, log, propsLevel)
    
let betaFromHead = 0
let includeFlameLength = true
let headVector = Wfs.makeBetaVector(fireSizePod, betaFromHead, includeFlameLength)
let airTemp = 95
headVector.scorchHeight = Wfs.getScorchHeight(headVector.firelineIntensity, 
    airTemp, midflameWindSpeed)
console.log('Head Vector Pod:', headVector)
