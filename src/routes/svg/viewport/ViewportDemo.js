import { Viewport } from "./Viewport.js"

export class ViewportDemo extends Viewport {
    constructor(svgWidth, svgHeight) {
        super(svgWidth, svgHeight, 200, 200, [4, 2, 1, 0.5, 0.1], 2, 'ft')
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
        str += this.drawZoomCenterLable(textAttr)
        // str += this.drawEdgeLables(textAttr)
        str += this.drawAxis(textAttr)
        this.svgContent = str
        return str
    }
    drawZoomCenterLable(textAttr) {
        const zoom = `Zoom ${this.level}, Scale ${this.upp} ${this.units}/pixel`
        const center = `Center [${this.wcx}, ${this.wcy}]`
        let str = `<text x=${this.width/4} y=10 text-anchor='middle' ${textAttr}>${zoom}</text>`
        str += `<text x=${3*this.width/4} y=10 text-anchor='middle' ${textAttr}>${center}</text>`
        return str
    }
    drawEdgeLables(textAttr) {
        let str = ''
        str += `<text x=20 y=10 text-anchor='start' ${textAttr}>${this.wtop()}</text>`
        str += `<text x=${this.width-20} y=10 text-anchor='end' ${textAttr}>${this.wtop()}</text>`

        str += `<text x=5 y=10 text-anchor='end' transform='rotate(270,10,10)' ${textAttr}>${this.wleft()}</text>`
        str += `<text x=${this.width-10} y=10 text-anchor='start' transform='rotate(90,${this.width-10},10)' ${textAttr}>${this.wright()}</text>`
        
        str += `<text x=5 y=${this.height/2} text-anchor='start' transform='rotate(270,10,${this.height/2})' ${textAttr}>${this.wleft()}</text>`
        str += `<text x=${this.width-10} y=${this.height/2} text-anchor='end' transform='rotate(90,${this.width-10},${this.height/2})' ${textAttr}>${this.wright()}</text>`
        
        str += `<text x=20 y=${this.height-5} text-anchor='start' ${textAttr}>${this.wbottom()}</text>`
        str += `<text x=${this.width-20} y=${this.height-5} text-anchor='end' ${textAttr}>${this.wbottom()}</text>`
        
        str += `<text x=5 y=${this.height-10} text-anchor='start' transform='rotate(270,10,${this.height-10})' ${textAttr}>${this.wleft()}</text>`
        str += `<text x=${this.width-10} y=${this.height-10} text-anchor='end' transform='rotate(90,${this.width-10},${this.height-10})' ${textAttr}>${this.wright()}</text>`

        return str
    }
    drawAxis(textAttr) {
        const w = this.width
        const mx = w/2
        const h = this.height
        const my = h/2
        let str = `<line x1=0 y1=${my} x2=${w} y2=${my} stroke='black'/>`
        str += `<line x1=${mx} y1=0 x2=${mx} y2=${h} stroke='black'/>`
        str += `<text x=2 y=${my-2} text-anchor='start' ${textAttr}>${this.wleft()}</text>`
        str += `<text x=${w-2} y=${my-2} text-anchor='end' ${textAttr}>${this.wright()}</text>`
        str += `<text x=${mx} y=10 text-anchor='start' transform='rotate(270,${mx+8},10)' ${textAttr}>${this.wtop()}</text>`
        str += `<text x=${mx+8} y=${h-2} text-anchor='start' transform='rotate(270,${mx+8},${h-2})'${textAttr}>${this.wbottom()}</text>`
        return str
    }
}
