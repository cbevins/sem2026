import { FireFrontDataProvider } from "./FireFrontDataProvider.js"
import { FireFrontFeaturePalette } from "./FireFrontFeaturePalette.js"
import { FireEllipseModel } from '../FireEllipseModel.js'

export class FireFrontModel {
    constructor(width, height, degStep) {
        this.dataProvider = new FireFrontDataProvider()
        this.width = width
        this.height = height
        this.degStep = degStep
        this.frontalBurnMap = this.dataProvider.getBurnMap(0, 0, this.width, this.height, 1)
        this.spinnerBurnMap = this.dataProvider.getBurnMap(0, 0, this.width, this.height, 1)
        this.fires = this.dataProvider.getFires()
        this.counts = [0, 0, 0, 0]
        this.palette = FireFrontFeaturePalette
        this.updateSpinner()
        this.updateFrontal()
    }

    drawToCanvas(ctx) {
        // const burnMap = this.frontalBurnMap
        const burnMap = this.spinnerBurnMap
        burnMap.drawToCanvas(ctx, this.palette)
    }

    updateSpinner() {
        // In this use case, we're just spinning the same FireEllipses
        // over various bearings (instead of growing the same fire),
        // so each frame must start with a fresh BurnMap.
        this.spinnerBurnMap = this.dataProvider.getBurnMap(0, 0, this.width, this.height, 1)
        const burnMap = this.spinnerBurnMap
        for(let fire of this.fires) {
            // Change the fire behavior bearing and create a new fire ellipse model
            fire.bearing = (fire.bearing + 5)%360
            const fem = new FireEllipseModel(fire.lwr, fire.headRos, fire.bearing,
                fire.elapsed, fire.ignEast, fire.ignNorth, fire.label)
            // Use degStep to generate perimeter points
            fire.points = fem.perimeterPoints(this.degStep)
            fire.raster = this.spinnerBurnMap.rasterPerimeter(fire.points)
            this.castBurnLines(burnMap, fire)
        }
        this.counts = burnMap.getBurnCounts()
        return this.fires
    }

    updateFrontal() {
        const burnMap = this.frontalBurnMap
        console.log('Frontal BurnCode at 0,0 is', burnMap.getBurnCode(0, 0))
        const startCounts = burnMap.getBurnCounts()
        console.log('Frontal start Counts', startCounts)
        const front = burnMap.getFireFront()
        console.log('Fire front cells', front)
        const stopCounts = burnMap.getBurnCounts()
        console.log('Frontal stop Counts', startCounts)
    }

    castBurnLines(burnMap, fire) {
        const ignCol = burnMap.col(fire.ignEast)
        const ignRow = burnMap.row(fire.ignNorth)
        for(let [perimCol, perimRow] of fire.raster)
            burnMap.castBurnLine(ignCol, ignRow, perimCol, perimRow)
    }
}