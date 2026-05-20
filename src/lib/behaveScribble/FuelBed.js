export class FuelBedParticle {
    constructor(fuelModelParticle, loadFraction=1) {
        const p = fuelModelParticle

        // This class has 8 FuelModelParticle properties
        this.deadfm = p.deadfm
        this.density = p.dens
        this.effMineral = p.seff
        this.heat = p.heat
        this.livefm = p.livefm
        this.ovendryLoad = p.load * loadFraction
        this.savr = p.savr
        this.totalMineral = p.stot

        // This class has 10 derived properties that do not depend upon fuel moisture.
        // 3 properties (surfaceAreaWtg, sizeClasWtg, and fineFuelLoad) are set by the parent FuelBedLifeCategory
        // The remaining 7 properties are set here:

        // particle "net" (mineral free) fuel load from Rothermel Eq 24 (p 26)
        // and as later corrected by Albini
        this.netLoad = (1 - this.totalMineral) * this.ovendryLoad

        // Particle size class used to determine size class weighting factor
        this.sizeClass = FuelBedParticle.getSizeClass(this.savr)

        // particle surface area (ft2)
        this.surfaceArea = (this.density > 0) ? (this.ovendryLoad * this.savr) / this.density : 0
        
        // Particle volume (ft3)
        this.volume = (this.density > 0) ? this.ovendryLoad / this.density : 0

        // Particle cylindrical equivalent diameter (ft) is derived using Rothermel (1972) equation 32 (p 14).
        // (informational only, not used by the fire model)
        this.diameter = (this.savr > 0) ? 4 / this.savr : 0

        // Particle equivalent cylindrical length (ft) is volume/area (ft3/ft2)
        // (informational only, not used by the fire model)
        this.leng = (this.diameter > 0) ? this.volume /  (Math.PI * (this.diameter/2)**2) : 0

        // Particle 'effective heating number' is the fraction of the fuel particle load
        // that participates in the fire ignition and spread process. 
        // From Rothermel (1972) equations 14 (p 8, 26) and 77 (p 32):
        this.effHeating = (p.savr > 0) ? Math.exp(-138 / p.savr) : 0
        return this
    }

    // Updates the 3 FuelBedParticle properties that depend upon fuel moisture
    updateMoistureContent(moistureContent) {
        // Particle fuel moisture content (lb water / lb ovendry load)
        this.mois = moistureContent

        // Particle heat of pre-ignition (BTU/lb) from Rothermel Eq 12 (p 7, 26)
        this.qig = this.effHeating * (250.0 + 1116.0 * this.mois)

        // Particle effective water load (lb water / lb effective fuel load)
        this.fineWaterLoad = this.fineFuelLoad * this.mois
        return this
    }

    // Returns a size class index [0-5]
    static getSizeClass(savr) {
        if (savr >= 1200) { return 0 }  // 0.00 - 0.04"
        if (savr >= 192) { return 1 }   // 0.04 - 0.25"
        if (savr >= 96) { return 2 }    // 0.25 - 0.50"
        if (savr >= 48) { return 3 }    // 0.50 - 1.00"
        if (savr >= 16) { return 4 }    // 1.00 - 3.00"
        return 5                        // 3.00+
    }
}

function fraction(f) {
    return Math.max(0, Math.min(1, f))
}

class FuelBedLifeCategory {
    constructor(category, mext=1) {
        this.category = category        // 'dead' or 'live'
        this.fineFuelLoad = 0
        this.fineFuelLoadFactor = (this.category === 'dead') ? -138 : -500
        this.effMineral = 0
        this.heat = 0
        this.mineralDamping = 1
        this.mext = mext
        this.mois = 0
        this.moistureDamping = 0
        this.netLoad = 0
        this.ovendryLoad = 0
        this.particles = []
        this.qig = 0
        this.reactionIntensity = 0
        this.reactionIntensityDry = 0
        this.savr = 0
        this.sizeClassArea = [0,0,0,0,0,0]
        this.sizeClassWtg = [0,0,0,0,0,0]
        this.surfaceArea = 0
        this.surfaceAreaWtg = 0
        this.volume = 0
    }

    addParticle(fuelModelParticle, loadFraction) {
        const p = new FuelBedParticle(fuelModelParticle, loadFraction)
        // Ensure that cured live fuels use the correct dead fuel moisture content class
        if (this.category === "dead") {
            if (p.deadfm !== 'dead1h' && p.deadfm !== 'dead10h' && p.deadfm !== 'dead100h') {
                if(p.sizeClass <= 1) p.deadfm = 'dead1h'
                else if (p.sizeClass <=3) p.deadfm = 'dead10h'
                else p.deadfm = 'dead100h'
            }
        }
        this.particles.push(p)
        return this
    }

