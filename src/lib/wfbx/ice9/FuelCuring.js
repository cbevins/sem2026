export class FuelCuring {
    constructor(curedHerb=0) {
        this.curedHerb = curedHerb
        this.moistureLiveCurable = Math.max(0, Math.min(1,(1.333-curedHerb) / 1.11))
    }
    updateFuelCuringFromLiveMoisture(fuelMoisture) {
        this.moistureLiveCurable = fuelMoisture.moistureLiveCurable
        this.curedHerb = Math.max(0, Math.min(1, 1.333 - 1.11 * this.moistureLiveCurable))
    }
}