import { PcsMapper, FireGeometry, gxmlStr } from "$lib/index.js"

export class TangentDemo01View extends PcsMapper {
    constructor(pcs, model) {
        super(pcs.width, pcs.height,    // SVG image width and height
            pcs.west, pcs.east, pcs.south, pcs.north,   // PCS bounds
            pcs.upp, pcs.units, pcs.focusEast, pcs.focusNorth)
        this.pcs = pcs
        this.model = model
    }

    addAxis() {
        const {west, east, north, south} = this.bounds
        return gxmlStr([
            this.line(0, south, 0, north, {stroke: 'green', 'stroke-width': 2}),
            this.line(west, 0, east, 0, {stroke: 'green', 'stroke-width': 2})
        ])
    }
    
    // 'vectors' is an array of objects with {east, north, bearing, distance}
    addPoint(els, east, north, text, color) {
        els.push(this.circle(east, north, 10, {fill: color}))
        els.push(this.textMid(east, north-8, text, {'font-size': 24}))
    }
    addTriplets(triplets) {
        const perimLine = {stroke: 'red', 'stroke-width': 3}
        const baseLine = {stroke: 'cyan', 'stroke-width': 1}
        const growLine = {stroke: 'yellow', 'stroke-width': 3}
        const els = []
        for (let [a, b, c] of triplets) {
            const [ae, an] = a
            const [be, bn] = b
            const [ce, cn] = c
            const normal = FireGeometry.normalIntersection(be, bn, ae, an, ce, cn)
            const baseMid = FireGeometry.midPoint(ae, an, ce, cn)
            const bearing = FireGeometry.bearing(baseMid.east, baseMid.north, be, bn)
            const growMid = FireGeometry.midPoint(baseMid.east, baseMid.north, be, bn)
            const term = FireGeometry.vectorEndpoint(be, bn, bearing, 30)
            const d = FireGeometry.pointSide(be, bn, ae, an, ce, cn)
            let side = 'C'
            if (d<0) side = 'R'
            if (d>0) side = 'L'

            els.push(this.line(ae, an, be, bn, perimLine))
            els.push(this.line(ce, cn, be, bn, perimLine))
            els.push(this.line(ae, an, ce, cn, baseLine))
            els.push(this.line(baseMid.east, baseMid.north, term.east, term.north, growLine))
            this.addPoint(els, ae, an, 'A', 'green')
            this.addPoint(els, be, bn, 'B', 'red')
            this.addPoint(els, ce, cn, 'C', 'blue')
            this.addPoint(els, normal.east, normal.north, 'N', 'cyan')
            this.addPoint(els, baseMid.east, baseMid.north, 'M', 'yellow')
            els.push(this.textMid(growMid.east, growMid.north, bearing.toFixed(0),
                {'alignment-baseline': 'middle', 'font-size': 24}))
            els.push(this.textMid(term.east, term.north, side,
                {'alignment-baseline': 'middle', 'font-size': 24}))
        }
        return gxmlStr(els)
    }

    content() {
        let str = this.addBoundsRect({fill:'gray'})
            + this.addTriplets(this.model.triplets)
            + this.addGridLines(100, 100, 0)
            + this.addAxis()
        this.svgContent = str
        return str
    }
}