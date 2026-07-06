import { toDegrees } from '../Wfs.js'

export class SlopeMap {
    constructor() {
        this.mapScale = 24000
        this.mapContourInterval = 100
        this.mapContoursCrossed = 0
        this.mapDistance = 0
        this.slopeRatio = 0
        this.slopeDegrees = 0
    }
    update() {
        const reach = Math.max(0, this.mapScale * this.mapDistance)
        const rise = Math.max(0, this.mapContoursCrossed * this.mapContourInterval)
        this.slopeRatio = (reach > 0) ? (rise / reach) : 0
        this.slopeDegrees = toDegrees(Math.atan(this.slopeRatio))
    }
}
