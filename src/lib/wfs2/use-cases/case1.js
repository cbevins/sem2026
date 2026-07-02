// Illustrates the WFS fundamental design concept:
// 1 - identify the latest possible points in the fire behavior
// computation chain at which input parameters may be introduced, and
// 2 - combine all computation between those points to produce a state.
// The code below identifies those points:
import * as Wfs from '../src/Wfs.js'

const start = performance.now()
// For now, store maximum amount of state properties at each level
let propsLevel = 2
let activeCrownFireModule = 'active'
let surfaceFireModule = 'active'
let surfaceSizeModule = 'active'
let midflameWindSpeedInput = 'estimated'
let midflameWsrfInput = 'estimated'

// The fuel model catalog contains the standard fire behavior fuel models
// accessable by their numeric or string keys
let fuelCatalog = Wfs.makeFuelCatalog()

// Determine canopy props if estimating midflame wind speed or running the crown fire
let canopyPod = {
    canopyHeight: 40,
    canopyBase: 6,
    canopyCover: 1,
    canopyBulkDensity: 0.02,
    canopyHeatContent: 8000,
}
// Adds canopyFuelLoad, canopyHeatPerUnitArea, canopyMidflameWsrf to canopyPod
let canopyFuelsPod = Wfs.makeCanopyFuels(canopyPod, propsLevel)

// Set up Rothermel's crown fire model if it is active
let crownFuelBedPod=null, crownFuelIgnitionPod=null, crownFireBehaviorPod=null, crownFirePod=null
if (activeCrownFireModule === 'active') {
    let crownFuelModelPod = Wfs.makeFuelModel(fuelCatalog, 10, propsLevel)
    crownFuelBedPod = Wfs.makeFuelBed(crownFuelModelPod, {curedHerb:0}, propsLevel)
}

// Parameter Level 1 - the fuel model
let fuelKey = 10
// With the fuel model key we get a reference to a plain-old-data FuelModel object
// with a fuel depth, dead extinction moisture content, and an array of fuel particles
// and their load, savr
let fuelModelPod = Wfs.makeFuelModel(fuelCatalog, fuelKey, propsLevel)

// Parameter level 2 - the fuel curing condition determines how much of the 'curable'
// fuel particle loads are distributed between the dead and live fuel categories
let fuelCuringPod = {
    curedHerb: 0.778,       // required standard curing class
    curedCheatgrass: 0.5    // example custom curing class
}
// We can now determine fuel bed structural properties of bulk density, packing ratio,
// and dead/live fuel category surface-are-to-volume ratio, net fuel load, heat content,
// mineral damping coefficient, and dry reaction intensity.
let fuelBedPod = Wfs.makeFuelBed(fuelModelPod, fuelCuringPod, propsLevel)

// Parameter Level 3 - dead and live fuel moisture contents
// Generally, from least-to-most variable when iterating:
let fuelMoisturePod = {
    moistureLiveCheatgrass: 1,  // example custom live moisture class
    moistureLiveStem: 1.5,      // required standard moisture class
    moistureLiveHerb: 0.5,      // required standard moisture class
    moistureDeadDuff: 0.1,      // example custom dead moisture class
    moistureDead100h: 0.09,     // required standard moisture class
    moistureDead10h: 0.07,      // required standard moisture class
    moistureDead1h: 0.05,       // required standard moisture class
}
// We can now determine the fuel bed moisture dead and live category moisture
// damping coefficient and reaction intensity, and fuel bed heat source, heat sink,
// reaction intensity, and no-wind, no-slope spread rate.
let fuelIgnitionPod = Wfs.makeFuelIgnition(fuelBedPod, fuelMoisturePod, propsLevel)
if (activeCrownFireModule === 'active') {
    crownFuelIgnitionPod = Wfs.makeFuelIgnition(crownFuelBedPod, fuelMoisturePod, propsLevel)
}

// Parameter Level 4 - wind and slope
// Generally, from least-to-most variable when iterating:
let windSlopePod = {
    aspect: 180,
    slopeRatio: 0.25,
    windBearing: 90,
    // Set windSpeed20ft to desired value if activeCrownFireModule is active OR midflameWindSpeedInput='estimated'
    windSpeed20ft: 880,
    // Set midflameWsrf to desired value if midflameWsrfInput='input' AND midflameWindSpeedInput='estimated'
    midflameWsrf: 1,
    // Set midflameWindSpeed to desired value if midflameWindSpeedInput='input', otherwise itwill be re-calculated
    midflameWindSpeed: 880,
}

// Estimate midflame wind speed and/or wind speed reduction factor
if (midflameWindSpeedInput === 'estimated') {   // re-calculate its value
    if (midflameWsrfInput === 'estimated') {    // recalculate its value
        windSlopePod.midflameWsrf = Math.min(canopyFuelsPod.canopyMidflameWsrf, fuelBedPod.fuelMidflameWsrf)
    }
    windSlopePod.midflameWindSpeed = windSlopePod.windSpeed20ft * windSlopePod.midflameWsrf
}

// We can now determine fire heading spread rate, bearing, length-to-width ratio,
// and fireline intensity/flame length
let fireBehaviorPod = Wfs.makeFireBehavior(fuelBedPod, fuelIgnitionPod, windSlopePod, propsLevel)

if (activeCrownFireModule === 'active') {
    // Crown fire uses 20-ft wind as midflame wind, and has no slope
    let windSpeed20ft = windSlopePod.windSpeed20ft
    let crownWindSlopePod = {...windSlopePod, aspect:0, slopeRatio:0, midflameWindSpeed: windSpeed20ft}
    crownFireBehaviorPod = Wfs.makeFireBehavior(crownFuelBedPod, crownFuelIgnitionPod,
        crownWindSlopePod, propsLevel)
    crownFirePod = Wfs.makeActiveCrownFire(crownFireBehaviorPod, fireBehaviorPod,
        canopyFuelsPod, windSpeed20ft, propsLevel)
}

// We can also determine basic fire ellipse properties of eccentricity and back rate.
let fireEllipsePod = Wfs.makeFireEllipse(fireBehaviorPod, propsLevel)

// Parameter Levilwill be re- - location and elapsed time
// Generally, from least-to-most variable when iterating:
let firePositionPod = {
    ignEast: 1000,
    ignNorth: 2000,
    elapsedTime: 60,
}
// We can now determine fire ellipse area, perimeter length, perimeter location
let fireSizePod = Wfs.makeFireSize(fireEllipsePod, firePositionPod, propsLevel)
// We can also determine distance and position of fixed vectors
let headVector = Wfs.makeBetaVector(fireSizePod)
let backVector = Wfs.makeBetaVector(fireSizePod)
let leftVector = Wfs.makeLeftFlankVector(fireSizePod)
let rightVector = Wfs.makeLeftFlankVector(fireSizePod)

// Parameter Level 5b - angle from fire head
let angleFromHead = 45
let betaVector = Wfs.makeBetaVector(fireSizePod, angleFromHead)
let beta6Vector = Wfs.makeBeta6Vector(fireSizePod, angleFromHead)
let psiVector = Wfs.makePsiVector(fireSizePod, angleFromHead)

// Parameter Level6 - air temperature
let airTemp = 95
// Can now determine scorch height at any vector
for(let vector of [headVector, backVector, leftVector, rightVector, betaVector, beta6Vector, psiVector])
    vector.scorchHeight = Wfs.getScorchHeight(vector.firelineIntensity,
        airTemp, windSlopePod.midflameWindSpeed)

const stop = performance.now()
console.log(`case1.js ${(stop-start).toFixed(2)} msec`)