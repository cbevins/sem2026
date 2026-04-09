import { RayCastDataProvider } from "./RayCastDataProvider.js"
import { RayCastFeaturePalette } from "./RayCastFeaturePalette.js"
import { FireEllipseModel } from '../FireEllipseModel.js'
import { FireEllipseScanLines } from '../FireEllipseScanLines.js'

export class RayCastModel {
    constructor(width, height, degStep,
            getBurnCounts=true, getBurnGaps=true, getScanLineStats=true) {
        this.dataProvider = new RayCastDataProvider()
        this.width = width
        this.height = height
        this.degStep = degStep
        this.getBurnCounts = getBurnCounts
        this.getBurnGaps = getBurnGaps
        this.getScanLineStats = getScanLineStats
        this.fires = this.dataProvider.getFires()
        this.counts = [0, 0, 0, 0]
        this.palette = RayCastFeaturePalette
        this.update()
    }

    drawToCanvas(ctx) {
        this.burnMap.drawToCanvas(ctx, this.palette)
    }

    update() {
        // Because we're just spinning the same FireEllipses
        // (instead of growing the same fire),
        // each frame must start with a fresh BurnMap
        this.burnMap = this.dataProvider.getBurnMap(0, 0, this.width, this.height, 1)

        // Generate perimeter points for the fire ellipse at the current bearing
        for(let fire of this.fires) {
            fire.bearing = (fire.bearing + 5)%360
            // This is currently using BurnMap raster ignEast and ignNorth
            // Should be changed to PCS?
            const gen = new FireEllipseModel(fire.lwr, fire.headRos, fire.bearing,
                fire.elapsed, fire.ignEast, fire.ignNorth)
            fire.points = gen.perimeterPoints(this.degStep)
            if (this.showBurnGaps) fire.gap = gen.maxGap(fire.points)
            fire.size = gen.size()
            fire.perimeter = gen.perimeter()
            this.castBurnLines(fire)
            // Some ScanLine size and perimeters for comparison purposes ...
            if (this.getScanLineStats) {
                const fireEllipseScanLines = new FireEllipseScanLines(
                    fire.ignEast, fire.ignNorth,
                    gen.length(), gen.width(), fire.bearing,
                    gen.centerEasting(), gen.centerNorthing(), 1, 'ft')
                fire.scan.size = fireEllipseScanLines.size
                fire.scan.perimeter = fireEllipseScanLines.perimeter
                fire.scan.cells = fireEllipseScanLines.rasterSize
            }
        }
        if (this.getBurnCounts) this.counts = this.burnMap.getBurnCounts()
        return this.fires
    }

    castBurnLines(fire) {
        const ignCol = this.burnMap.col(fire.ignEast)
        const ignRow = this.burnMap.row(fire.ignNorth)
        for(let [easting, northing /*, bearing*/] of fire.points) {
            const lastCol = this.burnMap.col(easting)
            const lastRow = this.burnMap.row(northing)
            this.burnMap.castBurnLine(ignCol, ignRow, lastCol, lastRow)
        }
    }
}