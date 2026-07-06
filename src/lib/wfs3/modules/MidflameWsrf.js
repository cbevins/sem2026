export class MidflameWsrf {
    constructor() {
        this.midflamWsrf = 1
    }
    update(state) {
        this.midflameWsrf = Math.min(
            state.canopyStructure.canopyMidflameWsrf,
            state.primaryFuelBed.fuelMidflameWsrf)
    }
}
