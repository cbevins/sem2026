import { Viewport } from "./Viewport.js"

export class ViewportDemo extends Viewport {
    constructor(svgWidth, svgHeight) {
        super(svgWidth, svgHeight, 200, 200, [0.1, 0.5, 1, 2, 4], 3, 'ft')
    }

    drawSvg() {
        const rx = this.width / 4
        const c1 = this.width / 3
        const c2 = 2 * this.width / 3
        const c3 = this.width /  2
        const y1 = this.height / 3
        const y2 = 2 * this.height / 3

        let str = `<rect x=0 y=0 width=${this.width} height=${this.height} fill='gray'/>`
        str += `<circle cx=${this.px(c1)} cy=${this.py(y1)} r=${this.pd(rx)} fill='red' opacity="0.6"/>`
        str += `<circle cx=${this.px(c2)} cy=${this.py(y1)} r=${this.pd(rx)} fill='yellow' opacity="0.6"/>`
        str += `<circle cx=${this.px(c3)} cy=${this.py(y2)} r=${this.pd(rx)} fill='blue' opacity="0.6"/>`

        const textAttr = "stroke='black' font-size=8 'font-family'='sans-serif' font-weight='light'"
        str += `<text x=10 y=10 text-anchor='start' ${textAttr}>ZOOM ${this.level}</text>`

        this.svgContent = str
        return str
    }
}
