import { describe, it, expect } from 'vitest'
import { StandardFuelModelCatalog } from '../src/StandardFuelModelCatalog.js'
import { FuelBed } from '../src/FuelBed.js'
import { FuelIgnition } from '../src/FuelIgnition.js'
import { FireBehavior } from '../src/FireBehavior.js'

import { parts, ppb } from './assertions.js'
expect.extend({ parts })

// Dummy functions to test error
function noFuelIgnitionArg() { new FireBehavior() }
function badFuelIgnitionArg() { new FireBehavior({fuelIgnition:{}}) }

// Inputs
const inputs = {
    // Save all testing properties
    saveProps: 2,
    // FuelBed()
    curedHerb: 0.778,
    // FuelIgnition()
    moistureDead1h: 0.05,
    moistureDead10h: 0.07,
    moistureDead100h: 0.09,
    moistureLiveHerb: 0.5,
    moistureLiveStem: 1.5,
    // FireBehavior()
    limitSpreadRateByReactionIntensity: true,
    limitSpreadRateByEffWindSpeed: false,
    midflameWindSpeed: 10*88,
    windBearing: 90,
    aspect: 180,
    slopeRatio: 0.25,
}

// This has been tested in ./standardFuelModelCatalog.test.js
const catalog = new StandardFuelModelCatalog()

describe('FireBehavior Class', () => {
    it('throws an error if new FireBehavior() is not passed a {fuelIgnition} property', () => {
        expect(() => noFuelIgnitionArg()).toThrow()
    })
    
    it('throws an error if new FireBehavior({fuelIgnition}) property is not a FuelIgnition instance', () => {
        expect(() => badFuelIgnitionArg()).toThrow()
    })

    it('Fuel Model 10 FireBehavior properties match BehavePlus v5 and v6 beta:', () => {
        const fuelModel = catalog.get(10)
        const fuelBed = new FuelBed({fuelModel, ...inputs})
        const fuelIgnition = new FuelIgnition({fuelBed, ...inputs})
        const fireBehavior = new FireBehavior({fuelIgnition, ...inputs})

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
        expect(fireBehavior.getScorchHeight(95)).parts(39.580182, 1.0e-8)
    })
    it('Fuel Model 124 FireBehavior properties match BehavePlus v5 and v6 beta:', () => {
        const fuelModel = catalog.get(124)
        const fuelBed = new FuelBed({fuelModel, ...inputs})
        const fuelIgnition = new FuelIgnition({fuelBed, ...inputs})
        const fireBehavior = new FireBehavior({fuelIgnition, ...inputs})

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
        expect(fireBehavior.getScorchHeight(95)).parts(215.682771, 1.0e-8)
    })
})
