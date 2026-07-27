export class CanopyFuels {
    constructor() {
        this.bulkDensity = 0        // lb fuel / ft3 canopy
        this.fuelLoad = 0           // lb/ft2
        this.heatContent = 8000     // BTU/lb
        this.heatPerUnitArea = 0    // BTU/ft2
    }
    // WfbxRunner has previously set this.bulkDensity and this.heatContent.
    updateCanopyFuels(canopyLength) {
        this.fuelLoad = this.bulkDensity * canopyLength
        this.heatPerUnitArea = this.fuelLoad * this.heatContent
    }
}
