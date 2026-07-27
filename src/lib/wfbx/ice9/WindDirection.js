/**
 * WindDirection is a class for storing and updating wind directions
 * for the Wildland Fire Behavior eXplorer.
 */
export class WindDirection {
    constructor() {
        this.bearingCompass = 'n'
        this.bearingDegrees = 0
        this.sourceCompass = 's'
        this.sourceDegrees = 180
    }
    static CompassDegrees = {
        n:   0, nne:  22.5, ne:  45, ene:  67.5, e:  90, ese: 112.5, se: 135, sse: 157.5,
        s: 180, ssw: 202.5, sw: 225, wsw: 247.5, w: 270, wnw: 292.5, nw: 315, nnw: 337.5
    }
    degreesToCompass(degrees) {
        const compass = [
            'n', 'nne', 'ne', 'ene', 'e', 'ese', 'se', 'sse',
            's', 'ssw', 'sw', 'wsw', 'w', 'wnw', 'nw', 'nnw']
        const idx = Math.trunc(((degrees + 11.25)%360) / 22.5)
        return compass[idx]
    }
    // WfbxRunner already set this.bearingCompass; so just update the other 3
    updateWindDirectionFromBearingCompass() {
        this.bearingDegrees = WindDirection.CompassDegrees[this.bearing.compass]
        this.sourceDegrees = (this.bearingDegrees + 180) % 360
        this.sourceCompass = this.degreesToCompass(this.sourceDegrees)
    }
    // WfbxRunner already set this.bearingDegrees; so just update the other 3
    updateWindDirectionFromBearingDegrees() {
        this.bearingCompass = this.degreesToCompass(this.bearingDegrees)
        this.sourceDegrees = (this.bearingDegrees + 180) % 360
        this.sourceCompass = this.degreesToCompass(this.sourceDegrees)
    }
    // WfbxRunner already set this.sourceCompass; so just update the other 3
    updateWindDirectionFromSourceCompass() {
        this.sourceDegrees = WindDirection.CompassDegrees[this.source.compass]
        this.bearingDegrees = (this.sourceDegrees + 180) % 360
        this.bearingCompass = this.degreesToCompass(this.bearingDegrees)
    }
    // WfbxRunner already set this.sourceDegrees; so just update the other 3
    updateWindDirectionFromSourceDegrees() {
        this.sourceCompass = this.degreesToCompass(this.sourceDegrees)
        this.bearingDegrees = (this.sourceDegrees + 180) % 360
        this.bearingCompass = this.degreesToCompass(this.bearingDegrees)
    }
}
