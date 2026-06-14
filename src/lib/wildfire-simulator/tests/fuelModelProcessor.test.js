import { describe, it, expect } from 'vitest'
import { FuelModelProcessor} from '../src/FuelModelProcessor.js'
import {Herb} from '../src/StandardFuelModels.js'

const Cheatgrass = {
    number: 666,
    code: "cheatgrass",
    group: "CUSTOM",
    label: "Cheatgrass",
    desc: "Cures earlier in the season than other herbs",
    depth: 1,
    deadMext: 0.15,
    particles: [
        {...Herb, ovendryLoad: 0.10, savr: 2500, heat: 8000,
        liveMoistureClass: "moistureLiveCheatgrass", curingClass: "curedCheatgrass"}
    ],
}

describe('FuelModelProcessor Class', () => {
    it('FBFM13, FBFM40, and LANDFIRE fuel models are available by default', () => {
        const catalog = new FuelModelProcessor()
        expect(catalog.has({fuelKey: 1})).toBe(true)
        expect(catalog.has({fuelKey: '1'})).toBe(true)
        expect(catalog.has({fuelKey: 101})).toBe(true)
        expect(catalog.has({fuelKey: 'gr1'})).toBe(true)
        expect(catalog.has({fuelKey: 99})).toBe(true)
        expect(catalog.has({fuelKey: 'nb9'})).toBe(true)
    })
    it('Fuel keys are not case-sensitive', () => {
        const catalog = new FuelModelProcessor()
        expect(catalog.has({fuelKey:'GR1'})).toBe(true)
        expect(catalog.has({fuelKey:'gr1'})).toBe(true)
        expect(catalog.has({fuelKey:'gR1'})).toBe(true)
    })
    it('Can include custom fuel models with their own curing and moisture classes', () => {
        const catalog = new FuelModelProcessor()
        catalog.set(Cheatgrass.number, Cheatgrass)
        catalog.set(Cheatgrass.code, Cheatgrass)
        expect(catalog.has({fuelKey: 666})).toBe(true)
        expect(catalog.has({fuelKey: 'CHEATgrASS'})).toBe(true)
    })
    it('has() returns FALSE if key not found, TRUE if it is found', () => {
        const catalog = new FuelModelProcessor()
        expect(catalog.has({fuelKey: 'gr1'})).toBe(true)
        expect(catalog.has({fuelKey: 'junk'})).toBe(false)
    })
    it('get() returns FALSE if key not found', () => {
        const catalog = new FuelModelProcessor()
        expect(catalog.get({fuelKey: 'junk'})).toBe(false)
    })
    it('Returns a deep copy of the FuelModel as a plain old data object', () => {
        const catalog = new FuelModelProcessor()
        const copy1 = catalog.get({fuelKey: 10})
        const copy2 = catalog.get({fuelKey: 10})
        expect(copy1.label).toBe("Timber litter & understory")
        expect(copy2.label).toBe("Timber litter & understory")
        
        copy1.label = 'Not the same label'
        copy1.particles[0].heat= 9999
        expect(copy1.label).toBe("Not the same label")
        expect(copy1.particles[0].heat).toBe(9999)
        expect(copy2.label).toBe("Timber litter & understory")
        expect(copy2.particles[0].heat).toBe(8000)

        const copy3 = catalog.get({fuelKey: 10})
        expect(copy3.label).toBe("Timber litter & understory")
        expect(copy1.label).toBe("Not the same label")
        expect(copy2.label).toBe("Timber litter & understory")
    })
})
