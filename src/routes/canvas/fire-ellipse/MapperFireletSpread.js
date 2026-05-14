import { Firelet } from './narrative/Firelet.js'
import { FireMap } from './narrative/FireMap.js'

// We want the Firelet perimeter to rotate around [ignEast, ignNorth]
export class MapperFireletSpread {
    constructor(cols, rows, headRos=50, lwr=2, bearing=0) {
        this.cols = cols
        this.rows = rows
        this.bearing = bearing
        this.duration = 1
        this.headRos= headRos
        this.lwr = lwr
        this.spacing = 1
        this.init()
    }

    getNarrative() {
        return `Uses a Firelet of lwr=${this.lwr}, headRos=${this.headRos} bearing=${this.bearing} `
            + `to generate a Firelet. Period ${this.period}: ${this.freq}`
    }

    getTitle() {
        return 'Firelet Fire Spread Demonstration'
    }

    init() {
        // Create the FireMap
        this.fireMap = new FireMap(this.cols, this.rows)
        this.fireMap.set(256, 256, FireMap.ignited)
        this.fireMap.set(200, 240, FireMap.unburnable, 112)

        // Create the Firelet
        this.firelet = new Firelet(this.headRos, this.lwr, this.duration, this.bearing, this.spacing)

        // Status
        this.period = 0
        this.freq = `Unburned: 0, Ignited: 0, Burned: 0, Unburnable: 0`
        return this.fireMap
    }

    refreshFireMap() {
        this.period++
        const fireFrontCells = this.fireMap.getFireFrontCells()
        if (! fireFrontCells.length) {
            return null
        }
        this.fireFrontCellCount = fireFrontCells.length
        for(let cell of fireFrontCells) {
            this.fireMap.igniteFirelet(this.firelet, cell.col, cell.row)
        }
        const f = this.fireMap.freq()
        this.freq = `Unburned: ${f.unburned}, Ignited: ${f.ignited}, Burned: ${f.burned}, Unburnable: ${f.unburnable}`
        return this.fireMap
    }
}