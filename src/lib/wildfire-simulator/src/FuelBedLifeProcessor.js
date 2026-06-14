/**
 * The FuelbedLife class converts Fuel Model parameters into a
 * 'dead' and a 'live' fuel bed following the weighting procedures
 * described by Rothermel (1972) in the section titled 'Formulation
 * of Fire Spread Model'.
 */
export class FuelBedLifeProcessor {
    static get(category, inputs) {
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
        for(let particle of inputs.particles) {

            // Could this particle have fuel in this life category?
            if (particle.life === category || particle.life === "curable") {
                // Determine the fraction of particle's ovendry load for this life category
                let loadFraction = 1
                if (particle.life === "curable") {
                    // Only apply a curable's curedFraction if its curingClass is in the inputs
                    let curedFraction = inputs[particle.curingClass] ?? 0
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
        const {saveProps=0} = inputs
        // Informational, part of Rothermel basic equation
        if (saveProps >= 1) pod = {...pod,
            heat: lifeHeat,
            mineralDamping: lifeMineralDamping,
        }
        return pod
    }
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
