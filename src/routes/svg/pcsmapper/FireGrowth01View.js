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
        const textProps = {stroke: 'black', 'font-size':16}
        let str = this.addBoundsRect({fill:'gray'})
            + this.addPerimeter(frame)
            + this.addCentralAxis({stroke: 'green', 'stroke-width': 4}, textProps)
        this.svgContent = str
        return str
    }

    addPerimeter(frame) {
        // const textProps = {stroke: 'black', 'font-size':16, 'text-anchor':'middle'}
        const {ign, rate, time} = this.model
        const els = []
        const radius = rate * time * frame
        els.push(this.circle(ign.east, ign.north, radius,
            {fill: 'red', stroke: 'yellow'}))
        return gxmlStr(els)
    }
}