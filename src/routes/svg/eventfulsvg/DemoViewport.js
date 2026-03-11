import { EventfulViewport } from '$lib/index.js'

export class DemoViewport extends EventfulViewport {
    constructor(svgWidth, svgHeight) {
        super(svgWidth, svgHeight, 200, 200,
            [16, 8, 4, 2, 1, 0.5, 0.1, 0.05], 4, 'ft',
            0, 400, 0, 400)
        // Additional props manipulated by parent classes or components
        this.lwRatio = 1
        this.bearing = 0
    }

    drawSvg() {
        const rx = this.pd(this.width / 4)
        const c1 = this.px(this.width / 3)
        const c2 = this.px(2 * this.width / 3)
        const c3 = this.px(this.width /  2)
        const y1 = this.py(this.height / 3)
        const y2 = this.py(2 * this.height / 3)
        const ry = this.pd(rx / this.lwRatio)
        let str = `<rect x=${this.px(this.wxMin)} y=${this.py(this.wyMax)} width=${this.pd(this.width)} height=${this.pd(this.height)} fill='gray'/>`
        str += `<ellipse cx=${c1} cy=${y1} rx=${rx} ry=${ry} fill='red' opacity="0.6" transform="rotate(${this.bearing}, ${c1}, ${y1})"/>`
        str += `<ellipse cx=${c2} cy=${y1} rx=${rx} ry=${ry} fill='yellow' opacity="0.6" transform="rotate(${this.bearing}, ${c2}, ${y1})"/>`
        str += `<ellipse cx=${c3} cy=${y2} rx=${rx} ry=${ry} fill='blue' opacity="0.6" transform="rotate(${this.bearing}, ${c3}, ${y2})"/>`

        const textAttr = "stroke='black' font-size=8 'font-family'='sans-serif' font-weight='light'"
        str += this.drawZoomCenterLabels(textAttr)
        // str += this.drawEdgeLables(textAttr)
        str += this.drawAxis(textAttr)
        this.svgContent = str
        return str
    }
}
