import { describe, it, expect } from 'vitest'
import { makeFuelBed, makeFuelCatalog, makeFuelModel, makeLogger  } from '../Wfs.js'
import { Bp6Configs } from './Bp6Inputs.js'

import { parts } from './assertions.js'
expect.extend({ parts })

// Dummy functions to test error
function noFuelCatalogArg() { makeFuelBed() }

let configs = {...Bp6Configs}
configs.logger = makeLogger()
let fuelCatalog = makeFuelCatalog(configs)

describe('FuelBed Class', () => {
    it('throws an error if makeFuelModel() is not passed a inputs.fuelCatalog property', () => {
        configs.logger.clear()
        expect(() => noFuelCatalogArg()).toThrow()
    })

    it('Uses Fuel Model 1 if makeFuelModel() is not passed a inputs.fuelKey property', () => {
        configs.logger.clear()
        let fuelModel = makeFuelModel({fuelCatalog}, configs)
        expect(fuelModel.number).toBe(1)
        expect(fuelModel.code).toBe('1')
        expect(configs.logger.length()).toBe(1)
    })

    it('Uses Fuel Model 1 if makeFuelModel() is passed a bad inputs.fuelKey property', () => {
        configs.logger.clear()
        let fuelModel = makeFuelModel({fuelCatalog, fuelKey: 'junk'}, configs)
        expect(fuelModel.number).toBe(1)
        expect(fuelModel.code).toBe('1')
        expect(configs.logger.length()).toBe(1)
    })
    
    it('Fuel Model 10 FuelBed properties match BehavePlus v5 and v6 beta:', () => {
        configs.logger.clear()
        let fuelModel = makeFuelModel({fuelCatalog, fuelKey: 10}, configs)
        expect(fuelModel.number).toBe(10)
        expect(fuelModel.code).toBe('10')
        expect(configs.logger.length()).toBe(0)
    })
    
    it('Fuel Model 124 FuelBed properties match BehavePlus v5 and v6 beta:', () => {
        configs.logger.clear()
        let fuelModel = makeFuelModel({fuelCatalog, fuelKey: 124}, configs)
        expect(fuelModel.number).toBe(124)
        expect(fuelModel.code).toBe('gs4')
        expect(configs.logger.length()).toBe(0)
    })
})
