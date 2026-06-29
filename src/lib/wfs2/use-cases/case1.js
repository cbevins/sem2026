// The WFS fundamental design concept is simple:
// 1 - identify the latest possible points in the fire behavior
// computation chain at which input parameters may be introduced, and
// 2 - combine all computation between those points to produce a state.
// The code below identifies those points:
import * as Wfs from '../src/Wfs.js'

const start = performance.now()
// For now, store maximum amount of state properties at each level
let propsLevel = 2

// the fuel model catalog contains the standard fire behavior fuel models
// accessable by their numeric or string keys
let fuelCatalog = Wfs.makeFuelCatalog()

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

// Parameter Level 4 - wind and slope
// Generally, from least-to-most variable when iterating:
let windSlopePod = {
    aspect: 180,
    slopeRatio: 0.25,
    windBearing: 90,
    midflameWindSpeed: 880,
}
// We can now determine fire heading spread rate, bearing, length-to-width ratio,
// and fireline intensity/flame length
let fireBehaviorPod = Wfs.makeFireBehavior(fuelBedPod, fuelIgnitionPod, windSlopePod, propsLevel)
// We can also determine basic fire ellipse properties of eccentricity and back rate.
let fireEllipsePod = Wfs.makeFireEllipse(fireBehaviorPod, propsLevel)

// Parameter Level 5 - location and elapsed time
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