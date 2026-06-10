/**
 * FireEllipse represents a parametric fire ellipse defined by its (1) length-to-width
 * ratio and (2) head fire spread rate.  These two parameters distinguish one FireEllipse
 * instance from another, and determine derived properties such as eccentricity,
 * backing spread rate, length and width expansion rate.
 */
import { ConfigTemplate } from './ConfigTemplate.js'
import { getPointOnEllipseCodePen } from './getPointOnEllipseCodePen.js'

export class FireEllipse {
    constructor(config={}, inputs={}) {
        this.config = {...ConfigTemplate, ...config}

        // Default input parameter values
        // These may be overridden during construction by specifying them in 'inputs'
        const parameters = [
            // setFire()
            {key: 'headingSpreadRate', value: 0},
            {key: 'lengthWidthRatio', value: 1},
            {key: 'flameLength', value: 0},
            // setElapsedTime()
            {key: 'elapsedTime', value: 0},
            // setBearing()
            {key: 'bearing', value: 0},
            // setPcs()
            {key: 'ignEast', value: 0},
            {key: 'ignNorth', value: 0},
            // setBetaAngle() or setBetaBearing()
            {key: 'betaDegrees', value: 0}
        ]

        for(let {key, value} of parameters) {
            this[key] = value
            if (Object.hasOwn(inputs, key))
                this[key] = inputs[key]
        }
        this.ignitionPcs = {east: this.ignEast, north: this.ignNorth}

        // Initiatiate call chain
        this.updateFireDependents()
    }
    
    // Updates the underlying fire ellipse shape
    setFire(headingSpreadRate=0, lengthWidthRatio=1, flameLength=0) {
        this.headingSpreadRate = headingSpreadRate
        this.lengthWidthRatio = lengthWidthRatio
        this.flameLength = flameLength
        return this.updateFireDependents()
    }

    updateFireDependents() {
        // ellipse eccentricity [0..1]
        const lwr = this.lengthWidthRatio
        this.eccentricity = Math.sqrt(lwr * lwr - 1) / lwr
        // Alternatively, e = sqrt((1 - b*b) / a*a)
        // this.eccentricity = Math.sqrt(1 - this.minorAxisRate**2 / this.majorAxisRate**2)

        // backing spread rate (ft/min)
        // BEHAVE and BehavePlus place the ignition point at one of the focii points
        this.backingSpreadRate = this.headingSpreadRate * (1 - this.eccentricity) / (1 + this.eccentricity)

        // expansion rate of the major axis (ft/min)
        this.majorExpansionRate = this.headingSpreadRate + this.backingSpreadRate

        // expansion rate of the minor axis (ft/min)
        this.minorExpansionRate = this.majorExpansionRate / lwr

        // spread rate of the major semi-axis (ft/min)
        this.fSpreadRate = 0.5 * this.majorExpansionRate

        // spread rate of the minor semi-axis (ft/min)
        this.hSpreadRate = 0.5 * this.minorExpansionRate

        // expansion rate between the ignition point and center point
        this.gSpreadRate = this.fSpreadRate - this.backingSpreadRate

        // Expansion rate of the latus rectum semi-chord (ft/min)
        // length = (2 * b*b) / a
        this.latusRectumSpreadRate = this.hSpreadRate * this.hSpreadRate / this.fSpreadRate
        // Alternatively, length = 2a(1-e2)
        // this.latusRectumSpreadRate = this.fSpreadRate * (1 - this.eccentricity**2)

        // The following is Catchpole & Alexander Eq 10, which produces the same
        // result as above, but requires knowing 'f' (half the major axis ros) in advance:
        // const gSpreadRateCatchpole = fSpreadRate * Math.sqrt(1 - lwr**-2)
    
        // Fireline intensity (BTU/ft/s)
        const flame = this.flameLength
        // this.firelineIntensity = (flame > 0) ? Math.pow(flame / 0.45, 1 / 0.46) : 0
        this.firelineIntensity = (flame > 0) ? (flame / 0.45)**( 1 / 0.46) : 0

        return this.updateElapsedTimeDependents()
    }

