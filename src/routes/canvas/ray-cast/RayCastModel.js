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
            const fem = new FireEllipseModel(fire.lwr, fire.headRos, fire.bearing,
                fire.elapsed, fire.ignEast, fire.ignNorth, fire.label)
            fire.size = fem.size()
            fire.perimeter = fem.perimeter()

            // Using degStep to generate perimeter points at regular theta's
            fire.points = fem.perimeterPoints(this.degStep)
            fire.raster = this.burnMap.rasterPerimeter(fire.points)
            if (this.getBurnGaps) {
                fire.gap = fem.maxGap(fire.points)
                fire.gaps = this.burnMap.getGaps()
            }

            // Some ScanLine size and perimeters for comparison purposes ...
            if (this.getScanLineStats) {
                const fireEllipseScanLines = new FireEllipseScanLines(
                    fire.ignEast, fire.ignNorth,
                    fem.length(), fem.width(), fire.bearing,
                    fem.centerEasting(), fem.centerNorthing(), 1, 'ft')
                fire.scan.size = fireEllipseScanLines.size
                fire.scan.perimeter = fireEllipseScanLines.perimeter
                fire.scan.cells = fireEllipseScanLines.rasterSize
                // fire.scan.points = fireEllipseScanLines.perimeterPoints()
                // console.log(new Date(), fire.label)
                // console.table(fire.scan.points)
            }
            this.castBurnLines(fire)
        }
        if (this.getBurnCounts) this.counts = this.burnMap.getBurnCounts()
        return this.fires
    }

    castBurnLines(fire) {
        const ignCol = this.burnMap.col(fire.ignEast)
        const ignRow = this.burnMap.row(fire.ignNorth)
        for(let [perimCol, perimRow] of fire.raster)
            this.burnMap.castBurnLine(ignCol, ignRow, perimCol, perimRow)
    }
}