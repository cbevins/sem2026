import { DeadFuelBed, LiveFuelBed } from "./FuelBedLife.js"

export class FuelBed {
    constructor(fuelModel, curingConditions={}) {
        this.setFuelConditions(fuelModel, curingConditions)
    }
    
    setFuelConditions(fuelModel, curingConditions={}) {
        // Apply any changed curing conditions
        this.curingConditions = curingConditions
        this.modelCode = fuelModel.code     // just save the FuelModel.code

        this.depth = fuelModel.depth
        this.dead = new DeadFuelBed(fuelModel, curingConditions)
        this.live = new LiveFuelBed(fuelModel, curingConditions)

        // Accumulate fuel bed total surface area (ft2), ovendry load (lb/ft2), and volume (ft3)
        for (let prop of ['ovendryLoad', 'surfaceArea', 'volume'])
            this[prop] = this.dead[prop] + this.live[prop]

        // Assign fuel life category surface area weighting factors
        for(let life of ['dead', 'live'])
            this[life].surfaceAreaWtg = (this.surfaceArea > 0) ? this[life].surfaceArea / this.surfaceArea : 0

        // Fuel bed characteristic surface area-to-volume ratio (ft2/ft3)
        this.savr = this.dead.savr * this.dead.surfaceAreaWtg + this.live.savr * this.live.surfaceAreaWtg

        // Fuel bed ovendry bulk density (lb/ft3) is only used to derive heat sink
        this.bulkDensity = (this.depth > 0) ? this.ovendryLoad / this.depth : 0

        // Fuel bed packing ratio is the ratio of bulk density to particle density
        // Rothermel (1972) eq 31 (p 26)
        this.packingRatio = (this.depth > 0) ? this.volume / this.depth : 0

        //  Rothermel (1972) eq 37 (p 19, 26) and eq 69 (p32).
        this.packingRatioOpt = (this.savr > 0) ? 3.348 / this.savr ** 0.8189 : 0

        // Ratio of packing ratio to the optimum packing ratio
        this.packingRatioFraction = (this.packingRatioOpt > 0) ? this.packingRatio / this.packingRatioOpt : 0

        // The no-wind, no-slope propagating flux (ratio) is the numerator of the Rothermel (1972)
        // spread rate equation 1 and has units of heat per unit area per unit time.
        // See Rothermel (1972) eq 42 (p 20, 26) and eq 76 (p32).
        this.propagatingFluxRatio = (this.savr > 0)
            ? Math.exp((0.792 + 0.681 * Math.sqrt(this.savr)) * (this.packingRatio + 0.1)) / (192 + 0.2595 * this.savr) : 0

        // This is the arbitrary variable 'A' used to derive the fuel bed optimum reaction velocity (1/min).
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
        this.reactionVelocityOpt = (this.packingRatioFraction > 0)
            ? this.reactionVelocityMax * this.packingRatioFraction**this.reactionVelocityExp
                * Math.exp(this.reactionVelocityExp * (1 - this.packingRatioFraction)) : 0

        // Fuel bed life category reaction intensity under ovendry fuel conditions (BTU/ft2/min)
        for(let life of ['dead', 'live'])
            this[life].reactionIntensityDry = this.reactionVelocityOpt * this[life].heatSource

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
        this.windI = (this.packingRatioFraction > 0 && this.windC > 0) ?
            this.packingRatioFraction ** this.windE / this.windC : 0

        // Calculate the fuel bed wind coeffient `phiW` wind K factor.
        // This factor is an intermediate parameter that is constant for a fuel bed,
        // and used to determine the fire spread wind coefficient `phiW`.
        // See Rothermel (1972) eq 47 (p 23, 26) and eq 79 (p 33).
        this.windK = (this.packingRatioFraction > 0 && this.windE > 0) ?
            this.windC * this.packingRatioFraction**-this.windE : 0
        
        return this
    }
}