    // Elapsed time since ignition (min)
    setElapsedTime(elapsedTime) {
        this.elapsedTime = elapsedTime
        return this.updateElapsedTimeDependents()
    }

    updateElapsedTimeDependents() {
        // Distance between the *ignition point* and the fire head
        this.headingDistance = this.headingSpreadRate * this.elapsedTime
        
        // Distance between the *ignition point* and the fire back
        this.backingDistance = this.backingSpreadRate * this.elapsedTime

        // Major semi-axis length (ft) [aka 'rx']
        this.fDistance = this.fSpreadRate * this.elapsedTime

        // Distance (ft) between ignition and center points
        this.gDistance = this.gSpreadRate * this.elapsedTime

        // Minor semi-axis length (ft) [aka 'ry']
        this.hDistance = this.hSpreadRate * this.elapsedTime

        // Latus rectum semi-chord length (ft)
        this.latusRectumDistance = this.latusRectumSpreadRate * this.elapsedTime

        // Total ellipse length (ft)
        this.length = this.majorExpansionRate * this.elapsedTime

        // Total ellipse width (ft0)
        this.width = this.minorExpansionRate * this.elapsedTime
        
        // Ellipse area (ft2)
        this.area = (Math.PI * this.length * this.width) / 4

        // Fire ignition point LCS {x, y} (local coordinate system)
        this.ignitionLcs = {x: 0, y: 0}

        return this.updateBearingDependents()
    }

