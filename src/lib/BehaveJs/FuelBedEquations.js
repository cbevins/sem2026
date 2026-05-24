/**
 * @file Behavejs 'fuel/bed' equations as described by Rothermel (1972) and as implemented by BehavePlus V6.
 * @copyright 2025 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
*/
import {Calc} from './Calc.js'

export class FuelBedEquations {
    /**
     * Calculate the fuel bed bulk density (lb/ft3)
     * @param {float} totalOvendryLoad  (lb/ft2)
     * @param {float} bedDepth (ft)
     * @returns Fuel bed bulk density (lb/ft3)
     */
    static bulkDensity(totalOvendryLoad, bedDepth) {
        return Calc.divide(totalOvendryLoad, bedDepth)
    }

    /**
     * Cured herb fraction is 1 at moisture content of 0.3,
     * and is 0.001 at moisture content of 1.20
     * @param {float} liveHerbMc (fraction)
     * @returns Fraction of cured herb
     */
    static curedHerbFraction (liveHerbMc) {
        const fraction = 1.333 - 1.11 * liveHerbMc
        return Calc.fraction(fraction)
    }

    /**
     * Calculate the life fuel category reaction intensity without moisture damping.
     *
     * @param {float} rxvo Fuel bed optimum reaction velocity (min-1).
     * @param {float} wnet Life fuel category net ovendry fuel load (lb+1 ft-2).
     * @param {float} heat Life fuel category heat of combustion (btu+1 lb-1).
     * @param {float} etas Life fuel category mineral damping coefficient (fraction).
     * @return The life fuel category reaction intensity (btu+1 ft-2 min-1)
     *      without moisture damping.
     */
    static dryFuelReactionIntensity(rxvo, wnet, heat, etas) {
        return rxvo * wnet * heat * etas
    }

    /**
     * Calculate the fire spread heat sink
     * @param {float} qig Fuel bed heat of pre-ignition (btu+1 lb-1)
     * @param {float} bulk Fuel bed bulk density (lb+1 ft-3)
     * @return float Fuel bed heat sink (btu+1 ft-3)
     */
    static heatSink (bulk, qig) {
        return bulk * qig
    }

    /**
     * Calculate the fire spread heat source
     *
     * @param {float} rxi The total fire reaction intensity (btu+1 ft-2 min-1).
     * @param {float} pflx The fuel bed propagating flux ratio (ratio).
     * @return The fire spread heat source (btu+1 ft-2 min-1).
     */
    static heatSource(rxi, pflx) {
        return pflx * rxi
    }

    /**
     * Calculate the fire heat per unit area.
     *
     * @param {float} rxi Fire reaction intensity (btu+1 ft-2 min-1).
     * @param {float} taur The fire/flame residence time (min+1).
     * @return The heat per unit area (btu+1 ft-2).
     */
    static heatPerUnitArea (rxi, taur) {
        return rxi * taur
    }

    /**
     * Calculate the 'live' fuel category moisture content of extinction.
     *
     * @param {float} mextk The 'live' fuel category moisture content of extinction factor (ratio).
     * @param {float} dfmc The 'dead' fuel category fine moisture content (ratio).
     * @param {float} dmext The 'dead' category moisture content of extinction (ratio).
     * @return The 'live' fuel category  moisture content of extinction (ratio).
     */
    static liveFuelExtinctionMoistureContent (mextk, dfmc, dmext) {
        const dry = 1 - Calc.divide(dfmc, dmext)
        const lmext = mextk * dry - 0.226
        return Math.max(lmext, dmext)
    }

    /**
     * Calculate the 'live' fuel category moisture content of extinction factor.
     *
     * This factor is constant for a fuel bed, and represents the ratio
     * of dead-to-live fuel mass that must be raised to ignition.  It
     * is the method described by Rothermel (1972) on page 35 that was
     * subsequently refined in BEHAVE and BehavePlus to use the
     * effective fuel load and effective heating number to determine
     * the ratio of fine dead to fine live fuels.
     *
     * See Rothermel (1972) eq 88 on page 35.
     *
     * @param {float} defl The 'dead' fuel catagory total fine fuel load (lb+1 ft-2).
     * @param {float} lefl The 'live' fuel catagory total fine fuel load (lb+1 ft-2).
     *
     * @return The 'live' fuel category moisture content of extinction factor (fraction).
     */
    static liveFuelExtinctionMoistureContentFactor(defl, lefl) {
        return 2.9 * Calc.divide(defl, lefl)
    }

