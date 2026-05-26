import { describe, it, expect } from 'vitest'
import { StandardFuelModelCatalog } from '../src/StandardFuelModelCatalog.js'
import { FuelBed } from '../src/FuelBed.js'
import { FuelIgnition } from '../src/FuelIgnition.js'

import { parts } from './assertions.js'
expect.extend({ parts })
const ppb = 1.0e-9  // parts per billion

// This has been tested in ./standardFuelModelCatalog.test.js
const catalog = new StandardFuelModelCatalog()
const config = {saveInfoProps: true, saveTestProps: true}

const curingConditions = {herb: 0.778}
const moistureConditions = {dead1h: 0.05, dead10h: 0.07, dead100h: 0.09, herb: 0.5, stem: 1.5}

describe('FuelIgnition Class', () => {
    it('Fuel Model 10 FuelIgnition properties meet specs:', () => {
        const fuelModel = catalog.get(10)
        const fuelBed = new FuelBed(fuelModel, curingConditions, config)
        const fuelIgnition = new FuelIgnition(fuelBed, moistureConditions, config)

        expect(fuelIgnition.reactionIntensity).parts(5794.6954002291168, ppb)
        expect(fuelIgnition.noWindSpreadRate).parts(0.67900860922904482, ppb)

    })
    it('Fuel Model 124 FuelIgnition properties meet specs:', () => {
        const fuelModel = catalog.get(124)
        const fuelBed = new FuelBed(fuelModel, curingConditions, config)
        const fuelIgnition = new FuelIgnition(fuelBed, moistureConditions, config)

        expect(fuelIgnition.reactionIntensity).parts(12976.692888496578, ppb)
        expect(fuelIgnition.noWindSpreadRate).parts(1.4333245773924823, ppb)
    })
})
