export class FuelMoisture {
    constructor() {
        this.moistureClasses = ['moistureDead1h', 'moistureDead10h', 'moisturedead100h',
            'moistureLiveHerb', 'moistureLiveStem']
        this.moistureDead1h = 0.1
        this.moistureDead10h = 0.1
        this.moistureDead100h = 0.1
        this.moistureDeadCategory = 0.1
        this.moistureLiveHerb = 3
        this.moistureLiveStem = 3
        this.moistureLiveCategory = 3
    }
    addMoistureClass(key) {
        this.moistureClasses.push(key)
        this[key] = (key.includes('Dead')) ? 0.1 : 3
    }
    updateFromDeadCategory() {
        this.moistureDead1h = this.moistureDeadCategory
        this.moistureDead10h = this.moistureDeadCategory
        this.moistureDead100h = this.moistureDeadCategory
    }
    updateFromLiveCategory() {
        this.moistureLiveHerb = this.moistureLiveCategory
        this.moistureLiveStem = this.moistureLiveCategory
    }
}