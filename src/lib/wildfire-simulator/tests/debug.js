import { StandardFuelModelCatalog } from '../src/StandardFuelModelCatalog.js'
import { FuelBed } from '../src/FuelBed.js'
import { FuelIgnition } from '../src/FuelIgnition.js'
import { FireBehavior } from '../src/FireBehavior.js'
import { FireEllipse } from '../src/FireEllipse.js'
import { BetaFireVector } from '../src/FireVector.js'

// Inputs
const inputs = {
    // Save all testing properties
    saveProps: 2,
    // FuelBed
    curedHerb: 0.778,
    // FuelIgnition
    moistureDead1h: 0.05,
    moistureDead10h: 0.07,
    moistureDead100h: 0.09,
    moistureLiveHerb: 0.5,
    moistureLiveStem: 1.5,
    // FireBehavior
    limitSpreadRateByReactionIntensity: true,
    limitSpreadRateByEffWindSpeed: false,
    midflameWindSpeed: 10*88,
    windBearing: 90,
    aspect: 180,
    slopeRatio: 0.25,
    // FireEllipse
    // headingSpreadRate: 0,    // provided by FireBehavior
    // lengthWidthRatio: 0,     // provided by FireBehavior
    // flameLength: 0,          // provided by FireBehavior
    // bearing: [87.573367385837855, 87.613728665173383]
    elapsedTime: 60,
    ignEast: 0,
    ignNorth: 0,
}
const beta5FromHead  = [360 - 42.573367385837855, 360 - 42.613728665173383]

const catalog = new StandardFuelModelCatalog()
const fuelModel = catalog.get(10)
const fuelBed = new FuelBed({fuelModel, ...inputs})
const fuelIgnition = new FuelIgnition({fuelBed, ...inputs})
const fireBehavior = new FireBehavior({fuelIgnition, ...inputs})
// Note that the fireBehavior instance must be spread,
// as FireEllipse uses its props directly, and NOT indirectly through its reference
const fireEllipse = new FireEllipse({...fireBehavior, ...inputs})
const betaVector = new BetaFireVector(fireEllipse, beta5FromHead[0])
console.log(betaVector)
