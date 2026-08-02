/*
*/
import { clockwiseFromHeadToBearing, clockwiseFromHeadToRotation, toRadians } from './utils.js'
import { calcPsiFromTheta, calcThetaFromBeta } from './getEllipseAngles.js'

export class FireEllipse {
    constructor(headingSpreadRate=0, lengthWidthRatio=0, bearing=0, flameLength=0) {
        this.update(headingSpreadRate, lengthWidthRatio, bearing, flameLength)
    }

    updateFromMidflameWindSpeed(headingSpreadRate, midflameWindSpeed, bearing=0, flameLength=0) {
        const lengthWidthRatio = 1 + 0.25 * (midflameWindSpeed / 88)
        this.update(headingSpreadRate, lengthWidthRatio, bearing, flameLength)
    }

    update(headingSpreadRate, lengthWidthRatio, bearing=0, flameLength=0) {
        this.headingSpreadRate = headingSpreadRate
        this.lengthWidthRatio = lengthWidthRatio

        // Effective (wind plus slope) wind speed (ft/min) estimated from lengthWidthRatio
        this.effectiveWindSpeed = 88 * (4 * (lengthWidthRatio - 1))

        const lwr = this.lengthWidthRatio

        // ellipse eccentricity [0..1] e = sqrt((a/b * a/b - 1) / (a/b))
        this.eccentricity = Math.sqrt(lwr * lwr - 1) / lwr
        
        // Alternatively, e = sqrt((1 - b*b) / a*a)
        // eccentricity = Math.sqrt(1 - minorAxisRate**2 / majorAxisRate**2)

        // backing spread rate (ft/min)
        // BEHAVE and BehavePlus place the ignition point at one of the focii points
        this.backingSpreadRate = headingSpreadRate * (1 - this.eccentricity) / (1 + this.eccentricity)

        // expansion rate of the major axis (ft/min)
        this.majorExpansionRate = headingSpreadRate + this.backingSpreadRate

        // expansion rate of the minor axis (ft/min)
        this.minorExpansionRate = this.majorExpansionRate / lwr

        // spread rate of the major semi-axis (ft/min)
        this.fSpreadRate = 0.5 * this.majorExpansionRate

        // spread rate of the minor semi-axis (ft/min)
        this.hSpreadRate = 0.5 * this.minorExpansionRate

        // expansion rate between the ignition point and center point (ft/min)
        this.gSpreadRate = this.fSpreadRate - this.backingSpreadRate

        this.updateBearing(bearing)
        this.updateFlameLength(flameLength)
        return this
    }
    updateBearing(bearing) {
        this.bearing = bearing

        // Rotation of ellipse from normal (counter-clockwise)
        this.rotationDeg = (450 - bearing) % 360   // ellipse rotation degrees counter-clockwise from x-axis
        this.rotationRad = toRadians(this.rotationDeg)
        this.rotationCos = Math.cos(this.rotationRad)
        this.rotationSin = Math.sin(this.rotationRad)

        // Inverse rotation of ellipse back to normal (clockwise)
        this.rotationCosInv = Math.cos(-this.rotationRad)
        this.rotationSinInv = Math.sin(-this.rotationRad)
        return this
    }
    updateFlameLength(flameLength) {
        this.flameLength = flameLength

        // Fireline intensity (BTU/ft/s) at HEAD of fire
        // (this is scaled back for the beta angles to derived fli, flame length, hpua, scorch)
        this.firelineIntensity = (flameLength > 0) ? (flameLength / 0.45)**( 1 / 0.46) : 0
        // Heat per unit area (Btu/ft2)
        this.heatPerUnitArea = (this.headingSpreadRate > 0) ?
            (60 * this.firelineIntensity / this.headingSpreadRate) : 0
        return this
    }
    updateFirelineIntensity(fli) {
        // Byram's (1959) flame length (ft)
        this.flameLength = (fli > 0) ? 0.45 * fli**0.46 : 0
        // Heat per unit area (Btu/ft2)
        this.heatPerUnitArea = (this.headingSpreadRate > 0) ?
            (60 * this.firelineIntensity / this.headingSpreadRate) : 0
        return this
    }
}

// Fire behavior along a vector from the ignition point at some angle from the fire head
export class IgnitionPointVector {
    constructor(fireEllipse, angleFromHead=0, elapsedTime=0, ignEast=0, ignNorth=0) {
        this.fireEllipse = fireEllipse
        this.updateAngle(angleFromHead)
        this.updateElapsedTime(elapsedTime)
        this.updateIgnitionPoint(ignEast, ignNorth)
    }
    updateAngle(angleFromHead) {
        const fireEllipse = this.fireEllipse
        this.angleFromHead = angleFromHead
        this.bearing = clockwiseFromHeadToBearing(angleFromHead, fireEllipse.bearing)

        // rotation is the *counter-clockwise* rotation of vector from fire heading
        this.rotationDeg = clockwiseFromHeadToRotation(angleFromHead)
        const rotationRad = toRadians(this.rotationDeg + fireEllipse.rotationDeg)
        this.rotationCos = Math.cos(rotationRad)
        this.rotationSin = Math.sin(rotationRad)
        this.updateFireBehavior()
        return this
    }

