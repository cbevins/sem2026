/**
 */
import { FuelBed } from "./FuelBed.js"
import { FuelIgnition } from "./FuelIgnition.js"
import { FireBehavior } from "./FireBehavior.js"

export const FireStateInputs = {
    fuelKey: 'none',
    curedHerb: 0,
    moistureDead1h: 0.01,
    moistureDead10h: 0.01,
    moistureDead100h: 0.01,
    moistureLiveHerb: 0.3,
    moistureLiveStem: 0.3,
    slopeAspect: 180,
    slopeDegrees: 0,
    slopeRatio: 0,
    windAt10m,
    windAt20ft: 0,
    windAtMidflame: 0,
    windBearing: 0,
    canopyHt: 0,
    canopyBase: 0,
    canopyCover: 0,
    appliedWrsf: 1,
    fuelWsrf: 1,
    canopyWsrf: 1,
}

export class FireState {
    constructor(catalog, inputs={...FireStateInputs}) {
        this.catalog = catalog
        this.fuelBed = new FuelBed()
        this.fuelIgnition = new FuelIgnition()
        this.fireBehavior = new FireBehavior()

        const {fuelKey} = inputs
        this.fuelKey = fuelKey
        this.fuelModel = this.catalog.get(fuelKey)
        this.fuelBed.update(this.fuelModel, inputs)
        this.fuelIgnition.update(this.fuelBed, inputs)
        
        this.isCurable = this.catalog.isCurable(fuelKey)
        this.fuelModel = this.catalog.get(inputs.fuelKey)
        this.fuelBed.update(this.fuelModel, inputs)
        this.fuelIgnition.update(this.fuelBed, inputs)
        this.fireBehavior.update(this.fuelBed, this.fuelIgnition,
            inputs.windAtMidflame, inputs.windBearing, inputs.slopeRatio, inputs.slopeAspect)

        this.current = {...inputs}
    }

    update(inputs) {
        const {current} = this
        const {fuelKey, curedHerb,
            moistureDead1h, moistureDead10h, moistureDead100h, moistureLiveHerb, moistureLiveStem,
            windAtMidflame, windBearing, slopeRatio, slopeAspect} = inputs

        // If the fuel model or cured herb has changed, so does the FuelBed, and everything else
        if (
            fuelKey !== current.fuelKey ||
            (this.isCurable && curedHerb !== current.curedHerb)
        ) {
            this.fuelKey = fuelKey
            this.isCurable = this.catalog.isCurable(fuelKey)
            this.fuelModel = this.catalog.get(inputs.fuelKey)
            this.fuelBed.update(this.fuelModel, inputs)
            this.fuelIgnition.update(this.fuelBed, inputs)
            this.fireBehavior.update(this.fuelBed, this.fuelIgnition,
                windAtMidflame, windBearing, slopeRatio, slopeAspect)
        } 
        // If any fuel moisture has changed, so does the FuelIgnition and FireBehavior
        else if (
            moistureDead1h != current.moistureDead1h ||
            moistureDead10h != current.moistureDead10h ||
            moistureDead100h != current.moistureDead100h ||
            moistureLiveHerb != current.moistureLiveHerb ||
            moistureLiveStem != current.moistureLiveStem
        ) {
            this.fuelIgnition.update(this.fuelBed, inputs)
            this.fireBehavior.update(this.fuelBed, this.fuelIgnition,
                windAtMidflame, windBearing, slopeRatio, slopeAspect)
        }
        // If wind or slope has changed, so does the FireBehavior
        else if (
            windAtMidflame !== current.windAtMidflame ||
            windBearing !== current.windBearing ||
            slopeRatio !== current.slopeRatio ||
            slopeAspect !== current.slopeAspect
        ) {
            this.fireBehavior.update(this.fuelBed, this.fuelIgnition,
                windAtMidflame, windBearing, slopeRatio, slopeAspect)
        }
        this.current = {...inputs}
        return this
    }

    static resolveUpdatedInputs(current, updatedInputs) {
        let inputs = FireState.resolveSlopeInputs(current, updatedInputs)
        inputs = FireState.resolveWindInputs(current, inputs)
        return inputs
    }

    // Returns a resolved copy of the 'updatedInputs' object
    static resolveSlopeInputs(current, updatedInputs) {
        let inputs = {...updatedInputs}
        // Case 1: slopeDegrees has changed, so update slopeRatio
        if (inputs.slopeDegrees !== this.current.slopeDegrees) {
            inputs.slopeRatio = Math.tan(inputs.slopeDegrees * (Math.PI / 180))
        }
        // Case 2: slopeRatio has changed, so update slopeDegrees
        else if (inputs.slopeRatio !== this.current.slopeRatio) {
            inputs.slopeDegrees = Math.atan(inputs.slopeRatio) * (180 / Math.PI)
        }
        return inputs
    }

    // Returns a resolved copy of the 'updatedInputs' object
    static resolveWindSpeedInputs(current, updatedInputs) {
        let inputs = {...updatedInputs}
        
        if (inputs.windAt10m !== current.windAt10m) {
            inputs.windAt20ft = inputs.windAt10m / 1.13
        } else if (inputs.windAt20ft !== current.windAt20ft) {
            inputs.windAt10m = 1.13 * inputs.windAt20ft
        }

        // If canopy was changed, update canopyWsrf
        if (
            inputs.canopyHt !== current.canopyHt ||
            inputs.canopyBase !== current.canopyBase ||
            inputs.canopyCover !== current.canopyCover
        ) {
            const canopyLength = Math.max(0, inputs.canopyHt - inputs.canopyBase)
            const canopyRatio = (inputs.canopyHt > 0) ? (canopyLength / inputs.canopyHt) : 0
            const canopyFill = inputs.canopyCover * canopyRatio / 3
            const canopySheltersFuel = inputs.canopyCover >= 0.01 && canopyFill >= 0.05 && inputs.canopyHt >= 6
            const ht = inputs.canopyHt
            inputs.canopyWsrf = (! canopySheltersFuel) ? 1
                : 0.555 / (Math.sqrt(canopyFill * ht) * Math.log((20 + 0.36 * ht) / (0.13 * ht)))
        }

        // If windAtMidflame was directly changed, ignore appliedWsrf, fuelWsrf, canopyWsrf, windAt20
        if (inputs.windAtMidflame !== current.windAtMidflame){
            return inputs
        }

        // If appliedWsrf was directly changed
        // use it to update windAtMidflame ignoring fuelWsrf and canopyWsrf
        if (inputs.appliedWsrf !== current.appliedWsrf) {
            inputs.windAtMidflame = inputs.windAt20ft * inputs.appliedWsrf
            return inputs
        }

        // Apply minimum of fuel or canopy Wsrf
        inputs.appliedWsrf = Math.min(this.fuelWsrf, this.canopyWsrf)
        inputs.windAtMidflame = inputs.windAt20ft * inputs.appliedWsrf

        return inputs
    }
}
