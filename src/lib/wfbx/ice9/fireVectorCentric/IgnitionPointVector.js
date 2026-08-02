import { clockwiseFromHeadToBearing, clockwiseFromHeadToRotation, toRadians } from '../utils.js'

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
