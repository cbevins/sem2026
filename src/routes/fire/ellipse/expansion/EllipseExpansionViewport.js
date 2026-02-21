import { EventfulViewport } from "$lib/index.js"

export class EllipseExpansionViewport extends EventfulViewport {
    constructor(svgWidth, svgHeight, headRos, elapsed, timeStep,
            fireRing1, fireRing2, // perimeter points at elapsed and elapsed+timeStep
            ignx, igny, ignEast, ignNorth,  // ignition point
            ctrx, ctry, ctrEast, ctrNorth) { // center point
        const length = 4 * headRos * (elapsed+timeStep)
        super(svgWidth, svgHeight, 0, 0,    // width, height, wcx, wcy
            [64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.1, 0.05], 7, 'ft',   // scales, scale, units
            -length, length, -length, length)    // wxMin, wxMax, wyMin, wyMax
        
        this.ctr = {x: ctrx, y: ctry, e: ctrEast, n: ctrNorth}
        this.elapsed = elapsed
        this.fireRing1 = fireRing1
        this.fireRing2 = fireRing2
        this.headRos = headRos
        this.ign = {x: ignx, y: igny, e: ignEast, n: ignNorth}
        this.timeStep = timeStep
    }

    drawSvg() {
        const textAttr = "stroke='black' font-size=8 'font-family'='sans-serif' font-weight='light'"
        let str = `<rect x=${this.px(this.wxMin)} y=${this.py(this.wyMax)} `
            + `width=${this.pd(this.wxMax-this.wxMin)} height=${this.pd(this.wyMax-this.wyMin)}
            fill='gray'/>`
        str += this.drawZoomCenterLabels(textAttr)

        // Perimeters
        str += this.drawPerimeter(this.fireRing1, 'red', 1)
        str += this.drawPerimeter(this.fireRing2, 'cyan', 1)

        // NOTE: points {x,y} are really eastings and northings
        // Ignition, center, and head points
        str += `<circle cx=${this.px(this.fireRing1.head.x)} cy=${this.py(this.fireRing1.head.y)} r=3 fill='yellow'/>`
        str += `<circle cx=${this.px(this.ign.e)} cy=${this.py(this.ign.n)} r=3 fill='red'/>`
        str += `<circle cx=${this.px(this.ctr.e)} cy=${this.py(this.ctr.n)} r=3 fill='blue'/>`

        // Labels
        // str += this.drawEdgeLabels(textAttr)
        str += this.drawAxis(textAttr)
        this.svgContent = str
        return str
    }

    drawPerimeter(fireRing, color, width) {
        // NOTE: FireRing point {x,y} are really eastings and northings!!!
        let str = ''
        let node = fireRing.head
        do {
            str += this.drawPerimeterPt(node.prev.x, node.prev.y, node.x, node.y, color, width)
            node = node.next
        } while(node !== fireRing.head.prev)
        return str
    }

    drawPerimeterPt(x0, y0, x1, y1, color, width) {
        let str = `<circle cx=${this.px(x1)} cy=${this.py(y1)} r='${width+1}' fill='${color}'/>`
        str += `<line x1=${this.px(x0)} y1=${this.py(y0)} x2=${this.px(x1)} y2=${this.py(y1)} `
            + ` stroke='${color}' stroke-width='${width}'/>`
        return str
    }
}