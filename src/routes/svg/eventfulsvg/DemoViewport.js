import {EventfulViewport} from './EventfulViewport.js'

export class DemoViewport extends EventfulViewport {
    constructor(svgWidth, svgHeight) {
        super(svgWidth, svgHeight, 200, 200,
            [16, 8, 4, 2, 1, 0.5, 0.1, 0.05], 4, 'ft',
            0, 400, 0, 400)
    }

    drawSvg() {
        const rx = this.width / 4
        const c1 = this.width / 3
        const c2 = 2 * this.width / 3
        const c3 = this.width /  2
        const y1 = this.height / 3
        const y2 = 2 * this.height / 3

        let str = `<rect x=${this.px(this.wxMin)} y=${this.py(this.wyMax)} width=${this.pd(this.width)} height=${this.pd(this.height)} fill='gray'/>`
        str += `<circle cx=${this.px(c1)} cy=${this.py(y1)} r=${this.pd(rx)} fill='red' opacity="0.6"/>`
        str += `<circle cx=${this.px(c2)} cy=${this.py(y1)} r=${this.pd(rx)} fill='yellow' opacity="0.6"/>`
        str += `<circle cx=${this.px(c3)} cy=${this.py(y2)} r=${this.pd(rx)} fill='blue' opacity="0.6"/>`

        const textAttr = "stroke='black' font-size=8 'font-family'='sans-serif' font-weight='light'"
        str += this.drawZoomCenterLabels(textAttr)
        // str += this.drawEdgeLables(textAttr)
        str += this.drawAxis(textAttr)
        this.svgContent = str
        return str
    }
}
