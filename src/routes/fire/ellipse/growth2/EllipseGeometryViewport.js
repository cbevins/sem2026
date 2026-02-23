import { EventfulViewport } from "./EventfulViewport.js"
import { gxmlStr } from "$lib/gxml/gxmlStr.js"

export class EllipseGeometryViewport extends EventfulViewport {
    constructor(svgWidth, svgHeight, ellipseMod) {
        super(svgWidth, svgHeight, 0, 0, 0.005, 'dl', {l:-1, r:1, t:1, b:-1})
        this.mod = ellipseMod
    }
    drawSvg() {
        const e = this.mod
        console.log('drawSvg() f.vhr', e.f.vhr.get())
        const textProps = {stroke:'black', 'font-size':10, 'font-family':'sans-serif', 'font-weight':'light'}
        const lineProps = {stroke:'black'}
        
        const els = []
        let str = this.drawBackdrop('gray')
            + this.drawCenterScale(textProps)
            + this.drawAxis(lineProps, textProps)

        // Subtending circle
        els.push(this.circle(this.px(0), this.py(0),
            this.pd(e.f.vhr.get()), 'none', 'black'))
        
        // Parametric ellipse based on length/width
        els.push(this.ellipse(this.px(0), this.py(0),
            this.pd(e.f.vhr.get()), this.pd(e.h.vhr.get()),
            'none', 'red'))

        // 'f' axis
        els.push(this.line(this.px(0), this.py(0),
            this.px(e.f.vhr.get()), this.py(0), {stroke:'red'}))
        str += gxmlStr(els)
        this.svgContent = str
        return str
    }

}