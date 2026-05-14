import { Firelet } from './narrative/Firelet.js'
import { FireMap } from './narrative/FireMap.js'

// We want the Firelet perimeter to rotate around [ignEast, ignNorth]
export class MapperFireletSpread {
    constructor(cols, rows, headRos=50, lwr=2, bearing=0) {
        this.cols = cols
        this.rows = rows
        this.fireMap = new FireMap(cols, rows)
        this.fireMap.set(256, 256, FireMap.ignited)
        this.fireMap.set(200, 240, FireMap.unburnable, 112)

        // For creating the Firelet...
        this.bearing = bearing
        this.duration = 1
        this.headRos= headRos
        this.lwr = lwr
        this.spacing = 1
        this.firelet = new Firelet(this.headRos, this.lwr, this.duration, this.bearing, this.spacing)
        this.node = this.firelet.start
        this.period = 0
    }

    getNarrative() {
        return `Uses a Firelet of lwr=${this.lwr}, headRos=${this.headRos} bearing=${this.bearing} `
            + `ignited at [easting: ${this.ignEast}, northing: ${this.ignNorth}] PCS `
            + `to generate a Firelet. Period ${this.period}`
    }

    getTitle() {
        return 'Firelet Fire Spread Demonstration'
    }

    refreshFireMap() {
        this.period++
        const fireFrontCells = this.fireMap.getFireFrontCells()
        this.fireFrontCellCount = fireFrontCells.length
        for(let cell of fireFrontCells) {
            this.fireMap.igniteFirelet(this.firelet, cell.col, cell.row)
        }
        this.freq = this.fireMap.freq()
        console.log(this.period, this.freq)
        return this.fireMap
    }
}