    /**
     * Calculate the dead or live category mineral damping coefficient.
     *
     * @param {float} lifeCategoryEffectiveMineralContent (fraction)
     * @return Dead or live fuel category mineral damping coefficient (fraction)
     */
    static mineralDamping (seff) {
        const etas = seff <= 0 ? 1 : 0.174 / seff ** 0.19
        return Calc.fraction(etas)
    }

    /**
     * Calculate the dead or live life category moisture damping coefficient.
     *
     * @param mois Life fuel category moisture content (ratio).
     * @param mext Life fuel category moisture content of extinction (ratio).
     * @return The life fuel category moisture damping coefficient (fraction).
     */
    static moistureDamping (mois, mext) {
        const r = Calc.divide(mois, mext)
        return Calc.fraction(1 - 2.59 * r + 5.11 * r * r - 3.52 * r * r * r)
    }

    /**
     * Calculate the no-wind no-slope fire spread rate.
     *
     * @param {float} heatSource The fire spread heat source (btu+1 ft-2 min-1).
     * @param {float} heatSink The fuel bed heat sink (btu+1 ft-3).
     * @return The no-wind no-slope fire spread rate (ft+1 min-1).
     */
    static noWindNoSlopeSpreadRate(heatSource, heatSink) {
        return Calc.positive(Calc.divide(heatSource, heatSink))
    }

    /**
     * Calculate the open-canopy midflame wind speed adjustment factor.
     *
     * @param fuelDepth Fuel bed depth (ft+1)
     * @return Wind speed adjustment factor
     */
    static openWindSpeedAdjustmentFactor (fuelDepth) {
        const f = Math.min(6, Math.max(fuelDepth, 0.1))
        return 1.83 / Math.log((20 + 0.36 * f) / (0.13 * f))
    }

    /**
     * Calculate the fuel bed optimum packing ratio (fraction).
     *
     * See Rothermel (1972) eq 37 (p 19, 26) and eq 69 (p32).
     *
     * @param {float} bedSavr Fuel bed surface area-to-volume ratio (ft-1).
     * @return float The fuel bed optimum packing ratio (fraction).
     */
    static optimumPackingRatio (savr) {
        return savr <= 0 ? 0 : 3.348 / savr ** 0.8189
    }

    static packingRatio (deadPprc, livePprc, depth) {
        return Calc.divide(deadPprc + livePprc, depth)
    }

    static packingRatioRatio(packingRatio, optPackingRatio) {
        return Calc.divide(packingRatio, optPackingRatio)
    }

    /** Calculate the fire spread rate slope coefficient (ratio).
     *
     * This returns Rothermel's (1972) `phiS' as per equation 51 (p 24, 26).
     *
     * @param slopeRatio Slope steepness ratio (vertical rise / horizontal reach).
     * @param slopeK Fuel Bed slope factor.
     * @return The fire spread rate slope coefficient (ratio).
     */
    static phiSlopeDUP (slopeRatio, slopeK) {
        const phis = slopeK * slopeRatio * slopeRatio
        // console.log(`***phiSlope() slopeRatio=${slopeRatio}, slopeK=${slopeK} yields ${phis}`)
        return phis
    }

    /** Calculate the fire spread rate wind coefficient (ratio).
     *
     * This returns Rothermel's (1972) `phiW' as per equation 47 (p 23, 26).
     *
     * @param midflameWind Wind speed at midflame height (ft+1 min-1).
     * @param windB Fuel Bed wind factor `B`.
     * @param windK Fuel Bed wind factor `K`.
     * @return The fire spread rate wind coefficient (ratio).
     */
    static phiWindDUP (midflameWind, windB, windK) {
        const phiw = midflameWind <= 0 ? 0 : windK * Math.pow(midflameWind, windB)
        // console.log(`***phiWind() midws=${midflameWind}, windB=${windB}, windK=${windK} yields ${phiw}`)
        return phiw
    }

    /**
     * Calculate the no-wind propagating flux ratio (ratio).
     *
     * The propagating flux is the numerator of the Rothermel (1972) spread
     * rate equation 1 and has units of heat per unit area per unit time.
     *
     * See Rothermel (1972) eq 42 (p 20, 26) and eq 76 (p32).
     *
     * @param {float} savr The fuel bed characteristic surface area-to-volume ratio (ft-1).
     * @param {float} beta The fuel bed packing ratio (ratio).
     * @return float The fuel bed no-wind propagating flux ratio (ratio).
     */
    static propagatingFluxRatio (savr, beta) {
        // console.log('***propflux savr=', savr, 'beta=',beta)
        return savr <= 0
            ? 0
            : Math.exp((0.792 + 0.681 * Math.sqrt(savr)) * (beta + 0.1)) /
                (192 + 0.2595 * savr)
    }

