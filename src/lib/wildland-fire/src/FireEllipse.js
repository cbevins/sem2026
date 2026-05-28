/**
 * FireEllipse represents a parametric fire ellipse defined by its (1) length-to-width
 * ratio and (2) head fire spread rate.  These two parameters distinguish one FireEllipse
 * instance from another, and determine derived properties such as eccentricity,
 * backing spread rate, length and width expansion rate.
 * 
 */
import { ConfigTemplate } from './ConfigTemplate.js'
import { getPointOnEllipseCodePen } from './getPointOnEllipseCodePen.js'

export class FireEllipse {
     // ellipseParameters is an object with "spreadRate", "firelineIntensity", and "lengthToWidthRatio"
     // properties, such as an instance of the FireBehavior class .
    constructor(ellipseParameters, config={}) {
        this.config = {...ConfigTemplate, ...config}
        this.setEllipse(ellipseParameters, config)
    }
    
    // Updates basic axis & shape properties dependent upon headRos, lwr
    setEllipse(ellipseParameters) {
        const headingSpreadRate = ellipseParameters.spreadRate
        const firelineIntensity = ellipseParameters.firelineIntensity
        const lwr = ellipseParameters.lengthWidthRatio

        // ellipse eccentricity [0..1]
        const eccentricity = Math.sqrt(lwr * lwr - 1) / lwr

        // backing spread rate (ft/min)
        const backingSpreadRate = headingSpreadRate * (1 - eccentricity) / (1 + eccentricity)

        // expansion rate of the major axis (ft/min)
        const majorExpansionRate = headingSpreadRate + backingSpreadRate

        // expansion rate of the minor axis (ft/min)
        const minorExpansionRate = majorExpansionRate / lwr

        // spread rate of the major semi-axis (ft/min)
        const fSpreadRate = 0.5 * majorExpansionRate

        // spread rate of the minor semi-axis (ft/min)
        const hSpreadRate = 0.5 * minorExpansionRate

        // expansion rate between the ignition point and center point
        const gSpreadRate = fSpreadRate - backingSpreadRate

        // The following is Catchpole & Alexander Eq 10, which produces the same
        // result as above, but requires knowing 'f' (half the major axis ros) in advance 
        // const gSpreadRateCatchpole = fSpreadRate * Math.sqrt(1 - lwr**-2)

        // Save needed properties
        this.headingSpreadRate = headingSpreadRate
        this.backingSpreadRate = backingSpreadRate
        this.fSpreadRate = fSpreadRate
        this.gSpreadRate = gSpreadRate
        this.hSpreadRate = hSpreadRate
        this.majorExpansionRate = majorExpansionRate
        this.minorExpansionRate = minorExpansionRate
        this.lengthWidthRatio = lwr
        this.firelineIntensity = firelineIntensity

        if(this.config.saveInfoProps) {
            this.eccentricity = eccentricity
        }
        return this
    }

    // Returns the ellipse size (ft2) at the elapsed time.
    calcArea(elapsedTime) {
        const length = this.majorExpansionRate * elapsedTime
        const width = this.minorExpansionRate * elapsedTime
        return (Math.PI * length * width) / 4
    }

    // Returns the distance from the *ignition point* to the perimeter
    // at 180 degrees from heading direction.
    calcBackingDistance(elapsedTime) {
        return this.backingSpreadRate * elapsedTime
    }

    // Returns the distance between *ignition point* and ellipse *center*.
    calcCenterDistance(elapsedTime) {
        return this.gSpreadRate * elapsedTime
    }

    calcCenterLcs(elapsedTime, rotationDegrees=0) {
        const rotation = this.toRadians(rotationDegrees)
        const dx = this.calcCenterDistance(elapsedTime)
        const x = dx * Math.cos(rotation)
        const y = dx * Math.sin(rotation)
        return {x, y}
    }

    // Returns the distance from the *ignition point* to the perimeter
    // at 0 degrees from heading direction.
    calcHeadingDistance(elapsedTime) {
        return this.headingSpreadRate * elapsedTime
    }

    // Returns the distance from the *ignition point* to the perimeter at elapsed time
    // at 'betaDegrees' angle counter-clockwise from the heading direction
    calcIgnitionDistance(betaDegrees, elapsedTime) {
        return elapsedTime * this.calcIgnitionSpreadRate(betaDegrees)
    }

    // Returns the perimeter point LCS coordinates {x,y} at betaDegrees and elapsed time.
    // The local coordinate system origin is at the ignition point.
    calcIgnitionPerimeterLcs(betaDegrees, elapsedTime) {
        const dist = this.calcIgnitionDistance(betaDegrees, elapsedTime)
        const beta = this.toRadians(betaDegrees)
        const x = dist * Math.cos(beta)
        const y = dist * Math.sin(beta)
        return {x, y}
    }

