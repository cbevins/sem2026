/**
 * Base class for generating zoomable & pannable views of a world scene in an SVG.
 * - The SVG is a frame containing a scalable/pannable view onto the world.
 * - Employs a y-axis with higher values at the top and lower values at the bottom
 *  (opposite of SVG y-axis coordinates) more suitable to map content
 * - Derived classes re-implement the render() method to show viewable content
 *  and adjust labels and text (scaling an SVG scales all elements including text).
 * 
 * Used to generate a Gxml for the SVG.
 */
export class SvgScope {
    constructor(svgWidth=100, svgHeight=null, worldXmin=null, worldYmin=null, worldXmax=null, worldYmax=null) {
        // Define the SVG frame
        const f = {width: svgWidth}
        f.height = (svgHeight===null) ? f.width : svgHeight

        // Define the world coordinates (defaults to SVG frame)
        const w = {}
        w.left = (worldXmin===null) ? 0 : worldXmin             // west limit
        w.right = (worldXmax===null) ? f.width : worldXmax     // east limit
        w.bottom = (worldYmin===null) ? 0 : worldYmin           // south limit
        w.top = (worldYmax===null) ? f.height : worldYmax      // north limit
        w.width = w.right - w.left
        w.height = w.top - w.bottom
        w.cx = w.left + w.width/2
        w.cy = w.bottom + w.height/2
        w.xscale = f.width / w.width
        w.yscale = f.height / w.height

        // Determine scale that fits world limits within the SVG frame (i.e., zoom=1)
        if (w.xscale <= w.yscale) {
            w.scale = w.xscale
            w.dim = w.width
        } else {
            w.scale = w.yscale
            w.dim = w.height
        }

        // Define the field of view in world coordinates
        // (defaults to center of world sceme at zoom 1)
        const v = {}
        v.cx = w.left + w.width/2
        v.cy = w.bottom + w.height/2
        v.zoom = 1
        v.scale = w.scale * v.zoom

        // Store it all as this properties
        this.w = w
        this.f = f
        this.v = v
    }

    // Adjust the zoom and field of view, then re-render the scene to fit
    view(zoom, cx=null, cy=null) {
        // Store the new focal point, zoom, and scale parms
        if (cx!==null) this.v.cx = cx
        if (cy!==null) this.v.cy = cy
        this.v.zoom = zoom
        this.v.scale = this.w.scale * this.v.zoom
        this.v.width = this.f.width / this.v.scale
        this.v.height = this.f.height / this.v.scale
        this.v.left = this.v.cx - this.v.width/2
        this.v.right = this.v.cx + this.v.width/2
        this.v.bottom = this.v.cy - this.v.height/2
        this.v.top = this.v.cy + this.v.height/2

        const pan = {}
        pan.xstep = this.v.width/4
        pan.ystep = this.v.height/4
        this.v.pan = pan

        // Store the rendered elements inside the returned svg
        const els = this.render()
        return els
    }
    
    // Returns svg distance corresponding to the world distance
    frameD(wd) { return this.v.scale * wd }
    
    // Returns svg x coordinate corresponding to the world x
    frameX(wx) { return this.f.width/2 + this.v.scale * (wx - this.v.cx) }
    
    // Returns svg y coordinate corresponding to the world y (north > south)
    frameY(wy) { return this.f.height/2 - this.v.scale * (wy - this.v.cy) }

    // Must be re-implemented by derived classes
    render() {
        const els = []
        els.push({el: 'rect', x: 0, y: 0, width:this.f.width, height: this.f.height,
            fill: 'gray'})
        return els
    }
}