    updateParticles() {
        // Fuel bed life category summation properties
        for(let particle of this.particles) {
            // Fuel bed life category total ovendry load (lb/ft2)
            this.ovendryLoad += particle.ovendryLoad
            // Fuel bed life category total surface area (ft2)
            this.surfaceArea += particle.surfaceArea
            // Fuel bed life category surface area (ft2) by size class
            this.sizeClassArea[particle.sizeClass] += particle.surfaceArea
            // Fuel bed life category fuel volume (ft3)
            this.volume += particle.volume
        }

        // Fuel bed life category SIZE CLASS surface area weighting factor (ratio)
        for(let i=0; i<this.sizeClassArea.length; i++)
            this.sizeClassWtg[i] = (this.surfaceArea > 0) ? this.sizeClassArea[i] / this.surfaceArea : 0

        // Assign each life category fuel particle its surface area weighting factor and size class weighting factor
        for(let particle of this.particles) {
            particle.surfaceAreaWtg = (this.surfaceArea > 0) ? particle.surfaceArea / this.surfaceArea : 0
            particle.sizeClassWtg = this.sizeClassWtg[particle.sizeClass]
        }

        // Fuel bed life category weighted properties
        for(let particle of this.particles) {
            this.netLoad += particle.netLoad * particle.sizeClassWtg    // NOTE that this uses SIZE CLASS WTG!!
            this.savr += particle.savr * particle.surfaceAreaWtg
            this.heat += particle.heat * particle.surfaceAreaWtg
            this.effMineral += particle.effMineral * particle.surfaceAreaWtg
        }

        // Assign each life category fuel particle its effective fuel load
        for(let particle of this.particles) {
            particle.fineFuelLoad = (particle.savr > 0) ? particle.ovendryLoad * Math.exp(this.fineFuelLoadFactor / particle.savr) : 0
            this.fineFuelLoad += particle.fineFuelLoad
        }

        this.mineralDamping = (this.effMineral > 0) ? fraction(0.174 / this.effMineral**0.19) : 1
    }

    // Updates the 3 FuelBedLifeCategory properties that depend upon fuel moisture
    // moistureContents is an object with properties {dead1h, dead10h, dead100h, herb, stem}
    updateMoistureContent(moistureContents) {
        // Fuel bed life category weighted values
        this.mois = 0
        this.fineWaterLoad = 0
        this.qig = 0
        const moistureLifeCategory = (this.category === 'dead') ? "deadfm" : "livefm"
        for(let particle of this.particles) {
            const moistureClass = particle[moistureLifeCategory]
            const moistureContent = moistureContents[moistureClass]
            particle.updateMoistureContent(moistureContent)
            this.mois += particle.mois * particle.surfaceAreaWtg    // wtd average
            this.qig += particle.qig * particle.surfaceAreaWtg      // wtd average
            // The fine fuel water load applies ONLY to the dead fuel category,
            // and is ONLY used in the computation of the fine fuel moisture content,
            // which in turn is used to derive the live fuel moisture content of extinction
            this.fineWaterLoad += particle.fineWaterLoad            // summation
        }

        // The fine fuel moisture content applies ONLY to the dead fuel category,
        // and is ONLY used in the computation of live fuel moisture content of extinction
        this.fineMois = this.fineWaterLoad / this.fineFuelLoad
    }
}