    // Returns the spread rate from the *ignition point*
    // at 'betaDegrees' angle counter-clockwise from the heading direction
    calcIgnitionSpreadRate(betaDegrees) {
        if (betaDegrees === 0) return this.headingSpreadRate
        const beta = this.toRadians(betaDegrees)
        const eccent = this.eccentricity
        return (this.headingSpreadRate * (1 - eccent)) / (1 - eccent * Math.cos(beta))
    }

    calcIgnitionFirelineIntensity(betaDegrees) {
        if (this.headingSpreadRate <= 0) return 0
        const ros = this.calcIgnitionSpreadRate(betaDegrees)
        return this.firelineIntensity * ros / this.headingSpreadRate
    }

    // Returns the ellipse total length at elapsed time.
    calcLength(elapsedTime) {
        return this.majorExpansionRate * elapsedTime
    }

    // Returns the ellipse major semi-axis length ("rx")
    // (the distance from the *ellipse center* to the perimeter)
    // at 0 and 180 degrees from heading direction.
    calcMajorDistance(elapsedTime) {
        return this.fSpreadRate * elapsedTime
    }

    // Returns the ellipse minor semi-axis length ("ry")
    // (the distance from *ellipse center* to the perimeter)
    // at 90 and 270 degrees from heading direction.
    calcMinorDistance(elapsedTime) {
        return this.hSpreadRate * elapsedTime
    }

