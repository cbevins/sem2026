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
    constructor(inputs) {
        // 'fuelBed' is a required property, and must be a FuelModel instance
        if (inputs?.fuelBed === 'undefined')
            throw new Error(`new FuelIgnition() was not passed an inputs '{fuelBed}' reference.`)
        if (!(inputs?.fuelBed instanceof FuelBed))
            throw new Error(`new FuelIgnition({fuelBed}) is not an instance of FuelBed.`)

        // Set default parameter values
        const {moistureDead1h=1, moistureDead10h=1, moistureDead100h=1,
            moistureLiveHerb=5, moistureLiveStem=5} = inputs
        this.moistureDead1 = moistureDead1h
        this.moistureDead10 = moistureDead10h
        this.moistureDead100 = moistureDead100h
        this.moistureLiveHerb = moistureLiveHerb
        this.moistureLiveStem = moistureLiveStem

        this.set(inputs)
    }

    // Moisture content determines the live fuel moisture content of extincion
    // and life category moisture damping coefficients
    set(inputs={}) {
        // The constructor ensured that inputs.fuelBed exists
        const fuelBed = inputs.fuelBed

        // Get the updated moisture contents
        const moistureConditions = {
            moistureDead1h: this.moistureDead1h,
            moistureDead10h: this.moistureDead10,
            moistureDead100h: this.moistureDead100h,
            moistureLiveHerb: this.moistureLiveHerb,
            moistureLiveStem: this.moistureLiveStem,
            ...inputs}

        // Update life category moisture variables
        const cat = {dead: {}, live: {}}
        for(let life of ["dead", "live"]) {
            cat[life].moisture = 0
            cat[life].heatPreIgn = 0
            cat[life].fineFuelMoisture = 0
            cat[life].fineWaterLoad = 0

            for(let particle of fuelBed[life].particles) {
                const moistureContent = moistureConditions[particle.moistureClass]
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
