import { StandardFuelModelCatalog } from '../src/StandardFuelModelCatalog.js'
import { FuelBed } from '../src/FuelBed.js'
import { FuelIgnition } from '../src/FuelIgnition.js'
import { FireBehavior } from '../src/FireBehavior.js'
import { FireEllipse } from '../src/FireEllipse.js'

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

const elapsed = 60
const betaDegrees = 360 - 42.573367385837855 // FM124: 360 - 42.613728665173383
const fireEllipse = new FireEllipse(fireBehavior, config)
            .setElapsedTime(elapsed)
            .setFireVectorAngle(betaDegrees)
