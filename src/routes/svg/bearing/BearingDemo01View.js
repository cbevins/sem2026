import { PcsMapper, FireGeometry, gxmlStr } from "$lib/index.js"

export class BearingDemo01View extends PcsMapper {
    constructor(pcs, model) {
        super(pcs.width, pcs.height,    // SVG image width and height
            pcs.west, pcs.east, pcs.south, pcs.north,   // PCS bounds
            pcs.upp, pcs.units, pcs.focusEast, pcs.focusNorth)
        this.model = model
        this.pcs = pcs
    }

    addAxis() {
        const {west, east, north, south} = this.bounds
        return gxmlStr([
            this.line(0, south, 0, north, {stroke: 'green', 'stroke-width': 2}),
            this.line(west, 0, east, 0, {stroke: 'green', 'stroke-width': 2})
        ])
    }
    
    // 'vectors' is an array of objects with {east, north, bearing, distance}
    addVectors(vectors) {
        const els = []
        for (let vector of vectors) {
            const {east, north, bearing, distance} = vector
            const {east:endEast, north:endNorth} = this.vectorEndpoint(
                east, north, bearing, distance)
            els.push(this.line(east, north, endEast, endNorth, {stroke:'black', 'stroke-width':2}))
            els.push(this.circle(east, north, 6, {fill: 'green'}))
            els.push(this.circle(endEast, endNorth, 6, {fill:'red'}))
            els.push(this.textMid(endEast, endNorth, bearing.toFixed(0)))
            const b = FireGeometry.bearing(east, north, endEast, endNorth)
            if (bearing !== b) throw new Error('Bearings do not reconcile.')
        }
        return gxmlStr(els)
    }

    content() {
        let str = this.addBoundsRect({fill:'gray'})
            + this.addVectors(this.model.vectors)
            + this.addGridLines(100, 100, 0)
            + this.addAxis()
        this.svgContent = str
        return str
    }
}