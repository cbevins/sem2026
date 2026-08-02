import { toRadians } from '../utils.js'

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
    updateElapsedTime(elapsedTime) {
        this.elapsedTime = elapsedTime

        // Distance (ft) between the *ignition point* and the fire ellipse head
        this.headingDistance = this.headingSpreadRate * elapsedTime
        
        // Distance (ft) between the *ignition point* and the fire ellipse back
        this.backingDistance = this.backingSpreadRate * elapsedTime

        // Major semi-axis length (ft) [aka 'rx']
        this.fDistance = this.fSpreadRate * elapsedTime

        // Distance (ft) between ignition and center points
        this.gDistance = this.gSpreadRate * elapsedTime

        // Minor semi-axis length (ft) [aka 'ry']
        this.hDistance = this.hSpreadRate * elapsedTime

        // Total ellipse length (ft)
        this.length = this.majorExpansionRate * elapsedTime

        // Total ellipse width (ft)
        this.width = this.minorExpansionRate * elapsedTime
        
        // Ellipse area (ft2)
        this.area = (Math.PI * this.length * this.width) / 4
        this.acres = this.area / (66*660)

        // Ellipse perimeter length (ft) using Ramanujan's approximation.
        const a = this.fDistance, b = this.hDistance
        const h = (a - b)**2 / (a + b)**2
        this.perimeter = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))
        return this
    }
}
