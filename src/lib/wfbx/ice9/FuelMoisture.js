/**
 * FuelMoisture is a class for storing and updating dead and live fuel moistures
 * for the Wildland Fire Behavior eXplorer.
 */
export class FuelMoisture {
    constructor() {
        // the following keys match the FuelModel Particle moisture class keys
        this.moistureDead1h = 1
        this.moistureDead10h = 1
        this.moistureDead100h = 1
        this.moistureDeadCategory = 1
        this.moistureLiveCategory = 5
        this.moistureLiveCurable = 5
        this.moistureLiveHerb = 5
        this.moistureLiveStem = 5
    }
    // The WfbxRunner will have previously set this.moistureDeadCategory
    updateFuelMoistureDeadFromCategory() {
        this.moistureDead1h = this.moistureDeadCategory
        this.moistureDead10h = this.moistureDeadCategory
        this.moistureDead100h = this.moistureDeadCategory
    }
    // The WfbxRunner will have previously set all 3 dead fuel moistures,
    // so there is literally nothing more to do!
    updateFuelMoistureDeadFromParticles() {}
    // The WfbxRunner will have previously set this.moistureLiveCategory
    updateFuelMoistureLiveFromCategory() {
        this.moistureLiveCurable = this.moistureLiveCategory
        this.moistureLiveHerb = this.moistureLiveCategory
        this.moistureLiveStem = this.moistureLiveCategory
    }
    // The WfbxRunner will have previously set all 2 or 3 live fuel moistures,
    // so there is literally nothing more to do!
    updateFuelMoistureLiveFromParticles() {}
}
