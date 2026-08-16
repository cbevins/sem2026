import { FuelModelCatalog } from "./FuelModelCatalog.js"
import { FuelBed } from "./FuelBed.js"
import { FuelIgnition } from "./FuelIgnition.js"
import { FireBehavior } from "./FireBehavior.js"

export class FbfmChart {
    constructor() {
        this.initData()
        this.initFuels()
    }
    initData() {
        // Scott & Burgan conditions
        this.scottBurgan = {
            moistureDead1h:   [0.03, 0.06, 0.09, 0.12],
            moistureDead10h:  [0.04, 0.07, 0.10, 0.13],
            moistureDead100h: [0.05, 0.08, 0.11, 0.14],
            moistureLiveStem: [0.60, 0.90, 1.20, 1.50],
            moistureLiveHerb: [0.30, 0.60, 0.90, 1.20],
            curedHerb:        [1.00,  2/3,  1/3,    0],
        }
        this.data = {
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
        this.prev = {...this.data}
        this.results = {}
    }

    // Creates and initializes all the fire behavior fuel models
    initFuels() {
        this.catalog = new FuelModelCatalog()
        this.fuelKeys = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13',
            'gr1', 'gr2', 'gr3', 'gr4', 'gr5', 'gr6',  'gr7', 'gr8', 'gr9',
            'gs1', 'gs2', 'gs3', 'gs4',
            'sh1', 'sh2', 'sh3', 'sh4', 'sh5',  'sh6', 'sh7', 'sh8', 'sh9',
            'tu1', 'tu2', 'tu3', 'tu4', 'tu5',
            'tl1', 'tl2', 'tl3',  'tl4', 'tl5', 'tl6', 'tl7', 'tl8', 'tl9',
            'sb1', 'sb2', 'sb3', 'sb4']
        this.fuel = {}
        for(let fuelKey of this.fuelKeys) {
            const isCurable = this.catalog.isCurable(fuelKey)
            const fuelModel = this.catalog.get(fuelKey)
            const fuelBed = new FuelBed()
            fuelBed.update(fuelModel, this.data)
            const fuelIgnition = new FuelIgnition()
            fuelIgnition.update(fuelBed, this.data)
            const fireBehavior = new FireBehavior()
            fireBehavior.update(fuelBed, fuelIgnition,
                this.data.midflameWindSpeed, this.data.windBearing,
                this.data.slopeRatio, this.data.slopeAspect)
            this.fuel[fuelKey] = {fuelKey, isCurable, selected: true,
                fuelModel, fuelBed, fuelIgnition, fireBehavior}
        }
        this.saveResults()
    }

    fmt2(x) { return Math.trunc(100*x)/100 }
    fmt4(x) { return Math.trunc(10000*x)/10000 }

    getFuels() {
        return Object.values(this.fuel)
    }
    
    saveResults() {
        this.results = {}
        for(let fuelKey of this.fuelKeys) {
            const fuel = this.fuel[fuelKey]
            if (fuel.selected) {
                this.results[fuelKey] = {fuelKey,
                    ros: fuel.fireBehavior.headingSpreadRate,
                    fli: fuel.fireBehavior.firelineIntensity,
                    flame: fuel.fireBehavior.flameLength,
                }
            }
        }
    }
    update(data) {
        this.data = {...data}
        for(let fuelKey of this.fuelKeys) {
            const fuel = this.fuel[fuelKey]
            if (fuel.selected)
                this.updateFuel(fuel, data)
        }
        this.prev = {...data}
        this.saveResults()
        return this
    }
    updateFuel(fuel, data) {
        // Only 16 of the 53 fuel models have curable live herb fuels,
        // so only rebuild their fuel beds and only when cured herb fraction changes
        if (fuel.isCurable && this.prev.curedHerb !== data.curedHerb) {
            fuel.fuelBed.update(fuel.fuelModel, data)
        }
        fuel.fuelIgnition.update(fuel.fuelBed, data)
        fuel.fireBehavior.update(fuel.fuelBed, fuel.fuelIgnition,
            data.midflameWindSpeed, data.windBearing, data.slopeRatio, data.slopeAspect)
    }
}
