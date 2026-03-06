/**
 * EventfulViewport is a base class for implementing interactive SVG images.
 * It provides a handleEvent() method called by the controller component event handler called by EventfulSvg
 * It is responsible for 
 *  - handling mouse and key events over the SVG image,
 *  - interprets certain events as pan and zoom operations,
 *  - storing state including the svg dimensions, center point, scale, and bounds,
 *  -
 * 
 * Derived classes must re-implement the drawSvg() method which is responsible
 * for returning SVG content based on current state.
 */
const xy = {x: 0, y: 0}
const xyt = {x: 0, y: 0, t: 0}

export class EventfulViewport {
    constructor(svgWidth, svgHeight, centerX=0, centerY=0, upp=1, units='units', bounds=null) {
        // Viewport state properties
        this.width  = svgWidth      // Svg image width in pixels
        this.height = svgHeight     // Svg image height in pixels
        this.units  = units         // world units label, such as 'ft'
        this.upp    = upp           // units per pixel, i.e., 20 ft per pixel is 20
        this.wcx    = centerX       // viewport center x in world units
        this.wcy    = centerY       // viewport center y in world units
        this.bounds = bounds        // only used to define panning limits in world coords {l, r, t, b}

        // Store initial view so it can be restored
        this.wcx0    = centerX       // initial viewport center x in world units
        this.wcy0    = centerY       // initial viewport center y in world units
        this.upp0    = upp           // initial units per pixel

        this.begPan = {...xyt}      // most recent mousedown location (pixels) and time
        this.endPan = {...xyt}      // most recent mouseup location (pixels) and time
        this.keyxy  = {...xy}       // most recent keyup location (pixels)
        this.movexy = {...xy}       // current mouse location (pixels)
        this.panning = false        // becomes TRUE after a mousedown and FALSE after a mouseup
        this.svgContent = ''        // Result of most recent drawSvg() call

        this.clickDelay = 200       // maximum milliseconds between mousedown and mouse up to qualify as a 'click'
        this.panRatio = 0.25        // Proportion of width or height shifted by each pan
        this.zoomRatio = 2          // Change in units-per-pixel with each zoom
        this.controller = {
            enabled: true, x: svgWidth-50, y: 50, r1: 50, r2: 20, r3: 5, zone: 0}
    }
    
    // This function must be reimplemented by derived classes
    // Must return proper SVG content to embed within an <svg> element wrapper
    content() {
        throw new Error('Classes derived from EventfulViewport must re-implement their own content() method.')
    }

    //--------------------------------------------------------------------------
    // Event handlers
    // If an event handler returns TRUE, drawSVg() should be called.
    //--------------------------------------------------------------------------

    handleEvent(e) {
        this.event = e
        let xy = {x: e.offsetX, y: e.offsetY}
        if (e.type === 'mousemove') return this.mousemove(xy)
        else if (e.type === 'click') return this.click(xy)
        else if (e.type === 'dblclick') return this.dblclick(xy)
        else if (['mouseenter', 'mouseover'].includes(e.type)) return this.mouseenter(xy)
        else if (['mouseleave', 'mouseout'].includes(e.type)) return this.mouseleave(xy)
        else if (e.type === 'mousedown') return this.mousedown(xy)
        else if (e.type === 'mouseup') return this.mouseup(xy)
        else if (e.type === 'keyup') return this.key(xy)
    }

    // Re-centers without scaling
    center() {
        this.wcx = this.wcx0
        this.wcy = this.wcy0
        return true // should redraw
    }
    
    // Moves the clicked location to the image center
    click(xy) {
        if(this.controller.zone) return this.handleControllerClick(xy)
        return false
    }
    
    // eslint-disable-next-line no-unused-vars
    dblclick(xy) { return false /* not currently used */ }