    static secondaryCoverage(primaryCoverage) {
        return 1 - primaryCoverage
    }
    
    static reactionIntensity( deadRxi, liveRxi) {
        return deadRxi + liveRxi
    }

    /**
     * Calculate the fuel bed reaction velocity exponent 'A'.
     *
     * This is an arbitrary variable 'A'  used to derive the
     * fuel bed optimum reaction velocity.
     * See Rothermel (1972) eq 39 (p19, 26) and 67 (p 31).
     *
     * @param {float} savr Fuel bed surface area-to-volume ratio (ft-1).
     * @return float Fuel bed reaction velocity exponent 'A' (ratio).
     */
    static reactionVelocityExponent (savr) {
        return savr <= 0 ? 0 : 133 / savr ** 0.7913
    }

    /**
     * Calculate the fuel bed maximum reaction velocity (min-1).
     *
     * See Rothermel (1972) eq 36 (p 19, 26) and 68 (p 32).
     *
     * @param {float} bedSavr Fuel bed surface area-to-volume ratio (ft-1).
     * @return float Fuel bed maximum reaction velocity (min-1).
     */
    static reactionVelocityMaximum (sv15) {
        return sv15 <= 0 ? 0 : sv15 / (495 + 0.0594 * sv15)
    }

    /**
     * Calculate the fuel bed optimum reaction velocity (min-1).
     *
     * See Rothermel (1972) eq 38 (p 19, 26) and eq 67 (p 31).
     *
     * @param {float} betr Fuel bed packing ratio ratio (ratio).
     * @param {float} rxvm Fuel bed maximum reaction velocity (min-1).
     * @param {float} rxve Fuel bed reaction velocity exponent 'A' (ratio).
     * @return float Fuel bed optimum reaction velocity (min-1).
     */
    static reactionVelocityOptimum (betr, rxvm, rxve) {
        return betr <= 0 || betr === 1
            ? 0
            : rxvm * betr ** rxve * Math.exp(rxve * (1 - betr))
    }

    /**
     * Calculate the often-used intermediate parameter of the fuel bed's
     * characteristics surface area-to-volume ratio raised to the 1.5 power.
     *
     * @param {float} savr Fuel bed characteristic surface area-to-volume ratio (ft-1).
     * @return float Fuel bed parameter (ratio).
     */
    static savr15 (savr) {
        return savr ** 1.5
    }

    /**
     * Returns an array of 6 size class area weighting factors.
     * @param {float} a1 - surface area of fuel element 1 
     * @param {float} s1 - size class of fuel element 1
     * @param {float} a5 - surface area of fuel element 15
     * @param {float} s5 - size class of fuel element 5
     * @returns Returns an array of 6 size class area weighting factors.
     */
    static sizeClassWeightingFactorArray(a1, s1, a2, s2, a3, s3, a4, s4, a5, s5) {
        const a = [a1, a2, a3, a4, a5]
        const s = [s1, s2, s3, s4, s5]
        let tarea = 0.0
        const scar = [0, 0, 0, 0, 0, 0]
        for (let idx = 0; idx < 5; idx += 1) {
            scar[s[idx]] += a[idx]
            tarea += a[idx]
        }
        const scwt = [0, 0, 0, 0, 0, 0]
        if (tarea > 0.0) {
            for (let idx = 0; idx < 6; idx += 1) {
                scwt[idx] = scar[idx] / tarea
            }
        }
        return scwt
    }

    /**
     * Calculate the fuel bed slope coeffient `phiS` slope factor.
     *
     * This factor is an intermediate parameter that is constant for a fuel bed,
     * and used to determine the fire spread slope coefficient `phiS`.
     *
     * See Rothermel (1972) eq 51 (p 24, 26) and eq 80 (p 33).
     *
     * @param {float} packingRatio Fuel bed packing ratio (ratio).
     * @return float Factor used to derive the slope coefficient `phiS' (factor).
     */
    static slopeK (beta) {
        return beta <= 0 ? 0 : 5.275 * beta ** -0.3
    }

    /**
     * Calculate the fuel bed flame residence time.
     *
     * \TODO find reference
     *
     * @param {float} savr Fuel bed surface area-to-volume ratio (ft-1).
     * @return Fuel bed flame residence time (min+1).
     */
    static fireResidenceTime (savr) {
        return savr <= 0 ? 0 : 384 / savr
    }

