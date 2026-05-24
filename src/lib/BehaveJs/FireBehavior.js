import { SurfaceFireEquations as Fire } from "./SurfaceFireEquations.js"
import { FuelBedEquations as Bed} from "./FuelBedEquations.js"

export class FireBehavior {
    constructor(fireIgnition, windSlopeConditions={}, config={}) {
        // Default parameters
        this.defaultWindSlopeConiditons = {windSpeed: 0, bearing: 0, aspect: 180, slopeRatio: 0, airTemp: 77}
        this.windSlopeConditions = {...this.defaultWindSlopeConiditons, ...windSlopeConditions}

        this.defaultConfig = {
            limitSpreadRateByReactionIntensity: true,
            limitSpreadRatebyEffWindSpeed: false
        }
        this.config = {...this.defaultConfig, ...config}
        this.setWindSlopeConditions(fireIgnition, this.windSlopeConditions, this.config)
    }

    setWindSlopeConditions(fireIgnition, windSlopeConditions={}, config={}) {
        this.windSlopeConditions = {...this.windSlopeConditions, ...windSlopeConditions}
        this.config = {...this.config, ...config}
        this.fireIgnition = fireIgnition

        // this.moduleVersion(fireIgnition, windSlopeConditions)
        this.updatedVersion(fireIgnition, windSlopeConditions)
        return this
    }
    
