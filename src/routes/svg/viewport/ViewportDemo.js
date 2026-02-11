import { Viewport } from "./Viewport.js"

export class ViewportDemo extends Viewport {
    constructor(svgWidth, svgHeight, centerX=0, centerY=0, unitsPerPixel=1,
            units='', scales=[1], level=0) {
        super(svgWidth, svgHeight, centerX, centerY, unitsPerPixel, units,
            scales, level)
    }
        
    drawSvg() {
        const cx = this.width/2
        const cy = this.height/2
        const fill = ['red', 'green', 'blue']
        const textAttr = "stroke='black' font-size=10 text-anchor='middle'"
            + " 'font-family'='sans-serif' font-weight='light'"
        let str = `<rect x=0 y=0 width=${this.width} height=${this.height} fill='green'/>`
        str += `<ellipse cx=${cx} cy=${cy} rx=200 ry=200 fill='blue'/>`
        str += `<ellipse cx=${cx} cy=${cy} rx=180 ry=160 fill='yellow'/>`
        str += `<ellipse cx=${cx} cy=${cy} rx=160 ry=120 fill='magenta'/>`
        str += `<ellipse cx=${cx} cy=${cy} rx=120 ry=80 fill='cyan'/>`
        str += `<ellipse cx=${cx} cy=${cy} rx=80 ry=80 fill='red'/>`
        this.svgContent = str
        return str
    }
}
