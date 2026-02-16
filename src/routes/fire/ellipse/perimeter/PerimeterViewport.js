import { Viewport } from "$lib/index.js"

export class PerimeterViewport extends Viewport {
    constructor(svgWidth, svgHeight, length,
            thetaPts=[], psiPts=[], betaPts=[],
            ignx, igny, centerx, centery,
            drawTheta=true, drawPsi=true, drawBeta=true) {

        super(svgWidth, svgHeight, 0, 0,    // width, height, wcx, wcy
            [64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.1, 0.05], 7, 'ft',   // scales, scale, units
            -length, length, -length, length)    // wxMin, wxMax, wyMin, wyMax
        
        this.beta = {pts: betaPts, draw: drawBeta}
        this.psi = {pts: psiPts, draw: drawPsi}
        this.theta = {pts: thetaPts, draw: drawTheta}
        this.ign = {x: ignx, y: igny}
        this.ctr = {x: centerx, y: centery}
    }

    drawSvg() {
        const textAttr = "stroke='black' font-size=8 'font-family'='sans-serif' font-weight='light'"
        let str = `<rect x=${this.px(this.wxMin)} y=${this.py(this.wyMax)} `
            + `width=${this.pd(this.wxMax-this.wxMin)} height=${this.pd(this.wyMax-this.wyMin)} fill='green'/>`

        // Perimeters
        if (this.beta.draw) str += this.drawPerim(this.beta.pts, 'red', 3)
        if (this.theta.draw) str += this.drawPerim(this.theta.pts, 'yellow', 2)
        if (this.psi.draw) str += this.drawPerim(this.psi.pts, 'blue', 1)

        // Ignition and center points
        str += `<circle cx=${this.px(this.ign.x)} cy=${this.py(this.ign.y)} r=4 fill='red'/>`
        str += `<circle cx=${this.px(this.ctr.x)} cy=${this.py(this.ctr.y)} r=4 fill='yellow'/>`

        // Beta 15-degree line
        const degStep =  this.beta.pts[1].deg - this.beta.pts[0].deg
        const i15 = 15/degStep
        const beta15 = this.beta.pts[i15]
        // Line from ignition point to beta at 15 degrees from head
        str += `<line x1=${this.px(this.ign.x)} y1=${this.py(this.ign.y)} `
            + ` x2=${this.px(beta15.x)} y2=${this.py(beta15.y)} stroke='red'/>`
        // Perimeter point for beta=15
        str += `<circle cx=${this.px(beta15.x)} cy=${this.py(beta15.y)} r=3 fill='red'/>`

        const theta15 = this.theta.pts[i15]
        // Line from ellipse center to theta at 15 degrees from head -->
        str += `<line x1=${this.px(this.ctr.x)} y1=${this.py(this.ctr.y)} `
            + `x2=${this.px(theta15.x)} y2=${this.py(theta15.y)} stroke='yellow' stroke-width='3'/>`
        // Perimeter point for theta=15 (should be ellipse head) -->
        str += `<circle cx=${this.px(theta15.x)} cy=${this.py(theta15.y)} r='4' fill='yellow'/>`

        // Labels
        str += this.drawZoomCenterLabels(textAttr)
        // str += this.drawEdgeLabels(textAttr)
        str += this.drawAxis(textAttr)
        this.svgContent = str
        return str
    }

    drawPerim(pts, color, width) {
        let {x:x1, y:y1} = pts[0]
        let str = ''
        for(let i=0; i<pts.length; i++) {
            const {x, y} = pts[i]
            str += `<circle cx=${this.px(x)} cy=${this.py(y)} r='${width}' fill='${color}'/>`
            str += `<line x1=${this.px(x1)} y1=${this.py(y1)} x2=${this.px(x)} y2=${this.py(y)} `
                + ` stroke='${color}' stroke-width='${width}'/>`
            x1 = x
            y1 = y
        }
        return str
    }
}