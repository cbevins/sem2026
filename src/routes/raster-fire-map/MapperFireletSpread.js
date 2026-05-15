import { Firelet, FireRaster } from './index.js'

const firelet1 = new Firelet(50, 2, 1, 45)
function getFirelet() {
    return firelet1
}

const starTemplate = [
    [25, 2], [30, 18], [47, 18], [34, 28], [39, 44],
    [25, 34], [11, 44], [16, 28], [3, 18], [20, 18]
]
let colOffset = 100
let rowOffset = 350
let scale = 2
const star5= []
for(let [col, row] of starTemplate) {
    star5.push([scale*col + colOffset, scale*row + rowOffset])
}

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
        // Create the FireRaster
        this.fireRaster = new FireRaster(this.cols, this.rows)
        this.fireRaster.set(50, 500, FireRaster.ignited)
        this.fireRaster.setRect(200, 220, 100, 5, FireRaster.unburnable)
        this.fireRaster.setPolygon(star5, FireRaster.unburnable)

        // Create the Firelet
        // this.firelet = new Firelet(this.headRos, this.lwr, this.duration, this.bearing, this.spacing)
        this.firelet = firelet1

        // Status
        this.period = 0
        this.freq = `Unburned: 0, Ignited: 0, Burned: 0, Unburnable: 0`
        return this.fireRaster
    }

    refreshFireRaster() {
        this.period++
        const fireFrontCells = this.fireRaster.getFireFrontCells()
        if (! fireFrontCells.length) {
            return null
        }
        this.fireFrontCellCount = fireFrontCells.length
        for(let cell of fireFrontCells) {
            const firelet = getFirelet(/*cell.col, cell.row, period*/)
            this.fireRaster.igniteFirelet(firelet, cell.col, cell.row)
        }
        const f = this.fireRaster.freq()
        this.freq = `Unburned: ${f.unburned}, Ignited: ${f.ignited}, Burned: ${f.burned}, Unburnable: ${f.unburnable}`
        return this.fireRaster
    }
}