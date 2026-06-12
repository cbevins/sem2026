import { describe, it, expect } from 'vitest'
import { StandardFuelModelCatalog } from '../src/StandardFuelModelCatalog.js'
import {Herb} from '../src/StandardFuelModels.js'

const Cheatgrass = { number: 301,
        code: "cheatgrass",
        group: "CUSTOM",
        label: "Cheatgrass",
        desc: "Cures early in the season",
        depth: 1,
        deadMext: 0.15,
        particles: [
            {...Herb, ovendryLoad: 0.10, savr: 2500, heat: 8000},
        ],
    }

describe('StandardFuelModelCatalog Class', () => {
    it('has FBFM13, FBFM40, and LANDFIRE fuel models available by default', () => {
        const catalog = new StandardFuelModelCatalog()
        expect(catalog.has(1)).toBe(true)
        expect(catalog.has(101)).toBe(true)
        expect(catalog.has(99)).toBe(true)
    })
    it('keys are not case-sensitive', () => {
        const groups = {FBFM13: true, FBFM40: false, LANDFIRE: false, CUSTOM: false}
        const catalog = new StandardFuelModelCatalog(groups)
        expect(catalog.has('GR1')).toBe(false)
        expect(catalog.has('gr1')).toBe(false)
        expect(catalog.has('gR1')).toBe(false)
    })
    it('can be configured to contain just FBFM13 fuel models', () => {
        const groups = {FBFM13: true, FBFM40: false, LANDFIRE: false, CUSTOM: false}
        const catalog = new StandardFuelModelCatalog(groups)
        expect(catalog.has(1)).toBe(true)
        expect(catalog.has(101)).toBe(false)
        expect(catalog.has('GR1')).toBe(false)
        expect(catalog.has('gr1')).toBe(false)
        expect(catalog.has('gR1')).toBe(false)
        expect(catalog.has(99)).toBe(false)
        expect(catalog.has('nb1')).toBe(false)
    })
    it('can be configured to contain just FBFM40 fuel model', () => {
        const groups = {FBFM13: false, FBFM40: true, LANDFIRE: false, CUSTOM: false}
        const catalog = new StandardFuelModelCatalog(groups)
        expect(catalog.has(1)).toBe(false)
        expect(catalog.has(101)).toBe(true)
        expect(catalog.has('GR1')).toBe(true)
        expect(catalog.has(99)).toBe(false)
        expect(catalog.has('nb1')).toBe(false)
    })
    it('can be configured to contain FBFM40 and LANDFIRE fuel models', () => {
        const groups = {FBFM13: false, FBFM40: true, LANDFIRE: true, CUSTOM: false}
        const catalog = new StandardFuelModelCatalog(groups)
        expect(catalog.has(1)).toBe(false)
        expect(catalog.has(101)).toBe(true)
        expect(catalog.has('GR1')).toBe(true)
        expect(catalog.has(99)).toBe(true)
        expect(catalog.has('nb1')).toBe(true)
    })
    it('can be configured to include custom fuel models', () => {
        const groups = {FBFM13: false, FBFM40: true, LANDFIRE: true, CUSTOM: true}
        const catalog = new StandardFuelModelCatalog(groups)
        catalog.set(Cheatgrass.number, Cheatgrass)
        catalog.set(Cheatgrass.code, Cheatgrass)
        expect(catalog.has(301)).toBe(true)
        expect(catalog.has('CHEATgrASS')).toBe(true)
    })
    it('get() and has() return FALSE if key not found', () => {
        const groups = {FBFM13: false, FBFM40: true, LANDFIRE: true, CUSTOM: false}
        const catalog = new StandardFuelModelCatalog(groups)
        expect(catalog.has('junk')).toBe(false)
    })
})
