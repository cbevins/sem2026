import { IgnitionPointVector } from "./IgnitionPointVector.js"

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
export function calcPsiSpreadRate(fireEllipse, rotationCos) {
    const {fSpreadRate:f, gSpreadRate:g, hSpreadRate:h} = fireEllipse
    if (f <=0 || h <=0 || g <= 0) return 0
    const cos2Psi = rotationCos * rotationCos
    const sin2Psi = 1 - cos2Psi
    const ros = g * rotationCos + Math.sqrt((f * f * cos2Psi) + (h * h * sin2Psi))
    return ros
}
