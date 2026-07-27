/**
 * SlopeMap is a class for storing and updating slope steepness calculations
 * based on map measurements for the Wildland Fire Behavior eXplorer.
 */
import { toDegrees } from './utils.js'

export class SlopeMap {
    constructor() {
        this.scale = 24000
        this.contourInterval = 100
        this.contoursCrossed = 0
        this.distance = 0
        this.slopeRatio = 0
        this.slopeDegrees = 0
    }
    // WfbxRunner will have previously set scale, sontourInterval, contoursCrossedd,
    // and distance; just need to update the slope degrees and ratio.
    updateSlopeMap() {
        const reach = Math.max(0, this.scale * this.distance)
        const rise = Math.max(0, this.contoursCrossed * this.contourInterval)
        this.slopeRatio = (reach > 0) ? (rise / reach) : 0
        this.slopeDegrees = toDegrees(Math.atan(this.slopeRatio))
    }
}