    updateFireBehavior() {
        const fireEllipse = this.fireEllipse
        const e = fireEllipse.eccentricity
        this.ratio = (1 - e) / (1 - e * Math.cos(toRadians(this.rotationDeg)))
        this.spreadRate = this.ratio * fireEllipse.headingSpreadRate
        this.firelineIntensity = this.ratio * fireEllipse.firelineIntensity
        this.flameLength = (this.firelineIntensity > 0) ? 0.45 * this.firelineIntensity**0.46 : 0
        return this
    }

    updateElapsedTime(elapsedTime) {
        this.elapsedTime = elapsedTime
        this.distance = this.spreadRate * elapsedTime
        return this
    }
    
    // Must have called updateElapsedTime() to set time and distance
    updateIgnitionPoint(ignEast, ignNorth, ignX=0, ignY=0) {
        this.x = ignX + this.distance * this.rotationCos
        this.y = ignY + this.distance * this.rotationSin
        this.perimEast = this.x + ignEast - ignX
        this.perimNorth = this.y + ignNorth - ignY
        return this
    }

    updateScorchHeight(airTemp, windSpeed=null) {
        this.scorchHeight = 0
        if (this.firelineIntensity > 0) {
            const fli = this.firelineIntensity
            if(windSpeed === null)
                windSpeed = this.effectiveWindSpeed
            const mph = windSpeed / 88
            this.scorchHeight = ((63 / (140 - airTemp))
                * Math.pow(fli, 1.166667))
                / Math.sqrt(fli + mph * mph * mph)
        }
        return this
    }
}

// Fire behavior along a vector from the ignition point at some angle from the fire head.
// Uses fire front (psi) fireline intensity instead of ignition point (beta) fireline intensity.
export class IgnitionPointVector6 extends IgnitionPointVector {
    constructor(fireEllipse, angleFromHead=0, elapsedTime=0, ignEast=0, ignNorth=0) {
        super(fireEllipse, angleFromHead, elapsedTime, ignEast, ignNorth)
    }

    updateFireBehavior() {
        super.updateFireBehavior()
        const fe = this.fireEllipse
        // Adjust fireline intensity to use psi distance
        this.theta = calcThetaFromBeta(fe, this.rotationDeg)
        this.psi = calcPsiFromTheta(fe, this.theta)
        const rotationCos = Math.cos(toRadians(this.psi))
        this.psiRos = calcPsiSpreadRate(fe, rotationCos)
        this.fli5 = this.firelineIntensity
        this.firelineIntensity = fe.firelineIntensity * this.psiRos / fe.headingSpreadRate
        this.flameLength = (this.firelineIntensity > 0) ? 0.45 * this.firelineIntensity**0.46 : 0
        return this
    }
}

// Fire behavior from the fire front at some angle from the fire head.
// Useful for determine fire perimeter expansion rates
export class FireFrontVector extends IgnitionPointVector {
    constructor(fireEllipse, angleFromHead=0, elapsedTime=0, ignEast=0, ignNorth=0) {
        super(fireEllipse, angleFromHead, elapsedTime, ignEast, ignNorth)
    }

    updateFireBehavior() {
        const fe = this.fireEllipse
        this.spreadRate = calcPsiSpreadRate(this.fireEllipse, this.rotationCos)
        this.ratio = (fe.headingSpreadRate > 0) ? this.spreadRate / fe.headingSpreadRate : 0
        this.firelineIntensity = this.ratio * fe.firelineIntensity
        this.flameLength = (this.firelineIntensity > 0) ? 0.45 * this.firelineIntensity**0.46 : 0
        return this
    }
}
// Returns spread rate from the ellipse *perimeter* (or 'fire front')
// at 'psiDegrees' *counter-clockwise* rotation from the heading direction
// Catchpole et.al. (1982) Equation 7
function calcPsiSpreadRate(fireEllipse, rotationCos) {
    const {fSpreadRate:f, gSpreadRate:g, hSpreadRate:h} = fireEllipse
    if (f <=0 || h <=0 || g <= 0) return 0
    const cos2Psi = rotationCos * rotationCos
    const sin2Psi = 1 - cos2Psi
    const ros = g * rotationCos + Math.sqrt((f * f * cos2Psi) + (h * h * sin2Psi))
    return ros
}

const fireEllipse = new FireEllipse(100, 2, 90, 10)
console.log('fireEllipse = {', fireEllipse)

const beta = new IgnitionPointVector(fireEllipse, 45, 60, 1000, 2000)
console.log('beta =', beta)

const beta6 = new IgnitionPointVector6(fireEllipse, 45, 60, 1000, 2000)
console.log('beta6 =', beta6)

const psi = new FireFrontVector(fireEllipse, 45, 60, 1000, 2000)
console.log('psi =', psi)