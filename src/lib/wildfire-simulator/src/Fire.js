/**
 * Fire is a wrapper around the chain of classes including StandardFuelModelCatalog,
 * FuelModel, FuelBed, FuelIgnition, FireBehavior, and FireEllipse.
 * 
 * Clients can access any of these instances as fire.catalog, fire.fuelModel,
 * fire.fuelBed, fire.fuelIgnition, fire.fireBehavior, or fire.fireEllipse.
 * 
 * Besides construction, there is only 1 method, update(inputs), in which new
 * input values are provided.  This is NOT currently optimized,
 * and the entire chain of classes is reconstructed with each update().
 */
import { StandardFuelModelCatalog } from '../src/StandardFuelModelCatalog.js'
import { FuelBed } from '../src/FuelBed.js'
import { FuelIgnition } from '../src/FuelIgnition.js'
import { FireBehavior } from '../src/FireBehavior.js'
import { FireEllipse } from '../src/FireEllipse.js'
import { BetaFireVector } from '../src/FireVector.js'

// Requires an additional 'fuelKey' inputs property
export class Fire {
    constructor(inputs) {
        // Set default parameter values
        this.saveProps = inputs?.saveProps ?? 0
        // FuelBed (2)
        this.fuelKey = inputs?.fuelKey ?? 1
        this.curedHerb = inputs?.curedHerb ?? 0
        // FuelIgnition (5)
        this.moistureDead1h = inputs?.moistureDead1h ?? 0.1
        this.moistureDead10h = inputs?.moistureDead10h ?? 0.1
        this.moistureDead100h = inputs?.moistureDead100h ?? 0.1
        this.moistureLiveHerb = inputs?.moistureLiveHerb ?? 2
        this.moistureLiveStem = inputs?.moistureLiveStem ?? 2
        // FireBehavior (6)
        this.limitSpreadRateByReactionIntensity = inputs?.limitSpreadRateByReactionIntensity ?? true
        this.limitSpreadRateByEffWindSpeed = inputs?.limitSpreadRateByEffWindSpeed ?? false
        this.midflameWindSpeed = inputs?.midflameWindSpeed ?? 0
        this.windBearing = inputs?.windBearing ?? 0
        this.aspect = inputs?.aspect ?? 180
        this.slopeRatio = inputs?.slopeRatio ?? 0
        // FireEllipse (7)
        this.headingSpreadRate = inputs?.headingSpreadRate ?? 0
        this.lengthWidthRatio = inputs?.lengthWidthRatio ?? 0
        this.flameLength = inputs?.flameLength ?? 0
        this.bearing = inputs?.bearing ?? 0
        this.elapsedTime = inputs?.elapsedTime ?? 60
        this.ignEast = inputs?.ignEast ?? 0
        this.ignNorth = inputs?.ignNorth ?? 0

        this.catalog = new StandardFuelModelCatalog()
        this.update(inputs)
    }
    update(inputs={}) {
        // Get the updated input parameters
        const parms = {
            saveProps: this.saveProps,
            // FuelBed inputs
            fuelKey: this.fuelKey,
            curedHerb: this.curedHerb,
            // FuelIgnition inputs
            moistureDead1h: this.moistureDead1h,
            moistureDead10h: this.moistureDead10,
            moistureDead100h: this.moistureDead100h,
            moistureLiveHerb: this.moistureLiveHerb,
            moistureLiveStem: this.moistureLiveStem,
            // FireBehavior inputs
            limitSpreadRateByReactionIntensity: this.limitSpreadRateByReactionIntensity,
            limitSpreadRateByEffWindSpeed: this.limitSpreadRateByEffWindSpeed,
            midflameWindSpeed: this.midflameWindSpeed,
            windBearing: this.windBearing,
            aspect: this.aspect,
            slopeRatio: this.slopeRatio,
            // FireEllipse inputs
            headingSpreadRate: this.headingSpreadRate,
            lengthWidthRatio: this.lengthWidthRatio,
            flameLength: this.flameLength,
            bearing: this.bearing,
            elapsedTime: this.elapsedTime,
            ignEast: this.ignEast,
            ignNorth: this.ignNorth,
            betaFromHead: this.betaFromHead,
            ...inputs}

        const fuelModel = this.catalog.get(parms.fuelKey)
        const fuelBed = new FuelBed({fuelModel, ...parms})
        const fuelIgnition = new FuelIgnition({fuelBed, ...parms})
        const fireBehavior = new FireBehavior({fuelIgnition, ...parms})
        // Note that the fireBehavior instance must be spread,
        // as FireEllipse uses its props directly, and NOT indirectly through its reference
        const fireEllipse = new FireEllipse({...fireBehavior, ...parms})
        this.head = new BetaFireVector(fireEllipse, 0)
        this.back = new BetaFireVector(fireEllipse, 180)

        // Store all
        this.fuelModel = fuelModel
        this.fuelBed = fuelBed
        this.fuelIgnition= fuelIgnition
        this.fireBehavior = fireBehavior
        this.fireEllipse = fireEllipse

        return this
    }
}