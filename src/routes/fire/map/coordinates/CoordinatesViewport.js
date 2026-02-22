import { EventfulViewport } from "../EventfulViewport.js"
import { gxmlStr } from "$lib/gxml/gxmlStr.js"

export class CoordinatesViewport extends EventfulViewport {
    constructor(svgWidth, svgHeight, centerX=0, centerY=0, upp=1, units='units', bounds=null) {
        super(svgWidth, svgHeight, centerX, centerY, upp, units, bounds)
    }
    drawSvg() {
        const textProps = {stroke:'black', 'font-size':8, 'font-family':'sans-serif', 'font-weight':'light'}
        const lineProps = {stroke:'black'}

        let x = this.bounds ? this.px(this.bounds.l) : 0
        let y = this.bounds ? this.py(this.bounds.t) : 0
        let width = this.bounds ? this.pd(this.bounds.r-this.bounds.l) : this.width
        let height = this.bounds ? this.pd(this.bounds.t-this.bounds.b) : this.height
        
        this.svgContent = gxmlStr(this.rect(x, y, width, height, 'gray'))
            + this.drawCenterScale(textProps)
            + this.drawAxis(lineProps, textProps)
        return this.svgContent
    }
}
