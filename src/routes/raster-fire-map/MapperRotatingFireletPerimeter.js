import { FireEllipse, FireRaster, getEllipsePerimeterCells } from './index.js'

// We want the Firelet perimeter to rotate around [ignEast, ignNorth]
export class MapperRotatingFireletPerimeter {
    constructor(cols, rows, headRos=100, lwr=2) {
        this.cols = cols
        this.rows = rows
        this.headRos= headRos
        this.lwr = lwr
        this.ignEast = 0    // easting, where 0 is map center
        this.ignNorth =100   // relative to map center
        this.bearing = 0
        this.duration = 1
        this.spacing = 1
        this.fireRaster = new FireRaster(cols, rows)
    }

    getNarrative() {
        return `Uses a FireEllipse of lwr=${this.lwr}, headRos=${this.headRos} `
            + `ignited at [easting: ${this.ignEast}, northing: ${this.ignNorth}] PCS `
            + `to generate a Firelet perimeter in Raster Coordinate System.`
    }

    getTitle() {
        return 'Rotating Firelet Perimeters'
    }

    init() {
        this.bearing = 0
        this.refreshFireRaster()
        return this.fireRaster
    }

    refreshFireRaster() {
        // Start with a clean FireRaster
        this.fireRaster.data.fill(FireRaster.unburned)

        // Get the perimeter cells at the next bearing stpe
        this.bearing = (this.bearing + 5) % 360
        const ellipse = new FireEllipse(this.headRos, this.lwr, this.duration, 0, 0, this.bearing)
        const {majorDist: rx, minorDist: ry, degRot, centerEast: cx, centerNorth: cy} = ellipse
        const perimCells = getEllipsePerimeterCells(cx, cy, rx, ry, degRot, this.spacing)

        // We want [east, north] of [0,0] PCS to be located over the FireRaster center cell
        // at [cols/2, rows/2] RCS, so translate ignEast and ignNorth to that point
        const c0 = Math.trunc(this.cols/2) + this.ignEast
        const r0 = Math.trunc(this.rows/2) - this.ignNorth
        for(let {col, row} of perimCells) {
            this.fireRaster.set(c0 + col + this.ignEast, r0 + row , FireRaster.ignited)
        }
        return this.fireRaster
    }
}