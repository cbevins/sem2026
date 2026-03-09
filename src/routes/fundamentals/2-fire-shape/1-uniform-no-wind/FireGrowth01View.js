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
        let str = this.addBoundsRect({fill:'khaki'})
            + this.addPerimeter(frame)
            + this.addBuilding(250, 250)
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
    addBuilding(easting, northing) {
        const lineProps = {stroke: 'black'}
        const dim = 10
        const els = [
            this.circle(easting, northing, 5, {fill: 'red'}),
            this.line(easting-dim, northing-dim, easting-dim, northing+dim, lineProps),
            this.line(easting+dim, northing-dim, easting+dim, northing+dim, lineProps),
            this.line(easting-dim, northing+dim, easting+dim, northing+dim, lineProps),
            this.line(easting-dim, northing-dim, easting+dim, northing-dim, lineProps),
            this.line(easting-dim, northing+dim, easting, northing+2*dim, lineProps),
            this.line(easting+dim, northing+dim, easting, northing+2*dim, lineProps),
        ]
        return gxmlStr(els)
    }
}