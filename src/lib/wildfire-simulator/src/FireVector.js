import { calcBetaFromTheta, calcPsiFromTheta, calcThetaFromBeta, toRadians } from './ellipseAngles.js'
import{ FireEllipse }from './FireEllipse.js'

export class FireVector {
    constructor(fireEllipse) {
        if (fireEllipse === 'undefined')
            throw new Error(`new FireVector() was not passed a FireEllipse instance.`)
        if (!(fireEllipse instanceof FireEllipse))
            throw new Error(`new FireVector()) is not passed a valid FireEllipse instance.`)

        // FireEllipse provides the following 7 properties:
        // eccentricity, headingSpreadRate, elapsedTime, ignX, ignY, ignEast, ignNorth
        this.ellipse = fireEllipse

        this.angle = 0              // vector angle in degrees clockwise from fire head
        this.bearing = 0            // vector bearing in degrees clockwise from north
        this.distance = 0           // vector length (ft)
        this.east = 0               // vector end (perimeter) point false easting
        this.north = 0              // vector end (perimeter) point false northing
        this.firelineIntensity = 0  // vector fireline intensity (BTU/ft/s)
        this.ratio = 1              // ratio of vector to FireEllipse head fire magnitude
        this.spreadRate = 0         // vector fire spread rate (ft/min)
        this.x = 0                  // vector end (perimeter) point x coordinate
        this.y = 0                  // vector end (perimeter) point y coordinate
    }

    bearingToClockwiseFromHead(bearing) {
        return (360 + bearing - this.ellipse.bearing) % 360
    }

    // 'bearing' is always clockwise from north
    clockwiseFromHeadToBearing(clockwiseFromHead) {
        return (360 + this.ellipse.bearing + clockwiseFromHead) % 360
    }
    
    // 'rotation' is always counter-clockwise from fire head
    clockwiseFromHeadToRotation(clockwiseFromHead) {
        return (360 - clockwiseFromHead) % 360
    }

    // 'rotation' is always counter-clockwise from fire head
    rotationToClockwiseFromHead(rotation) {
        return (360 - rotation) % 360
    }

    getFlameLength() {
        return (this.firelineIntensity > 0) ? 0.45 * this.firelineIntensity**0.46 : 0
    }

    getScorchHeight(airTemp=77, midflameWindSpeed=0) {
        const mph = midflameWindSpeed / 88
        return (this.firelineIntensity > 0) ?
            ((63 / (140 - airTemp)) * this.firelineIntensity**1.166667) /
            Math.sqrt(this.firelineIntensity + mph * mph * mph) : 0
    }
}

// 'Beta' fire vectors are anchored at the FireEllipse ignition point
// at [ignX, ignY] in the local coordinate system,
// or at [ignEast, ignNorth] projected coordinate system.
export class BetaFireVector extends FireVector {
    constructor(fireEllipse, clockwiseFromHead=0) {
        super(fireEllipse)
        this.setClockwiseFromHead(clockwiseFromHead)
    }

    // Returns the fire vector from the ellipse ignition point oriented towards
    // the 'bearing' angle in degrees *clockwise* from north
    setBearing(bearing) {
        return this.setClockwiseFromHead(this.bearingToClockwiseFromHead(bearing))
    }

    // Returns the fire vector from the ellipse ignition point oriented towards
    // the specified degrees *clockwise* from the fire heading direction
    setClockwiseFromHead(degClockwiseFromHead) {
        const ellipse = this.ellipse
        // betaRotation is the *counter-clockwise* rotation from fire heading
        const betaRotation = this.clockwiseFromHeadToRotation(degClockwiseFromHead)
        const betaRadians = toRadians(betaRotation + ellipse.rotationDeg)

        this.angle = degClockwiseFromHead
        this.bearing = this.clockwiseFromHeadToBearing(degClockwiseFromHead)

        const e = ellipse.eccentricity
        this.ratio = (1 - e) / (1 - e * Math.cos(toRadians(betaRotation)))
        this.spreadRate = this.ratio * ellipse.headingSpreadRate
        this.distance = this.spreadRate * ellipse.elapsedTime
        this.firelineIntensity = this.ratio * ellipse.firelineIntensity

        // Perimeter position requires 2 more trancendentals
        this.x = ellipse.ignX + this.distance * Math.cos(betaRadians)
        this.y = ellipse.ignY + this.distance * Math.sin(betaRadians)
        this.east = this.x + ellipse.ignEast - ellipse.ignX
        this.north = this.y + ellipse.ignNorth - ellipse.ignY
        return this
    }

    // Returns the fire vector from the ellipse ignition point oriented towards
    // the ellipse perimeter point intercepted by a line from the ellipse center
    // at the specified degrees clockwise from the fire heading direction.
    // Allows use of theta to specify (more uniformly spaced) points around
    // the ellipse perimeter.
    setTheta(thetaClockwiseFromHead) {
        const betaFromHead = calcBetaFromTheta(this.ellipse, thetaClockwiseFromHead)
        return this.setClockwiseFromHead(betaFromHead)
    }
}

// 'Beta' fire vectors are anchored at the FireEllipse ignition point
// at [ignX, ignY] in the local coordinate system,
// or at [ignEast, ignNorth] projected coordinate system.
export class Beta6FireVector extends BetaFireVector {
    constructor(fireEllipse, clockwiseFromHead=0) {
        super(fireEllipse)
        this.setClockwiseFromHead(clockwiseFromHead)
    }

    // Returns the fire vector from the ellipse ignition point oriented towards
    // the 'bearing' angle in degrees *clockwise* from north
    setBearing(bearing) {
        return this.setClockwiseFromHead(this.bearingToClockwiseFromHead(bearing))
    }

