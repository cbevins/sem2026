// Demonstrates how to implement a specialized SvgScope instance.
import { SvgScope } from "./SvgScope.js"

export class CirclesSvgScope extends SvgScope {
    // The constuctor() specializes the svg frame size and the world coordinates
    constructor(svgWidth=400, svgHeight=400, worldXmin=1000, worldYmin=2000,
        worldXmax=2000, worldYmax=3000) {
        super(svgWidth, svgHeight, worldXmin, worldYmin, worldXmax, worldYmax)
    }

    // The render() method provides the specialized SVG content
    render() {
        const els = []
        // Start with a green background
        els.push({el: 'rect', x: 0, y: 0, width:this.f.width, height: this.f.height,
            fill: 'green'})
        // Create a field of circles with 100-ft diameters
        const space = 100
        const r = this.frameD(space/2 - 5)
        for(let x=this.w.left+space/2; x<=this.w.right; x+=space) {
            for(let y=this.w.bottom+space/2; y<=this.w.top; y+=space) {
                els.push({el: 'circle', cx:this.frameX(x), cy:this.frameY(y),
                    r:r, fill:'red'})
                els.push(this.label(x,y))
            }
        }
        // Mark the center of the world
        els.push({el: 'circle', cx:this.frameX(this.v.cx),
            cy:this.frameY(this.v.cy), r:this.frameD(25), fill:'yellow'})
        return els
    }
    // Text helper
    label(x, y) {
        return {el: 'text', x:this.frameX(x), y:this.frameY(y), stroke: 'black',
        'font-size': 10,'text-anchor': 'middle', 'font-family': 'sans-serif', 'font-weight': 'light',
        els: [{el: 'inner', content: `${x},${y}`}]}
    }
}
