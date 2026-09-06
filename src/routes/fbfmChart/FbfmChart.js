/**
 * FbfmChart.js is the 'model' of the 'Fire Behavior Fuel Model Chart'
 * model-view-controller architecture.  It defines all the data structures:
 * - 'input' object contains all the weather and site conditions,
 * - 'fuel' object contains all the FBFM fuel conditions and properties.
 * 
 * Note that 'fuel' is an *object* whose keys are fuel model keys.
 * Use the getFuels() method to obtain an *array* of fuel models.
 * 
 * The update() method must be called whenever any of the 'input' properties changes
 * to update all the 'fuel' properties.
 */
import { FuelModelCatalog } from "./FuelModelCatalog.js"
import { FuelBed } from "./FuelBed.js"
import { FuelIgnition } from "./FuelIgnition.js"
import { FireBehavior } from "./FireBehavior.js"
import { FbfmFuelStyles } from './FbfmFuelStyles.js'

export class FbfmChart {
    constructor() {
        this.initData()
        this.initFuels()
    }
    initData() {
        // Scott & Burgan conditions
        // this.scottBurgan = {
        //     moistureDead1h:   [0.03, 0.06, 0.09, 0.12],
        //     moistureDead10h:  [0.04, 0.07, 0.10, 0.13],
        //     moistureDead100h: [0.05, 0.08, 0.11, 0.14],
        //     moistureLiveStem: [0.60, 0.90, 1.20, 1.50],
        //     moistureLiveHerb: [0.30, 0.60, 0.90, 1.20],
        //     curedHerb:        [1.00,  2/3,  1/3,    0],
        // }
        this.input = {
            curedHerb: 2/3,
            moistureDead1h: 0.01,
            moistureDead10h: 0.01,
            moistureDead100h: 0.01,
            moistureLiveHerb: 0.3,
            moistureLiveStem: 0.3,
            midflameWindSpeed: 40*88,
            slopeRatio: 0,
            windBearing: 0,
            slopeAspect: 180
        }
        this.prev = {...this.input}
    }

    // Creates and initializes all the fire behavior fuel models
    initFuels() {
        this.catalog = new FuelModelCatalog()
        // Fuel models of interest (ignore non-burnable and custom fuels)
        this.fuelKeys = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13',
            'gr1', 'gr2', 'gr3', 'gr4', 'gr5', 'gr6', 'gr7', 'gr8', 'gr9',
            'gs1', 'gs2', 'gs3', 'gs4',
            'sh1', 'sh2', 'sh3', 'sh4', 'sh5', 'sh6', 'sh7', 'sh8', 'sh9',
            'tu1', 'tu2', 'tu3', 'tu4', 'tu5',
            'tl1', 'tl2', 'tl3', 'tl4', 'tl5', 'tl6', 'tl7', 'tl8', 'tl9',
            'sb1', 'sb2', 'sb3', 'sb4']
        // Fuel model groups
        this.fuelGroups = {
            '13': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
            gr: ['gr1', 'gr2', 'gr3', 'gr4', 'gr5', 'gr6',  'gr7', 'gr8', 'gr9'],
            gs: ['gs1', 'gs2', 'gs3', 'gs4'],
            sh: ['sh1', 'sh2', 'sh3', 'sh4', 'sh5',  'sh6', 'sh7', 'sh8', 'sh9'],
            tu: ['tu1', 'tu2', 'tu3', 'tu4', 'tu5'],
            tl: ['tl1', 'tl2', 'tl3', 'tl4', 'tl5', 'tl6', 'tl7', 'tl8', 'tl9'],
            sb: ['sb1', 'sb2', 'sb3', 'sb4']
        }
        
        // Create each fuel object
        this.fuel = {}
        for(let fuelKey of this.fuelKeys) {
            const isCurable = this.catalog.isCurable(fuelKey)
            const fuelModel = this.catalog.get(fuelKey)
            const fuelBed = new FuelBed()
            fuelBed.update(fuelModel, this.input)
            const fuelIgnition = new FuelIgnition()
            fuelIgnition.update(fuelBed, this.input)
            const fireBehavior = new FireBehavior()
            fireBehavior.update(fuelBed, fuelIgnition,
                this.input.midflameWindSpeed, this.input.windBearing,
                this.input.slopeRatio, this.input.slopeAspect)
            this.fuel[fuelKey] = {
                fuelKey,
                label: fuelKey.toUpperCase(),
                isActive: true,
                style: FbfmFuelStyles[fuelKey],
                isCurable,
                fuelModel,
                fuelBed,
                fuelIgnition,
                fireBehavior,
            }
        }
        // Add a fuel model 'group' key to each fuel model
        for (const [groupKey, fuelKeys] of Object.entries(this.fuelGroups)) {
            for(let fuelKey of fuelKeys) {
                this.fuel[fuelKey].groupKey = groupKey
            }
        }
    }

    // Returns an *array* of all the *fuel* object properties
    getFuels() {
        return Object.values(this.fuel)
    }

    update(input) {
        this.input = {...input}
        for(let fuelKey of this.fuelKeys) {
            const fuel = this.fuel[fuelKey]
            if (fuel.isActive)
                this.updateFuel(fuel, input)
        }
        this.prev = {...input}
        return this
    }

    updateFuel(fuel, input) {
        // Only 16 of the 53 fuel models have curable live herb fuels,
        // so only rebuild their fuel beds and only when cured herb fraction changes
        if (fuel.isCurable && this.prev.curedHerb !== input.curedHerb) {
            fuel.fuelBed.update(fuel.fuelModel, input)
        }
        fuel.fuelIgnition.update(fuel.fuelBed, input)
        fuel.fireBehavior.update(fuel.fuelBed, fuel.fuelIgnition,
            input.midflameWindSpeed, input.windBearing,
            input.slopeRatio, input.slopeAspect)
    }
}
