// Demonstrates how to implement a specialized SvgScope instance.
import { SvgScope } from "./SvgScope.js"

export class TerrainSvgScope extends SvgScope {
    // The constuctor() specializes the svg frame size and the world coordinates
    constructor(svgWidth=400, svgHeight=400, worldXmin=1000, worldYmin=2000,
        worldXmax=2000, worldYmax=3000, gridSize=100) {
        super(svgWidth, svgHeight, worldXmin, worldYmin, worldXmax, worldYmax)
        this.w.grid = {size: gridSize}
    }

    // The render() method provides the specialized SVG content
    render() {
        const els = []
        // Start with a green background
        els.push({el: 'rect', x: 0, y: 0, width:this.f.width, height: this.f.height,
            fill: 'green'})
        // Add vertical grid lines
        let y1 = this.frameY(this.w.bottom)
        let y2 = this.frameY(this.w.top)
        for(let wx=this.w.left; wx<=this.w.right; wx+=this.w.grid.size) {
            let x1 = this.frameX(wx)
            let x2 = x1
            els.push({el: 'line', stroke:'black', x1, y1, x2, y2})
            els.push(this.label(x1, y1, wx, 'middle', '30%'))
            els.push(this.label(x1, y2, wx, 'middle', "-120%" ))
        }
        let x1 = this.frameX(this.w.left)
        let x2 = this.frameX(this.w.right)
        for(let wy=this.w.bottom; wy<=this.w.top; wy+=this.w.grid.size) {
            let y1 = this.frameY(wy)
            let y2 = y1
            els.push({el: 'line', stroke:'black', x1, y1, x2, y2})
            els.push(this.label(x1, y1, wy, 'start'))
            els.push(this.label(x2, y1, wy, 'end'))
        }
        return els
    }
    // Text helper
    label(fx, fy, str, anchor, shift='0%') {
        return {el: 'text', x:fx, y:fy, 'text-anchor': anchor, stroke: 'black',
            'baseline-shift': shift,
        'font-size': 10, 'font-family': 'sans-serif', 'font-weight': 'light',
        els: [{el: 'inner', content: `${str}`}]}
    }
}
