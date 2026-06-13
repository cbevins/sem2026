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
    // Input parameter definitions
    // These may be overridden during construction or by set() by specifying them in 'inputs'
    static Inputs = [
        // updateFireEllipse() is invoked whenever one of these are specified in inputs object
        // (both of these (and flameLength) are also present in FireBehavior instances)
        {key: 'headingSpreadRate', desc: 'Maximum fire spread rate',
            value: 0, type: 'quantity', units: 'ft/min', min: 0, order: 1},
        {key: 'lengthWidthRatio', desc: 'Fire ellipse length-to-width ratio',
            value: 1, type: 'ratio', min: 1, order: 1},
        {key: 'flameLength', desc: 'Flame length',
            value: 0, type: 'quantity', units: 'ft', order: 1},

        // updateElapsedTime() is invoked whenever 'elapsedTime' is specified in 'inputs' object:
        {key: 'elapsedTime', desc: 'Elapsed time since ignition',
            value: 0, type: 'quantity', units: 'min', min: 0, order: 2},

        // updatePosition() is invoked whenever one or more of these are specified in 'inputs' object:
        {key: 'bearing', desc: 'Head fire bearing in degrees clockwie from north',
            value: 0, type: 'quantity', units: 'degrees', min: 0, max: 360, order: 3},
        {key: 'ignEast', desc: 'Ignition point false easting (Projected Coordinate System)',
            value: 0, type: 'quantity', units: 'ft', order: 3},
        {key: 'ignNorth',  desc: 'Ignition point false northing (Projected Coordinate System)',
            value: 0, type: 'quantity', units: 'ft', order: 3},
        {key: 'ignX', desc: 'Ignition point Cartesian x (normally left to 0)',
            value: 0, type: 'quantity', units: 'ft', order: 3},       
        {key: 'ignY', desc: 'Ignition point Cartesian y (normally left to 0)',
            value: 0, type: 'quantity', units: 'ft', order: 3},       
    ]

    static Outputs = [
        {key: 'area', desc: 'Fire ellipse area',
            type: 'quantity', units: 'ft2'},
        {key: 'backingDistance', desc: 'Fire ellipse ignition point to back distance',
            type: 'quantity', units: 'ft'},
        {key: 'backingSpreadRate', desc: 'Fire ellipse backing fire spread rate',
            type: 'quantity', units: 'ft/min'},
        {key: 'centerE', desc: 'Fire ellipse center false easting (projected coordinate system)',
            type: 'quantity', units: 'ft'},
        {key: 'centerN', desc: 'Fire ellipse center false northing (projected coordinate system)',
            type: 'quantity', units: 'ft'},
        {key: 'centerX', desc: 'Fire ellipse center x-coordinate (local coordinate system)',
            type: 'quantity', units: 'ft'},
        {key: 'centerY', desc: 'Fire ellipse center y-coordinate (local coordinate system)',
            type: 'quantity', units: 'ft'},
        {key: 'eccentricity', desc: 'Fire ellipse eccentricity',
            type: 'ratio', units: 'dl'},
        {key: 'effectiveWindSpeed', desc: 'Fire ellipse effective wind speed (from length/width)',
            type: 'quantity', units: 'ft/min'},
        {key: 'firelineIntensity', desc: 'Fire ellipse heading fireline intensity',
            type: 'quantity', units: 'BTU/ft/s'},
        {key: 'fDistance', desc: 'Fire ellipse major semi-axis length',
            type: 'quantity', units: 'ft'},
        {key: 'fSpreadRate', desc: 'Fire ellipse major semi-axis expansion rate',
            type: 'quantity', units: 'ft/min'},
        {key: 'heatPerUnitArea', desc: 'Fire ellipse heat per unit area during passage of fire front',
            type: 'quantity', units: 'Btu/ft2'},
        {key: 'headingDistance', desc: 'Fire ellipse ignition point to head distance',
            type: 'quantity', units: 'ft'},
        {key: 'hDistance', desc: 'Fire ellipse minor semi-axis length',
            type: 'quantity', units: 'ft'},
        // NOTE that headingSpreadRate is an input property
        {key: 'hSpreadRate', desc: 'Fire ellipse minor semi-axis expamsion rate',
            type: 'quantity', units: 'ft/min'},
        {key: 'gDistance', desc: 'Fire ellipse ignition point to center distance',
            type: 'quantity', units: 'ft'},
        {key: 'gSpreadRate', desc: 'Fire ellipse center expansion rate from ignition point',
            type: 'quantity', units: 'ft/min'},
        {key: 'latusRectumDistance', desc: 'Fire ellipse latus rectum length (normal to ignition point)',
            type: 'quantity', units: 'ft'},
        {key: 'latusRectumSpreadRate', desc: 'Fire ellipse latus rectum expansion rate (normal to ignition point)',
            type: 'quantity', units: 'ft/min'},
        {key: 'length', desc: 'Fire ellipse total length',
            type: 'quantity', units: 'ft'},
        {key: 'majorExpansionRate', desc: 'Fire ellipse major axis expansion rate',
            type: 'quantity', units: 'ft/min'},
        {key: 'minorExpansionRate', desc: 'Fire ellipse minor axis expansion rate',
            type: 'quantity', units: 'ft/min'},
        {key: 'rotationDeg', desc: 'Fire ellipse rotation counter-clockwise from Cartesian x-axis',
            type: 'quantity', units: 'deg'},
        {key: 'rotationRad', desc: 'Fire ellipse rotation counter-clockwise from Cartesian x-axis',
            type: 'quantity', units: 'radians'},
        {key: 'rotationCos', desc: 'Cosine of the fire ellipse rotation counter-clockwise from Cartesian x-axis',
            type: 'fraction', units: 'cos'},
        {key: 'rotationSin', desc: 'Sine of the fire ellipse rotation counter-clockwise from Cartesian x-axis',
            type: 'fraction', units: 'sin'},
        {key: 'width', desc: 'Fire ellipse total width',
            type: 'quantity', units: 'ft'},
    ]
    constructor(inputs={}) {
        // Initialize all input parameters to their default values
        for(let {key, value} of FireEllipse.Inputs) {
            this[key] = value
        }
        // Processed the provided input values
        this.set(inputs)
    }
    
    // Client may call this method whenever needed to provide new input values
    // and update their dependent properties.
    set(inputs={}) {
        // Update values of all properties present in the 'inputs' object
        let start = 9
        for(let {key, order} of FireEllipse.Inputs) {
            if (Object.hasOwn(inputs, key)) {
                this[key] = inputs[key]
                start = Math.min(start, order)
            }
        }
        if (start === 1)
            return this.#updateFireEllipse()
        else if (start === 2)
            return this.#updateElapsedTime()
        else if (start === 3)
            return this.#updatePosition()
    }

    // Called whenever 'headingSpreadRate' or 'lengthWidthRatio' changes
    // to update fire ellipse shape
    #updateFireEllipse() {
        // ellipse eccentricity [0..1] e = sqrt((a/b * a/b - 1) / (a/b))
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

        // Fireline intensity (BTU/ft/s) at head of fire
        // This is scaled back for the beta angles to derived fli, flame length, hpua, scorch
        this.firelineIntensity = (this.flameLength > 0)
            ? (this.flameLength / 0.45)**( 1 / 0.46) : 0

        // Heat per unit area (Btu/ft2)
        const ros = this.headingSpreadRate
        this.heatPerUnitArea = (ros > 0) ? (60 * this.firelineIntensity / ros) : 0

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

        // Ellipse perimeter length (ft) using Ramanujan's approximation.
        const a = this.fDistance, b = this.hDistance
        const h = (a - b)**2 / (a + b)**2
        this.perimeter = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))

        return this.#updatePosition()
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