export class FuelBed {
    /**
     * 
     * @param {StandardFuelModel} fuelModel Reference to a StandardFuelModel class instance.
     * @param {object} cured May have properties {herb, stem} or others as assigned by each fuel model
     */
    constructor(fuelModel, cured={}) {
        this.bulkDensity = 0
        this.cured = cured
        this.depth = fuelModel.depth
        this.ovendryLoad = 0
        this.packingRatio = 0
        this.packingRatioOpt = 0
        this.packingRatioRatio = 0
        this.propagatingFluxRatio = 0
        this.qig = 0
        this.reactionIntensity = 0
        this.reactionIntensityDry = 0
        this.reactionVelocityExp = 1
        this.reactionVelocityMax = 0
        this.reactionVelocityOpt = 0
        this.residenceTime = 0
        this.savr = 1
        this.savr15 = 1
        this.surfaceArea = 0
        this.volume = 0

        // Create the dead and live fuel beds, and add their constituent particles
        this.dead = new FuelBedLifeCategory('dead', fuelModel.deadMext)
        this.live = new FuelBedLifeCategory('live', 1)
        for(let particle of fuelModel.particles) {
            // Divide the particle into separate "dead" and "live" categories, if needed
            let curedFraction = particle.cured      // particle default cured fraction
            if (Object.hasOwn(cured, particle.type)) {
                curedFraction = cured[particle.type]// overridden by cured parameter
            }
            if (curedFraction === 1)
                this.dead.addParticle(particle, 1)  // add all of it to dead category
            else if (curedFraction === 0)
                this.live.addParticle(particle, 1)  // add all of it to live category
            else {
                this.dead.addParticle(particle, curedFraction)
                this.live.addParticle(particle, (1 - curedFraction))
            }
        }
        this.dead.updateParticles()
        this.live.updateParticles()

        // Fuel bed summation properties
        for (let prop of ['ovendryLoad', 'surfaceArea', 'volume'])
            this[prop] = this.dead[prop] + this.live[prop]

        // Fuel life category weighting factors
        for(let life of ['dead', 'live'])
            this[life].surfaceAreaWtg = (this.surfaceArea > 0) ? this[life].surfaceArea / this.surfaceArea : 0

        // Fuel bed savr
        this.savr = this.dead.savr * this.dead.surfaceAreaWtg + this.live.savr * this.live.surfaceAreaWtg

        // Fuel bed calculated properties
        this.bulkDensity = (this.depth > 0) ? this.ovendryLoad / this.depth : 0

        // Packing ratio
        this.packingRatio = (this.depth > 0) ? this.volume / this.depth : 0

        //  Rothermel (1972) eq 37 (p 19, 26) and eq 69 (p32).
        this.packingRatioOpt = (this.savr > 0) ? 3.348 / this.savr ** 0.8189 : 0

        // Ratio of packing ratio to the optimum packing ratio
        this.packingRatioRatio = (this.packingRatioOpt > 0) ? this.packingRatio / this.packingRatioOpt : 0

        // The no-wind, no-slope propagating flux (ratio) is the numerator of the Rothermel (1972)
        // spread rate equation 1 and has units of heat per unit area per unit time.
        // See Rothermel (1972) eq 42 (p 20, 26) and eq 76 (p32).
        this.propagatingFluxRatio = (this.savr > 0)
            ? Math.exp((0.792 + 0.681 * Math.sqrt(this.savr)) * (this.packingRatio + 0.1)) / (192 + 0.2595 * this.savr) : 0

        // This is an arbitrary variable 'A' used to derive the fuel bed optimum reaction velocity (1/min).
        // See Rothermel (1972) eq 39 (p19, 26) and 67 (p 31).
        this.reactionVelocityExp = (this.savr > 0) ? 133 / this.savr**0.7913 : 0

        this.savr15 = (this.savr > 0) ? this.savr**1.5 : 0

        // Fuel bed flame residence time (min)
        this.residenceTime = (this.savr > 0) ? 384 / this.savr : 0

        // Fuel bed maximum reaction velocity (1/min)
        // See Rothermel (1972) eq 36 (p 19, 26) and 68 (p 32).
        this.reactionVelocityMax = (this.savr15 > 0) ? this.savr15 / (495 + 0.0594 * this.savr15) : 0

        // Fuel bed optimum reaction velocity (min-1)
        // See Rothermel (1972) eq 38 (p 19, 26) and eq 67 (p 31).
        this.reactionVelocityOpt = (this.packingRatioRatio > 0)
            ? this.reactionVelocityMax * this.packingRatioRatio**this.reactionVelocityExp
                * Math.exp(this.reactionVelocityExp * (1 - this.packingRatioRatio)) : 0

        // Fuel bed life category Reaction intensity under ovendry fuel conditions (BTU/ft2/min)
        for(let life of ['dead', 'live'])
            this[life].reactionIntensityDry = this.reactionVelocityOpt * this[life].netLoad * this[life].heat * this[life].mineralDamping

        // The live fuel moisture content of extinction factor represents the ratio
        // of dead-to-live fuel mass that must be raised to ignition.  It is constant
        // within a fuel bed, and applies ONLY to the LIVE fuel bed life category.
        // It was first described by Rothermel (1972) on page 35 and subsequently
        // refined in BEHAVE and BehavePlus to use the 'effective fuel load' and
        // 'effective heating number' to determine the ratio of fine dead to fine live fuels.
        // See Rothermel (1972) eq 88 on page 35.
        this.liveMextFactor = 2.9 * (this.dead.fineFuelLoad / this.live.fineFuelLoad)

        
        // Fuel bed slope coeffient `phiS` slope factor.
        // This factor is an intermediate parameter that is constant for a fuel bed,
        // and used to determine the fire spread slope coefficient `phiS`.
        // See Rothermel (1972) eq 51 (p 24, 26) and eq 80 (p 33).
        this.slopeK = (this.packingRatio > 0) ? 5.275 * this.packingRatio**-0.3 : 0

        // Fuel bed wind coefficient `phiW` correlation factor `B`.
        // This factor is an intermediate parameter that is constant for a fuel bed,
        // and is used to derive the fire spread wind coefficient `phiW`.
        // * See Rothermel (1972) eq 49 (p 23, 26) and eq 83 (p 33).
        this.windB = (this.savr > 0) ? 0.02526 * this.savr**0.54 : 0

        // Calculate the fuel bed wind coefficient `phiW` correlation factor `C`.
        // This factor is an intermediate parameter that is constant for a fuel bed,
        // and is used to derive the fire spread wind coefficient `phiW`.
        // See Rothermel (1972) eq 48 (p 23, 26) and eq 82 (p 33).
        this.windC = (this.savr > 0) ? 7.47 * Math.exp(-0.133 * this.savr**0.55) : 0

        // Calculate the fuel bed wind coefficient `phiW` correlation factor `E`.
        // This factor is an intermediate parameter that is constant for a fuel bed,
        // and is used to derive the fire spread wind coefficient `phiW`.
        // See Rothermel (1972) eq 50 (p 23, 26) and eq 82 (p 33).
        this.windE = (this.savr > 0) ? 0.715 * Math.exp(-0.000359 * this.savr) : 0

        // Calculate the fuel bed wind coeffient `phiW` inverse K wind factor.
        // This factor is an intermediate parameter that is constant for a fuel bed,
        // and used to determine the fire spread wind coefficient `phiW`.
        // It is the inverse of the wind factor 'K', and is used to re-derive
        // effective wind speeds within the BEHAVE fire spread computations.
        // See Rothermel (1972) eq 47 (p 23, 26) and eq 79 (p 33).
        this.windI = (this.packingRatioRatio > 0 && this.windC > 0) ?
            this.packingRatioRatio ** this.windE / this.windC : 0

        // Calculate the fuel bed wind coeffient `phiW` wind K factor.
        // This factor is an intermediate parameter that is constant for a fuel bed,
        // and used to determine the fire spread wind coefficient `phiW`.
        // See Rothermel (1972) eq 47 (p 23, 26) and eq 79 (p 33).
        //
        // @param {float} betr Fuel bed packing ratio (ratio).
        // @param {float} wnde The fuel bed wind coefficient `phiW` correlation factor `E`.
        // @param {float} wndc The fuel bed wind coefficient `phiW` correlation factor `C`.
        // @return float Factor used to derive the wind coefficient `phiW' (ratio).
        this.windK = (this.packingRatioRatio > 0 && this.windE > 0) ?
            this.windC * this.packingRatioRatio**-this.windE : 0
    }

