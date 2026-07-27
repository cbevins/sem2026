/**
 * SlopeSteepness is a class for storing and updating slope steepness
 * for the Wildland Fire Behavior eXplorer.
 */
import { toDegrees, toRadians } from './utils.js'

export class SlopeSteepness {
    constructor() {
        this.degrees = 0
        this.ratio = 0
    }
    // WfbxRunner already updated the SlopeMap, so just get its values.
    updateFromSlopeMap(slopeMap) {
        this.degrees = slopeMap.slopeDegrees
        this.ratio = slopeMap.slopeRatio
    }
    // WfbxRunner already set this.slopeRatio; so just update this.slopeDegrees
    updateSlopeSteepnessFromRatio() {
        this.degrees = toDegrees(Math.atan(this.ratio))
    }
    // WfbxRunner already set this.slopeDegrees; so just update this.slopeRatio
    updateSlopeSteepnessFromDegrees() {
        this.ratio = Math.tan(toRadians(this.degrees))
    }
}
