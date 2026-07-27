/**
 * WindSpeed is a class for storing and updating wind speed
 * for the Wildland Fire Behavior eXplorer.
 */
export class WindSpeed {
    constructor() {
        this.at20ft = 0
        this.at10m = 0
    }
    // WfbxRunner already set this.at10m; just update this.at20f
    updateWindSpeedFrom10m() {
        this.at20ft = this.at10m / 1.13
    }
    // WfbxRunner already set this.at20ft; just update this.at10m
    updateWindSpeedFrom20ft() {
        this.at10m = 1.13 * this.at20ft
    }
}
