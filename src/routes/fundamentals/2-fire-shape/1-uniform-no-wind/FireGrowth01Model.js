export class FireGrowth01Model {
    constructor(spreadRate=10, elapsedTime=10, ignEast=0, ignNorth=0) {
        this.rate = spreadRate
        this.time = elapsedTime
        this.ign = {east: ignEast, north: ignNorth}
    }
    radius() { return this.rate * this.time }
}