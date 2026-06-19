/**
 * The FuelBed class does as much processing of Fuel Model parameters as possible
 * up to the application of moisture, wind, and slope conditions.
 */
import { requireInputs } from "./utils.js"

export function makeFuelBed(inputs={}, configs={}) {
    // Get applicable input objects
    let {fuelModel=null} = inputs
    fuelModel = requireInputs('makeFuelBed()', fuelModel, 'fuelModel')
    
    const dead = makeFuelBedLife('dead', inputs, configs)
    dead.mext = fuelModel.deadMext
    const live = makeFuelBedLife('live', inputs, configs)
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
    const packingRatio = (fuelModel.depth > 0) ? volume / fuelModel.depth : 0

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
    const f = Math.min(6, Math.max(fuelModel.depth, 0.1))
    const midflameWindReduction = 1.83 / Math.log((20 + 0.36 * f) / (0.13 * f))

    //----------------------------------------------------------------------------------
    // The following are used by FireBehavior and therefore are saved as properties
    //----------------------------------------------------------------------------------
    
    // Fuel bed ovendry bulk density (lb/ft3) is only used to derive heat sink
    const bulkDensity = (fuelModel.depth > 0) ? ovendryLoad / fuelModel.depth : 0

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
        depth: fuelModel.depth,
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
    const {detailLevel=0} = configs
    if (detailLevel >= 1) pod = {...pod,
        ovendryLoad,
        surfaceArea,
        volume,
    }
    // Only save these for testing and/or debugging
    if (detailLevel >= 2) pod = {...pod,
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

/**
 * The FuelbedLife class converts Fuel Model parameters into a
 * 'dead' and a 'live' fuel bed following the weighting procedures
 * described by Rothermel (1972) in the section titled 'Formulation
 * of Fire Spread Model'.
 */
function makeFuelBedLife(category, inputs, configs) {
    const {fuelModel, fuelCuring} = inputs
    // Since fuel updates are generally processed much less frequently
    // than moisture updates, do as much computation as possible here
    // NOTE that inputs is passed in since it may contain FuelParticle curingClass data
    const fineFuelLoadFactor = (category === 'dead') ? -138 : -500
    let lifeEffectiveMineral = 0
    let lifeFineFuelLoad = 0
    let lifeHeat = 0
    let lifeHeatSource = 0
    let lifeMineralDamping = 1
    let lifeNetLoad = 0
    let lifeOvendryLoad = 0
    const lifeParticles = []
    let lifeSavr = 0
    let lifeSurfaceArea = 0
    let lifeSizeClassSurfaceArea = new Array(6).fill(0)
    let lifeVolume = 0
    const tmpParticles = []

    // First iterate through all the *FuelModelParticles* to derive intermediate properties
    // and accumulate life category surface area, surface area by size class,
    // ovendry load, fine fuel load, and volume.
    for(let particle of fuelModel.particles) {

        // Could this particle have fuel in this life category?
        if (particle.life === category || particle.life === "curable") {
            // Determine the fraction of particle's ovendry load for this life category
            let loadFraction = 1
            if (particle.life === "curable") {
                // Only apply a curable's curedFraction if its curingClass is in the inputs
                let curedFraction = 0
                if (!Object.hasOwn(fuelCuring, particle.curingClass)) {
                    if (configs.logger)
                        configs.logger.log(`makeFuelBed() fuel model ${fuelModel.number} has a curingClass ${particle.curingClass} that was not provided as input: assuming a 0 percent cured.`)
                } else {
                    curedFraction = fuelCuring[particle.curingClass]
                }
                loadFraction = (category === "dead") ? curedFraction : 1 - curedFraction
            }
            const ovendryLoad = loadFraction * particle.ovendryLoad
            lifeOvendryLoad += ovendryLoad

            // Accumulate particle's surface area (ft2)
            const surfaceArea = (particle.density > 0) ? (ovendryLoad * particle.savr) / particle.density : 0
            lifeSurfaceArea += surfaceArea

            // Determine particle's size class [0-5]
            const sizeClass = calcFuelParticleSizeClass(particle.savr)
            lifeSizeClassSurfaceArea[sizeClass] += surfaceArea

            // Determine and accumulate particle's volume
            const volume = (particle.density > 0) ? ovendryLoad / particle.density : 0
            lifeVolume += volume

            // Determine particle's net (mineral-free) load used in next section
            const netLoad = (1 - particle.totalMineral) * ovendryLoad

            // Determine and accumulate particle's fine fuel load, which is same as
            // effective heating for dead particles, but different for live particles
            const fineFuelLoad = (particle.savr > 0) ?
                ovendryLoad * Math.exp(fineFuelLoadFactor / particle.savr) : 0
            lifeFineFuelLoad += fineFuelLoad

            // Determine particle's moisture class
            const moistureClass = (category === "dead") ? particle.deadMoistureClass : particle.liveMoistureClass

            // Particle 'effective heating number' is the fraction of the fuel particle load
            // that participates in the fire ignition and spread process. 
            // It is used to determine particle heat of pre-ignition regardless of life category
            // From Rothermel (1972) equations 14 (p 8, 26) and 77 (p 32):
            const effHeating = (particle.savr > 0) ? Math.exp(-138 / particle.savr) : 0

            // Save fuel particle properties that are needed for next step
            tmpParticles.push({
                effHeating,
                effectiveMineral: particle.effectiveMineral,
                fineFuelLoad,
                heat: particle.heat,
                moistureClass,
                netLoad,
                ovendryLoad,
                savr: particle.savr,
                sizeClass,
                surfaceArea,
            })
        }
    }
    
    // Second, iterate through all the temporarily saved intermediate particles to determine
    // their weighting factors and accumulate the life category weighted properties
    for(let particle of tmpParticles) {
        // particle surface area weighting and size class surface area weighting
        const surfaceAreaWtg = particle.surfaceArea / lifeSurfaceArea

        // life category savr is surface area weighted weighted average of particle savr
        lifeSavr += particle.savr * surfaceAreaWtg

        // life category heat of combustion is surface area weighted average of particle heat
        lifeHeat += particle.heat * surfaceAreaWtg

        // effective (silica-free) mineral content uses weighting by particle surface area
        lifeEffectiveMineral += particle.effectiveMineral * surfaceAreaWtg

        // net load uses weighting by SIZE CLASS surface area
        const sizeClassSurfaceArea = lifeSizeClassSurfaceArea[particle.sizeClass]
        const netLoadWtg = (lifeSurfaceArea > 0) ? sizeClassSurfaceArea / lifeSurfaceArea : 0
        lifeNetLoad += particle.netLoad * netLoadWtg // NOTE that this is the ONLY prop to use SIZE CLASS WTG!!

        // Save only those properties needed for moisture content updates
        lifeParticles.push({
            effHeating: particle.effHeating,
            fineFuelLoad: particle.fineFuelLoad,
            moistureClass: particle.moistureClass,
            surfaceAreaWtg
        })
    }

    // Life category mineral damping coefficient
    lifeMineralDamping = (lifeEffectiveMineral > 0)
        ? clampFraction(0.174 / lifeEffectiveMineral**0.19) : 1
    
    // Life category heat source contribution to reaction intensity
    lifeHeatSource = lifeNetLoad * lifeHeat * lifeMineralDamping

    // These properties are required down stream by FuelIgnition
    let pod = {
        fineFuelLoad: lifeFineFuelLoad,
        heatSource: lifeHeatSource,
        netLoad: lifeNetLoad,
        ovendryLoad: lifeOvendryLoad,
        particles: lifeParticles,   // nested object
        savr: lifeSavr,
        surfaceArea: lifeSurfaceArea,
        volume: lifeVolume,
    }
    const {detailLevel=0} = configs
    // Informational, part of Rothermel basic equation
    if (detailLevel >= 1) pod = {...pod,
        heat: lifeHeat,
        mineralDamping: lifeMineralDamping,
    }
    return pod
}
    
// Returns a size class index [0-5]
function calcFuelParticleSizeClass(savr) {
    if (savr >= 1200) { return 0 }  // 0.00 - 0.04"
    if (savr >= 192) { return 1 }   // 0.04 - 0.25"
    if (savr >= 96) { return 2 }    // 0.25 - 0.50"
    if (savr >= 48) { return 3 }    // 0.50 - 1.00"
    if (savr >= 16) { return 4 }    // 1.00 - 3.00"
    return 5                        // 3.00+
}

function clampFraction(f) {
    return Math.max(0, Math.min(1, f))
}

