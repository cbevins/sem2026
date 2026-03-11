import { EventfulViewport } from "./EventfulViewportV2.js"
import { gxmlStr } from "$lib/gxml/gxmlStr.js"

export class CoordinatesViewport extends EventfulViewport {
    constructor(svgWidth, svgHeight, points, centerX=0, centerY=0, upp=1, units='units', bounds=null) {
        super(svgWidth, svgHeight, centerX, centerY, upp, units, bounds)
        this.points = points
    }
    midPoint(a, b) {
        return {x: (a.x + b.x)/2, y: (a.y + b.y)/2}
    }

    drawSvg(n) {
        if (n===0) return this.drawSvg0()
            else return this.drawSvg1()
    }

    // Draws beraing at midpoint
    drawSvg0() {
        const textProps = {stroke:'black', 'font-size':10, 'font-family':'sans-serif', 'font-weight':'light'}
        const lineProps = {stroke:'black'}
        
        let str = this.drawBackdrop('gray')
            + this.drawCenterScale(textProps)
            + this.drawAxis(lineProps, textProps)
        str += this.reflect(this.points, textProps)
        this.svgContent = str
        return str
    }
    reflect(pairs, textProps) {
        function fmten(p) { return `${p.pt} [${p.e}, ${p.n}]` }
        function fmtxy(p) { return `${p.pt} [${p.x}, ${p.y}]` }

        const els = []
        let label, mid
        let fill = 'green'
        let stroke = 'green'
        for(let pair of pairs) {
            let [p0, p1] = pair
            // First draw the PCS point easting, northing, bearing
            // Line segment and midpoint marker
            els.push(this.line(this.px(p0.e), this.py(p0.n),
                this.px(p1.e), this.py(p1.n), {stroke}))
            mid = this.midPoint({x: p0.e, y: p0.n}, {x: p1.e, y: p1.n})
            els.push(this.circle(this.px(mid.x), this.py(mid.y), 3, fill))
            // Beginning marker and label
            els.push(this.circle(this.px(p0.e), this.py(p0.n), 6, fill))
            els.push(this.textMid(this.px(p0.e), this.py(p0.n), fmten(p0), textProps))
            // Vertical and horizontal baselines
            els.push(this.line(this.px(p0.e), this.py(p0.n),
                this.px(p0.e), 0, {stroke, 'stroke-dasharray': "4"}))
            els.push(this.line(this.px(p0.e), this.py(p0.n),
                this.width, this.py(p0.n), {stroke, 'stroke-dasharray': "4"}))
            // End point marker and label
            els.push(this.circle(this.px(p1.e), this.py(p1.n), 6, fill))
            els.push(this.textMid(this.px(p1.e), this.py(p1.n), fmten(p1), textProps))
            // Place angle and bearing values at midpoint
            label = `b = ${p0.b.toFixed(1)}, a = ${p0.a.toFixed(1)}`
            els.push(this.textMid(this.px(mid.x), this.py(mid.y), label, textProps))

            // The draw the reflected Cartesian version
            fill = 'red'
            stroke = 'red'
            // Line segment and midpoint marker
            els.push(this.line(this.px(p1.x), this.py(p0.y),
                this.px(p1.x), this.py(p1.y), {stroke}))
            mid = this.midPoint({x: p0.x, y: p0.y}, {x: p1.x, y: p1.y})
            els.push(this.textMid(this.px(mid.x), this.py(mid.y), label, textProps))
            // Beginning marker and label
            els.push(this.circle(this.px(p0.x), this.py(p0.y), 3, fill))
            els.push(this.textMid(this.px(p0.x), this.py(p0.y), fmtxy(p1), textProps))
            // Vertical and horizontal baselines
            els.push(this.line(this.px(p0.x), this.py(p0.y),
                this.px(p0.x), 0, {stroke, 'stroke-dasharray': "4"}))
            els.push(this.line(this.px(p0.x), this.py(p0.y),
                this.width, this.py(p0.y), {stroke, 'stroke-dasharray': "4"}))
            // End point marker and label
            els.push(this.circle(this.px(p1.x), this.py(p1.y), 3, fill))
            els.push(this.textMid(this.px(p1.x), this.py(p1.y), fmtxy(p1), textProps))
            // Place angle and bearing values at midpoint
            els.push(this.circle(this.px(mid.x), this.py(mid.y), 3, fill))
            label = `b = ${p1.b.toFixed(1)}, a = ${p1.a.toFixed(1)}`
        }
        return gxmlStr(els)
    }

    drawSvg1() {
        const textProps = {stroke:'black', 'font-size':8, 'font-family':'sans-serif', 'font-weight':'light'}
        const lineProps = {stroke:'black'}
        
        let str = this.drawBackdrop('gray')
            + this.drawCenterScale(textProps)
            + this.drawAxis(lineProps, textProps)

        const els = []
        for(let i=0; i<this.points.length; i++) {
            let {x, y, e, n, idx, an, ap, bn, bp, next, prev} = this.points[i]
            els.push(this.circle(this.px(x), this.py(y), 8, 'red'))
            els.push(this.line(this.px(x), this.py(y),
                this.px(next.x), this.py(next.y), {stroke: 'red'}))
            els.push(this.text(this.px(x), this.py(y), idx.toString(), textProps))

            els.push(this.circle(this.px(e), this.py(n), 6, 'green'))
            els.push(this.line(this.px(e), this.py(n),
                this.px(next.e), this.py(next.n), {stroke: 'green'}))
            els.push(this.text(this.px(e), this.py(n), idx.toString(), textProps))
        }
        str += gxmlStr(els)
        this.svgContent = str
        return str
    }
}
