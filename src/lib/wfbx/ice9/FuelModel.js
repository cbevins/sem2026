
export class FuelModel {
    constructor(fuelCatalog, fuelKey=0) {
        this.fuelCatalog = fuelCatalog
        this.fuelKey = fuelKey
        this.fuelModel = this.fuelCatalog.get(fuelKey)
    }
    setFuelKey(fuelKey) {
        this.fuelKey = fuelKey
        this.fuelModel = this.fuelCatalog.get(fuelKey)
    }
}
