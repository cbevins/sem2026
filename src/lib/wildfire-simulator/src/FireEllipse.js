/**
 * While the FireBehavior class produces fire spread rate and intensity in the direction
 * of maximum spread, the FireEllipse class expands fire behavior to two dimensions
 * under the assumption of uniform fuel, moisture, wind, and slope.  Under such
 * conditions, the fire assumes an elliptical shape with the perimeter expanding fastest
 * at the fire head and slowest at the fire back.
 * 
 * FireEllipse generates fire size, location, and behavior estimates for any point
 * along the perimeter at any time since ignition, as long as the assumption of
 * continuous conditions is valid.  It also places the fire within the geographical
 * context of the user's projected coordinate system.
 * 
 * Four of the 7 inputs are provided by the FireBehavior class; passing a reference as
 * the 'inputs' object provides the 'headingSpreadRate', 'lengthWidthRatio', 'bearing',
 * and 'flameLength' properties.  Alternately, they can also be provided from direct
 * field observation.  These inputs determine the general ellipse shape, orientation,
 * and spread rates at various angles.
 * 
 * The 'elapsedTime' parameter determines the ellipse area, length, width, perimeter
 * length, and perimeter position at any time. Finally, by providing an ignition point
 * location the ellipse can be placed into a geographical context of the user's choosing.
 */
import { toRadians } from './ellipseAngles.js'

export class FireEllipse {
    constructor(inputs={}) {
        // Default input parameter values
        // These may be overridden during construction by specifying them in 'inputs'
        this.parameters = [
            // updateFireEllipse() is invoked whenever one of these are specified in inputs object
            // (both of these and flameLength are also present in FireBehavior instances)
            {key: 'headingSpreadRate', value: 0, call: 1},
            {key: 'lengthWidthRatio', value: 1, call: 1},
            // updateElapsedTime() is invoked whenever 'elapsedTime' is specified in 'inputs' object:
            {key: 'elapsedTime', value: 0, call: 2},
            // updatePosition() is invoked whenever one or more of these are specified in 'inputs' object:
            {key: 'bearing', value: 0, call: 3},    // fire heading in degrees clockwise from north
            {key: 'ignEast', value: 0, call: 3},    // ignition point easting (Projected Coordinate System)
            {key: 'ignNorth', value: 0, call: 3},   // ignition point northing (Projected Coordinate System)
            {key: 'ignX', value: 0, call: 3},       // ignition point Cartesian x, normally left to zero
            {key: 'ignY', value: 0, call: 3},       // ignition point Cartesian y, normally left to zero
            // updateFire() is invoked whenever 'flameLength' is specified in 'inputs' object
            // (which is also present in FireBehavior instances)
            {key: 'flameLength', value: 0, call: 4},
        ]
        // Set all inputs to their default values
        for(let {key, value} of this.parameters) {
            this[key] = value
        }
        // Set specified parameter values and update all properties
        this.set(inputs)
    }
    
    // This method may be called whenever needed to provide new input values
    // and update their dependent properties.
    set(inputs={}) {
        // Set all inputs to either their default or specified values
        let start = 9
        for(let parm of this.parameters) {
            if (Object.hasOwn(inputs, parm.key)) {
                this[parm.key] = inputs[parm.key]
                start = Math.min(start, parm.call)
            }
        }
        if (start === 1)
            return this.#updateFireEllipse()
        else if (start === 2)
            return this.#updateElapsedTime()
        else if (start === 3)
            return this.#updatePosition()
        else if (start === 4)
            return this.#updateFire()
    }

    // Called whenever 'headingSpreadRate' or 'lengthWidthRatio' changes
    // to update fire ellipse shape
    #updateFireEllipse() {
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

        // expansion rate between the ignition point and center point (ft/min)
        this.gSpreadRate = this.fSpreadRate - this.backingSpreadRate

        // The following is Catchpole & Alexander Equation 10, which produces the same
        // result as above, but requires knowing 'f' (half the major axis ros) in advance:
        // const gSpreadRateCatchpole = fSpreadRate * Math.sqrt(1 - lwr**-2)

        // Expansion rate of the latus rectum semi-chord (ft/min)
        // length = (2 * b*b) / a
        this.latusRectumSpreadRate = this.hSpreadRate * this.hSpreadRate / this.fSpreadRate

        // Alternatively, length = 2a(1-e2)
        // this.latusRectumSpreadRate = this.fSpreadRate * (1 - this.eccentricity**2)

        // Effective (wind plus slope) wind speed (ft/min) estimated from lengthWidthRatio
        this.effectiveWindSpeed = 88 * (4 * (lwr - 1))

        return this.#updateElapsedTime()
    }

    // Called whenever 'elapsedTime' changes to update all distances, area, and perimeter
    #updateElapsedTime() {
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

        return this.#updatePosition()
    }

    // Ellipse perimeter length (ft) using Ramanujan's approximation.
    // Placed inside a getter since its makes 3 transcendental Math calls
    // and is not required to derive any other property
    get perimeter() {
        const a = this.fDistance, b = this.hDistance
        const h = (a - b)**2 / (a + b)**2
        return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))
    }

    // Called whenever 'bearing', 'ignEast', 'ignNorth', 'ignX', or 'ignY' changes
    #updatePosition() {
        // Rotation of ellipse from normal (counter-clockwise)
        this.rotationDeg = (450 - this.bearing) % 360   // ellipse rotation degrees counter-clockwise from x-axis
        this.rotationRad = toRadians(this.rotationDeg)

        this.rotationCos = Math.cos(this.rotationRad)
        this.rotationSin = Math.sin(this.rotationRad)

        // Inverse rotation of ellipse back to normal (clockwise)
        // this.rotationCosInv = Math.cos(-this.rotationRad)
        // this.rotationSinInv = Math.sin(-this.rotationRad)

        // Cannot use getBetaFireVector() for center point position!!!
        this.centerX = this.ignX + this.gDistance * this.rotationCos
        this.centerY = this.ignY + this.gDistance * this.rotationSin
        this.centerE = this.centerX + this.ignEast - this.ignX
        this.centerN = this.centerY + this.ignNorth - this.ignY
        return this.#updateFire()
    }

    #updateFire() {    
        const flame = this.flameLength
        // Fireline intensity (BTU/ft/s) at head of fire
        // This is scaled back for the beta angles to derived fli, flame length, hpua, scorch
        const fli = (flame > 0) ? (flame / 0.45)**( 1 / 0.46) : 0
        this.firelineIntensity = fli

        // Heat per unit area (Btu/ft2)
        const ros = this.headingSpreadRate
        this.heatPerUnitArea = (ros > 0) ? (60 * fli / ros) : 0

        return this
    }

    // Returns spread rate from the ellipse *perimeter* (or 'fire front')
    // at 'psiDegrees' from the heading direction
    // Catchpole et.al. (1982) Equation 7
    calcPsiSpreadRate(psiDegrees) {
        const f = this.fSpreadRate
        const g = this.gSpreadRate
        const h = this.hSpreadRate
        if (f <=0 || h <=0 || g <= 0) return 0
        const psi = toRadians(psiDegrees)
        const cosPsi = Math.cos(psi)
        const cos2Psi = cosPsi * cosPsi
        const sin2Psi = 1 - cos2Psi
        const ros = g * cosPsi + Math.sqrt((f * f * cos2Psi) + (h * h * sin2Psi))
        return ros
    }
}
