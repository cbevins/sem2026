import { PcsMapper } from "$lib/index.js"
import { gxmlStr } from "$lib/index.js"

export class FireGrowth02View extends PcsMapper {
    constructor(pcs, model, frames=0) {
        super(pcs.width, pcs.height,
            pcs.west, pcs.east, pcs.south, pcs.north,
            pcs.upp, pcs.units, pcs.focusEast, pcs.focusNorth)

        this.frames = frames
        this.model = model
        this.pcs = pcs
    }
    
    content(degStep, frame) {
        let str = this.addBoundsRect({fill:'khaki'})
        + this.animate(frame)
        // + this.animate1(degStep, frame)
            + this.addGridLines(100, 100, 0)
        this.svgContent = str
        return str
    }

    // Uses array of perimeter points (rather than parametric circel equations)
    // to expand the fire perimeter at each time step
    animate(frame) {
        const phases = 6
        const times = Math.trunc(frame/phases) + 1  // Starts with 1 times and 2 perims
        this.model.initPerims()
        this.model.grow(times)
        const perims = this.model.perims
        const els = []
        let str = ''
        // First draw all previous time step perimeters in black
        for (let time=0; time<times-1; time++) {
            str += this.drawPerimeter(perims[time], time, {stroke:'black'})
        }
        const prev = perims[times-1]
        const next = perims[times]

        // Now draw current perimeter
        str += this.drawPerimeter(perims[times-1], times-1, {stroke:'red', 'stroke-width': 3})
        const phase = frame % phases

        const textProps = {'font-size': 16, 'stroke': 'black'}
        const dist = this.model.radiusStep
        let text = ''
        for(let i=0; i<prev.length; i++) {
            const {east:east0, north:north0} = prev[i]
            const {east:east1, north:north1} = next[i]
            // Phase 0 - Add red fire perimeter at start of time step
            // els.push(this.circle(east0, north0, 5, {fill: 'black'}))
            text = 'Most recent fire perimeter'
            
            // Phase 1 - Add a new fire at each perimeter point
            if (phase>=1) {
                els.push(this.circle(east0, north0, 5, {fill: 'red'}))
                text = 'Start a new fire at each perimeter point'
            }
            // Phase 2 - Add new (blue) fire fires for one time step
            // (But not in Phase 5)
            if (phase>=2 && phase!==5) {
                els.push(this.circle(east0, north0, dist, {fill: 'none', stroke: 'blue'}))
                text = 'Grow the new fires for one time step'
            }
            // Phase 3 - Add expanded point and vector
            if (phase>=3) {
                els.push(this.line(east0, north0, east1, north1, {stroke: 'red'}))
                els.push(this.circle(east1, north1, 5, {fill: 'red'}))
                text = 'Identify new point at normal to tangent of old pt'
            }
            // Phase 4 - Draw the new (red) perimeter line
            if (phase>=4) {
                str += this.drawPerimeter(next, times, {stroke:'red', 'stroke-wodth': 3})
                text = 'Connect points into a new perimeter'
            }
            if (phase>=5) {
                /*northing - blue circles are excled in phase 2*/
            }
        }
        // Annotation
        els.push(this.textMid(0, 0, `Time Step ${times}`, textProps))
        els.push(this.textMid(0, -16, `Phase ${phase}: ${text}`, textProps))
        return str + gxmlStr(els)
    }

    // Convenience funcion called by animate()
    drawPerimeter(perim, time, lineProps) {
        const els = []
        let prev = perim[perim.length-1]
        for(let pt of perim) {
            els.push(this.line(prev.east, prev.north, pt.east, pt.north, lineProps))
            prev = pt
        }
        prev = perim[0]
        els.push(this.textMid(prev.east, prev.north, 't='+time.toFixed(0), {'font-size':16}))
        return gxmlStr(els)
    }

    // An older version of the animation that uses parametric circle equations
    // rather than an aray of perimeter points
    animate1(degStep, frame) {
        const textProps = {'font-size': 16, 'stroke': 'black'}
        const els = []
        const phases = 6
        const radius0 = 200 // initial fire perimeter radius
        const time = Math.trunc(frame/phases)
        const dist = 50
        for(let t=0; t<=time; t++) {
            const radius1 = radius0 + time * dist
            const radius2 = radius1 + dist
            const phase = frame % phases
            let text = ''
            // Phase 0 - Fire perimeter at start of time step
                els.push(this.circle(0, 0, radius1, {fill: 'none', stroke: 'red'}))
                text = 'Fire perimeter at start of time step'
            // Phase 1 - Start fire a perimeter points
            if (phase>0) {
                for (let bearing=0; bearing<360; bearing+=degStep) {
                    const v1 = this.vectorEndpoint(0, 0, bearing, radius1)
                    els.push(this.circle(v1.east, v1.north, 5, {fill: 'red'}))
                }
                text = 'Start new fire at each perimeter point'
            }
            // Phase 2 - Grow the circular fire
            if (phase>1 && phase !==5) {
                for (let bearing=0; bearing<360; bearing+=degStep) {
                    const v1 = this.vectorEndpoint(0, 0, bearing, radius1)
                    els.push(this.circle(v1.east, v1.north, dist, {fill: 'none', stroke: 'blue'}))
                }
                text = 'Grow each fire for 1 time step'
            }
            // Phase 3 -Add expanded point
            if (phase>2) {
                for (let bearing=0; bearing<360; bearing+=degStep) {
                    const v1 = this.vectorEndpoint(0, 0, bearing, radius1)
                    const v2 = this.vectorEndpoint(0, 0, bearing, radius2)
                    els.push(this.line(v1.east, v1.north, v2.east, v2.north, {stroke: 'red'}))
                    els.push(this.circle(v2.east, v2.north, 5, {fill: 'red'}))
                }
                text = 'Identify point at normal to tangent'
            }
            // Phase 4 - Add new perimeter line
            if (phase>3) {
                let pv = this.vectorEndpoint(0, 0, 0, radius2)
                for (let bearing=0; bearing<360; bearing+=degStep) {
                    const v = this.vectorEndpoint(0, 0, bearing, radius2)
                    els.push(this.line(pv.east, pv.north, v.east, v.north,
                        {stroke:'red', 'stroke-width': 3}))
                    pv = v
                }
                const v = this.vectorEndpoint(0, 0, 0, radius2)
                els.push(this.line(pv.east, pv.north, v.east, v.north, {stroke:'red'}))
                text = 'Connect points into a new perimeter'
            }
            if (phase>4) { /*nothing*/} // handled in phase 2
            // Annotation
            els.push(this.textMid(0, 0, `Time Step ${time}`, textProps))
            els.push(this.textMid(0, -16, `Phase ${phase}: ${text}`, textProps))
        }
        return gxmlStr(els)
    }
}