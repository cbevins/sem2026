import { EventfulViewport } from "./EventfulViewport.js"
import { gxmlStr } from "$lib/gxml/gxmlStr.js"
import {Model} from './model.js'

export class View extends EventfulViewport {
    constructor(svgWidth, svgHeight, rate=0.5, time=1) {
        super(svgWidth, svgHeight, 0.0, 0, 0.01, 'dl', {l:-1.2, r:1.2, t:1.2, b:-1.2})
        this.rate = rate
        this.time = time
    }

    drawSvg() {
        const textProps = {stroke:'black', 'font-size':10, 'font-family':'sans-serif', 'font-weight':'light'}
        // eslint-disable-next-line no-unused-vars
        const lineProps = {stroke:'black'}
        const rad = this.pd(0.01)   // 'dot' size
        const color = {head: 'red', back: 'blue', perim: 'yellow', ign: 'magenta', center: 'yellow'}

        const els = []
        let str = this.drawBackdrop('gray')
            + this.drawCenterScale(textProps)
            + this.drawAxis(lineProps, textProps)
            + this.drawController(this.width-50,50, 50)
        // Subtending circle
        // els.push(this.circle(centerx, centery, this.pd(e.f.vhr.get()), 'none', 'black'))
        
        const rate = 0.5
        for(let time=1; time<3; time+=1) {
            const model = new Model(rate, time)
            const {a, b, center, ignition, head, back} = model
            const aDist = this.pd(a)
            const bDist = this.pd(b)
            const centerx = this.px(center.x)
            const centery = this.py(center.y)
            const ignx = this.px(ignition.x)
            const igny = this.py(ignition.y)
            const headx = this.px(head.x)
            const heady = this.py(head.y)
            const backx = this.px(back.x)
            const backy = this.py(back.y)

            // Parametric ellipse based on length/width
            els.push(this.ellipse(centerx, centery, aDist, bDist, 'none', color.head))

            // head and back axis
            els.push(this.line(centerx, centery, headx, heady, {stroke: color.head}))
            els.push(this.line(centerx, centery, backx, backy, {stroke: color.back}))

            els.push(this.circle(ignx, igny, rad, color.ign))
            els.push(this.circle(centerx, centery, rad, color.center))
            els.push(this.circle(headx, heady, rad, color.head))
            els.push(this.circle(backx, backy, rad, color.back))
        }
        str += gxmlStr(els)
        this.svgContent = str
        return str
    }

}