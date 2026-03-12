import { PcsMapper, gxmlStr } from "$lib/index.js"
import { expandPoint, vectorEndpoint, vectorBearing, midPoint, side, perimSeedPoints }
    from '$lib/index.js'

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
            // + this.addTestCases(this.model.triplets)
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
    addTestCases(triplets) {
        const textProps = {'alignment-baseline': 'middle', 'font-size': 24, 'font-weight':'bold'}
        const perimLine = {stroke: 'red', 'stroke-width': 3}
        const baseLine = {stroke: 'cyan', 'stroke-width': 1}
        const growLine = {stroke: 'yellow', 'stroke-width': 3}
        const els = []
        for (let [prev, ctr, next] of triplets) {
            const baseMid = midPoint(prev, next)
            const bearing = vectorBearing(baseMid, ctr)
            const growMid = midPoint(baseMid, ctr)
            const expand = vectorEndpoint(ctr, bearing, 30)
            const ptSide = side(ctr, prev, next)

            els.push(this.line(prev.east, prev.north, ctr.east, ctr.north, perimLine))
            els.push(this.line(next.east, next.north, ctr.east, ctr.north, perimLine))
            els.push(this.line(prev.east, prev.north, next.east, next.north, baseLine))
            els.push(this.line(baseMid.east, baseMid.north, expand.east, expand.north, growLine))
            this._addPoint(els, prev.east, prev.north, 'A', 'green')
            this._addPoint(els, ctr.east, ctr.north, 'B', 'red')
            this._addPoint(els, next.east, next.north, 'C', 'blue')
            this._addPoint(els, baseMid.east, baseMid.north, 'M', 'yellow')
            els.push(this.textMid(growMid.east, growMid.north, bearing.toFixed(0), textProps))
            els.push(this.textMid(expand.east, expand.north, ptSide, textProps))
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
        function method(pt, time, duration, bearing) {
            const distance = 100
            return vectorEndpoint(pt, bearing, distance)
        }

        const perim1 = []
        const els = []
        const perimLine = {stroke: 'red', 'stroke-width': 3}
        const perimDot = {fill: 'red', stroke:'none'}
        const seedDot = {fill: 'white', stroke:'none'}
        const baseLine = {stroke: 'cyan', 'stroke-width': 1}
        const expandLine = {stroke: 'yellow', 'stroke-width': 3}
        const expandDot = {fill: 'yellow', stroke:'none'}
        const perim1Line = {stroke: 'orange', 'stroke-width': 3}
        const textProps = {'alignment-baseline': 'middle', 'font-size': 24, 'font-weight':'bold'}

        // SHOULD PEFORM FIRE PERIMETER POINT SEEDING HERE!
        const seedPts = perimSeedPoints(perim0, 100)
        
        let prev = perim0[perim0.length-1]
        for(let i=0; i<perim0.length; i++) {
            const ctr = perim0[i]
            const next = (i<perim0.length-1) ? perim0[i+1] : perim0[0]
            const expand = expandPoint(prev, ctr, next, method)
            perim1.push(expand)
            // we redundantly calculate the following for diagramming purposes only
            let baseMid = midPoint(prev, next)          // for diagramming purposes only
            let bearing = vectorBearing(baseMid, ctr)   // for diagramming purposes only
            let ptSide = side(ctr, prev, next)          // for diagramming purposes only

            els.push(this.line(prev.east, prev.north, ctr.east, ctr.north, perimLine))
            els.push(this.line(prev.east, prev.north, next.east, next.north, baseLine))
            els.push(this.line(baseMid.east, baseMid.north, ctr.east, ctr.north, baseLine))
            els.push(this.line(ctr.east, ctr.north, expand.east, expand.north, expandLine))
            els.push(this.circle(ctr.east, ctr.north, 6, perimDot))
            els.push(this.circle(expand.east, expand.north, 6, expandDot))
            els.push(this.textMid(expand.east, expand.north, `${ptSide} ${bearing.toFixed(0)}`, textProps))
            els.push(this.textMid(ctr.east, ctr.north, i.toFixed(0), textProps))
            prev = ctr
        }

        // Draw the new perimeter
        prev = perim1[perim1.length-1]
        for(let i=0; i<perim1.length; i++) {
            const ctr = perim1[i]
            els.push(this.line(prev.east, prev.north, ctr.east, ctr.north, perim1Line))
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