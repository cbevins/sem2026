/**
 * The FuelBed class does as much processing of Fuel Model parameters as possible
 * up to the application of moisture, wind, and slope conditions.
 */
import { FuelBedLifeProcessor } from "./FuelBedLifeProcessor.js"

export class FuelBedProcessor {
    static Inputs = [
        {key: 'depth', desc: 'Fuel bed depth',
            initialValue: 1, type: 'quantity', units: 'ft'},
        {key: 'deadMext', desc: 'Dead fuel extinction moisture content',
            initialValue: 0.15, type: 'ratio', min: 0},
        {key: 'particles', desc: 'FuelParticle array',
            initialValue: [], type: 'array'},
        // CAUTION: there is no validation of FuelParticles objects
    ]

    static get(inputs={}) {
        // Ensure all required inputs are present
        for(let {key} of FuelBedProcessor.Inputs) {
            if (! Object.hasOwn(inputs, key))
                throw new Error(`FuelBedProcessor.get() inputs does not have the required '${key}' property.`)
        }

        const dead = FuelBedLifeProcessor.get('dead', inputs)
        dead.mext = inputs.deadMext
        const live = FuelBedLifeProcessor.get('live', inputs)
        live.mext = 5   // will be re-determined by the parent FuelBed

        // Accumulate fuel bed total surface area (ft2), ovendry load (lb/ft2), and volume (ft3)
        const ovendryLoad = dead.ovendryLoad + live.ovendryLoad
        const surfaceArea = dead.surfaceArea + live.surfaceArea
        const volume = dead.volume + live.volume

        // Assign fuel life category surface area weighting factors
        dead.surfaceAreaWtg = (surfaceArea > 0) ? dead.surfaceArea / surfaceArea : 0
        live.surfaceAreaWtg = (surfaceArea > 0) ? live.surfaceArea / surfaceArea : 0

        // Fuel bed characteristic surface area-to-volume ratio (ft2/ft3)
        const savr = dead.savr * dead.surfaceAreaWtg + live.savr * live.surfaceAreaWtg

        // Fuel bed packing ratio is the ratio of bulk density to particle density
        // Rothermel (1972) eq 31 (p 26)
        const packingRatio = (inputs.depth > 0) ? volume / inputs.depth : 0

        //  Rothermel (1972) eq 37 (p 19, 26) and eq 69 (p32).
        const packingRatioOpt = (savr > 0) ? 3.348 / savr**0.8189 : 0

        // Ratio of packing ratio to the optimum packing ratio
        const packingRatioFraction = (packingRatioOpt > 0) ? packingRatio / packingRatioOpt : 0

        // The no-wind, no-slope propagating flux (ratio) is the numerator of the Rothermel (1972)
        // spread rate equation 1 and has units of heat per unit area per unit time.
        // See Rothermel (1972) eq 42 (p 20, 26) and eq 76 (p32).
        const propagatingFluxRatio = (savr > 0)
            ? Math.exp((0.792 + 0.681 * Math.sqrt(savr)) * (packingRatio + 0.1)) / (192 + 0.2595 * savr) : 0

        // This is the arbitrary variable 'A' used to derive the fuel bed optimum reaction velocity (1/min).
        // See Rothermel (1972) eq 39 (p19, 26) and 67 (p 31).
        const reactionVelocityExp = (savr > 0) ? 133 / savr**0.7913 : 0
        
        // Fuel bed maximum reaction velocity (1/min)
        // See Rothermel (1972) eq 36 (p 19, 26) and 68 (p 32).
        const savr15 = (savr > 0) ? savr**1.5 : 0
        const reactionVelocityMax = (savr15 > 0) ? savr15 / (495 + 0.0594 * savr15) : 0

        // Fuel bed optimum reaction velocity (min-1)
        // See Rothermel (1972) eq 38 (p 19, 26) and eq 67 (p 31).
        const reactionVelocityOpt = (packingRatioFraction > 0)
            ? reactionVelocityMax * packingRatioFraction**reactionVelocityExp
                * Math.exp(reactionVelocityExp * (1 - packingRatioFraction)) : 0

        // Fuel bed life category reaction intensity under ovendry fuel conditions (BTU/ft2/min)
        dead.reactionIntensityDry = reactionVelocityOpt * dead.heatSource
        live.reactionIntensityDry = reactionVelocityOpt * live.heatSource

        // The live fuel moisture content of extinction factor represents the ratio
        // of dead-to-live fuel mass that must be raised to ignition.  It is constant
        // within a fuel bed, and applies ONLY to the LIVE fuel bed life category.
        // It was first described by Rothermel (1972) on page 35 and subsequently
        // refined in BEHAVE and BehavePlus to use the 'effective fuel load' and
        // 'effective heating number' to determine the ratio of fine dead to fine live fuels.
        // See Rothermel (1972) eq 88 on page 35.
        const liveMextFactor = 2.9 * (dead.fineFuelLoad / live.fineFuelLoad)

        // Open-canopy midflame wind speed reduction factor
        const f = Math.min(6, Math.max(inputs.depth, 0.1))
        const midflameWindReduction = 1.83 / Math.log((20 + 0.36 * f) / (0.13 * f))

        //----------------------------------------------------------------------------------
        // The following are used by FireBehavior and therefore are saved as properties
        //----------------------------------------------------------------------------------
        
        // Fuel bed ovendry bulk density (lb/ft3) is only used to derive heat sink
        const bulkDensity = (inputs.depth > 0) ? ovendryLoad / inputs.depth : 0

        // Fuel bed flame residence time (min)
        const residenceTime = (savr > 0) ? 384 / savr : 0

        // Fuel bed slope coeffient `phiS` slope factor.
        // This factor is an intermediate parameter that is constant for a fuel bed,
        // and used to determine the fire spread slope coefficient `phiS`.
        // See Rothermel (1972) eq 51 (p 24, 26) and eq 80 (p 33).
        const slopeK = (packingRatio > 0) ? 5.275 * packingRatio**-0.3 : 0

        // Fuel bed wind coefficient `phiW` correlation factor `B`.
        // This factor is an intermediate parameter that is constant for a fuel bed,
        // and is used to derive the fire spread wind coefficient `phiW`.
        // See Rothermel (1972) eq 49 (p 23, 26) and eq 83 (p 33).
        const windB = (savr > 0) ? 0.02526 * savr**0.54 : 0

        // Fuel bed wind coefficient `phiW` correlation factor `C`.
        // This factor is an intermediate parameter that is constant for a fuel bed,
        // and is used to derive the fire spread wind coefficient `phiW`.
        // See Rothermel (1972) eq 48 (p 23, 26) and eq 82 (p 33).
        const windC = (savr > 0) ? 7.47 * Math.exp(-0.133 * savr**0.55) : 0

        // Fuel bed wind coefficient `phiW` correlation factor `E`.
        // This factor is an intermediate parameter that is constant for a fuel bed,
        // and is used to derive the fire spread wind coefficient `phiW`.
        // See Rothermel (1972) eq 50 (p 23, 26) and eq 82 (p 33).
        const windE = (savr > 0) ? 0.715 * Math.exp(-0.000359 * savr) : 0

        // Fuel bed wind coeffient `phiW` inverse K wind factor.
        // This factor is an intermediate parameter that is constant for a fuel bed,
        // and used to determine the fire spread wind coefficient `phiW`.
        // It is the inverse of the wind factor 'K', and is used to re-derive
        // effective wind speeds within the BEHAVE fire spread computations.
        // See Rothermel (1972) eq 47 (p 23, 26) and eq 79 (p 33).
        const windI = (packingRatioFraction > 0 && windC > 0) ?
            packingRatioFraction ** windE / windC : 0

        // Fuel bed wind coeffient `phiW` wind K factor.
        // This factor is an intermediate parameter that is constant for a fuel bed,
        // and used to determine the fire spread wind coefficient `phiW`.
        // See Rothermel (1972) eq 47 (p 23, 26) and eq 79 (p 33).
        const windK = (packingRatioFraction > 0 && windE > 0) ?
            windC * packingRatioFraction**-windE : 0

        let pod = {
            depth: inputs.depth,
            dead,
            live,
            savr, 
            packingRatio,
            propagatingFluxRatio,
            liveMextFactor,
            bulkDensity,
            residenceTime,
            slopeK,
            windB,
            windI,
            windK,
            midflameWindReduction,
        }
        const {saveProps=0} = inputs
        if (saveProps >= 1) pod = {...pod,
            ovendryLoad,
            surfaceArea,
            volume,
        }
        // Only save these for testing and/or debugging
        if (saveProps >= 2) pod = {...pod,
            packingRatioFraction,
            packingRatioOpt,
            reactionVelocityExp,
            reactionVelocityMax,
            reactionVelocityOpt,
            savr15,
            windC,
            windE,
        }
        return pod
    }
}
