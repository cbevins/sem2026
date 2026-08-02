import { calcPsiFromTheta, calcThetaFromBeta } from '../getEllipseAngles.js'
import { toRadians } from '../utils.js'
import { IgnitionPointVector } from './IgnitionPointVector.js'
import { calcPsiSpreadRate } from './FireFrontVector.js'

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