    static weightedHeatOfPreIgnition(deadWtg, deadQig, liveWtg, liveQig) {
        return deadWtg * deadQig + liveWtg * liveQig
    }

    static weightedSavr(deadWtg, deadSavr, liveWtg, liveSavr) {
        return deadWtg * deadSavr + liveWtg * liveSavr
    }

    /**
     * Calculate the fuel bed wind coefficient `phiW` correlation factor `B`.
     *
     * This factor is an intermediate parameter that is constant for a fuel bed,
     * and is used to derive the fire spread wind coefficient `phiW`.
     *
     * See Rothermel (1972) eq 49 (p 23, 26) and eq 83 (p 33).
     *
     * @param {float} savr Fuel bed characteristic surface area-to-volume ratio (ft-1).
     * @return float Wind coefficient `phiW` correlation parameter `B` (ratio).
     */
    static windB (savr) {
        const b = 0.02526 * savr ** 0.54
        return b
    }

    /**
     * Calculate the fuel bed wind coefficient `phiW` correlation factor `C`.
     *
     * This factor is an intermediate parameter that is constant for a fuel bed,
     * and is used to derive the fire spread wind coefficient `phiW`.
     *
     * See Rothermel (1972) eq 48 (p 23, 26) and eq 82 (p 33).
     *
     * @param {float} savr Fuel bed characteristic surface area-to-volume ratio (ft-1).
     * @return float Wind coefficient `phiW` correlation parameter `C` (ratio).
     */
    static windC (savr) {
        const c = 7.47 * Math.exp(-0.133 * savr ** 0.55)
        return c
    }

    /**
     * Calculate the fuel bed wind coefficient `phiW` correlation factor `E`.
     *
     * This factor is an intermediate parameter that is constant for a fuel bed,
     * and is used to derive the fire spread wind coefficient `phiW`.
     *
     * See Rothermel (1972) eq 50 (p 23, 26) and eq 82 (p 33).
     *
     * @param {float} savr Fuel bed characteristic surface area-to-volume ratio (ft-1).
     * @return float Wind coefficient `phiW` correlation parameter `E` (ratio).
     */
    static windE (savr) {
        return 0.715 * Math.exp(-0.000359 * savr)
    }

    /**
     * Calculate the fuel bed wind coeffient `phiW` inverse K wind factor.
     *
     * This factor is an intermediate parameter that is constant for a fuel bed,
     * and used to determine the fire spread wind coefficient `phiW`.
     *
     * It is the inverse of the wind factor 'K', and is used to re-derive
     * effective wind speeds within the BEHAVE fire spread computations.
     *
     * See Rothermel (1972) eq 47 (p 23, 26) and eq 79 (p 33).
     *
     * @param {float} betr Fuel bed packing ratio ratio (ratio).
     * @param {float} wnde The fuel bed wind coefficient `phiW` correlation factor `E`.
     * @param {float} wndc The fuel bed wind coefficient `phiW` correlation factor `C`.
     * @return float Factor used to derive the wind coefficient `phiW' (ratio).
     */
    static windI (betr, wnde, wndc) {
        const i = betr <= 0.0 || wndc <= 0 ? 0 : betr ** wnde / wndc
        // console.log(`***windI() betr=${betr}, wnde=${wnde}, wndc=${wndc} yields ${i}`)
        return i
    }

    /**
     * Calculate the fuel bed wind coeffient `phiW` wind factor.
     *
     * This factor is an intermediate parameter that is constant for a fuel bed,
     * and used to determine the fire spread wind coefficient `phiW`.
     *
     * See Rothermel (1972) eq 47 (p 23, 26) and eq 79 (p 33).
     *
     * @param {float} betr Fuel bed packing ratio (ratio).
     * @param {float} wnde The fuel bed wind coefficient `phiW` correlation factor `E`.
     * @param {float} wndc The fuel bed wind coefficient `phiW` correlation factor `C`.
     * @return float Factor used to derive the wind coefficient `phiW' (ratio).
     */
    static windK (betr, wnde, wndc) {
        const k = betr <= 0 ? 0 : wndc * betr ** -wnde
        // console.log(`***windK() betr=${betr} wnde=${wnde} wndc=${wndc} yields ${k}`)
        return k
    }

    static windSpeedAdjustmentFactor (fuelSheltered, shelteredWaf, openWaf) {
        return fuelSheltered ? Math.min(shelteredWaf, openWaf) : openWaf
    }
}