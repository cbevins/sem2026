/**
 * Viewport is a base class for implementing interactive SVG images using SvgEvent.
 * It is responsible for handling mouse and key events over the SVG image,
 * and storing the svg dimensions, client (world) coordinates, and other state variables.
 * Derived classes must re-implement the Viewport.draw() method and are responsible
 * for returning SVG content based on current state.
 */
export class Viewport {
    constructor(svgWidth, svgHeight, centerX=0, centerY=0, scales=[1], level=0, units='') {
        // Viewport state properties
        this.level  = level         // current scale index into this.scales[this.level]
        this.pw     = svgWidth      // Svg image width in pixels
        this.ph     = svgHeight     // Svg image height in pixels
        this.scales = scales        // array of unitsPerPixel at various scale (zoom) levels
        this.units  = units         // world units label, such as 'ft'
        this.upp    = scales[level] // units per pixel, i.e., 20 ft per pixel is 20
        this.wcx    = centerX       // viewport center x in world units
        this.wcy    = centerY       // viewport center y in world units
        
        // Store initial view so it can be restored
        this.wcx0    = centerX       // initial viewport center x in world units
        this.wcy0    = centerY       // initial viewport center y in world units
        this.level0  = level         // initial scale index into this.scales[this.level0]

        this.begPan = {x: 0, y: 0, t: 0}    // most recent mousedown location (pixels) and time
        this.endPan = {x: 0, y: 0, t: 0}    // most recent mouseup location (pixels) and time
        this.keyxy = {x: 0, y: 0}           // most recent keyup location (pixels)
        this.movexy = {x:0, y:0}    // current mouse location (pixels)
        this.panning = false        // TRUE while no mouseup occurs after a mousedown
        this.svgContent = ''
        this.zoomxy = {x:0, y:0}    // most recent zoom location (pixels)

        this.clickDelay = 200       // maximum milliseconds between mousedown and mouse up to qualify as a 'click'
    }

    // Called from SvgEvent.keyHandler() and SvgEvent.mouseHandler()
    // to interperet the event as needed, and return a (possibly) new SVG image
    create(e=null) {
        // the event handler potentially updates the Viewport state
        if(e) this.handleEvent(e)
        return this.drawSvg()
    }
    
    // This function must be reimplemented by derived classes
    // Must return proper SVG content to embed within the SvgEvent wrapper
    drawSvg() {
        throw new Error('Classes derived from Viewport must re-implement their own draw() method.')
    }

    //--------------------------------------------------------------------------
    // State handlers
    //--------------------------------------------------------------------------

    // The following return viewport edge x or y in world units
    // from the current viewport center and scale
    wleft() { return this.wcx - this.upp * this.pw/2 }
    wright() { return this.wcx + this.upp * this.pw/2 }
    wtop() { return this.wcy + this.upp * this.ph/2 }
    wbottom() { return this.wcy - this.upp * this.ph/2 }
    
    // The following return svg pixel offset gicen world x or y
    px(wx) { return this.pcx + (wx - this.wcx) / this.upp }
    py(wy) { return this.pcy - (wy - this.wcy) / this.upp }

    // The following returns world position given SVG pixel offset
    wx(px) { return this.wleft() + this.upp * px }
    wy(py) { return this.wtop() - this.upp * py }
    
    //--------------------------------------------------------------------------
    // Event handlers
    //--------------------------------------------------------------------------

    // eslint-disable-next-line no-unused-vars
    click(xy) { /* not currently used */ }
    
    // eslint-disable-next-line no-unused-vars
    dblclick(xy) { /* not currently used */ }

    // Catch '+' and '-' keys for zoom control
    key(xy) {
        this.keyxy = xy
        const e = this.event
        if (e.key === '+') this.zoomin(xy)
        else if (e.key === '-') this.zoomout(xy)
    }

    // mousedown starts the panning action or possibly a click action
    mousedown(xy) {
        this.begPan =  {...xy, t: Date.now()}
        this.isPanning = true
    }

    // eslint-disable-next-line no-unused-vars
    mouseenter(xy) { /* not currently used */ }

    // mouseleave cancels any on-going panning action
    mouseleave(xy) {
        if (this.isPanning) {
            this.endPan = {...xy, t: Date.now()}
            this.isPanning = false
        }
    }
    
    // Currently unused, but could use mousemove update display of current pointer position
    mousemove(xy) { this.movexy = xy }

    // mouseup ends a 'panning' OR 'click' action
    mouseup(xy) {
        // only consider a mouseup that follows a mousedown on this element
        if (this.isPanning) {
            this.endPan = {...xy, t: Date.now()}
            this.isPanning = false
            // if this mouseup was fast (an far?) enough to be a click ...
            let delay = this.endPan.t - this.begPan.t
            if (delay < this.clickDelay) this.click(xy)
            else this.pan(xy)
        }
    }

    pan(xy) { /* not yet implemented*/ }

    zoomin(xy) {
        this.zoomxy = xy
        if (this.level < this.scales.length-2) this.level++
        this.upp = this.scales[this.level]
    }

    zoomout(xy) {
        this.zoomxy = xy
        if (this.level > 0) this.level--
        this.upp = this.scales[this.level]
    }

    handleEvent(e) {
        this.event = e
        let xy = {x: e.offsetX, y: e.offsetY}
        if (e.type === 'mousemove') this.mousemove(xy)
        else if (e.type === 'click') this.click(xy)
        else if (e.type === 'dblclick') this.dblclick(xy)
        else if (e.type === 'mouseenter' || e.type === 'mouseover') this.mouseenter(xy)
        else if (e.type === 'mouseleave' || e.type === 'mouseout') this.mouseleave(xy)
        else if (e.type === 'mousedown') this.mousedown(xy)
        else if (e.type === 'mouseup') this.mouseup(xy)
        else if (e.type === 'keyup') this.key(xy)
    }
}
