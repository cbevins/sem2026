/**
 * FbfmBehavior.js is the 'model' of the 'Fire Behavior Fuel Model Chart'
 */
import { FuelModelCatalog } from "./FuelModelCatalog.js"
import { FuelBed } from "./FuelBed.js"
import { FuelIgnition } from "./FuelIgnition.js"
import { FireBehavior } from "./FireBehavior.js"

export const FbfmInput = {
    curedHerb: 0,
    moistureDead1h: 0.01,
    moistureDead10h: 0.01,
    moistureDead100h: 0.01,
    moistureLiveHerb: 0.3,
    moistureLiveStem: 0.3,
    midflameWindSpeed: 40*88,
    slopeRatio: 0,
    windBearing: 0,
    slopeAspect: 180,
    // The following wind speed options are not yet implemented
    // windSpeedAt: 'midflame',    // 'midflame', '20ft', or'10m'
    // canopyHt: 0,
    // canopyBase: 0,
    // canopyFill: 0,
}

export const FbfmFuelKeys = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13',
    'gr1', 'gr2', 'gr3', 'gr4', 'gr5', 'gr6', 'gr7', 'gr8', 'gr9',
    'gs1', 'gs2', 'gs3', 'gs4',
    'sh1', 'sh2', 'sh3', 'sh4', 'sh5', 'sh6', 'sh7', 'sh8', 'sh9',
    'tu1', 'tu2', 'tu3', 'tu4', 'tu5',
    'tl1', 'tl2', 'tl3', 'tl4', 'tl5', 'tl6', 'tl7', 'tl8', 'tl9',
    'sb1', 'sb2', 'sb3', 'sb4'
]

export class FbfmBehavior {
    constructor() {
        this.catalog = new FuelModelCatalog()
        this.input = {...FbfmInput}
        this.prevInput = {...FbfmInput}
        this.fuelKeys = [...FbfmFuelKeys]

        // Create each fuel object
        const {midflameWindSpeed, windBearing, slopeRatio, slopeAspect} = this.input
        this.fuel = {}
        for(let fuelKey of this.fuelKeys) {
            const groupKey = this.getGroupKey(fuelKey)
            const isCurable = this.catalog.isCurable(fuelKey)
            const fuelModel = this.catalog.get(fuelKey)
            const fuelBed = new FuelBed()
            fuelBed.update(fuelModel, this.input)
            const fuelIgnition = new FuelIgnition()
            fuelIgnition.update(fuelBed, this.input)
            const fireBehavior = new FireBehavior()
            fireBehavior.update(fuelBed, fuelIgnition,
                midflameWindSpeed, windBearing, slopeRatio, slopeAspect)
            this.fuel[fuelKey] = {fuelKey, groupKey,
                isCurable, fuelModel, fuelBed, fuelIgnition, fireBehavior}
        }
    }
    getGroupKey(fuelKey) {
        const g = fuelKey.slice(0, 2)
        if (g==='gr' || g==='gs' || g==='sh' || g==='tl' || g=== 'tu' || g==='sb') return g
        return '13'
    }
    update(input) {
        this.input = {...input}
        for(let fuelKey of this.fuelKeys) {
            this.updateFuel(this.fuel[fuelKey], input)
        }
        this.prevInput = {...input}
        return this
    }

    updateFuel(fuel, input) {
        // Only 16 of the 53 fuel models have curable live herb fuels,
        // so must rebuild their fuel beds only when cured herb fraction changes
        if (fuel.isCurable && this.prevInput.curedHerb !== input.curedHerb) {
            fuel.fuelBed.update(fuel.fuelModel, input)
        }
        // For now, we'll *always* update the moisture and wind-slope dependent props
        fuel.fuelIgnition.update(fuel.fuelBed, input)
        fuel.fireBehavior.update(fuel.fuelBed, fuel.fuelIgnition,
            input.midflameWindSpeed, input.windBearing,
            input.slopeRatio, input.slopeAspect)
    }

    getData() {
        const data = []
        for(let fuelKey of this.fuelKeys) {
            const fuel = this.fuel[fuelKey]
            data.push({
                fuelKey,
                groupKey: fuel.groupKey,
                isCurable: fuel.isCurable,
                depth: fuel.fuelBed.depth,
                wsrf: fuel.fuelBed.midflameWsrf,
                savr: fuel.fuelBed.savr,
                deadMext: fuel.fuelIgnition.dead.mext,
                liveMext: fuel.fuelIgnition.live.mext,
                ros: fuel.fireBehavior.headingSpreadRate,
                fli: fuel.fireBehavior.firelineIntensity,
                flame: fuel.fireBehavior.flameLength,
            })
        }
        return data
    }
}
