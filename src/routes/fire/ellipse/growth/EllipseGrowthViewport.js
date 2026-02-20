import { EventfulViewport } from "$lib/index.js"
import { bearingEndpoint } from './Geometry.js'

export class EllipseGrowthViewport extends EventfulViewport {
    constructor(svgWidth, svgHeight, headRos, elapsed, timeStep,
            points, points2,    // perimeter points at elapsed and elapsed+timeStep
            ignx, igny, ignEast, ignNorth,  // ignition point
            ctrx, ctry, ctrEast, ctrNorth) { // center point
        const length = 4 * headRos * (elapsed+timeStep)
        super(svgWidth, svgHeight, 0, 0,    // width, height, wcx, wcy
            [64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.1, 0.05], 7, 'ft',   // scales, scale, units
            -length, length, -length, length)    // wxMin, wxMax, wyMin, wyMax
        
        this.points = points
        this.points2 = points2
        this.ign = {x: ignx, y: igny, e: ignEast, n: ignNorth}
        this.ctr = {x: ctrx, y: ctry, e: ctrEast, n: ctrNorth}
        this.head = this.points[0]
        this.headRos = headRos
        this.elapsed = elapsed
        this.timeStep = timeStep
    }

    drawSvg() {
        const textAttr = "stroke='black' font-size=8 'font-family'='sans-serif' font-weight='light'"
        let str = `<rect x=${this.px(this.wxMin)} y=${this.py(this.wyMax)} `
            + `width=${this.pd(this.wxMax-this.wxMin)} height=${this.pd(this.wyMax-this.wyMin)}
            fill='gray'/>`
        str += this.drawZoomCenterLabels(textAttr)

        // Perimeters
        str += this.drawGeoPerimeter(this.points, 'red', 1)
        str += this.drawExpansionVectors(this.points, 'cyan', 1)
        str += this.drawGeoPerimeter(this.points2, 'green', 1)

        // Ignition, center, and head points
        str += `<circle cx=${this.px(this.head.east)} cy=${this.py(this.head.north)} r=3 fill='yellow'/>`
        str += `<circle cx=${this.px(this.ign.e)} cy=${this.py(this.ign.n)} r=3 fill='red'/>`
        str += `<circle cx=${this.px(this.ctr.e)} cy=${this.py(this.ctr.n)} r=3 fill='blue'/>`

        // Labels
        // str += this.drawEdgeLabels(textAttr)
        str += this.drawAxis(textAttr)
        this.svgContent = str
        return str
    }

    drawPerimeterPt(x0, y0, x1, y1, color, width) {
        let str = `<circle cx=${this.px(x1)} cy=${this.py(y1)} r='${width+1}' fill='${color}'/>`
        str += `<line x1=${this.px(x0)} y1=${this.py(y0)} x2=${this.px(x1)} y2=${this.py(y1)} `
            + ` stroke='${color}' stroke-width='${width}'/>`
        return str
    }
    
    drawCartesianPerimeter(pts, color, width) {
        let {x:x0, y:y0} = pts[0]
        let str = ''
        for(let i=0; i<pts.length; i++) {
            const {x, y} = pts[i]
            str += this.drawPerimeterPt(x0, y0, x, y, color, width)
            x0 = x; y0 = y
        }
        const last = pts[0]
        str += this.drawPerimeterPt(x0, y0, last.x, last.y, color, width)
        return str
    }

    drawGeoPerimeter(pts, color, width) {
        let {east:e0, north:n0} = pts[0]
        let str = ''
        for(let i=0; i<pts.length; i++) {
            const {east:e, north:n} = pts[i]
            str += this.drawPerimeterPt(e0, n0, e, n, color, width)
            e0 = e; n0 = n
        }
        const last = pts[0]
        str += this.drawPerimeterPt(e0, n0, last.east, last.north, color, width)
        return str
    }
    
    drawExpansionVectors(pts, color, width) {
        let str = ''
        const headDist =  this.headRos * this.timeStep
        for(let i=0; i<pts.length; i++) {
            const pt = pts[i]
            const beg = {x: pt.east, y: pt.north}
            let end = bearingEndpoint(beg, pt.bearing, headDist * pt.betaVhr)
            str += this.drawExpansionPt(beg, end, 'cyan', 3)
            end = bearingEndpoint(beg, pt.bearing, headDist * pt.psiVhr)
            str += this.drawExpansionPt(beg, end, 'magenta', 2)
            end = bearingEndpoint(beg, pt.bearing, headDist * pt.thetaVhr)
            str += this.drawExpansionPt(beg, end, 'yellow', 1)
        }
        return str
    }
    
    drawExpansionPt(beg, end, color, width) {
        let str = `<circle cx=${this.px(end.x)} cy=${this.py(end.y)} r='${width}' fill='${color}'/>`
        str += `<line x1=${this.px(beg.x)} y1=${this.py(beg.y)} x2=${this.px(end.x)} y2=${this.py(end.y)} `
        + ` stroke='${color}' stroke-width='${width}'/>`
        return str
    }
}