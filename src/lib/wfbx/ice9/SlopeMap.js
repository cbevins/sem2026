/**
 * SlopeMap is a class for storing and updating slope steepness calculations
 * based on map measurements for the Wildland Fire Behavior eXplorer.
 */
import { toDegrees } from './utils.js'

export class SlopeMap {
    constructor() {
        this.scale = 24000              // 1-inch of map is 2000-ft of terrain
        this.contourInterval = 100
        this.contoursCrossed = 0
        this.distance = 0
        this.reach = 0
        this.rise = 0
        this.slopeRatio = 0
        this.slopeDegrees = 0
    }
    // WfbxRunner will have previously set scale, sontourInterval, contoursCrossedd,
    // and distance; just need to update the slope degrees and ratio.
    updateSlopeMap() {
        this.reach = Math.max(0, this.scale * this.distance)
        this.rise = Math.max(0, this.contoursCrossed * this.contourInterval)
        this.slopeRatio = (this.reach > 0) ? (this.rise / this.reach) : 0
        this.slopeDegrees = toDegrees(Math.atan(this.slopeRatio))
    }
}
