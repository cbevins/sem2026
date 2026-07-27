export class MidflameWindSpeed {
    constructor() {
        this.windSpeed = 0
        this.wsrf = 1
    }
    // WfbxRunner has previously set this.wsrf, so just update this.windSpeed
    updateMidflameWindSpeedFromWsrf20ft(windSpeed20ft) {
        this.windSpeed = this.wsrf * windSpeed20ft
    }
    updateMidflameWsrfFromCanopyFuel(fuelBedMidflameWsrf, canopyMidflameWsrf) {
        this.wsrf = Math.min(fuelBedMidflameWsrf, canopyMidflameWsrf)
    }
}