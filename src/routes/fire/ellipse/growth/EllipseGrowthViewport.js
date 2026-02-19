import { EventfulViewport } from "$lib/index.js"

export class EllipseGrowthViewport extends EventfulViewport {
    constructor(svgWidth, svgHeight, length, points,
            ignx, igny, ignEast, ignNorth, ctrx, ctry, ctrEast, ctrNorth) {
        super(svgWidth, svgHeight, 0, 0,    // width, height, wcx, wcy
            [64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.1, 0.05], 7, 'ft',   // scales, scale, units
            -length, length, -length, length)    // wxMin, wxMax, wyMin, wyMax
        
        this.points = points
        this.ign = {x: ignx, y: igny, e: ignEast, n: ignNorth}
        this.ctr = {x: ctrx, y: ctry, e: ctrEast, n: ctrNorth}
    }

    drawSvg() {
        const textAttr = "stroke='black' font-size=8 'font-family'='sans-serif' font-weight='light'"
        let str = `<rect x=${this.px(this.wxMin)} y=${this.py(this.wyMax)} `
            + `width=${this.pd(this.wxMax-this.wxMin)} height=${this.pd(this.wyMax-this.wyMin)}
            fill='gray'/>`

        // Perimeters
        str += this.drawPerimGeo(this.points, 'red', 1)

        // Ignition and center points
        str += `<circle cx=${this.px(this.ign.e)} cy=${this.py(this.ign.n)} r=3 fill='blue'/>`
        str += `<circle cx=${this.px(this.ctr.e)} cy=${this.py(this.ctr.n)} r=3 fill='blue'/>`

        // Labels
        str += this.drawZoomCenterLabels(textAttr)
        // str += this.drawEdgeLabels(textAttr)
        str += this.drawAxis(textAttr)
        this.svgContent = str
        return str
    }

    drawPerimPt(x0, y0, x1, y1, width, color) {
        let str = `<circle cx=${this.px(x1)} cy=${this.py(y1)} r='${width}' fill='${color}'/>`
        str += `<line x1=${this.px(x0)} y1=${this.py(y0)} x2=${this.px(x1)} y2=${this.py(y1)} `
            + ` stroke='${color}' stroke-width='${width}'/>`
        return str
    }
    
    drawPerimCart(pts, color, width) {
        let {x:x0, y:y0} = pts[0]
        let str = ''
        for(let i=0; i<pts.length; i++) {
            const {x, y} = pts[i]
            str += this.drawPerimPt(x0, y0, x, y, width, color)
            x0 = x
            y0 = y
        }
        const last = pts[0]
        str += this.drawPerimPt(x0, y0, last.x, last.y, width, color)
        return str
    }

    drawPerimGeo(pts, color, width) {
        let {east:e0, north:n0} = pts[0]
        let str = ''
        for(let i=0; i<pts.length; i++) {
            const {east:e, north:n} = pts[i]
            str += this.drawPerimPt(e0, n0, e, n, width, color)
            e0 = e
            n0 = n
        }
        const last = pts[0]
        str += this.drawPerimPt(e0, n0, last.east, last.north, width, color)
        return str
    }

    // drawNormal(point, width, color) {
    //     const {x, y, east, north, slope, angle, bearing} = pt
    //     let str = `<circle cx=${this.px(x1)} cy=${this.py(y1)} r='${width}' fill='${color}'/>`
    //     str += `<line x1=${this.px(x0)} y1=${this.py(y0)} x2=${this.px(x1)} y2=${this.py(y1)} `
    //         + ` stroke='${color}' stroke-width='${width}'/>`
    //     return str
    // }
}