    updatedVersion(fireIgnition, windSlopeConditions) {
        const fuelBed = fireIgnition.fuelBed
        const {slopeK, windB, windC, windE, windI, windK, residenceTime} = fuelBed

        const {windSpeed, bearing, aspect, slopeRatio, airTemp} = windSlopeConditions
        const upslopeFromNorth = (aspect + 180) % 360
        const windHeadingFromUpslope = (bearing - upslopeFromNorth) % 360

        const {noWindSpreadRate, reactionIntensity} = fireIgnition

        const part = {ros:0, phi: 0, weff: 0}
        let p1={...part}, p2={...part}, p3={...part}, p4={...part}, p5={...part}, p6={...part}, p7={...part}

        //----------------------------------------------------------------------
        // Part 1: no-wind no-slope (nwns) fire spread rate conditions
        //----------------------------------------------------------------------

        p1.ros = noWindSpreadRate

        //----------------------------------------------------------------------
        // Part 2: *ADDITIONAL* fire spread rate due to wind and slope
        // ADDED to the no-wind, no-slope case
        //----------------------------------------------------------------------
        
        // Fire spread rate slope coefficient (ratio).
        // Rothermel's (1972) `phiS' as per equation 51 (p 24, 26).
        const slopeFactor = slopeK * slopeRatio * slopeRatio

        // Fire spread rate wind coefficient (ratio).
        // Rothermel's (1972) `phiW' as per equation 47 (p 23, 26).
        const windFactor = (windSpeed > 0) ? windK * Math.pow(windSpeed, windB) : 0

        // Wind and slope contributions to the spread rate
        const slopeRos = p1.ros * slopeFactor
        const windRos  = p1.ros * windFactor
        // x- and y-components of the spread rate vector
        let radians = windHeadingFromUpslope * Math.PI / 180
        const xComponent = slopeRos + windRos * Math.cos(radians)
        const yComponent = windRos * Math.sin(radians)
        p2.ros = Math.hypot(xComponent, yComponent)

        //----------------------------------------------------------------------
        // Part 3 - fire spread rate and effective wind for the cross-slope wind condition
        // NO Rothermel's limit applied (effective wind speed < 0.9 Rxi)
        // NO Andrew's limit applied (spread rate < effective wind speed)
        //----------------------------------------------------------------------

        p3.ros = p1.ros + p2.ros
        p3.phi = (p1.ros > 0) ? (p3.ros / p1.ros) - 1 : 0
        p3.weff = calcEffectiveWindSpeed(p3.phi, windB, windI)

        // Direction of maximum spread rate (degrees clockwise from upslope)
        // NOTE that p2.ros is used here, NOT p3.ros!
        const al = (p2.ros > 0) ? Math.asin(Math.abs(yComponent) / p2.ros) : 0
        radians = (xComponent >= 0)
            ? (yComponent >= 0 ? al : Math.PI + Math.PI - al)
            : (yComponent >= 0 ? Math.PI - al : Math.PI + al)
        const fireHeadingFromUpslope = radians * 180 / Math.PI
        const fireHeadingFromNorth = (upslopeFromNorth + fireHeadingFromUpslope) % 360

        //----------------------------------------------------------------------
        // Part 4 - fire spread rate and effective wind at the *effective wind speed limit*
        //----------------------------------------------------------------------

        // Maximum effective wind speed limit (ft/min) per Rothermel (1972) equation 86 on page 33.
        p4.weff = 0.9 * reactionIntensity
        p4.phi = (p4.weff > 0) ? windK * p4.weff**windB : 0
        p4.ros = p1.ros * (1 + p4.phi)

        //----------------------------------------------------------------------
        // Part 5 - fire spread rate and effective wind after applying Rothermel's effective wind speed limit
        // YES : Rothermel's limit applied (effective wind speed < 0.9 Rxi)
        // NO  : Andrew's limit applied (spread rate < effective wind speed)
        //----------------------------------------------------------------------

        p5.weff = Math.min(p3.weff, p4.weff)
        p5.phi = Math.min(p3.phi, p4.phi)
        p5.ros = Math.min(p3.ros, p4.ros)

        //----------------------------------------------------------------------
        // Part 6 - fire spread rate and effective wind after applying Andrews' RoS limit
        // NO  : Rothermel's limit applied (effective wind speed < 0.9 Rxi)
        // YES : Andrew's limit applied (spread rate < effective wind speed)
        //----------------------------------------------------------------------

        // If the spread rate exceeds the effective wind speed AND the effective
        // wind speed exceeds 1 mph, then the spread rate is reduced back to the
        // effective wind speed. This was a late change request by project head
        // Pat Andrews to BehavePlus Version 6.
        p6.ros = (p3.ros > p3.weff && p3.weff > 88) ? p3.weff : p3.ros
        p6.phi = (p1.ros > 0) ?  p6.ros / p1.ros - 1 : 0
        p6.weff = calcEffectiveWindSpeed(p6.phi, windB, windI)

        //----------------------------------------------------------------------
        // Part 7 - both Rothermel's and Andrew's limits are applied
        // YES : Rothermel's limit applied (effective wind speed < 0.9 Rxi)
        // YES : Andrew's limit applied (spread rate < effective wind speed)
        //----------------------------------------------------------------------

        p7.ros =  (p5.ros > p5.weff && p5.weff > 88) ? p5.weff : p5.ros
        p7.phi = (p1.ros > 0) ?  p7.ros / p1.ros - 1 : 0
        p7.weff = calcEffectiveWindSpeed(p7.phi, windB, windI)

        //----------------------------------------------------------------------
        // Part 8 - apply the appropriate spread rate, spread rate factor, and
        // effective wind speed, depending upin configuration
        //----------------------------------------------------------------------
        let p
        if (this.config.limitSpreadRateByReactionIntensity) 
            p = this.config.limitSpreadRatebyEffWindSpeed ? p7 : p5
        else
            p = this.config.limitSpreadRatebyEffWindSpeed ? p6 : p3

        // Fire heat per unit area. (BTU/ft2)
        const heatPerUnitArea = reactionIntensity * residenceTime

        // Fireline intensity (BTU/ft/s)
        const firelineIntensity = p.ros * reactionIntensity * residenceTime

        // Byram's (1959) flame length (ft)
        const flameLength = (firelineIntensity > 0) ? 0.45 * Math.pow(firelineIntensity, 0.46) : 0

        // Fire ellipse length-to-width ratio from the effective wind speed (ft/min)
        // Uses Anderson's (1983) equation.
        // *** NOTE: Wind speed MUST be converted to miles per hour***
        const lengthWidthRatio = 1 + 0.25 * (p.weff / 88)

        const scorchHeight = calcScorchHeight(firelineIntensity, windSpeed, airTemp)

        // Save whatever is needed for use further downstream
        this.spreadRate = p.ros
        this.effWindFactor = p.phi
        this.effWindSpeed = p.weff
        this.headingFromUpslope = fireHeadingFromUpslope
        this.headingFromNorth = fireHeadingFromNorth
        this.heatPerUnitArea = heatPerUnitArea
        this.firelineIntensity = firelineIntensity
        this.flameLength = flameLength
        this.lengthWidthRatio = lengthWidthRatio
        this.scorchHeight= scorchHeight

        // Save the following only if needed for information purposes
        this.spreadRateLimit = p4.ros
        this.effWindSpeedLimit = p4.weff
        this.effWindLimitExceeded = (p3.weff > p4.weff)
        
        // Save the following only if needed for testing/debugging purposes
        this.noWindNoSlopeSpreadRate = p1.ros
        this.additionalWindSlopeSpreadRate = p2.ros
        this.xComponent = xComponent
        this.yComponent = yComponent
        this.crossSlopeWindSpreadRate = p3.ros
        return this
    }

//     moduleVersion(fireIgnition, windSlopeConditions) {
//         const {windSpeed, bearing, aspect, slopeRatio, airTemp} = windSlopeConditions
//         const p1 = {}, p2={}, p3={}, p4={}, p5={}, p6={}, p7={};
        
//         const upslopeFromNorth = (aspect + 180) % 360
//         const windHeadingFromUpslope = (bearing - upslopeFromNorth) % 360

//         // Wind and slope factors
//         const {slopeK, windB, windC, windE, windI, windK, residenceTime} = fireIgnition.fuelBed
//         const fuelBed = fireIgnition.fuelBed

//         const phiW = Fire.phiWind(windSpeed, windB, windK)
//         const phiS = Fire.phiSlope(slopeRatio, slopeK)

//         //----------------------------------------------------------------------
//         // Part 1:  no-wind no-slope (nwns) conditions
//         //----------------------------------------------------------------------
//         // Part 1 - No-wind, no-slope fire spread rate and effective wind
//         p1.ros = Bed.noWindNoSlopeSpreadRate(fireIgnition.heatSource, fireIgnition.heatSink)
//         p1.phiE = Fire.effectiveWindSpeedCoefficient(phiW, phiS)
//         p1.weff = Fire.effectiveWindSpeed(p1.phiE, windB, windI)

//         // Part 2 - *ADDITIONAL* fire spread rate due to wind and slope ADDED to no-wind, no-slope case
//         p2.rosSlope = Fire.maximumDirectionSlopeSpreadRate(p1.ros, phiS)
//         p2.rosWind = Fire.maximumDirectionWindSpreadRate(p1.ros, phiW)
//         p2.rosXcomp = Fire.maximumDirectionXComponent(p2.rosWind, p2.rosSlope, windHeadingFromUpslope)
//         p2.rosYcomp = Fire.maximumDirectionYComponent(p2.rosWind, windHeadingFromUpslope)
//         p2.ros =  Fire.maximumDirectionSpreadRate(p2.rosXcomp, p2.rosYcomp)

//         // Part 3 - fire spread rate and effective wind for the cross-slope wind condition
//         // NO Rothermel's limit applied (effective wind speed < 0.9 Rxi)
//         // NO Andrew's limit applied (spread rate < effective wind speed)
//         p3.ros = Fire.spreadRateWithCrossSlopeWind(p1.ros, p2.ros)
//         p3.phiE = Fire.effectiveWindSpeedCoefficientInferred(p1.ros, p3.ros)
//         p3.weff = Fire.effectiveWindSpeed(p3.phiE, windB, windI)

//         // Part 4 - fire spread rate and effective wind at the *effective wind speed limit*
//         p4.weff = Fire.effectiveWindSpeedLimit(fireIgnition.reactionIntensity)
//         p4.phiE = Fire.phiEwFromEws(p4.weff, windB, windK)
//         p4.ros = Fire.maximumSpreadRate(p1.ros, p4.phiE)

//         // Part 5 (was 3a) - fire spread rate and effective wind after applying Rothermel's effective wind speed limit
//         // YES Rothermel's limit applied (effective wind speed < 0.9 Rxi)
//         // NO  Andrew's limit applied (spread rate < effective wind speed)
//         p5.weff = Math.min(p3.weff, p4.weff)
//         p5.phiE = Math.min(p3.phiE, p4.phiE)
//         p5.ros = Math.min(p3.ros, p4.ros)

//         // Part 6 (was 3b) - fire spread rate and effective wind after applying Andrews' RoS limit
//         // NO  Rothermel's limit applied (effective wind speed < 0.9 Rxi)
//         // YES Andrew's limit applied (spread rate < effective wind speed)
//         p6.ros = Fire.spreadRateWithRosLimitApplied(p3.ros, p3.weff)
//         p6.phiE = Fire.effectiveWindSpeedCoefficientInferred(p1.ros, p6.ros)
//         p6.weff = Fire.effectiveWindSpeed(p6.phiE, windB, windI)

//         // Part 7 (was 4)
//         // YES Rothermel's limit applied (effective wind speed < 0.9 Rxi)
//         // YES Andrew's limit applied (spread rate < effective wind speed)
//         p7.ros = Fire.spreadRateWithRosLimitApplied(p5.ros, p5.weff)
//         p7.phiE = Fire.effectiveWindSpeedCoefficientInferred(p1.ros, p7.ros)
//         p7.weff = Fire.effectiveWindSpeed(p7.phiE, windB, windI)

//         // Part 8 - Configure the base class fireCharModule nodes
//         // apply either Part 6 or Part 7 if EWS limit is applied
//         const p = (this.config.applySpreadRateLimit) ? p7 : p6
//         const spreadRate = p.ros
//         const effWindFactor = p.phiE
//         const effWindSpeed = p.weff
//         const effWindLimit =  p4.weff
//         const spreadRateLimit = p4.ros
//         const effWindLimitExceeded = (p3.weff > p4.weff)

//         // Direction of maximum spread
//         const fireHeadingFromUpslope = Fire.spreadDirectionFromUpslope(p2.rosXcomp, p2.rosYcomp, p2.ros)
//         const fireHeadingFromNorth = (upslopeFromNorth + fireHeadingFromUpslope) % 360
//         const heatPerUnitArea = Bed.heatPerUnitArea(fireIgnition.reactionIntensity, residenceTime)
//         const reactionIntensity = fireIgnition.reactionIntensity
//         const firelineIntensity = Fire.firelineIntensity(spreadRate, reactionIntensity, residenceTime)
//         const lengthWidthRatio = Fire.lengthToWidthRatio(effWindSpeed)
//         const flameLength = Fire.flameLength(firelineIntensity)
//         const scorchHeight = Fire.scorchHeight(firelineIntensity, airTemp)

//         this.noWindNoSlopeSpreadRate = p1.ros
//         this.additionalWindSlopeSpreadRate = p2.ros
//         this.crossSlopeWindSpreadRate = p3.ros
//         this.headingFromUpslope = fireHeadingFromUpslope
//         this.headingFromNorth = fireHeadingFromNorth
//         this.effWindFactor = effWindFactor
//         this.effWindSpeed = effWindSpeed
//         this.xComponent = p2.rosXcomp
//         this.yComponent = p2.rosYcomp
//     }
}

function calcEffectiveWindSpeed (phiew, windB, windI) {
    let ews = 0
    if (phiew > 0 && windB > 0 && windI > 0) {
        const a = phiew * windI
        const b = 1.0 / windB
        ews = Math.pow(a, b)
    }
    return ews
}

/**
 * Calculate the scorch height (ft+1) estimated from Byram's fireline
 * intensity, wind speed, and air temperature.
 *
 * @param fli Byram's fireline intensity (btu+1 ft-1 s-1).
 * @param windSpeed Wind speed (ft+1 min-1).
 * @param airTemp (oF).
 * @return The scorch height (ft+1).
 */
function calcScorchHeight (fli, windSpeed, airTemp) {
    const mph = windSpeed / 88
    return fli <= 0
    ? 0
    : ((63 / (140 - airTemp)) * Math.pow(fli, 1.166667)) /
        Math.sqrt(fli + mph * mph * mph)
}

function radians(degrees) { return (degrees * Math.PI) / 180 }
