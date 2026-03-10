import { PcsMapper } from "./PcsMapper.js"
import { gxmlStr } from "$lib/gxml/gxmlStr.js"

export class FireGrowth01View extends PcsMapper {
    constructor(pcs, model, frames) {
        super(pcs.width, pcs.height,
            pcs.west, pcs.east, pcs.south, pcs.north,
            pcs.upp, pcs.units, pcs.focusEast, pcs.focusNorth)

        this.frames = frames
        this.model = model
        this.pcs = pcs
    }
    
    content(frame) {
        const poi = {east: 250, north: 250, type: 'building', burned: 0}
        let str = this.addBoundsRect({fill:'khaki'})
            + this.addPerimeter(frame)
            + this.addBuilding(poi, frame)
            + this.addGridLines(100, 100, 0)
        this.svgContent = str
        return str
    }

    addPerimeter(frame) {
        const {ign, rate, time} = this.model
        const radius = rate * time * frame
        let str = '<defs>'
        str += '<radialGradient id="fire1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">'
        str += '<stop offset="80%" stop-color="slategray" />'
        str += '<stop offset="90%" stop-color="red" />'
        str += '<stop offset="100%" stop-color="yellow" />'
        str += '</radialGradient>'
        str += '</defs>'
        str += gxmlStr([
            this.circle(ign.east, ign.north, radius, {fill: 'url(#fire1)'}),
            this.circle(ign.east, ign.north, 5, {fill: 'red'})]
        )
        return str
    }
    addBuilding(poi, frame) {
        const {east, north, burned, type} = poi
        const {ign, rate, time} = this.model
        const radius = (rate * time * frame)**2
        const dist = (ign.east-east)**2 + (ign.north-north)**2
        const arrived = (radius >= dist)
        if (arrived && !poi.burned) {
            poi.burned = time * frame
            // console.log(`${type} burned at time ${time*frame}`)
        }
        const color = (burned) ? 'brown' : 'black'
        const lineProps = {stroke: color}
        const dim = 10
        const els = [
            this.circle(east, north, 5, {fill: 'red'}),
            this.line(east-dim, north-dim, east-dim, north+dim, lineProps),
            this.line(east+dim, north-dim, east+dim, north+dim, lineProps),
            this.line(east-dim, north+dim, east+dim, north+dim, lineProps),
            this.line(east-dim, north-dim, east+dim, north-dim, lineProps),
            this.line(east-dim, north+dim, east, north+2*dim, lineProps),
            this.line(east+dim, north+dim, east, north+2*dim, lineProps),
        ]
        if (poi.burned) {
            els.push(this.line(east-2*dim, north-2*dim, east+2*dim, north+2*dim, lineProps))
            els.push(this.line(east+2*dim, north-2*dim, east-2*dim, north+2*dim, lineProps))
        }
        return gxmlStr(els)
    }
}