    // Catch '+' and '-' keys for zoom control
    // Props: ctrlKey (bool), isComposing (bool), key (string),
    // location (int), metaKey (bool), repeat (bool), shiftKey (bool)
    // Obsolete props are charCode (int), keyCode (int), keyIdentifier
    key(xy) {
        this.keyxy = xy
        const e = this.event
        if (['v', '+'].includes(e.key)) return this.zoomout(xy)
        if (['^','-'].includes(e.key)) return this.zoomin(xy)
        if (e.key === 'ArrowDown') return this.shift('d')
        if (e.key === 'ArrowLeft') return this.shift('l')
        if (e.key === 'ArrowRight') return this.shift('r')
        if (e.key === 'ArrowUp') return this.shift('u')
        if (e.key === 'Home') return this.shift('ul')       // NumPad7
        if (e.key === 'End') return this.shift('dl')        // NumPad1
        if (e.key === 'PageUp') return this.shift('ur')     // NumPad9
        if (e.key === 'PageDown') return this.shift('dr')   // NumPad3
        if (e.key === 'c') return this.center()             // re-center without re-scaling
        if (['r','0'].includes(e.key)) this.reset()         // re-centers and re-scales
        // console.log(e)
        return false
    }

    // mousedown starts the 'panning' action, or possibly a 'click' action
    mousedown(xy) {
        this.begPan =  {...xy, t: Date.now()}
        this.isPanning = true
        return false
    }

    // eslint-disable-next-line no-unused-vars
    mouseenter(xy) {
        return false
    }

    // mouseleave cancels any on-going panning action
    mouseleave(xy) {
        if (this.isPanning) {
            this.endPan = {...xy, t: Date.now()}
            this.isPanning = false
        }
        return false
    }
    
    // Currently, if controller is enabled, determines which zone the mouse is over
    mousemove(xy) {
        this.movexy = xy
        if(this.controller.enabled) return this.getControllerZone(xy)
        return false
    }

    // mouseup ends a 'panning' processing, or possibly a 'click' action
    mouseup(xy) {
        // only consider a mouseup that follows a mousedown on this element
        if (this.isPanning) {
            this.endPan = {...xy, t: Date.now()}
            this.isPanning = false
            // if this mouseup was fast (and far?) enough to be a click ...
            let delay = this.endPan.t - this.begPan.t
            if (delay < this.clickDelay) this.click(xy)
            else this.pan()
        }
    }

    pan() {
        const dx = this.begPan.x - this.endPan.x
        const dy = this.endPan.y - this.begPan.y
        this.wcx += this.upp * dx
        this.wcy += this.upp * dy
        return true // should redraw
    }

    // Re-centers and re-scales to original settings
    reset() {
        this.wcx = this.wcx0
        this.wcy = this.wcy0
        this.level = this.level0
        this.upp = this.scales[this.level]
        return true // should redraw
    }

    shift(dir) {
        const xshift = this.panRatio * this.width
        const yshift = this.panRatio * this.height
        let dx = 0
        let dy = 0
        if (this.bounds) {
            if (['l','ul','dl'].includes(dir) && ((this.bounds.r-this.wleft()) > xshift)) dx = xshift
            if (['r','ur','dr'].includes(dir) && ((this.wright()-this.bounds.l) > xshift)) dx = -xshift
            if (['d','dl','dr'].includes(dir) && (this.pd(this.bounds.t-this.wbottom()) > yshift)) dy = yshift
            if (['u','ur','ul'].includes(dir) && (this.pd(this.wtop()-this.bounds.b) > yshift)) dy = -yshift
        } else {
            if (['l','ul','dl'].includes(dir)) dx = xshift
            if (['r','ur','dr'].includes(dir)) dx = -xshift
            if (['d','dl','dr'].includes(dir)) dy = yshift
            if (['u','ur','ul'].includes(dir)) dy = -yshift
        }
        this.wcx += dx * this.upp
        this.wcy += dy * this.upp
        return true // should redraw
    }

    zoomout() {
        this.upp = this.upp * this.zoomRatio
        return true // should redraw
    }

    zoomin() {
        this.upp = this.upp / this.zoomRatio
        return true // should redraw
    }
}
