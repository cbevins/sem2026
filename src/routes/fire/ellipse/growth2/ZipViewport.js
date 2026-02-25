import { EventfulViewport } from "./EventfulViewport.js"
import { gxmlStr } from "$lib/gxml/gxmlStr.js"

export class ZipViewport extends EventfulViewport {
    constructor(svgWidth, svgHeight, zip) {
        super(svgWidth, svgHeight, 0.2, 0, 0.005, 'dl', {l:-1.2, r:1.2, t:1.2, b:-1.2})
        this.zip = zip
        console.log('Zip', zip)
    }
    bearingEndpoint(x, y, bearing, dist) {
        const radians = bearing * Math.PI / 180
        const pt = {
            x: x + dist * Math.cos(radians),
            y: y + dist * Math.sin(radians)
        }
        consolz.log(`endpoint(${x.toFixed(2)}, ${y.toFixed(2)}, ${bearing}, ${dist}) => [${pt.x.toFixed(2)}, ${pt.y.toFixed(2)}]`)
        return pt
    }

    drawSvg() {
        const z = this.zip
        const textProps = {stroke:'black', 'font-size':10, 'font-family':'sans-serif', 'font-weight':'light'}
        const lineProps = {stroke:'black'}
        
        const rad = this.pd(0.01)
        const a1Dist = this.pd(z.a1.dist)
        const b1Dist = this.pd(z.b1.dist)
        // const backx = this.px(z.back.x)
        // const backy = this.py(z.back.y)
        // const betax = this.px(z.beta.x)
        // const betay = this.py(z.beta.y)
        const centerX = this.px(z.center.x)
        const centerY = this.py(z.center.y)
        // const fx = this.px(z.center.x+z.f.dist)
        // const gx = this.px(z.ignition.x+z.g.dist)
        // const headx = this.px(z.head.x)
        // const heady = this.py(z.head.y)
        const ignX = this.px(z.ign.x)
        const ignY = this.py(z.ign.y)
        // const psix = this.px(z.psi.x)
        // const psiy = this.py(z.psi.y)
        // const thetax = this.px(z.theta.x)
        // const thetay = this.py(z.theta.y)
        // const sub = this.bearingEndpoint(z.center.x, z.center.y,
        //     z.theta.angle, 1.1)
        // const thetax2 = this.px(sub.x)
        // const thetay2 = this.py(sub.y)

        const els = []
        let str = this.drawBackdrop('gray')
            + this.drawCenterScale(textProps)
            // + this.drawAxis(lineProps, textProps)

        // Subtending circle
        els.push(this.circle(centerX, centerY, a1Dist, 'none', 'black'))
        
        // Parametric ellipse based on length/width
        els.push(this.ellipse(centerX, centerY, a1Dist, b1Dist, 'none', 'red'))

        // // 'f', 'g', 'back' axis
        // els.push(this.line(centerx, centery, fx, this.py(0), {stroke:'red'}))
        // els.push(this.line(ignx, igny, gx, this.py(0), {stroke:'cyan'}))
        // els.push(this.line(ignx, igny, backx, backy, {stroke:'blue'}))
        // // theta
        // els.push(this.line(centerx, centery, thetax, thetay, {stroke:'yellow'}))
        // els.push(this.circle(thetax, thetay, rad, 'yellow'))
        // els.push(this.line(centerx, centery, thetax2, thetay2, {stroke:'yellow'}))

        // // beta
        // els.push(this.line(ignx, igny, betax, betay, {stroke:'magenta'}))
        // els.push(this.circle(betax, betay, rad, 'magenta'))

        // // psi
        // els.push(this.circle(psix, psiy, rad, 'blue'))

        els.push(this.circle(ignX, ignY, rad, 'red'))
        els.push(this.circle(centerX, centerY, rad, 'yellow'))
        // els.push(this.circle(headx, heady, rad, 'cyan'))


        str += gxmlStr(els)
        this.svgContent = str
        return str
    }

}