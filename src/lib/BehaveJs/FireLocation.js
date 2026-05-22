
export class FireLocation {
    constructor(fireEllipse, elapsedTime=1, ignitionLocation={east: 0, north:0}) {
        // primary outputs
        this.head = { distance: 0, point: {east: 0, north: 0}}
        this.back ={ distance: 0, point: {east: 0, north: 0}}
        this.right = { distance: 0, point: {east: 0, north: 0}}
        this.left = { distance: 0, point: {east: 0, north: 0}}
        this.center = { distance: 0, point: {east: 0, north: 0}}
        this.area = 0
        this.perimeter = 0
        this.setFireLocation(fireEllipse, elapsedTime, ignitionLocation)
    }
    setFireLocation(fireEllipse, elapsedTime=1, ignitionLocation={east: 0, north:0}) {
        this.elapsedTime = elapsedTime
        this.ignitionLocation = ignitionLocation
        return this
    }
    firelineIntensityAtBearing(bearing) {
        return 0
    }
    flameLengthAtBearing(bearing) {
        return 0
    }
    perimeterDistanceAtBearing(bearing) {
        return 0
    }
    perimeterLocationAtBearing(bearing) {
        return {east: 0, north: 0}
    }
    spreadRateAtBearing(bearing) {
        return 0
    }
}
