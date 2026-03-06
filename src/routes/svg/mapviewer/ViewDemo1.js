import { PcsViewport } from "./PcsViewport.js"
import { gxmlStr } from "$lib/gxml/gxmlStr.js"
import {Model} from './model.js'

export class ViewDemo1 extends PcsViewport {
    constructor(svgPixelWidth, svgPixelHeight) {
        super(svgPixelWidth, svgPixelHeight, 500, 2500, 1, 'ft', 0, 1000, 2000, 3000)
    }
    
    content() {
        const lineProps = {stroke: 'black'}
        const textProps = {stroke: 'black', 'font-size':12}
        let str = this.drawBackdrop({fill:'green'})
            + this.drawAxis(lineProps, textProps)
        return str
    }
}