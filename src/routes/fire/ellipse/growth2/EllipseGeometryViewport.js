import { EventfulViewport } from "./EventfulViewportV2.js"
import { gxmlStr } from "$lib/gxml/gxmlStr.js"

export class EllipseGeometryViewport extends EventfulViewport {
    constructor(svgWidth, svgHeight, ellipseMod) {
        super(svgWidth, svgHeight, 0.2, 0, 0.005, 'dl', {l:-1.2, r:1.2, t:1.2, b:-1.2})
        this.mod = ellipseMod
    }
    bearingEndpoint(x, y, bearing, dist) {
        const radians = bearing * Math.PI / 180
        const pt = {
            x: x + dist * Math.cos(radians),
            y: y + dist * Math.sin(radians)
        }
        console.log(`endpoint(${x.toFixed(2)}, ${y.toFixed(2)}, ${bearing}, ${dist}) => [${pt.x.toFixed(2)}, ${pt.y.toFixed(2)}]`)
        return pt
    }

    drawSvg() {
        const e = this.mod
        const textProps = {stroke:'black', 'font-size':10, 'font-family':'sans-serif', 'font-weight':'light'}
        // eslint-disable-next-line no-unused-vars
        const lineProps = {stroke:'black'}
        
        const rad = this.pd(0.01)
        const backx = this.px(e.back.x.get())
        const backy = this.py(e.back.y.get())
        const betax = this.px(e.beta.x.get())
        const betay = this.py(e.beta.y.get())
        const centerx = this.px(e.center.x.get())
        const centery = this.py(e.center.y.get())
        const fx = this.px(e.center.x.get()+e.f.dist.get())
        const gx = this.px(e.ignition.x.get()+e.g.dist.get())
        const headx = this.px(e.head.x.get())
        const heady = this.py(e.head.y.get())
        const ignx = this.px(e.ignition.x.get())
        const igny = this.py(e.ignition.y.get())
        const psix = this.px(e.psi.x.get())
        const psiy = this.py(e.psi.y.get())
        const thetax = this.px(e.theta.x.get())
        const thetay = this.py(e.theta.y.get())
        const sub = this.bearingEndpoint(e.center.x.get(), e.center.y.get(),
            e.theta.angle.get(), 1.1)
        const thetax2 = this.px(sub.x)
        const thetay2 = this.py(sub.y)

        const els = []
        let str = this.drawBackdrop('gray')
            + this.drawCenterScale(textProps)
            // + this.drawAxis(lineProps, textProps)

        // Subtending circle
        els.push(this.circle(centerx, centery, this.pd(e.f.vhr.get()), 'none', 'black'))
        
        // Parametric ellipse based on length/width
        els.push(this.ellipse(centerx, centery, this.pd(e.f.vhr.get()), this.pd(e.h.vhr.get()),
            'none', 'red'))

        // 'f', 'g', 'back' axis
        els.push(this.line(centerx, centery, fx, this.py(0), {stroke:'red'}))
        els.push(this.line(ignx, igny, gx, this.py(0), {stroke:'cyan'}))
        els.push(this.line(ignx, igny, backx, backy, {stroke:'blue'}))
        // theta
        els.push(this.line(centerx, centery, thetax, thetay, {stroke:'yellow'}))
        els.push(this.circle(thetax, thetay, rad, 'yellow'))
        els.push(this.line(centerx, centery, thetax2, thetay2, {stroke:'yellow'}))

        // beta
        els.push(this.line(ignx, igny, betax, betay, {stroke:'magenta'}))
        els.push(this.circle(betax, betay, rad, 'magenta'))

        // psi
        els.push(this.circle(psix, psiy, rad, 'blue'))

        els.push(this.circle(ignx, igny, rad, 'red'))
        els.push(this.circle(centerx, centery, rad, 'yellow'))
        els.push(this.circle(headx, heady, rad, 'cyan'))


        str += gxmlStr(els)
        this.svgContent = str
        return str
    }

}