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

export class FuelIgnitionProcessor {
    static Inputs = [
        {key: 'dead', desc: 'FuelBedProcessor.dead object',
            initialValue: null, type: 'FuelBedProcessor'},
        {key: 'live', desc: 'FuelBedProcessor.live object',
            initialValue: null, type: 'FuelBedProcessor'},

        {key: 'bulkDensity'},
        {key: 'propagatingFluxRatio'},
        {key: 'moistureDead1h', desc: 'Dead 1-h time-lag fuel moisture content',
            initialValue: 0.1, type: 'ratio', min: 0, max: 9},
        {key: 'moistureDead10h', desc: 'Dead 10-h time-lag fuel moisture content',
            initialValue: 0.1, type: 'ratio', min: 0, max: 9},
        {key: 'moistureDead100h', desc: 'Dead 100-h time-lag fuel moisture content',
            initialValue: 0.1, type: 'ratio', min: 0, max: 9},
        {key: 'moistureLiveHerb', desc: 'Live herbaceous fuel moisture content',
            initialValue: 5, type: 'ratio', min: 0, max: 9},
        {key: 'moistureLiveStem', desc: 'Live stem, woody fuel moisture content',
            initialValue: 5, type: 'ratio', min: 0, max: 9},
    ]

    static get(inputs, customMoistureClasses=[]) {
        // Ensure all required inputs are present
        for(let {key} of FuelIgnitionProcessor.Inputs) {
            if (! Object.hasOwn(inputs, key))
                throw new Error(`FuelIgnitionProcessor.get() inputs does not have the required '${key}' property.`)
        }
        // Ensure any custom fuel moisture class inputs are present
        for(let key of customMoistureClasses) {
            if (! Object.hasOwn(inputs, key))
                throw new Error(`FuelIgnitionProcessor.get() inputs does not have a '${key}' custom  moisture content class property.`)
        }

        // Update life category moisture variables
        const cat = {dead: {}, live: {}}
        for(let life of ["dead", "live"]) {
            cat[life].moisture = 0
            cat[life].heatPreIgn = 0
            cat[life].fineFuelMoisture = 0
            cat[life].fineWaterLoad = 0

            for(let particle of inputs[life].particles) {
                if(! Object.hasOwn(inputs, particle.moistureClass))
                    throw new Error(`FuelIgnitionProcessor.get() inputs does not have a '${particle.moistureClass}' moisture class property.`)

                const moistureContent = inputs[particle.moistureClass]
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
            cat[life].fineFuelMoisture = cat[life].fineWaterLoad / inputs[life].fineFuelLoad
        }

        // Fuel bed weighted heat of preignition
        const heatPreIgn = cat.dead.heatPreIgn * inputs.dead.surfaceAreaWtg
                         + cat.live.heatPreIgn * inputs.live.surfaceAreaWtg

        // Live fuel moisture content of extinction
        cat.dead.mext = inputs.dead.mext
        const dry = 1 - cat.dead.fineFuelMoisture / cat.dead.mext
        const liveMext = inputs.liveMextFactor * dry - 0.226
        cat.live.mext = Math.max(liveMext, cat.dead.mext)

        let reactionIntensity = 0
        for(let life of ["dead", "live"]) {
            // Fuel bed life category mineral damping coefficient
            let r = cat[life].moisture / cat[life].mext
            cat[life].moistureDamping = clampFraction(1 - 2.59 * r + 5.11 * r * r - 3.52 * r * r * r)

            // Fuel bed life category reaction intensity under current moisture conditions (BTU/ft2/min)
            cat[life].reactionIntensity = inputs[life].reactionIntensityDry * cat[life].moistureDamping

            // Fuel bed reaction intensity under current moisture conditions (BTU/ft2/min)
            reactionIntensity += cat[life].reactionIntensity
        }
        
        // Fire spread heat sink (BTU/ft3)
        const heatSink = inputs.bulkDensity * heatPreIgn

        // Fire spread heat source (BTU/ft2/min)
        // Product of the total fire reaction intensity (btu+1 ft-2 min-1)
        // and the fuel bed propagating flux ratio (ratio).
        const heatSource = reactionIntensity * inputs.propagatingFluxRatio

        // No-wind, no-slope fire spread rate
        const noWindSpreadRate = (heatSink > 0) ? heatSource / heatSink : 0
        
        // Required outputs
        let pod = {reactionIntensity, noWindSpreadRate}

        const {saveProps=0} = inputs
        // Only save these for informational purposes
        if (saveProps >= 1) pod = {...pod,
            heatPreIgn,
            heatSink,
            heatSource,
        }
        // Only save these for testing and/or debugging
        if (saveProps >= 2) pod = {...pod,
            dead: cat.dead,
            live: cat.live,
        }
        return pod
    }
}

function clampFraction(f) {
    return Math.max(0, Math.min(1, f))
}
