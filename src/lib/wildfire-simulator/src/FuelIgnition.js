/**
 * The FuelIgnition class determines the ignition requirements of a fuel bed
 * under a specific set of fuel moisture conditions to estimate its no-wind,
 * no-slope reaction intensity and spread rate.
 * 
 * FireIgnition uses the following input parameters that are provided as properties of a FuelBed:
 * - fuelBed[life].particles.effHeating, fineFuelLoad, surfaceAreaWtg, moistureClass,
 * - fuelBed[life].fineFuelLoad, surfaceAreaWtg, reactionIntensityDry
 * - fuelBed.dead.mext
 * - fuelBed.live.liveMextFactor
 * - fuelBed.bulkDensity
 * - fuelBed.propagatingFluxRatio
 */
import { FuelBed } from "./FuelBed.js"

export class FuelIgnition {
    static Inputs = [
        {key: 'fuelBed', desc: 'FuelBed object',
            value: null, type: 'FuelBed', order: 1},
        {key: 'moistureDead1h', desc: 'Dead 1-h time-lag fuel moisture content',
            value: 0.1, type: 'ratio', min: 0, max: 9, order: 1},
        {key: 'moistureDead10h', desc: 'Dead 10-h time-lag fuel moisture content',
            value: 0.1, type: 'ratio', min: 0, max: 9, order: 1},
        {key: 'moistureDead100h', desc: 'Dead 100-h time-lag fuel moisture content',
            value: 0.1, type: 'ratio', min: 0, max: 9, order: 1},
        {key: 'moistureLiveHerb', desc: 'Live herbaceous fuel moisture content',
            value: 5, type: 'ratio', min: 0, max: 9, order: 1},
        {key: 'moistureLiveStem', desc: 'Live stem, woody fuel moisture content',
            value: 5, type: 'ratio', min: 0, max: 9, order: 1},
    ]

    constructor(inputs, customMoistureClasses=[]) {
        // Add any custom moisture classes, such as 'moistureDuff' or moistureLitter'
        this.customMoistureClasses = customMoistureClasses

        // Initialize all input parameters to either their default values
        // or a value specified in the 'inputs' object
        for(let {key, value} of FuelIgnition.Inputs) {
            this[key] = value
            if (Object.hasOwn(inputs, key))
                this[key] = inputs[key]
        }

        // Initialize any custom fuel moisture classes
        for(let key of customMoistureClasses) {
            this[key] = 5
            if (Object.hasOwn(inputs, key))
                this[key] = inputs[key]
        }

        // Check required inputs
        if (this.fuelBed === null)
            throw new Error(`new FuelIgnition(inputs) object does not have the required '{fuelBed}' property.`)
        if (!(this.fuelBed instanceof FuelBed))
            throw new Error(`new FuelIgnition({fuelBed}) is not a valid FuelBed object.`)

        this.set(inputs)
    }

    // Moisture content determines the live fuel moisture content of extincion
    // and life category moisture damping coefficients
    set(inputs={}) {
        // Update values of all properties present in the 'inputs' object
        for(let {key} of FuelIgnition.Inputs) {
            if (Object.hasOwn(inputs, key)) {
                this[key] = inputs[key]
            }
        }
        // Check for any custom moisture contents mentioned in the inputs
        for(let key of this.customMoistureClasses) {
            if (Object.hasOwn(inputs, key))
                this[key] = inputs[key]
        }

        // The constructor ensured that inputs.fuelBed exists
        const fuelBed = inputs.fuelBed

        // Update life category moisture variables
        const cat = {dead: {}, live: {}}
        for(let life of ["dead", "live"]) {
            cat[life].moisture = 0
            cat[life].heatPreIgn = 0
            cat[life].fineFuelMoisture = 0
            cat[life].fineWaterLoad = 0

            for(let particle of fuelBed[life].particles) {
                const moistureContent = this[particle.moistureClass]
                cat[life].moisture += moistureContent * particle.surfaceAreaWtg    // wtd average

                // Particle heat of pre-ignition (BTU/lb) from Rothermel Eq 12 (p 7, 26)
                const heatPreIgn = particle.effHeating * (250.0 + 1116.0 * moistureContent)
                cat[life].heatPreIgn += heatPreIgn * particle.surfaceAreaWtg      // wtd average

                // The fine fuel water load applies ONLY to the dead fuel category,
                // and is ONLY used in the computation of the fine fuel moisture content,
                // which in turn is used to derive the live fuel moisture content of extinction
                const fineWaterLoad = particle.fineFuelLoad * moistureContent
                cat[life].fineWaterLoad += fineWaterLoad
            }
            
            // Only the DEAD life category fine fuel moisture content is needed, as it is
            // ONLY used in the computation of live fuel moisture content of extinction
            cat[life].fineFuelMoisture = cat[life].fineWaterLoad / fuelBed[life].fineFuelLoad
        }

        // Fuel bed weighted heat of preignition
        const heatPreIgn = cat.dead.heatPreIgn * fuelBed.dead.surfaceAreaWtg
                         + cat.live.heatPreIgn * fuelBed.live.surfaceAreaWtg

        // Live fuel moisture content of extinction
        cat.dead.mext = fuelBed.dead.mext
        const dry = 1 - cat.dead.fineFuelMoisture / cat.dead.mext
        const liveMext = fuelBed.liveMextFactor * dry - 0.226
        cat.live.mext = Math.max(liveMext, cat.dead.mext)

        let reactionIntensity = 0
        for(let life of ["dead", "live"]) {
            // Fuel bed life category mineral damping coefficient
            let r = cat[life].moisture / cat[life].mext
            cat[life].moistureDamping = this.clampFraction(1 - 2.59 * r + 5.11 * r * r - 3.52 * r * r * r)

            // Fuel bed life category reaction intensity under current moisture conditions (BTU/ft2/min)
            cat[life].reactionIntensity = fuelBed[life].reactionIntensityDry * cat[life].moistureDamping

            // Fuel bed reaction intensity under current moisture conditions (BTU/ft2/min)
            reactionIntensity += cat[life].reactionIntensity
        }
        
        // Fire spread heat sink (BTU/ft3)
        const heatSink = fuelBed.bulkDensity * heatPreIgn

        // Fire spread heat source (BTU/ft2/min)
        // Product of the total fire reaction intensity (btu+1 ft-2 min-1)
        // and the fuel bed propagating flux ratio (ratio).
        const heatSource = reactionIntensity * fuelBed.propagatingFluxRatio

        // No-wind, no-slope fire spread rate
        const noWindSpreadRate = (heatSink > 0) ? heatSource / heatSink : 0
        
        // Only need to save these for downstream use

        // Only save these for testing and/or debugging
        this.fuelBed = fuelBed  // Used by FireBehavior to get wind and slope factors
        this.reactionIntensity = reactionIntensity
        this.noWindSpreadRate = noWindSpreadRate

        const {saveProps=0} = inputs
        // Only save these for informational purposes
        if (saveProps >= 1) {
            this.heatPreIgn = heatPreIgn
            this.heatSink = heatSink
            this.heatSource = heatSource
        }
        // Only save these for testing and/or debugging
        if (saveProps >= 2) {
            this.dead = cat.dead
            this.live = cat.live
        }
        return this
    }

    clampFraction(f) {
        return Math.max(0, Math.min(1, f))
    }
}
