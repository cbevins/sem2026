import { EventfulViewport } from "./EventfulViewportV2.js"
import { gxmlStr } from "$lib/gxml/gxmlStr.js"

export class ZipViewport extends EventfulViewport {
    constructor(svgWidth, svgHeight, zip) {
        super(svgWidth, svgHeight, 0.2, 0, 0.005, 'dl') // {l:-1.2, r:1.2, t:1.2, b:-1.2})
        this.zip = zip
        // console.log('Zip', zip)
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
        const z = this.zip
        const textProps = {stroke:'black', 'font-size':10, 'font-family':'sans-serif', 'font-weight':'light'}
        const lineProps = {stroke:'black'}
        
        const rad = this.pd(0.01)
        const aDist = this.pd(z.a.dist)
        const bDist = this.pd(z.b.dist)
        const backDist = this.px(z.back.dist)
        const backX = this.px(z.back.x)
        const backY = this.py(z.back.y)
        // const betax = this.px(z.beta.x)
        // const betay = this.py(z.beta.y)
        const centerX = this.px(z.center.x)
        const centerY = this.py(z.center.y)
        // const fx = this.px(z.center.x+z.f.dist)
        // const gx = this.px(z.ignition.x+z.g.dist)
        const headDist = this.px(z.head.dist)
        const headX = this.px(z.head.x)
        const headY = this.py(z.head.y)
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
        els.push(this.circle(centerX, centerY, aDist, 'none', 'black'))
        
        // Parametric ellipse based on length/width
        els.push(this.ellipse(centerX, centerY, aDist, bDist, 'none', 'red'))

        // Ignition, center, head, and back points
        els.push(this.circle(ignX, ignY, 2*rad, 'red'))
        els.push(this.circle(centerX, centerY, rad, 'yellow'))
        els.push(this.circle(backX, backY, rad, 'blue'))
        els.push(this.circle(headX, headY, rad, 'red'))

        // head, back, and center segments of x-axis
        els.push(this.line(ignX, ignY, headX, headY, {stroke:'red', 'stroke-width': 3}))
        els.push(this.line(ignX, ignY, centerX, centerY, {stroke:'cyan'}))
        els.push(this.line(ignX, ignY, backX, backY, {stroke:'blue'}))

        // Calculated ellipse perimeter points
        for(let deg=0; deg<360; deg+=15) {
            const p = z.thetaPoint(deg)
            const x = this.px(p.x)
            const y = this.py(p.y)
            const dist = p.dist.toFixed(2)
            els.push(this.circle(x, y, rad, deg===45?'green':'yellow'))
            if(deg===45) {
                els.push(this.line(centerX, centerY, x, y, {stroke: 'yellow'}))
                els.push(this.line(ignX, ignY, x, y, {stroke:'cyan'}))
                els.push(this.textBeg(100, 100, `Beta Length ${p.betaDist.toFixed(4)}`))
            }   
            const xy = `${p.x.toFixed(2)}, ${p.y.toFixed(2)} `
            els.push(this.textBeg(x+2, y+2, deg.toFixed(0), textProps))
        }
        els.push(this.line(centerX, centerY, this.px(z.center.x+1),
            this.py(z.center.y+1), {stroke:'yellow'}))

        str += gxmlStr(els)
        this.svgContent = str
        return str
    }

}