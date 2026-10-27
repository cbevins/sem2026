/**
 */
import { FuelModelCatalog } from "./FuelModelCatalog.js"
import { FuelBed } from "./FuelBed.js"
import { FuelIgnition } from "./FuelIgnition.js"
import { FireBehavior } from "./FireBehavior.js"

export const FireStateParams = {
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
    windAt10m: 0,
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
    constructor(catalog, param={...FireStateParams}) {
        this.catalog = catalog
        this.param = param
        this.fuelKey = param.fuelKey
        this.fuelModel = this.catalog.get(this.fuelKey)
        this.fuelBed = new FuelBed()
        this.fuelBed.update(this.fuelModel, this.param)
        this.fuelIgnition = new FuelIgnition()
        this.fuelIgnition.update(this.fuelBed, this.param)
        this.fireBehavior = new FireBehavior()
        
        this.isCurable = this.catalog.isCurable(this.fuelKey)
        this.fireBehavior.update(this.fuelBed, this.fuelIgnition,
            this.windAtMidflame, this.windBearing, this.slopeRatio, this.slopeAspect)
    }

    update(updatedInputs) {
        let input = this.resolveInputs(updatedInputs)
        const {param} = this

        // If the fuel model or cured herb has changed, so does the FuelBed, and everything else
        if (
            input.fuelKey !== param.fuelKey ||
            (this.isCurable && input.curedHerb !== param.curedHerb)
        ) {
            this.fuelKey = input.fuelKey
            this.isCurable = this.catalog.isCurable(input.fuelKey)
            this.fuelModel = this.catalog.get(input.fuelKey)
            this.fuelBed.update(this.fuelModel, input)
            this.fuelIgnition.update(this.fuelBed, input)
            this.fireBehavior.update(this.fuelBed, this.fuelIgnition,
                input.windAtMidflame, input.windBearing, input.slopeRatio, input.slopeAspect)
        } 
        // If any fuel moisture has changed, so does the FuelIgnition and FireBehavior
        else if (
            input.moistureDead1h != param.moistureDead1h ||
            input.moistureDead10h != param.moistureDead10h ||
            input.moistureDead100h != param.moistureDead100h ||
            input.moistureLiveHerb != param.moistureLiveHerb ||
            input.moistureLiveStem != param.moistureLiveStem
        ) {
            this.fuelIgnition.update(this.fuelBed, input)
            this.fireBehavior.update(this.fuelBed, this.fuelIgnition,
                input.windAtMidflame, input.windBearing, input.slopeRatio, input.slopeAspect)
        }
        // If wind or slope has changed, so does the FireBehavior
        else if (
            input.windAtMidflame !== param.windAtMidflame ||
            input.windBearing !== param.windBearing ||
            input.slopeRatio !== param.slopeRatio ||
            input.slopeAspect !== param.slopeAspect
        ) {
            this.fireBehavior.update(this.fuelBed, this.fuelIgnition,
                input.windAtMidflame, input.windBearing, input.slopeRatio, input.slopeAspect)
        }
        this.param = {...input}
        // console.log('Param:', this.param)
        return this
    }

    resolveInputs(updatedParam) {
        // Make a copy that we can change
        let input = {...updatedParam}

        // Not allowed to change fuelKey, as it changes fuelWsrf
        if(input.fuelKey !== this.fuelKey) {
            throw new Error('NOT ALLOWED TO CHANGE fuelKey')
        }

        // If input slopeDegrees has changed, update its corresponding slopeRatio
        if (input.slopeDegrees !== this.slopeDegrees) {
            input.slopeRatio = Math.tan(input.slopeDegrees * (Math.PI / 180))
        }
        // If input slopeRatio has changed, update its corresponding slopeDegrees
        else if (input.slopeRatio !== this.slopeRatio) {
            input.slopeDegrees = Math.atan(input.slopeRatio) * (180 / Math.PI)
        }
        
        if (input.windAt10m !== this.windAt10m) {
            input.windAt20ft = input.windAt10m / 1.13
        } else if (input.windAt20ft !== this.windAt20ft) {
            input.windAt10m = 1.13 * input.windAt20ft
        }

        // If canopy ht/base/cover was changed, update its corresponding canopyWsrf
        if (
            input.canopyHt !== this.canopyHt ||
            input.canopyBase !== this.canopyBase ||
            input.canopyCover !== this.canopyCover
        ) {
            const canopyLength = Math.max(0, input.canopyHt - input.canopyBase)
            const canopyRatio = (input.canopyHt > 0) ? (canopyLength / input.canopyHt) : 0
            const canopyFill = input.canopyCover * canopyRatio / 3
            const canopySheltersFuel = input.canopyCover >= 0.01 && canopyFill >= 0.05 && input.canopyHt >= 6
            const ht = input.canopyHt
            input.canopyWsrf = (! canopySheltersFuel) ? 1
                : 0.555 / (Math.sqrt(canopyFill * ht) * Math.log((20 + 0.36 * ht) / (0.13 * ht)))
        }

        // If windAtMidflame was directly changed, ignore any changes in
        // appliedWsrf, fuelWsrf, canopyWsrf, windAt20ft
        if (input.windAtMidflame !== this.windAtMidflame){
            return input
        }

        // Otherwise, if appliedWsrf was directly changed,
        // use it to update windAtMidflame ignoring any changes in fuelWsrf and canopyWsrf
        if (input.appliedWsrf !== this.appliedWsrf) {
            input.windAtMidflame = input.windAt20ft * input.appliedWsrf
            return input
        }

        // Apply minimum of fuel or canopy Wsrf
        input.appliedWsrf = Math.min(this.fuelBed.midflameWsrf, this.canopyWsrf)
        input.windAtMidflame = input.windAt20ft * input.appliedWsrf

        return input
    }
    ros() { return this.fireBehavior.headingSpreadRate }
    fli() { return this.fireBehavior.firelineIntensity }
    flame() { return this.fireBehavior.flameLength }

}

const catalog = new FuelModelCatalog()
let input = {
    fuelKey: 'gr4',
    curedHerb: 0,
    moistureDead1h: 0.01,
    moistureDead10h: 0.01,
    moistureDead100h: 0.01,
    moistureLiveHerb: 0.3,
    moistureLiveStem: 0.3,
    slopeAspect: 180,
    slopeDegrees: 0,
    slopeRatio: 0,
    windAt10m: 0,
    windAt20ft: 0,
    windAtMidflame: 0,
    windBearing: 0,
    canopyHt: 0,
    canopyBase: 0,
    canopyCover: 0,
    appliedWrsf: 1,
    fuelWsrf: 1,
    canopyWsrf: 1
}
function dump(fire) {
    for(let key of ['slopeDegrees', 'slopeRatio'])
        console.log(key, fire.param[key])
    console.log('ros:', fire.ros())
}
const fire = new FireState(catalog, input)
dump(fire)
input.slopeDegrees = 45
fire.update(input)
dump(fire)
