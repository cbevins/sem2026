// Expands case1 by allowing iteration at each parameter injection site
import * as Wfs from '../src/Wfs.js'

const start = performance.now()
// For now, store maximum amount of state properties at each level
let propsLevel = 2

// the fuel model catalog contains the standard fire behavior fuel models
// accessable by their numeric or string keys
let fuelCatalog = Wfs.makeFuelCatalog()

// Parameter Level 1 - the fuel model
for (let fuelKey of [10]) {
let fuelModelPod = Wfs.makeFuelModel(fuelCatalog, fuelKey, propsLevel)

// Parameter level 2 - the fuel curing condition determines how much of the 'curable'
for(let curedHerb of [0.778]) {
let fuelCuringPod = {curedHerb}
let fuelBedPod = Wfs.makeFuelBed(fuelModelPod, fuelCuringPod, propsLevel)

// Parameter Level 3 - dead and live fuel moisture contents
for(let moistureLiveStem of [1.5]) {
for(let moistureLiveHerb of [0.5]) {
for(let moistureDead100h of [0.09]) {
for(let moistureDead10h of [0.07]) {
for(let moistureDead1h of [0.05]) {
let fuelMoisturePod = { moistureLiveStem, moistureLiveHerb,
    moistureDead100h, moistureDead10h, moistureDead1h}
let fuelIgnitionPod = Wfs.makeFuelIgnition(fuelBedPod, fuelMoisturePod, propsLevel)

// Parameter Level 4 - wind and slope
for(let aspect of [180]) {
for(let slopeRatio of [0.25]) {
for(let windBearing of [90]) {
for(let midflameWindSpeed of [880]) {
let windSlopePod = { aspect, slopeRatio, windBearing, midflameWindSpeed}
let fireBehaviorPod = Wfs.makeFireBehavior(fuelBedPod, fuelIgnitionPod, windSlopePod, propsLevel)
let fireEllipsePod = Wfs.makeFireEllipse(fireBehaviorPod, propsLevel)

// Parameter Level 5 - location and elapsed time
for(let elapsedTime of [60]) {
let firePositionPod = {ignEast: 1000, ignNorth: 2000, elapsedTime}
let fireSizePod = Wfs.makeFireSize(fireEllipsePod, firePositionPod, propsLevel)
let headVector = Wfs.makeBetaVector(fireSizePod)
let backVector = Wfs.makeBetaVector(fireSizePod)
let leftVector = Wfs.makeLeftFlankVector(fireSizePod)
let rightVector = Wfs.makeLeftFlankVector(fireSizePod)
let betaVector, beta6Vector, psiVector
// Parameter Level 5b - angle from fire head
for(let angleFromHead of [45]) {
betaVector = Wfs.makeBetaVector(fireSizePod, angleFromHead)
beta6Vector = Wfs.makeBeta6Vector(fireSizePod, angleFromHead)
psiVector = Wfs.makePsiVector(fireSizePod, angleFromHead)
} // angleFromHead

// Parameter Level6 - air temperature
for(let airTemp of [95]) {
    for(let vector of [headVector, backVector, leftVector, rightVector, betaVector, beta6Vector, psiVector])
        vector.scorchHeight = Wfs.getScorchHeight(vector.firelineIntensity,
    airTemp, windSlopePod.midflameWindSpeed)
} // airTemp
} // elapsedtime
} // midflameWind
} // windBearing
} // slopeRatio
} // aspect
} // moistureDead1h
} // moistureDead10h
} // moistureDead100h
} // moistureLiveHerb
} // moistureLiveStem
} // curedHerb
} // fuelKey

const stop = performance.now()
console.log(`case2.js ${(stop-start).toFixed(2)} msec`)