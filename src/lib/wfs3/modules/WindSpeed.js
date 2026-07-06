export class WindSpeed {
    constructor() {
        this.windSpeed10m = 0
        this.windSpeed20ft = 0
    }
    updateFromWindSpeed10m() {
        this.windSpeed20ft = this.windSpeed10m / 1.13
    }
    updateFromWindSpeed20ft() {
        this.windSpeed10m = 1.13 * this.windSpeed20ft
    }
}