import { EventfulViewport } from "$lib/index.js"

export class EllipseExpansionViewport extends EventfulViewport {
    constructor(svgWidth, svgHeight, headRos, elapsed, timeStep,
            points, // perimeter points at elapsed and elapsed+timeStep
            ignx, igny, ignEast, ignNorth,  // ignition point
            ctrx, ctry, ctrEast, ctrNorth) { // center point
        const length = 4 * headRos * (elapsed+timeStep)
        super(svgWidth, svgHeight, 0, 0,    // width, height, wcx, wcy
            [64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.1, 0.05], 7, 'ft',   // scales, scale, units
            -length, length, -length, length)    // wxMin, wxMax, wyMin, wyMax
        
        this.points = points
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

        // NOTE: points {x,y} are really eastings and northings
        // Ignition, center, and head points
        str += `<circle cx=${this.px(this.head.x)} cy=${this.py(this.head.y)} r=3 fill='yellow'/>`
        // str += `<circle cx=${this.px(this.head.east)} cy=${this.py(this.head.north)} r=3 fill='yellow'/>`
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

    drawGeoPerimeter(pts, color, width) {
        // NOTE: points {x,y} are really eastings and northings!!!
        let {x:x0, y:y0} = pts[0]
        let str = ''
        for(let i=0; i<pts.length; i++) {
            const {x, y} = pts[i]
            str += this.drawPerimeterPt(x0, y0, x, y, color, width)
            x0 = x; y0 = y;
        }
        const last = pts[0]
        str += this.drawPerimeterPt(x0, y0, last.x, last.y, color, width)
        return str
    }
}