    // mois is an object with properties {dead1h, dead10h, dead100h, herb, stem}
    updateMoisture(mois) {
        this.dead.updateMoistureContent(mois)
        this.live.updateMoistureContent(mois)

        // Fuel bed weighted heat of preignition
        this.qig = this.dead.qig * this.dead.surfaceAreaWtg + this.live.qig * this.live.surfaceAreaWtg

        // Live fuel moisture content of extinction
        const dry = 1 - this.dead.fineMois / this.dead.mext
        const liveMext = this.liveMextFactor * dry - 0.226
        this.live.mext = Math.max(liveMext, this.dead.mext)

        // Now we can determine the fuel life category mineral damping
        let r = this.dead.mois / this.dead.mext
        this.dead.moistureDamping = fraction(1 - 2.59 * r + 5.11 * r * r - 3.52 * r * r * r)
        r = this.live.mois / this.live.mext
        this.live.moistureDamping = fraction(1 - 2.59 * r + 5.11 * r * r - 3.52 * r * r * r)

        // Fuel bed life category reaction intensity under current moisture conditions (BTU/ft2/min)
        for(let life of ['dead', 'live'])
            this[life].reactionIntensity = this[life].reactionIntensityDry * this[life].moistureDamping

        // Fuel bed reaction intensity under current moisture conditions (BTU/ft2/min)
        this.reactionIntensity = this.dead.reactionIntensity + this.live.reactionIntensity
        
        // Fire spread heat sink (BTU/ft3)
        this.heatSink = this.bulkDensity *  this.qig

        // Fire spread heat source (BTU/ft2/min)
        // Product of the total fire reaction intensity (btu+1 ft-2 min-1)
        // and the fuel bed propagating flux ratio (ratio).
        this.heatSource = this.reactionIntensity * this.propagatingFluxRatio

        // No-wind, no-slope fire spread rate
        this.ros0 = (this.heatSink > 0) ? this.heatSource / this.heatSink : 0
        return this
    }
}