    // Returns the fire vector from the ellipse ignition point oriented towards
    // the specified degrees *clockwise* from the fire heading direction
    setClockwiseFromHead(degClockwiseFromHead) {
        super.setClockwiseFromHead(degClockwiseFromHead)
        // betaRotation is the *counter-clockwise* rotation from fire heading
        const betaRotation = this.clockwiseFromHeadToRotation(degClockwiseFromHead)
        // Beta V6 fireline intensity uses the psi spread rate
        const ellipse = this.ellipse
        this.theta = calcThetaFromBeta(ellipse, betaRotation)
        this.psi = calcPsiFromTheta(ellipse, this.theta)
        this.psiRos = PsiFireVector.calcPsiSpreadRate(ellipse, this.psi)
        this.firelineIntensity = ellipse.firelineIntensity * this.psiRos / ellipse.headingSpreadRate
        return this
    }
}

// CenterVector is not really a FireVector either.  But it does provide
// FireVector object properties for location as well as fire behavior
// at 0 degrees from the fire head.
export class CenterVector extends FireVector {
    constructor(fireEllipse) {
        super(fireEllipse)
        const fe = fireEllipse
        this.angle = 0
        this.bearing = fe.bearing
        this.x = fe.centerX
        this.y = fe.centerY
        this.east = fe.centerE
        this.north = fe.centerN
        this.distance = fe.gDistance
        this.spreadRate = fe.gSpreadRate
        this.firelineIntensity = fe.firelineIntensity
        return this
    }
}

export class PsiFireVector extends FireVector {
    constructor(fireEllipse, degClockwiseFromHead=0) {
        super(fireEllipse)
        this.setClockwiseFromHead(degClockwiseFromHead)
    }

    setBearing(bearing) {
        return this.setClockwiseFromHead(this.bearingToClockwiseFromHead(bearing))
    }

    setClockwiseFromHead(degClockwiseFromHead) {
        const ellipse = this.ellipse
        // psiRotation is the *counter-clockwise* rotation from fire heading
        const psiRotation = this.clockwiseFromHeadToRotation(degClockwiseFromHead)
        const psiRadians = toRadians(psiRotation + ellipse.rotationDeg)

        this.angle = degClockwiseFromHead
        this.bearing = this.clockwiseFromHeadToBearing(degClockwiseFromHead)
        this.spreadRate = PsiFireVector.calcPsiSpreadRate(ellipse, psiRotation)
        this.distance = this.spreadRate * ellipse.elapsedTime
        this.ratio = (ellipse.headingSpreadRate > 0) ? this.spreadRate / ellipse.headingSpreadRate : 0
        this.firelineIntensity = this.ratio * ellipse.firelineIntensity

        // Perimeter position requires 2 more trancendentals
        this.x = ellipse.ignX + this.distance * Math.cos(psiRadians)
        this.y = ellipse.ignY + this.distance * Math.sin(psiRadians)
        this.east = this.x + ellipse.ignEast - ellipse.ignX
        this.north = this.y + ellipse.ignNorth - ellipse.ignY
        return this
    }
    
    // Returns spread rate from the ellipse *perimeter* (or 'fire front')
    // at 'psiDegrees' *counter-clockwise* rotation from the heading direction
    // Catchpole et.al. (1982) Equation 7
    static calcPsiSpreadRate(fireEllipse, psiDegrees) {
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
}

// 'Theta' vectors are anchored at the FireEllipse center.  Because the fire does
// not spread from the ellipse center to the perimeter, it is not a true fire behavior vector.
// Nonetheless, it does have a valid distance, perimeter position, and expansion rate,
// and is useful for looking at the 'flank' of the fire ellipse.
// The 'spreadRate' is actually the *expansion rate* of the ellipse from the
// center at the angle.
export class ThetaVector extends FireVector {
    constructor(fireEllipse, degClockwiseFromHead=0) {
        super(fireEllipse)
        return this.setClockwiseFromHead(degClockwiseFromHead)
    }

    // Returns the fire vector from the ellipse *center* oriented towards
    // the specified degrees *clockwise* from the fire heading direction
    setClockwiseFromHead(degClockwiseFromHead) {
        const ellipse = this.ellipse
        // thtaRotation is the *counter-clockwise* rotation from fire heading
        const thetaRotation = this.clockwiseFromHeadToRotation(degClockwiseFromHead)
        const thetaRadians = toRadians(thetaRotation)
        const cosA = Math.cos(thetaRadians)
        const sinA = Math.sin(thetaRadians)
        
        const cosPhi = ellipse.rotationCos
        const sinPhi = ellipse.rotationSin

        // Parametric coordinates of an unrotated ellipse
        const paraX = ellipse.fDistance * cosA
        const paraY = ellipse.hDistance * sinA
        
        // Apply rotation around the center and translate to center coordinates
        this.x = ellipse.centerX + (paraX * cosPhi - paraY * sinPhi)
        this.y = ellipse.centerY + (paraX * sinPhi + paraY * cosPhi)

        this.east = this.x + ellipse.ignEast - ellipse.ignX
        this.north = this.y + ellipse.ignNorth - ellipse.ignY

        // These don't really apply, but are included to echo the beta vector properties
        this.angle = degClockwiseFromHead
        this.bearing = this.clockwiseFromHeadToBearing(degClockwiseFromHead)
        this.distance = Math.hypot(paraX, paraY)
        this.ratio = this.distance / ellipse.headingDistance
        this.spreadRate = this.ratio * ellipse.headingSpreadRate

        // 'theta' is not a valid fire behavior vector
        this.firelineIntensity = this.ratio * ellipse.firelineIntensity
        return this
    }
}
