import { clockwiseFromHeadToBearing, clockwiseFromHeadToRotation,
    getFlameLength, toRadians } from './utils.js'
import { calcBetaFromTheta, calcPsiFromTheta, calcThetaFromBeta } from './getEllipseAngles.js'

export class FireVector {
    constructor() {
        this.init()
    }
    init() {
        this.angleFromHead = 0
        this.bearing = 0
        this.ratio = 1
        this.spreadRate = 0
        this.distance = 0
        this.firelineIntensity = 0
        this.flameLength = 0
        this.x = 0
        this.y = 0
        this.east = 0
        this.north = 0
        this.scorchHeight = 0
        return this
    }
    updateScorchHeight(windSpeed, airTemp) {
        this.scorchHeight = 0
        if (this.firelineIntensity > 0) {
            const fli = this.firelineIntensity
            const mph = windSpeed / 88
            this.scorchHeight = ((63 / (140 - airTemp))
                * Math.pow(fli, 1.166667))
                / Math.sqrt(fli + mph * mph * mph)
        }
        return this
    }
}

//------------------------------------------------------------------------------
// makeBetaVector()
// 'Beta' fire vectors are anchored at the FireEllipse ignition point
// at [ignX, ignY] in the local coordinate system,
// or at [ignEast, ignNorth] projected coordinate system.
//------------------------------------------------------------------------------
export class FireVectorBeta extends FireVector {
    constructor() {
        super()
    }
    update(fireSize=null, betaFromHead=0, includeFlameLength=true) {
        this.init()
        if (fireSize===null) return

        // Get required fireSize (and fireEllipse) input properties
        let {bearing, eccentricity:e, headingSpreadRate, firelineIntensity, rotationDeg,
            elapsedTime, ignX, ignY, ignEast, ignNorth,} = fireSize

        // betaRotation is the *counter-clockwise* rotation from fire heading
        const betaRotation = clockwiseFromHeadToRotation(betaFromHead)
        const betaRadians = toRadians(betaRotation + rotationDeg)

        this.angleFromHead = betaFromHead
        this.bearing = clockwiseFromHeadToBearing(betaFromHead, bearing)

        this.ratio = (1 - e) / (1 - e * Math.cos(toRadians(betaRotation)))
        this.spreadRate = this.ratio * headingSpreadRate
        this.distance = this.spreadRate * elapsedTime
        this.firelineIntensity = this.ratio * firelineIntensity

        // Perimeter position requires 2 more trancendentals
        this.x = ignX + this.distance * Math.cos(betaRadians)
        this.y = ignY + this.distance * Math.sin(betaRadians)
        this.east = this.x + ignEast - ignX
        this.north = this.y + ignNorth - ignY

        if (includeFlameLength)
            this.flameLength = getFlameLength(this.firelineIntensity)
        return this
    }
}

//------------------------------------------------------------------------------
// makeBeta6Vector() uses Psi fli
//------------------------------------------------------------------------------
export class FireVectorBeta6 extends FireVectorBeta {
    constructor() {
        super()
    }
    update(fireSize=null, betaFromHead=0, includeFlameLength=true) {
        super.update(fireSize, betaFromHead, false)
        if (fireSize===null) return

       // betaRotation is the *counter-clockwise* rotation from fire heading
        const betaRotation = clockwiseFromHeadToRotation(betaFromHead)

        // Adjust fireline intensity to use psi distance
        this.theta = calcThetaFromBeta(fireSize, betaRotation)
        this.psi = calcPsiFromTheta(fireSize, this.theta)
        this.psiRos = calcPsiSpreadRate(fireSize, this.psi)
        this.firelineIntensity = fireSize.firelineIntensity * this.psiRos / fireSize.headingSpreadRate

        if (includeFlameLength)
            this.flameLength = getFlameLength(this.firelineIntensity)
        return this
    }
}

//------------------------------------------------------------------------------
// makePsiVector()
//------------------------------------------------------------------------------

export class FireVectorPsi extends FireVector {
    constructor() {
        super()
    }
    update(fireSize=null, psiFromHead=0, includeFlameLength=true) {
        this.init()
        if (fireSize===null) return

        // Get required fireEllipse/fireSize/firePosition input properties from fireSize
        let {bearing, headingSpreadRate, firelineIntensity, rotationDeg,
            ignX, ignY, ignEast, ignNorth} = fireSize

        // psiRotation is the *counter-clockwise* rotation from fire heading
        const psiRotation = clockwiseFromHeadToRotation(psiFromHead)
        const psiRadians = toRadians(psiRotation + rotationDeg)

        this.angleFromHead = psiFromHead
        this.bearing = clockwiseFromHeadToBearing(psiFromHead, bearing)

        this.spreadRate = calcPsiSpreadRate(fireSize, psiRotation)
        this.distance = this.spreadRate * fireSize.elapsedTime
        this.ratio = (headingSpreadRate > 0) ? this.spreadRate / headingSpreadRate : 0
        this.firelineIntensity = this.ratio * firelineIntensity

        this.x = ignX + this.distance * Math.cos(psiRadians)
        this.y = ignY + this.distance * Math.sin(psiRadians)
        this.east = this.x + ignEast - ignX
        this.north = this.y + ignNorth - ignY

        if (includeFlameLength)
            this.flameLength = getFlameLength(this.firelineIntensity)
        return this
    }
}

export class FireVectorBack extends FireVectorBeta {
    constructor() {
        super()
    }
    update(fireSize=null, includeFlameLength=true) {
        return super.update(fireSize, 180, includeFlameLength)
    }
}

export class FireVectorHead extends FireVectorBeta {
    constructor() {
        super()
    }
    update(fireSize=null, includeFlameLength=true) {
        return super.update(fireSize, 0, includeFlameLength)
    }
}

export class FireVectorLeftFlank extends FireVectorBeta {
    constructor() {
        super()
    }
    update(fireSize=null, includeFlameLength=true) {
        const beta = calcBetaFromTheta(fireSize, 270)
        return super.update(fireSize, beta, includeFlameLength)
    }
}

export class FireVectorRightFlank extends FireVectorBeta {
    constructor() {
        super()
    }
    update(fireSize=null, includeFlameLength=true) {
        const beta = calcBetaFromTheta(fireSize, 90)
        return super.update(fireSize, beta, includeFlameLength)
    }
}

// Returns spread rate from the ellipse *perimeter* (or 'fire front')
// at 'psiDegrees' *counter-clockwise* rotation from the heading direction
// Catchpole et.al. (1982) Equation 7
export function calcPsiSpreadRate(fireEllipse, psiDegrees) {
    const f = fireEllipse.fSpreadRate
    const g = fireEllipse.gSpreadRate
    const h = fireEllipse.hSpreadRate
    if (f <=0 || h <=0 || g <= 0) return 0
    const psi = toRadians(psiDegrees)
    const cosPsi = Math.cos(psi)
    const cos2Psi = cosPsi * cosPsi
    const sin2Psi = 1 - cos2Psi
    const ros = g * cosPsi + Math.sqrt((f * f * cos2Psi) + (h * h * sin2Psi))
    return ros
}
