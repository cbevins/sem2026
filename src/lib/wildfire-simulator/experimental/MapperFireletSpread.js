import { Firelet, FireRaster } from './index.js'

const firelet1 = new Firelet(50, 2, 1, 45)
function getFirelet() {
    return firelet1
}

function makeStar(colOffset, rowOffset, scale) {
    const template = [
        [25, 2], [30, 18], [47, 18], [34, 28], [39, 44],
        [25, 34], [11, 44], [16, 28], [3, 18], [20, 18], [25,2]]

    const star5= []
    for(let [col, row] of template)
        star5.push([scale*col + colOffset, scale*row + rowOffset])
    return star5
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
        this.addPattern4()

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

    addPattern1() {
        const raster = this.fireRaster
        raster.set(50, 500, FireRaster.ignited)
        raster.fillRect(200, 220, 100, 5, FireRaster.unburnable)
        raster.fillPolygon(makeStar(100, 300, 2), FireRaster.unburnable)
        raster.strokePath(makeStar(300, 100, 2), FireRaster.unburnable, true)
        raster.fillCircle(400, 400, 40, FireRaster.unburnable)
        raster.strokeEllipse(400, 300, 50, 20, 45, FireRaster.unburnable)
        raster.fillEllipse(400, 200, 50, 20, 45, FireRaster.unburnable)
    }
    addPattern2() {
        const raster = this.fireRaster
        raster.set(35, 455, FireRaster.ignited)
        for(let row=50; row<this.rows; row+=50) {
            for(let col=50; col<this.cols; col+=100) {
                raster.fillRect(col, row, 50, 5, FireRaster.unburnable)
            }
        }
    }
    addPattern3() {
        const raster = this.fireRaster
        raster.set(35, 455, FireRaster.ignited)
        raster.fillRect(100, 50, 10, 400, FireRaster.unburnable)
        raster.fillRect(100, 450, 300, 10, FireRaster.unburnable)
    }
    addPattern4() {
        const raster = this.fireRaster
        raster.set(35, 455, FireRaster.ignited)
        raster.strokePath([
            [50,400], [50,50], [500,50], [500,500],
            [100, 500], [100,100], [450,100], [450,450],
            [150,450], [150,150], [400,150], [400,400],
            [200,400], [200,200], [350,200], [350,350],
            [250,350],[250,250], [300,250], [300,300]
            ], FireRaster.unburnable
        )
    }
}