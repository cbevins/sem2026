/**
 * makeFuelIgnition determines the ignition requirements of a fuel bed
 * under a specific set of fuel moisture conditions to estimate its no-wind,
 * no-slope reaction intensity and spread rate.
 */
import { WfsFuelMoisture } from "./WfsInputs.js"
import { checkInputs, clampFraction, requireInputs } from './utils.js'

export function makeFuelIgnition(inputs={}, configs={}) {
    // Get applicable input objects
    let {fuelBed=null, fuelMoisture=null} = inputs

    // Get applicable configs
    const {detailLevel=0} = configs

    // Require the fuelBed object, as it is too complex to be reasonablly defaulted
    fuelBed = requireInputs('makeFireIgnition()', fuelBed, 'fuelBed')

    // Use either the provided 'fireWeather' object, or get the standard WfsFireWeather object
    fuelMoisture = checkInputs('makeFireIgnition()', fuelMoisture, 'fuelMoisture', WfsFuelMoisture, 'WfsFuelMoisture', configs)
    
    // Update life category moisture variables
    const cat = {dead: {}, live: {}}
    for(let life of ["dead", "live"]) {
        cat[life].moisture = 0
        cat[life].heatPreIgn = 0
        cat[life].fineFuelMoisture = 0
        cat[life].fineWaterLoad = 0

        for(let particle of fuelBed[life].particles) {
            let moistureClass = particle.moistureClass
            if(! Object.hasOwn(fuelMoisture, moistureClass)) {
                moistureClass = (life === 'dead') ? 'moistureDead1h' : 'moistureLiveHerb'
                if(configs.logger)
                    configs.logger.log(`makeFuelIgnition(): a fuel particle has a moisture class '${particle.moistureClass}' that is not in the fuelMoisture inputs object: assuming moisture class '${moistureClass}'.`)
            }
            const moistureContent = fuelMoisture[moistureClass]
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
        cat[life].moistureDamping = clampFraction(1 - 2.59 * r + 5.11 * r * r - 3.52 * r * r * r)

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
    
    // Required outputs
    let pod = {
        reactionIntensity,
        noWindSpreadRate
    }

    // Only save these for informational purposes
    if (detailLevel >= 1) pod = {...pod,
        heatPreIgn,
        heatSink,
        heatSource,
    }
    // Only save these for testing and/or debugging
    if (detailLevel >= 2) pod = {...pod,
        dead: cat.dead,
        live: cat.live,
    }
    return pod
}
