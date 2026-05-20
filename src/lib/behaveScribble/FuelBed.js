export class FuelBedParticle {
    constructor(fuelModelParticle, loadFraction=1) {
        const p = fuelModelParticle

        // This class has 7 FuelModelParticle properties
        this.ovendryLoad = p.load * loadFraction
        this.savr = p.savr
        this.density = p.dens
        this.heat = p.heat
        this.totalMineral = p.stot
        this.effMineral = p.seff
        this.fmcc = p.fmcc

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

    // mois = {th1h, tl10h, tl100h, stem, herb}
    updateMoistureContent(mois) {
        // 3 derived properties that depend upon fuel moisture

        // Particle fuel moisture content (lb water / lb ovendry load)
        this.mois = mois[this.fmcc]

        // Particle heat of pre-ignition (BTU/lb) from Rothermel Eq 12 (p 7, 26)
        this.qig = this.effHeating * (250.0 + 1116.0 * mois)

        // Particle effective water load (lb water / lb effective fuel load)
        this.fineWaterLoad = this.fineFuelLoad * mois
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
        this.savr = 0
        this.sizeClassArea = [0,0,0,0,0,0]
        this.sizeClassWtg = [0,0,0,0,0,0]
        this.surfaceArea = 0
        this.volume = 0
    }

    addParticle(fuelModelParticle, loadFraction) {
        const p = new FuelBedParticle(fuelModelParticle, loadFraction)
        // Ensure that cured live fuels use the correct dead fuel moisture content class
        if (this.category === "dead") {
            if (p.fmcc !== 'tl1h' && p.fmcc !== 'tl10h' && p.fmcc !== 'tl100h') {
                if(p.sizzeClass <= 1) p.fmcc = 'tl1h'
                else if (p.sizeClass <=3) p.fmcc = 'tl10h'
                else p.fmcc = 'tl100h'
            }
        }
        this.particle.push(p)
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
            particle.fineFuelLoad = (this.savr > 0) ? this.ovendryLoad * Math.exp(this.fineFuelLoadfactor / this.savr) : 0
            this.fineFuelLoad += particle.fineFuelLoad
        }

        this.mineralDamping = (this.effMineral > 0) ? fraction(0.174 / this.effMineral**0.19) : 1
    }

    // mois = {th1h, tl10h, tl100h, stem, herb}
    updateMoistureContent(mois) {
        // Fuel bed life category weighted values
        this.mois = 0
        this.fineWaterLoad = 0
        this.qig = 0
        for(let particle of this.particles) {
            particle.updateMoistureContent(mois)
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

        const r = this.mois / this.mext
        this.moistureDamping = fraction(1 - 2.59 * r + 5.11 * r * r - 3.52 * r * r * r)
    }
}

export class FuelBed {
    /**
     * 
     * @param {StandardFuelModel} fuelModel Reference to a StandardFuelModel class instance.
     * @param {number} deadHerb Dead fraction of the ovendry load of FuelParticles with type "herb"
     */
    constructor(fuelModel, deadHerb=0) {
        this.fuelModel = fuelModel
        this.deadHerb = deadHerb
        this.depth = fuelModel.depth

        // Create the dead and live fuel beds, and add their constituent particles
        this.dead = new FuelBedLifeCategory('dead', fuelModel.deadMext)
        this.live = new FuelBedLifeCategory('live', 1)
        for(let fmp of fuelModel.particles) {
            if (fmp.dead === 1)
                this.dead.addParticle(fmp, 1)
            else if (fmp.dead === 0)
                this.live.addparticle(fmp, 1)
            else {
                this.dead.addparticle(fmp, fmp.dead)
                this.live.addParticle(fmp, (1-fmp.dead))
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

        // Fuel bed weighted properties
        for(let prop of ['savr', 'qig'])
            this[prop] = this.dead[prop] * this.dead.surfaceAreaWtg + this.live[prop] * this.live.surfaceAreaWtg

        // Fuel bed calculated properties
        this.bulkDensity = (this.bedDepth > 0) ? this.ovendryLoad / this.bedDepth : 0

        // Packing ratio
        this.packingRatio = (this.bedDepth > 0) ? this.volume / this.bedDepth : 0

        //  Rothermel (1972) eq 37 (p 19, 26) and eq 69 (p32).
        this.optPackingRatio = (this.savr > 0) ? 3.348 / this.savr ** 0.8189 : 0

        // Ratio of packing ratio to the optimum packing ratio
        this.packingRatioRatio = (this.optPackingRatio > 0) ? this.packingRatio / this.optPackingRatio : 0

        // The no-wind, no-slope propagating flux (ratio) is the numerator of the Rothermel (1972)
        // spread rate equation 1 and has units of heat per unit area per unit time.
        // See Rothermel (1972) eq 42 (p 20, 26) and eq 76 (p32).
        this.propFlux = (this.savr > 0)
            ? Math.exp((0.792 + 0.681 * Math.sqrt(this.savr)) * (this.packingRatio + 0.1)) / (192 + 0.2595 * this.savr) : 0

        // This is an arbitrary variable 'A' used to derive the fuel bed optimum reaction velocity (1/min).
        // See Rothermel (1972) eq 39 (p19, 26) and 67 (p 31).
        this.reactionVelA = (this.savr > 0) ? 133 / this.savr**0.7913 : 0

        this.savr15 = (this.savr > 0) ? this.savr**1.5 : 0

        // Fuel bed flame residence time (min)
        this.residenceTime = (this.savr > 0) ? 384 / this.savr : 0
    }

        // Fuel bed maximum reaction velocity (1/min)
        // See Rothermel (1972) eq 36 (p 19, 26) and 68 (p 32).
        this.reactionVelMax = (this.savr15 > 0) ? this.savr15 / (495 + 0.0594 * this.savr15) : 0

        // Fuel bed optimum reaction velocity (min-1)
        // See Rothermel (1972) eq 38 (p 19, 26) and eq 67 (p 31).
        this.reactionVelOpt = (this.packingRatioRatio>0 && this.packingRatioRatio < 1)
            ? this.reactionVelMax * this.packingRatioRatio**this.reactionVelA
                * Math.exp(this.reactionVelA * (1 - this.packingRatioRatio)) : 0

        // Fuel bed life category Reaction intensity under ovendry fuel conditions (BTU/ft2/min)
        for(let life of ['dead', 'live'])
            this[life].dryRxInt = this.reactionVelOpt * this[life].netLoad * this[life].heat * this[life].mineralDamping

        // Fire spread heat sink (BTU/ft3)
        this.heatSink = this.bulkDensity *  this.qig

        // The live fuel moisture content of extinction factor represents the ratio
        // of dead-to-live fuel mass that must be raised to ignition.  It is constant
        // within a fuel bed, and applies ONLY to the LIVE fuel bed life category.
        // It was first described by Rothermel (1972) on page 35 and subsequently
        // refined in BEHAVE and BehavePlus to use the 'effective fuel load' and
        // 'effective heating number' to determine the ratio of fine dead to fine live fuels.
        // See Rothermel (1972) eq 88 on page 35.
        this.liveMextFactor = 2.9 * (this.dead.fineFuelLoad / this.live.fineFuelLoad)
    }

    updateMoisture(mois) {
        this.dead.updateMoistureContent(mois)
        this.live.updateMoistureContent(mois)

        // Fuel bed life category reaction intensity under current moisture conditions (BTU/ft2/min)
        for(let life of ['dead', 'live'])
            this[life].rxInt = this[life].dryRxInt * this[life].moistureDamping

        // Fuel bed reaction intensity under current moisture conditions (BTU/ft2/min)
        this.rxInt = this.dead.rxInt + this.live.rxInt

        // Live fuel moisture content of extinction
        const dry = 1 - this.dead.fineMois / this.dead.mext
        const liveMext = this.liveMextFactor * dry - 0.226
        this.live.mext = Math.max(liveMext, this.dead.mext)
        return this
    }
}