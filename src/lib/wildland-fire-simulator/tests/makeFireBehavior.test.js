import { describe, it, expect } from 'vitest'
import { makeFuelBed, makeFireBehavior, makeFuelCatalog, makeFuelCuring, makeFuelIgnition,
    makeFuelModel, makeFuelMoisture, makeLogger } from '../Wfs.js'
import { Bp6Configs, Bp6FireTerrain, Bp6FireWeather, Bp6FuelCuring, Bp6FuelMoisture } from './Bp6Inputs.js'

import { parts, ppb } from './assertions.js'
expect.extend({ parts })

// Dummy functions to test error
function noFuelIgnitionArg() { makeFireBehavior({fuelBed:{}}) }
function noFuelBedArg() { makeFireBehavior({fuelIgnition:{}}) }

// Inputs
let configs = {...Bp6Configs}
configs.logger = makeLogger()

let fuelCatalog = makeFuelCatalog(configs)
let fuelMoisture = {...Bp6FuelMoisture}
fuelMoisture = makeFuelMoisture({fuelMoisture}, configs)
let fuelCuring = {...Bp6FuelCuring}
fuelCuring = makeFuelCuring({fuelCuring, fuelMoisture}, configs)
let fireWeather = {...Bp6FireWeather}
let fireTerrain = {...Bp6FireTerrain}

describe('makeFireBehavior()', () => {
    it('throws an error if makeFireBehavior() is not passed an input.fuelBed property', () => {
        expect(() => noFuelBedArg()).toThrow()
    })
    it('throws an error if makeFireBehavior() is not passed an inputs.fuelIgnition property', () => {
        expect(() => noFuelIgnitionArg()).toThrow()
    })
    it('Uses WfsFireWeather if makeFireBehavior() is not passed a inputs.fireWeather property', () => {
        configs.logger.clear()
        let fuelModel = makeFuelModel({fuelCatalog, fuelKey: 10}, configs)
        let fuelBed = makeFuelBed({fuelModel, fuelCuring}, configs)
        let fuelIgnition = makeFuelIgnition({fuelBed, fuelMoisture}, configs)
        let fireBehavior = makeFireBehavior({fuelBed, fuelIgnition, fireTerrain}, configs)
        expect(configs.logger.length()).toBe(1)
        expect(fireBehavior.headingSpreadRate).parts(18.551680325448835, ppb)
    })
    it('Uses WfsFireTerrain if makeFireBehavior() is not passed a inputs.fireTerrain property', () => {
        configs.logger.clear()
        let fuelModel = makeFuelModel({fuelCatalog, fuelKey: 10}, configs)
        let fuelBed = makeFuelBed({fuelModel, fuelCuring}, configs)
        let fuelIgnition = makeFuelIgnition({fuelBed, fuelMoisture}, configs)
        let fireBehavior = makeFireBehavior({fuelBed, fuelIgnition, fireWeather}, configs)
        expect(configs.logger.length()).toBe(1)
        expect(fireBehavior.headingSpreadRate).parts(18.551680325448835, ppb)
    })

    it('Fuel Model 10 FireBehavior properties match BehavePlus v5 and v6 beta:', () => {
        configs.logger.clear()
        let fuelModel = makeFuelModel({fuelCatalog, fuelKey: 10}, configs)
        let fuelBed = makeFuelBed({fuelModel, fuelCuring}, configs)
        let fuelIgnition = makeFuelIgnition({fuelBed, fuelMoisture}, configs)
        let fireBehavior = makeFireBehavior({fuelBed, fuelIgnition, fireWeather, fireTerrain}, configs)
        expect(configs.logger.length()).toBe(0)

        expect(fireBehavior.xComponent).parts(0.75673013692577218, 1.0e-8)
        expect(fireBehavior.yComponent).parts(17.856644527335789, ppb)

        expect(fireBehavior.headingSpreadRate).parts(18.551680325448835, ppb)
        expect(fireBehavior.residenceTime).parts(0.21764611427384198, ppb)
        expect(fireBehavior.headingFromUpslope).parts(87.573367385837855, ppb)
        expect(fireBehavior.bearing).parts(87.573367385837855, ppb)
        expect(fireBehavior.firelineIntensity).parts(389.95413667947145, ppb)
        expect(fireBehavior.flameLength).parts(6.9996889013229229, ppb)
        expect(fireBehavior.heatPerUnitArea).parts(1261.1929372603729, ppb)
        expect(fireBehavior.effWindSpeedLimit).parts(5215.2258602062057, ppb)
        expect(fireBehavior.effWindFactor).parts(26.321715915373524, ppb)
        expect(fireBehavior.effWindSpeed).parts(880.55194372010692, ppb)
        expect(fireBehavior.lengthWidthRatio).parts(3.5015680219321221, ppb)
        expect(fireBehavior.scorchHeight).parts(39.580182, 1.0e-8)
    })
    it('Fuel Model 124 FireBehavior properties match BehavePlus v5 and v6 beta:', () => {
        configs.logger.clear()
        let fuelModel = makeFuelModel({fuelCatalog, fuelKey: 124}, configs)
        let fuelBed = makeFuelBed({fuelModel, fuelCuring}, configs)
        let fuelIgnition = makeFuelIgnition({fuelBed, fuelMoisture}, configs)
        let fireBehavior = makeFireBehavior({fuelBed, fuelIgnition, fireWeather, fireTerrain}, configs)
        expect(configs.logger.length()).toBe(0)

        expect(fireBehavior.xComponent).parts(1.9584486126230398, 1.0e-8)
        expect(fireBehavior.yComponent).parts(46.996312501163828, ppb)

        expect(fireBehavior.headingSpreadRate).parts(48.47042599399056, ppb)
        expect(fireBehavior.residenceTime).parts( 0.23541979977677915, ppb)
        expect(fireBehavior.headingFromUpslope).parts(87.613728665173383, ppb)
        expect(fireBehavior.bearing).parts(87.613728665173383, ppb)
        expect(fireBehavior.firelineIntensity).parts(2467.928645, ppb)
        expect(fireBehavior.flameLength).parts(16.35631663, ppb)
        expect(fireBehavior.heatPerUnitArea).parts(12976.692888496578 * 0.23541979977677915, ppb)
        expect(fireBehavior.effWindSpeedLimit).parts(11679.02359964692, ppb)
        expect(fireBehavior.effWindFactor).parts(32.816782854703028, ppb)
        expect(fireBehavior.effWindSpeed).parts(880.5568433322004, ppb)
        expect(fireBehavior.lengthWidthRatio).parts(3.501581941, ppb)
        expect(fireBehavior.scorchHeight).parts(215.682771, 1.0e-8)
    })
})