    // Returns perimeter length at elapsed time
    // using Ramanujan's approximation.
    calcPerimeterLength(elapsedTime) {
        const a = this.fSpreadRate * elapsedTime
        const b = this.hSpreadRate * elapsedTime
        const h = Math.pow((a - b), 2) / Math.pow((a + b), 2);
        return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))
    }

    calcPerimeterPointFromCenter(thetaDegrees, elapsedTime, rotationDeg=0) {
        const parametricAngle = true
        const inDegrees = true
        const rotation = this.toRadians(rotationDeg)
        const cosRot = Math.cos(rotation)
        const sinRot = Math.sin(rotation)
        const dx = this.calcCenterDistance(elapsedTime)
        const cx = dx * cosRot
        const cy = dx * sinRot
        const rx = this.calcMajorDistance(elapsedTime)
        const ry = this.calcMinorDistance(elapsedTime)
        const [x,y] = getPointOnEllipseCodePen(cx, cy, rx, ry, thetaDegrees,
            rotation, cosRot, sinRot, parametricAngle, inDegrees)
        return {x, y}
    }

    // Returns spread rate from the ellipse *perimeter* (or 'fire front')
    // at 'psiDegrees' from the heading direction
    // Catchpole et.al. (1982) Equation 7
    calcPsiSpreadRate(psiDegrees) {
        const f = this.fSpreadRate
        const g = this.gSpreadRate
        const h = this.hSpreadRate
        if (f <=0 || h <=0 || g <= 0) return 0
        const psi = this.toRadians(psiDegrees)
        const cosPsi = Math.cos(psi)
        const cos2Psi = cosPsi * cosPsi
        const sin2Psi = 1 - cos2Psi
        const ros = g * cosPsi + Math.sqrt((f * f * cos2Psi) + (h * h * sin2Psi))
        return ros
    }

    // Returns the ellipse total width at elapsed time.
    calcWidth(elapsedTime) {
        return this.minorExpansionRate * elapsedTime
    }

    // -------------------------------------------------------------------------
    // The following are all 'beta', 'psi', and 'theta' angle computation methods
    // that probably never need to be called directly by clients.
    // -------------------------------------------------------------------------

    // Returns the 'beta' degrees from the fire ellipse ignition point
    // asociated with the 'psi' degrees at the perimeter from the heading iretcion.
    // Unimplemented by BehavePlus
    calcBetaFromPsi(psiDegrees) {
        const thetaDegrees = this.thetaFromPsi(psiDegrees)
        return this.calcBetaFromTheta(thetaDegrees)
    }

    // Used only by betaFromPsi(), and unused by BehavePlus
    // Note: at thetaDeg 162, betaDeg suddenly drops from 87.52 deg to 0
    // where it remains until thetaDeg 199 when it pops back up to -87.52
    calcBetaFromTheta(thetaDegrees) {
        const f = this.fSpreadRate
        const g = this.gSpreadRate
        const h = this.hSpreadRate
        const theta = this.toRadians(thetaDegrees)
        // The following are from Catchpole (1982) Eq 2
        const y = h * Math.sin(theta)       // y = R * t * h * sin(theta)
        const x = g + f * Math.cos(theta)   // x = R * t * (g + f * cos(theta))
        if (x === 0) { console.log(`*** betaFromTheta() - x is zero at theta ${thetaDegrees}`)}
        let beta = ( x === 0) ? theta : Math.atan(y/x)
        // Quandrant adjustment
        if (beta < 0) beta +=  Math.PI
        if (thetaDegrees > 180) beta += Math.PI
        return this.toDegrees(beta)
    }

    // Returns psi degrees given beta degrees
    calcPsiFromBeta(betaDegrees) {
        const thetaDegrees = this.calcThetaFromBeta(betaDegrees)
        return this.calcPsiFromTheta(thetaDegrees)
    }

    // Catchpole et.al. (1982) Equation 6
    // Used only by psiFromBeta()
    calcPsiFromTheta(thetaDeg) {
        const f = this.fSpreadRate
        const h = this.hSpreadRate
        if (f * h * thetaDeg <= 0) return 0
        const theta = this.toRadians(thetaDeg)
        const tanPsi = (Math.tan(theta) * f) / h
        let psi = Math.atan(tanPsi)
        // psi += ( psi < 0) ? pi : 0
        // psi += ( theta > pi) ? pi : 0
        // Quadrant adjustment
        // 1st quadrant needs no adjustment
        if (theta <= 0.5 * Math.PI) { /* do nothing */ }
        // 2nd and 3rd quadrants
        else if (theta > 0.5 * Math.PI && theta <= 1.5 * Math.PI) { psi += Math.PI }
        // 4th quadrant
        else if (theta > 1.5 * Math.PI) { psi += 2 * Math.PI }
        const psiDeg = this.toDegrees(psi)
        return psiDeg
    }

    // Given the polar angle 'beta' from the fire ignition point to any point on the perimeter,
    // this function determines the angle 'theta' from the fire ellipse center to that point.
    // This is Catchpole et.al. (1982) Equation 5.
    // Used only by psiFromBeta()
    calcThetaFromBeta(betaDegrees) {
        const f = this.fSpreadRate
        const g = this.gSpreadRate
        const h = this.hSpreadRate
        if (f <= 0 || h <= 0) return 0
        const b = this.toRadians(betaDegrees)
        const cosB = Math.cos(b)
        const cos2B = cosB * cosB
        const sin2B = 1 - cos2B
        const f2 = f * f
        const g2 = g * g
        const h2 = h * h
        const term = Math.sqrt(h2 * cos2B + (f2 - g2) * sin2B)  // term used in numerator
        const num = h * cosB * term - f * g * sin2B
        const denom = h2 * cos2B + f2 * sin2B
        const cosTheta = num / denom
        let theta = Math.acos(cosTheta)               // theta in radians when beta radians < PI
        if (b >= Math.PI) theta = 2 * Math.PI - theta // theta in radians when beta >= PI
        // Convert theta radians to degrees
        let thetaDeg = this.toDegrees(theta)
        return thetaDeg
    }

    // Used only by betaFromPsi(), Unused by BehavePlus
    calcThetaFromPsi(psiDegrees) {
        const f = this.fSpreadRate
        const h = this.hSpreadRate
        if ( f <= 0 ) return 0
        const psi = this.toRadians(psiDegrees)
        const tanTheta = Math.tan(psi) * h / f
        let theta = Math.atan(tanTheta)
        // Quadrant adjustment
        if (psi <= 0.5 * Math.PI) { /* do nothing */ }
        else if (psi > 0.5 * Math.PI && psi <= 1.5 * Math.PI ) { theta += Math.PI }
        else if (psi > 1.5 * Math.PI ) { theta += 2 * Math.PI }
        // Convert theta radians to degrees
        return this.toDegrees(theta)
    }

    toDegrees(radians) {return radians * 180 / Math.PI}

    toRadians(degrees) {return degrees * Math.PI / 180 }
}

export class FireLocation {
    // Updates ignition, center, head, and back locations
    // dependent upon duration, ignition point and bearing
    setLocation(ignEast, ignNorth, bearing) {
        this.bearing = bearing
        this.ignEast = ignEast
        this.ignNorth = ignNorth

        this.degRot = (450-this.bearing ) % 360      // was 'headDeg'
        this.radRot = this.toRadians(this.degRot)
        this.cosRot = Math.cos(this.radRot)
        this.sinRot = Math.sin(this.radRot)

        this.centerEast = this.ignEast + this.gDist * this.cosRot
        this.centerNorth = this.ignNorth + this.gDist * this.sinRot
        
        this.headEast = this.ignEast + this.headDist * this.cosRot
        this.headNorth = this.ignNorth + this.headDist * this.sinRot
        
        this.backEast = this.ignEast + this.backDist * this.cosRot
        this.backNorth = this.ignNorth + this.backDist * this.sinRot
        return this
    }
    toRadians(degrees) {return degrees * Math.PI / 180 }
}
