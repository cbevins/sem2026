import { FuelBed } from './FuelBed.js'
import { FireIgnition } from './FireIgnition.js'
import { StandardFuelModelCatalog } from "./StandardFuelModelCatalog.js"
import { FireBehavior } from "./FireBehavior.js"
import { ExpectedFireIgnition010, ExpectedFuelBed010 , ExpectedFireBehavior010} from './expectedResults.js'

import { traverseObject } from './traverseObject.js';
import { compareObjects } from './compareObjects.js';

console.log('runComparisons() -', new Date())
// 1 - Use a standard fuel model catalog and add any custom fuel models to it
const catalog = new StandardFuelModelCatalog()
catalog.set({number: 999, code: 'cheatgrass', label: "Cheat Grass", desc: "Awful stuff", depth: 1, deadMext: 0.15, particles: []})

// 2 - Create a FuelBed from a FuelModel and the seasonal curing conditions
const curingConditions = {herb: 0.778, cheatgrass: 1}
const fuelModel010 = catalog.get(10)
const fuelBed010 = new FuelBed(fuelModel010, curingConditions)
// const fuelModel124 = catalog.get(124)
// const fuelBed124 = new FuelBed(fuelModel124, curingConditions)

// 3 - Create a FireBed from a FuelBed and fuel moisture conditions
const moistureConditions = {dead1h: 0.05, dead10h: 0.07, dead100h: 0.09, herb: 0.5, stem: 1.5}
const fireIgnition010 = new FireIgnition(fuelBed010, moistureConditions)

// 4 - Create FireBehavior from a FireIgnition and wind-slope conditions
const windSlopeConditions = {windSpeed: 880, bearing: 90, aspect: 180, slopeRatio: 0.25}
const config = {applySpreadRateLimit: true}
const fireBehavior010 = new FireBehavior(fireIgnition010, windSlopeConditions, config)


function compare(objName, modelName, expected, actual) {
    let errors = 0
    console.log(`\nTraversing Actual ${objName} ${modelName}: ------------------------------------------------`)
    console.log('0: ' + objName)
    traverseObject(actual)
    console.log(`\nDone traversing ${objName} ${modelName}: -------------------------------------------`)

    console.log(`\nValidating ${objName} ${modelName} -------------------------------------------------`)
    errors = compareObjects(expected, actual)
    console.log(`Found ${errors} errors while validating ${objName} ${modelName}------------------------`)
}

// compare('FuelBed', 'FuelModel 124', ExpectedFuelBed124, fuelBed124)
compare('FuelBed', 'FuelModel 10', ExpectedFuelBed010, fuelBed010)
// compare('FireIgnition', 'FuelModel 10', ExpectedFireIgnition010, fireIgnition010)
// compare('FireBehavior', 'FuelModel 10', ExpectedFireBehavior010, fireBehavior010)