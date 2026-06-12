// Mimics fireEllipse.test.js without the tests
import { StandardFuelModelCatalog } from '../src/StandardFuelModelCatalog.js'
import { FuelBed } from '../src/FuelBed.js'
import { FuelIgnition } from '../src/FuelIgnition.js'
import { FireBehavior } from '../src/FireBehavior.js'
import { FireEllipse } from '../src/FireEllipse.js'
import { Beta6FireVector, BetaFireVector, CenterVector, PsiFireVector, ThetaVector } from '../src/FireVector.js'

import { calcBetaFromTheta, calcThetaFromBeta, calcPsiFromTheta } from '../src/ellipseAngles.js'

const elapsed = 60

const bpProps = {
    // inputs
    headingSpreadRate: [18.551680325448835, 48.47042599399056],
    flameLength: [6.9996889013229229, 16.35631663317114],
    bearing: [87.573367385837855, 87.613728665173383],
    lengthWidthRatio: [3.5015680219321221, 3.5015819412846603],
    elapsedTime: [elapsed, elapsed],
    // setEllipse() outputs
    firelineIntensity: [389.95413667947145, 2467.9286450361865],
    eccentricity: [0.95835298387126711, 0.95835332217217739],
    backingSpreadRate: [0.39452649041938642, 1.0307803973340242],
    majorExpansionRate: [0.39452649041938642 + 18.551680325448835, 1.0307803973340242 + 48.47042599399056],
    minorExpansionRate: [2 * 2.7053889424963877, 2 * 7.0684061120619655],
    fSpreadRate: [9.4731034079341114, 1485.0361917397374 / elapsed],
    hSpreadRate: [2.7053889424963877, 424.10436672371787 / elapsed],
    gSpreadRate: [9.0785769175147255, 1423.189367899696 / elapsed],
    headingDistance: [1113.1008195269301, 2908.2255596394334],
    backingDistance: [23.671589425163184, 61.846823840041452],
    fDistance: [elapsed * 9.4731034079341114, 1485.0361917397374],
    hDistance: [elapsed * 2.7053889424963877, 424.10436672371787],
    gDistance: [elapsed * 9.0785769175147255, 1423.189367899696],
    // latusRectumDistance: [null, null],
    length: [1136.7724089520932, 2970.0723834794749],
    width: [324.64667309956644, 848.20873344743575],
}

const behaviorConfig = {limitSpreadRateByReactionIntensity: true,
    limitSpreadRateByEffWindSpeed: false}
const config = {saveInfoProps: true, saveTestProps: true}
const curingConditions = {herb: 0.778}
const moistureConditions = {dead1h: 0.05, dead10h: 0.07, dead100h: 0.09, herb: 0.5, stem: 1.5}
const windSlopeConditions = {midflameWindSpeed: 10*88, windBearing: 90, aspect: 180, slopeRatio: 0.25}
    
const catalog = new StandardFuelModelCatalog()
const fuelModel = catalog.get(10)
const fuelBed = new FuelBed(fuelModel, curingConditions, config)
const fuelIgnition = new FuelIgnition(fuelBed, moistureConditions, config)
const fireBehavior = new FireBehavior(fuelIgnition, windSlopeConditions,
    behaviorConfig, config)
const betaDegrees = 360 - 42.573367385837855 // FM124: 360 - 42.613728665173383
const fireEllipse1 = new FireEllipse({...fireBehavior, elapsedTime: elapsed})
for(let [prop, values] of Object.entries(bpProps)) {
    if (Math.abs(values[0] - fireEllipse1[prop]) > 0.01)
    console.log(`FM010 prop ${prop} expect value ${values[0]}, received ${fireEllipse1[prop]}`)
}

// A simpler FireEllipse
const fireEllipse2 = new FireEllipse({headingSpreadRate: 10, lengthWidthRatio: 2,
    bearing: 0, elapsedTime: 1, ignEast: 0, ignNorth: 0, flameLength: 10})

// ----------------------------------------------------------------------------------

const table = []
function add(name, vector) {
    let {angle, bearing, x, y, east, north, distance, spreadRate,
        firelineIntensity} = vector
    table.push({name,
        angle: angle.toFixed(2), bearing: bearing.toFixed(2),
        x: x.toFixed(2), y: y.toFixed(2),
        // east: east.toFixed(2), north: north.toFixed(2),
        ros: spreadRate.toFixed(2),
        dist: distance.toFixed(2),
        fli: firelineIntensity.toFixed(2)})
}

const fe = fireEllipse1

// console.log(`Fire Bearing = ${fe.bearing}, Fire Rotation = ${fe.rotationDeg}, L/W=${fe.lengthWidthRatio}`)
// const b = calcBetaFromTheta(fe, 90)
// console.log(`At theta of 90 degrees, beta is ${b.toFixed(2)} degrees`)

// add('head', new BetaFireVector(fe, 0))
// add('back', new BetaFireVector(fe, 180))
// add('center', new CenterVector(fe))
// add('beta @ 45', new BetaFireVector(fe, 45))
// add('beta @theta 90', new BetaFireVector(fe).setTheta(90))
// add('beta @theta 270', new BetaFireVector(fe).setTheta(270))
// add('theta @ 0', new ThetaVector(fe, 0))
// add('theta @ 90', new ThetaVector(fe, 90))
// add('theta @ 180', new ThetaVector(fe, 180))
// add('theta @ 270', new ThetaVector(fe, 270))
// console.table(table)

const beta6FromHead = 360 - 42.573367385837855
const beta5 = new BetaFireVector(fe, beta6FromHead)
const beta6 = new Beta6FireVector(fe, beta6FromHead)
console.log(beta5.spreadRate, beta5.firelineIntensity)
console.log(beta6.spreadRate, beta6.firelineIntensity)