    // Ellipse perimeter length (ft) using Ramanujan's approximation.
    // Placed inside a getter since its makes 3 transcendental Math calls
    // and is not required to derive any other property
    get perimeter() {
        const a = this.fDistance, b = this.hDistance
        const h = Math.pow((a - b), 2) / Math.pow((a + b), 2)
        return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))
    }

    setBearing(bearing) {
        this.bearing = bearing
        return this.updateBearingDependents()
    }

    updateBearingDependents() {
        // Rotation of ellipse from normal (counter-clockwise)
        this.degRot = (450-this.bearing ) % 360
        this.radRot = this.toRadians(this.degRot)
        this.cosRot = Math.cos(this.radRot)
        this.sinRot = Math.sin(this.radRot)

        // Inverse rotation of ellipse back to normal (clockwise)
        this.cosInvRot = Math.cos(-this.radRot)
        this.sinInvRot = Math.sin(-this.radRot)

        // Ignition point LCS is always origin [0,0]
        this.ignitionLcs = {x: 0, y: 0}

        // Fire head point LCS {x, y} (local coordinate system)
        this.headLcs = {x: this.headingDistance * this.cosRot, y: this.headingDistance * this.sinRot}

        // Center point LCS {x, y} (local coordinate system)
        this.centerLcs = {x: this.gDistance * this.cosRot, y: this.gDistance * this.sinRot}

        // Fire back point LCS {x, y} (local coordinate system)
        this.backLcs = {x: -this.backingDistance * this.cosRot, y: this.backingDistance * this.sinRot}

        // Fire right flank point LCS {x, y} (local coordinate system)
        // This is at 270 degrees counter-clockwise from fire heading
        this.rightLcs = this.getPerimeterPointAtGeometricAngle(270)
        
        // Fire left point LCS {x, y} (local coordinate system)
        // This is at 90 degrees counter-clockwise from fire heading
        this.leftLcs = this.getPerimeterPointAtGeometricAngle(90)

        return this.updatePcsDependents()
    }
    
    // Places the ellipse in the context of the ignition point's Projected Coordinate System
    setPcs(east, north) {
        this.ignitionPcs = {east, north}
        return this.updatePcsDependents()
    }

    updatePcsDependents() {
        const {east:ignEast, north:ignNorth} = this.ignitionPcs
        // Fire ellipse center PCS {east, north} (projected coordinate system)
        this.centerPcs = {
            east: ignEast + this.gDistance * this.cosRot,
            north: ignNorth + this.gDistance * this.sinRot}
        
        // Fire ellipse head {east, north} (projected coordinate system)
        this.headPcs = {
            east: ignEast + this.headingDistance * this.cosRot,
            north: ignNorth + this.headingDistance * this.sinRot}
        
        // Fire ellipse back PCS {east, north} (projected coordinate system)
        this.backPcs = {
            east: ignEast - this.backingDistance * this.cosRot,
            north: ignNorth - this.backingDistance * this.sinRot}

        // Fire ellipse center PCS {east, north} (projected coordinate system)
        this.centerPcs = {
            east: ignEast + this.gDistance * this.cosRot,
            north: ignNorth + this.gDistance * this.sinRot}

        // Fire ellipse right flank PCS {east, north} (projected coordinate system)
        this.rightPcs = {
            east: ignEast + this.hDistance * this.cosRot,
            north: ignNorth + -this.hDistance * this.sinRot}
        
        // Fire ellipse left flank PCS {east, north} (projected coordinate system)
        this.leftPcs = {
            east: ignEast + this.hDistance * this.cosRot,
            north: ignNorth + -this.hDistance * this.sinRot}

        // Fire perimeter PCS at the current fire vector beta
        this.betaPerimeterPcs = {
            east: ignEast + this.betaDistance * this.cosRot,
            north: ignNorth + this.betaDistance * this.sinRot}
        
        return this.updateBetaDependents()
    }

    // Update the vector angle (degrees counter-clockwise from the fire heading direction)
    // at which fire behavior and ellipse location is determined
    // relative to the *ignition point*
    setBetaAngle(betaDegrees) {
        this.betaDegrees = betaDegrees
        return this.updateBetaDependents()
    }

    // Beta angle flame length getter
    // Byram's (1959) flame length (ft)
    get betaFlameLength() {
        const fli = this.betaFirelineIntensity
        // return (fli > 0) ? 0.45 * Math.pow(fli, 0.46) : 0
        return (fli > 0) ? 0.45 * fli**0.46 : 0
    }

    updateBetaDependents() {
        const beta = this.toRadians(this.betaDegrees)
        const cosBeta = Math.cos(beta)
        const sinBeta = Math.sin(beta)

        // Ratio of beta-to-head spread rate, distance, fireline intensity, hpua
        const eccent = this.eccentricity
        this.betaHeadRatio = (1 - eccent) / (1 - eccent * cosBeta)

        // Spread rate (ft/min) at betaDegrees from the fire head
        this.betaSpreadRate = this.betaHeadRatio * this.headingSpreadRate
        
        // Fireline intensity (BTU/ft/s) at betaDegrees from the fire head
        this.betaFirelineIntensity = this.firelineIntensity * this.betaHeadRatio

        // Distance (ft) from ignition point to the perimeter at betaDegrees from the fire head
        this.betaDistance = this.betaSpreadRate * this.elapsedTime

        // Heat per unit area (BTU/ft2)
        this.betaHeatPerUnitArea = (this.betaSpreadRate > 0)
            ? 60 * this.betaFirelineIntensity /  this.betaSpreadRate : 0

        // LCS of perimeter point at beta angle from ignition point
        this.betaLcs = {
            x: this.betaDistance * cosBeta,
            y: this.betaDistance * sinBeta}

        // PCS of perimeter point at beta angle from ignition point
        const {east:ignEast, north:ignNorth} = this.ignitionPcs
        this.betaPcs = {
            east: ignEast + this.betaDistance * this.cosRot,
            north: ignNorth + this.betaDistance * this.sinRot}

        return this
    }

    //--------------------------------------------------------------------------
    // Supporting methods
    //--------------------------------------------------------------------------
    
    getPerimeterPointAtGeometricAngle(thetaDeg) {
        // Calculate local angle relative to the ellipse's own rotation
        const phi = this.toRadians(thetaDeg - this.degRot)
        const thetaRadians = this.toRadians(thetaDeg)
        const rx = this.fDistance
        const ry = this.hDistance
        if (rx*ry === 0) return {x: 0, y: 0}

        // Find the distance (radius) from center to the perimeter at this local angle
        // Formula: r = (rx * ry) / sqrt((ry * cos(phi))^2 + (rx * sin(phi))^2)
        const cosPhi = Math.cos(phi)
        const sinPhi = Math.sin(phi)
        const r = (rx * ry) / Math.sqrt(Math.pow(ry * cosPhi, 2) + Math.pow(rx * sinPhi, 2))

        // Convert polar coordinates (r, geometricAngle) to Cartesian (x, y)
        // Note: We use the original geometricAngle to project from the world-space center
        const x = this.centerLcs.x + r * Math.cos(thetaRadians)
        const y = this.centerLcs.y + r * Math.sin(thetaRadians)
        return {x, y}
    }

    /**
     * Calculates the subtended point on the perimeter of a rotated ellipse given
     * the parametric angle from ellipse center to to the subtending circle's perimeter.
     * NOTE: this is NOT the geometric angle!
     */
    getPerimeterPointAtParametricAngle(thetaDeg) {
        // Point on unrotated ellipse subtending circle
        const thetaRadians = this.toRadians(thetaDeg)
        const rx = this.fDistance
        const ry = this.hDistance
        const xBase = rx * Math.cos(thetaRadians)
        const yBase = ry * Math.sin(thetaRadians)

        // Apply the rotation matrix to the base point
        // x' = x*cos(rot) - y*sin(rot)
        // y' = x*sin(rot) + y*cos(rot)
        const xRotated = xBase * this.cosRot - yBase * this.sinRot
        const yRotated = xBase * this.sinRot + yBase * this.cosRot

        // Translate back to the ellipse's center
        return {x: this.centerLcs.x + xRotated, y: this.centerLcs.y + yRotated}
    }
    
    getPerimeterPointAtFocalAngle(betaDeg) {
        // Determine ellipse parameters
        const a = this.fDistance
        const e = this.eccentricity     // e is the eccentricity, where e = c / a
        // beta is angle from major axis line pointing outward
        const beta = this.toRadians(betaDeg)
        // focal distance to perimeter
        const r1 = (a*(1-e*e)/(1-e*Math.cos(beta)))  // if beta is from nearest side of the ellipse
        // const r2 = (a*(1-e*e)/(1+e*Math.cos(beta)))  // if beta is from opposite side of the ellipse
        // Convert to Cartesian coordinates
        const x = r1 * Math.cos(beta)
        const y = r1 * Math.sin(beta)
        return {x, y}
    }

    isPointInEllipse(x, y) {
        // Translate point to origin relative to ellipse center
        const dx = x - this.center.x
        const dy = y - this.center.y

        // Rotate point inversely to align with axis
        const rotX = dx * this.cosInvRot - dy * this.sinInvRot
        const rotY = dx * this.sinInvRot + dy * this.cosInvRot

        // Apply the ellipse equation: (x/rx)^2 + (y/ry)^2 <= 1
        const disc = (rotX*rotX) / (this.rx2) + (rotY * rotY) / (this.ry2)
        return disc <= 1
    }

    calcPerimeterPointFromCenter(thetaDegrees) {
        const parametricAngle = true
        const inDegrees = true
        const [x,y] = getPointOnEllipseCodePen(
            this.centerLcs.x, this.centerLcs.y, // cx, cy
            this.fDistance, this.hDistance,     // rx, ry
            thetaDegrees,
            this.degRot, this.cosRot, this.sinRot,
            parametricAngle, inDegrees)
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

    // -------------------------------------------------------------------------
    // The following are all 'beta', 'psi', and 'theta' angle computation methods
    // that probably never need to be called directly by clients.
    // -------------------------------------------------------------------------

    // Returns the 'beta' degrees from the fire ellipse ignition point
    // asociated with the 'psi' degrees at the perimeter from the heading iretcion.
    // Unimplemented by BehavePlus
    calcBetaFromPsi(psiDegrees) {
        const thetaDegrees = this.calcThetaFromPsi(psiDegrees)
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
        if (x === 0) {
            // theta intercepts perimeter at one of the beta (focus) latus rectum end points
            // so beta is either at 90 or 270 degrees
            return (thetaDegrees < 180) ? 90 : 270
        }
        let beta = Math.atan(y/x)
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
