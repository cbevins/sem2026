/**
 * The FireIgnition class determines the ignition requirements of a fuel bed
 * under a specific set of fuel moisture conditions to estimate its no-wind,
 * no-slope reaction intensity and spread rate.
 */
export class FireIgnition {
    constructor(fuelBed, moistureConditions={}) {
        this.fuelBed = fuelBed
        this.setMoistureConditions(fuelBed, moistureConditions)
    }

    // Moisture content determines the live fuel moisture content of extincion
    // and life category moisture damping coefficients
    setMoistureConditions(fuelBed, moistureConditions) {
        this.dead = {}
        this.live = {}

        // Update life category moisture variables
        for(let life of ["dead", "live"]) {
            this[life].moisture = 0
            this[life].heatPreIgn = 0
            this[life].fineFuelMoisture = 0
            this[life].fineWaterLoad = 0

            for(let particle of fuelBed[life].particles) {
                const moistureContent = moistureConditions[particle.moistureClass]
                this[life].moisture += moistureContent * particle.surfaceAreaWtg    // wtd average

                // Particle heat of pre-ignition (BTU/lb) from Rothermel Eq 12 (p 7, 26)
                const heatPreIgn = particle.effHeating * (250.0 + 1116.0 * moistureContent)
                this[life].heatPreIgn += heatPreIgn * particle.surfaceAreaWtg      // wtd average

                // The fine fuel water load applies ONLY to the dead fuel category,
                // and is ONLY used in the computation of the fine fuel moisture content,
                // which in turn is used to derive the live fuel moisture content of extinction
                const fineWaterLoad = particle.fineFuelLoad * moistureContent
                this[life].fineWaterLoad += fineWaterLoad
            }
            
            // Only the DEAD life category fine fuel moisture content is needed, as it is
            // ONLY used in the computation of live fuel moisture content of extinction
            this[life].fineFuelMoisture = this[life].fineWaterLoad / fuelBed[life].fineFuelLoad
        }

        // Fuel bed weighted heat of preignition
        this.heatPreIgn = this.dead.heatPreIgn * fuelBed.dead.surfaceAreaWtg
            + this.live.heatPreIgn * fuelBed.live.surfaceAreaWtg

        // Live fuel moisture content of extinction
        this.dead.mext = fuelBed.dead.mext
        const dry = 1 - this.dead.fineFuelMoisture / this.dead.mext
        const liveMext = fuelBed.liveMextFactor * dry - 0.226
        this.live.mext = Math.max(liveMext, this.dead.mext)

        this.reactionIntensity = 0
        for(let life of ["dead", "live"]) {
            // Fuel bed life category mineral damping coefficient
            let r = this[life].moisture / this[life].mext
            this[life].moistureDamping = fraction(1 - 2.59 * r + 5.11 * r * r - 3.52 * r * r * r)

            // Fuel bed life category reaction intensity under current moisture conditions (BTU/ft2/min)
            this[life].reactionIntensity = fuelBed[life].reactionIntensityDry * this[life].moistureDamping

            // Fuel bed reaction intensity under current moisture conditions (BTU/ft2/min)
            this.reactionIntensity += this[life].reactionIntensity
        }
        
        // Fire spread heat sink (BTU/ft3)
        this.heatSink = fuelBed.bulkDensity * this.heatPreIgn

        // Fire spread heat source (BTU/ft2/min)
        // Product of the total fire reaction intensity (btu+1 ft-2 min-1)
        // and the fuel bed propagating flux ratio (ratio).
        this.heatSource = this.reactionIntensity * fuelBed.propagatingFluxRatio

        // No-wind, no-slope fire spread rate
        this.noWindSpreadRate = (this.heatSink > 0) ? this.heatSource / this.heatSink : 0
        return this
    }
}

function fraction(f) {
    return Math.max(0, Math.min(1, f))
}

