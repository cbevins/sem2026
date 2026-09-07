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

export const FbfmChartInput = {
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

export const FbfmChartFuelGroups = {
    '13': {
        groupKey: '13',
        fuelKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
        spriteFill: '#FB7185',}, // rose-400'},
    gr: {
        groupKey: 'gr',
        fuelKeys: ['gr1', 'gr2', 'gr3', 'gr4', 'gr5', 'gr6',  'gr7', 'gr8', 'gr9'],
        spriteFill: '#FFA14A',}, // orange-400
    gs: {
        groupKey: 'gs',
        fuelKeys: ['gs1', 'gs2', 'gs3', 'gs4'],
        spriteFill: '#A3E635',}, // lime-400
    sh: {
        groupKey: 'sh',
        fuelKeys: ['sh1', 'sh2', 'sh3', 'sh4', 'sh5',  'sh6', 'sh7', 'sh8', 'sh9'],
        spriteFill: '#A4DE80',},    // green-400
    tu: {
        groupKey: 'tu',
        fuelKeys: ['tu1', 'tu2', 'tu3', 'tu4', 'tu5'],
        spriteFill: '#34D399',},    // emerald-400
    tl: {
        groupKey: 'tl',
        fuelKeys: ['tl1', 'tl2', 'tl3', 'tl4', 'tl5', 'tl6', 'tl7', 'tl8', 'tl9'],
        spriteFill: '#2DD4BF',},    // teal-400
    sb: {
        groupKey: 'sb',
        fuelKeys: ['sb1', 'sb2', 'sb3', 'sb4'],
        spriteFill: '#FF6467',},    // red-400
}

export const FbfmChartFuelKeys = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13',
    'gr1', 'gr2', 'gr3', 'gr4', 'gr5', 'gr6', 'gr7', 'gr8', 'gr9',
    'gs1', 'gs2', 'gs3', 'gs4',
    'sh1', 'sh2', 'sh3', 'sh4', 'sh5', 'sh6', 'sh7', 'sh8', 'sh9',
    'tu1', 'tu2', 'tu3', 'tu4', 'tu5',
    'tl1', 'tl2', 'tl3', 'tl4', 'tl5', 'tl6', 'tl7', 'tl8', 'tl9',
    'sb1', 'sb2', 'sb3', 'sb4'
]

export class FbfmChart {
    constructor() {
        this.input = {...FbfmChartInput}
        this.prev = {...FbfmChartInput}
        this.catalog = new FuelModelCatalog()
        this.fuelKeys = [...FbfmChartFuelKeys]
        this.fuelGroups = {...FbfmChartFuelGroups}

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
        // Add a fuel model 'groupKey' to each fuel model
        for (const [groupKey, group] of Object.entries(this.fuelGroups)) {
            for(let fuelKey of group.fuelKeys) {
                this.fuel[fuelKey].groupKey = groupKey
            }
        }
    }

    // Returns an *array* of all the *fuel* object properties
    getFuelsArray() { return Object.values(this.fuel)  }
    getGroupsArray() { return Object.values(this.fuelGroups)  }

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

    // Data access convenience methods
    isActive(fuelKey) { return this.fuel[fuelKey].isActive }
    isCurable(fuelKey) { return this.fuel[fuelKey].isCurable }
    label(fuelKey) { return this.fuel[fuelKey].label }
    ros(fuelKey) { return this.fuel[fuelKey].fireBehavior.headingSpreadRate }
    fli(fuelKey) { return this.fuel[fuelKey].fireBehavior.firelineIntensity }
    flame(fuelKey) { return this.fuel[fuelKey].fireBehavior.flameLength }
    deadMext(fuelKey) { return this.fuel[fuelKey].fuelIgnition.dead.mext }
    depth(fuelKey) { return this.fuel[fuelKey].fuelBed.depth }
    liveMext(fuelKey) { return this.fuel[fuelKey].fuelIgnition.live.mext }
    savr(fuelKey) { return this.fuel[fuelKey].fuelBed.savr }
    wsrf(fuelKey) { return this.fuel[fuelKey].fuelBed.midflameWsrf }
    
    groupKey(fuelKey) { return this.fuel[fuelKey].groupKey }
    groupSpriteFill(fuelKey) {
        const groupKey = this.fuel[fuelKey].groupKey
        return this.fuelGroups[groupKey].spriteFill
    }
}
