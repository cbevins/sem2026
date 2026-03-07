import { PcsMapper } from "./PcsMapper.js"
import { gxmlStr } from "$lib/gxml/gxmlStr.js"
// import {Model} from './model.js'

export class PcsViewDemo1 extends PcsMapper {
    constructor(model) {
        super(model.width, model.height,
            model.west, model.east, model.south, model.north,
            model.upp, model.units, model.focusEast, model.focusNorth)
        this.model = model
    }
    
    content() {
        const textProps = {stroke: 'black', 'font-size':16}
        let str = this.addBoundsRect({fill:'gray'})
            + this.addColoredGrid(100, 100)
            + this.addCentralAxis({stroke: 'green', 'stroke-width': 4}, textProps)
        this.svgContent = str
        return str
    }

    addColoredGrid(xdim=100, ydim=100) {
        const textProps = {stroke: 'black', 'font-size':12, 'text-anchor':'middle'}
        const {north, south, east, west} = this.bounds
        const cols = (east-west)/xdim
        const rows = (north-south) / xdim
        const els = []
        let hue = 0
        // Start at row 1 since 'y' must be the cell TOP
        for(let row=1, h=0; row<=rows; row++) {
            const y = south + row * ydim
            for(let col=0; col<cols; col++, h++) {
                const x = west + col * xdim
                hue = h * 360 / (rows*cols)
                const sat = 100
                const light = 70 - 2*row
                els.push(this.rect(x, y, xdim, ydim,
                    {fill: `hsl(${hue}, ${sat}%,${light}%)`, stroke: 'black'}))
            }
        }
        // Add coordinates
            for(let col=0; col<cols; col++) {
                const x = west + col * xdim + xdim/2
                for(let row=0; row<rows; row++) {
                    const y = south + row * ydim + ydim/2
                    els.push(this.text(x, y, `[${x}, ${y}]`, textProps))
                }
            }
        return gxmlStr(els)
    }
}