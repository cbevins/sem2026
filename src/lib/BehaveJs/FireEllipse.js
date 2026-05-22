
export class FireEllipse {
    constructor(fireBehavior) {
        // primary outputs
        this.back = {spreadRate: 0, bearing: 0, flameLength: 0, firelineIntensity: 0}
        this.right = {spreadRate: 0, bearing: 0, flameLength: 0, firelineIntensity: 0}
        this.left = {spreadRate: 0, bearing: 0, flameLength: 0, firelineIntensity: 0}
        this.setFireBehavior(fireBehavior)
    }
    setFireBehavior(fireBehavior) {
        this.lengthWidthRatio = fireBehavior.lengthWidthRatio
        this.head = {
            spreadRate: fireBehavior.spreadRate,
            bearing: fireBehavior.bearing,
            flameLength: 0,
            firelineIntensity: 0}
    }
    firelineIntensityAtAngle(angle) {
        return 0
    }
    flameLengthAtAngle(angle) {
        return 0
    }
    perimeterDistanceAtAngle(angle) {
        return 0
    }
    perimeterLocationAtAngle(angle) {
        return {east: 0, north: 0}
    }
    spreadRateAtAngle(angle) {
        return 0
    }
}
