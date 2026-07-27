/**
 * SlopeDirection is a class for storing and updating slope directions
 * for the Wildland Fire Behavior eXplorer.
 */
export class SlopeDirection {
    constructor() {
        this.aspectDegrees = 180
        this.aspectCompass = 's'
        this.upslopeDegrees = 0
        this.upslopeCompass = 'n'
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

    // WfbxRunner already set this.aspect; so just update this.upslope
    updateSlopeDirectionFromAspectDegrees() {
        this.aspectCompass = this.degreesToCompass(this.aspectDegrees)
        this.upslopeDegrees = (this.aspectDegrees + 180) % 360
        this.upslopeCompass = this.degreesToCompass(this.upslopeDegrees)
    }
    updateSlopeDirectionFromAspectCompass() {
        this.aspectDegrees = SlopeDirection.CompassDegrees[this.aspectCompass]
        this.upslopeDegrees = (this.aspectDegrees + 180) % 360
        this.upslopeCompass = this.degreesToCompass(this.upslopeDegrees)
    }
    updateSlopeDirectionFromUpslopeCompass() {
        this.upslopeDegrees = SlopeDirection.CompassDegrees[this.upslopeCompass]
        this.aspectDegrees = (this.upslopeDegrees + 180) % 360
        this.aspectCompass = this.degreesToCompass(this.aspectDegrees)
    }
    // WfbxRunner already set this.upslope; so just update this.aspect
    updateSlopeDirectionFromUpslopeDegrees() {
        this.upslopeCompass = this.degreesToCompass(this.upslopeDegrees)
        this.aspectDegrees = (this.upslopeDegrees + 180) % 360
        this.aspectCompass = this.degreesToCompass(this.aspectDegrees)
    }
}
