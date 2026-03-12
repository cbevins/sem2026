import { PcsMapper, FireGeometry, gxmlStr } from "$lib/index.js"

export class TangentDemo01View extends PcsMapper {
    constructor(pcs, model) {
        super(pcs.width, pcs.height,    // SVG image width and height
            pcs.west, pcs.east, pcs.south, pcs.north,   // PCS bounds
            pcs.upp, pcs.units, pcs.focusEast, pcs.focusNorth)
        this.pcs = pcs
        this.model = model
    }

    //--------------------------------------------------------------------------
    // Standard common stuff
    //--------------------------------------------------------------------------
    content() {
        let str = this.addBoundsRect({fill:'gray'})
            // + this.addTriplets(this.model.triplets)
            // + this.growPerim(this.model.circularPerim)
            + this.growPerim(this.model.modifiedPerim)
            + this.addGridLines(100, 100, 0)
            + this.addAxis()
        this.svgContent = str
        return str
    }

    addAxis() {
        const {west, east, north, south} = this.bounds
        return gxmlStr([
            this.line(0, south, 0, north, {stroke: 'green', 'stroke-width': 2}),
            this.line(west, 0, east, 0, {stroke: 'green', 'stroke-width': 2})
        ])
    }
    
    //--------------------------------------------------------------------------
    // Draws selected user cases
    //--------------------------------------------------------------------------
    addTriplets(triplets) {
        const textProps = {'alignment-baseline': 'middle', 'font-size': 24, 'font-weight':'bold'}
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
            const expand = FireGeometry.vectorEndpoint(be, bn, bearing, 30)
            const d = FireGeometry.pointSide(be, bn, ae, an, ce, cn)
            let side = 'C'
            if (d<0) side = 'R'
            if (d>0) side = 'L'

            els.push(this.line(ae, an, be, bn, perimLine))
            els.push(this.line(ce, cn, be, bn, perimLine))
            els.push(this.line(ae, an, ce, cn, baseLine))
            els.push(this.line(baseMid.east, baseMid.north, expand.east, expand.north, growLine))
            this._addPoint(els, ae, an, 'A', 'green')
            this._addPoint(els, be, bn, 'B', 'red')
            this._addPoint(els, ce, cn, 'C', 'blue')
            this._addPoint(els, normal.east, normal.north, 'N', 'cyan')
            this._addPoint(els, baseMid.east, baseMid.north, 'M', 'yellow')
            els.push(this.textMid(growMid.east, growMid.north, bearing.toFixed(0), textProps))
            els.push(this.textMid(expand.east, expand.north, side, textProps))
        }
        return gxmlStr(els)
    }
    _addPoint(els, east, north, text, color) {
        els.push(this.circle(east, north, 10, {fill: color}))
        els.push(this.textMid(east, north, text,
            {'alignment-baseline': 'middle', 'font-size': 24, 'font-weight':'bold'}))
    }

    //--------------------------------------------------------------------------
    // Illustrates  fire expansion from an initial perimeter
    //--------------------------------------------------------------------------
    growPerim(perim0) {
        const perim1 = []
        const els = []
        const perimLine = {stroke: 'red', 'stroke-width': 3}
        const perimDot = {fill: 'red', stroke:'none'}
        const seedDot = {fill: 'white', stroke:'none'}
        const baseLine = {stroke: 'cyan', 'stroke-width': 1}
        const expandLine = {stroke: 'yellow', 'stroke-width': 3}
        const expandDot = {fill: 'yellow', stroke:'none'}

        let prev = perim0[perim0.length-1]
        // SHOULD PEFORM FIRE PERIMETER POINT SEEDING HERE!
        const seedPts = FireGeometry.getSeedPoints(perim0, 100)
        for(let i=0; i<perim0.length; i++) {
            const ctr = perim0[i]
            const next = (i<perim0.length-1) ? perim0[i+1] : perim0[0]

            // BEGIN EXPANSION CALCULATION
            const baseMid = FireGeometry.midPoint(
                prev.east, prev.north, next.east, next.north)
            let bearing = FireGeometry.bearing(
                baseMid.east, baseMid.north, ctr.east, ctr.north)
            const d = FireGeometry.pointSide(ctr.east, ctr.north,
                prev.east, prev.north, next.east, next.north)
            let side = 'C'
            if (d<0) side = 'R'
            if (d>0) side = 'L'
            // Using a clockwise perimeter winding sequence
            // means growth must always be to the 'Left'
            if (side==='R') {
                bearing = (bearing>=180) ? bearing - 180 : bearing + 180
            // Co-linear center point should use left-hand normal
            } else if (side === 'C') {
                // console.log('Point', i, 'Colinear bearing of', bearing)
                bearing = (bearing >= 90) ? bearing - 90 : 270 + bearing
                // console.log('Changed to', bearing)
            }
            const expand = FireGeometry.vectorEndpoint(
                ctr.east, ctr.north, bearing, 100)
            // END EXPANSION CALCULATION
            perim1.push(expand)

            els.push(this.line(prev.east, prev.north, ctr.east, ctr.north, perimLine))
            els.push(this.line(prev.east, prev.north, next.east, next.north, baseLine))
            els.push(this.line(baseMid.east, baseMid.north, ctr.east, ctr.north, baseLine))
            els.push(this.line(ctr.east, ctr.north, expand.east, expand.north, expandLine))
            els.push(this.circle(ctr.east, ctr.north, 6, perimDot))
            els.push(this.circle(expand.east, expand.north, 6, expandDot))
            els.push(this.textMid(expand.east, expand.north, `${side} ${bearing.toFixed(0)}`,
                {'alignment-baseline': 'middle', 'font-size': 24, 'font-weight':'bold'}))
            els.push(this.textMid(ctr.east, ctr.north, i.toFixed(0),
                {'alignment-baseline': 'middle', 'font-size': 24}))
            prev = ctr
        }
        // Draw the new perimeter
        prev = perim1[perim1.length-1]
        for(let i=0; i<perim1.length; i++) {
            const ctr = perim1[i]
            els.push(this.line(prev.east, prev.north, ctr.east, ctr.north, expandLine))
            prev = ctr
        }
        this.perim1 = perim1
        // Draw the proposed seed points
        for(let i=0; i<seedPts.length; i++) {
            const {east, north} = seedPts[i]
            els.push(this.circle(east, north, 6, seedDot))
        }
        return gxmlStr(els)
    }
}