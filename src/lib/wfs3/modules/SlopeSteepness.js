import { toDegrees, toRadians } from '../Wfs.js'

export class SlopeSteepness {
    constructor() {
        this.slopeDegrees = 0
        this.slopeRatio = 0
    }
    updateFromSlopeDegrees() {
        this.slopeRatio = Math.tan(toRadians(this.slopeDegrees))
    }
    updateFromSlopeMap(state) {
        this.slopeDegrees = state.slopeMap.slopeDegrees
        this.slopeRatio = state.slopeMap.slopeRatio
    }
    updateFromSlopeRatio() {
        this.slopeDegrees = toDegrees(Math.atan(this.slopeRatio))
    }
}
