/**
 * Viewport is a base class for implementing interactive SVG images using SvgEvent.
 * It is responsible for handling mouse and key events over the SVG image,
 * and storing the svg dimensions, client (world) coordinates, and other state variables.
 * Derived classes must re-implement the Viewport.draw() method and are responsible
 * for returning SVG content based on current state.
 */
export class Viewport {
    constructor(svgWidth, svgHeight, centerX=0, centerY=0,
            scales=[1], level=0, units='',
            wxMin=-Infinity, wxMax=Infinity, wyMin=-Infinity, wyMax=Infinity) {
        // Viewport state properties
        this.width  = svgWidth      // Svg image width in pixels
        this.height = svgHeight     // Svg image height in pixels
        if (level >= scales.length) level = scales.length-1
        this.level  = level         // current scale index into this.scales[this.level]
        this.scales = scales        // array of unitsPerPixel at various scale (zoom) levels
        this.units  = units         // world units label, such as 'ft'
        this.upp    = scales[level] // units per pixel, i.e., 20 ft per pixel is 20
        this.wcx    = centerX       // viewport center x in world units
        this.wcy    = centerY       // viewport center y in world units
    
        // The following are only used to define panning limits
        this.wxMax = wxMax          // eastern-most world coordinate
        this.wxMin = wxMin          // western-most world coordinate
        this.wyMax = wyMax          // northern-most world coordinate
        this.wyMin = wyMin          // southern-most world coordinate

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
        this.shiftRatio = 0.25
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
    // Methods used by clients to draw at various coordinates
    //--------------------------------------------------------------------------

    // The following return viewport edge x or y in world units
    // from the current viewport center and scale
    wleft() { return this.wcx - (this.upp * this.width)/2 }
    wright() { return this.wcx + (this.upp * this.width/2) }
    wtop() { return this.wcy + (this.upp * this.height/2) }
    wbottom() { return this.wcy - (this.upp * this.height/2) }
    
    // The following return svg pixel offset given world x or y
    pd(wd) { return wd / this.upp }
    px(wx) { return (this.width/2) + ((wx - this.wcx) / this.upp) }
    py(wy) { return (this.height/2) - ((wy - this.wcy) / this.upp) }

    // The following returns world position given SVG pixel offset
    wd(pd) { return pd * this.upp }
    wx(px) { return this.wleft() + (this.upp * px) }
    wy(py) { return this.wtop() - (this.upp * py) }

    //--------------------------------------------------------------------------
    // Event handlers
    //--------------------------------------------------------------------------

    // Re-ceneters without scaling
    center() {
        this.wcx = this.wcx0
        this.wcy = this.wcy0
    }
    // Moves the clicked location to the image center
    click(xy) {
        this.wcx = this.wx(xy.x)
        this.wcy = this.wy(xy.y)
    }
    
    // eslint-disable-next-line no-unused-vars
    dblclick(xy) { /* not currently used */ }

    // Catch '+' and '-' keys for zoom control
    // Props: ctrlKey (bool), isComposing (bool), key (string),
    // location (int), metaKey (bool), repeat (bool), shiftKey (bool)
    // Obsolete props are charCode (int), keyCode (int), keyIdentifier
    key(xy) {
        this.keyxy = xy
        const e = this.event
        if (['v', '+'].includes(e.key)) this.zoomout(xy)
        else if (['^','-'].includes(e.key)) this.zoomin(xy)
        else if (e.key === 'ArrowDown') this.shift('d')
        else if (e.key === 'ArrowLeft') this.shift('l')
        else if (e.key === 'ArrowRight') this.shift('r')
        else if (e.key === 'ArrowUp') this.shift('u')
        else if (e.key === 'Home') this.shift('ul') // NumPad7
        else if (e.key === 'End') this.shift('dl')  // NumPad1
        else if (e.key === 'PageUp') this.shift('ur')  // NumPad9
        else if (e.key === 'PageDown') this.shift('dr')  // NumPad3
        else if (e.key === 'c') this.center() // re-center without re-scaling
        else if (['r','0'].includes(e.key)) this.reset()    // re-centers and re-scales
        // else (console.log(e))
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
    mousemove(xy) {
        this.movexy = xy }

    // mouseup ends a 'panning' OR 'click' action
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
    }

    // Re-centers and re-scales to original settings
    reset() {
        this.wcx = this.wcx0
        this.wcy = this.wcy0
        this.level = this.level0
        this.upp = this.scales[this.level]
    }

    shift(dir) {
        const xshift = this.shiftRatio * this.width
        const yshift = this.shiftRatio * this.height
        let dx = 0
        let dy = 0
        // x-shifts
        if (['l','ul','dl'].includes(dir) && ((this.wxMax-this.wleft()) > xshift)) dx = xshift
        if (['r','ur','dr'].includes(dir) && ((this.wright()-this.wxMin) > xshift)) dx = -xshift
        // y shifts
        if (['d','dl','dr'].includes(dir) && (this.pd(this.wyMax-this.wbottom()) > yshift)) dy = yshift
        if (['u','ur','ul'].includes(dir) && (this.pd(this.wtop()-this.wyMin) > yshift)) dy = -yshift
        this.wcx += dx * this.upp
        this.wcy += dy * this.upp
    }

    zoomout(xy) {
        this.zoomxy = xy
        if (this.level < this.scales.length-1) this.level++
        this.upp = this.scales[this.level]
    }

    zoomin(xy) {
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
        else if (['mouseenter', 'mouseover'].includes(e.type)) this.mouseenter(xy)
        else if (['mouseleave', 'mouseout'].includes(e.type)) this.mouseleave(xy)
        else if (e.type === 'mousedown') this.mousedown(xy)
        else if (e.type === 'mouseup') this.mouseup(xy)
        else if (e.type === 'keyup') this.key(xy)
    }

    //--------------------------------------------------------------------------
    // Some shared drawing elements
    //--------------------------------------------------------------------------

    // Draws axis and places world coordinates at terminus of each semi-axis
    drawAxis(textAttr) {
        const w = this.width
        const mx = w/2
        const h = this.height
        const my = h/2
        let str = `<line x1=0 y1=${my} x2=${w} y2=${my} stroke='black'/>`
        str += `<line x1=${mx} y1=0 x2=${mx} y2=${h} stroke='black'/>`
        str += `<text x=2 y=${my-2} text-anchor='start' ${textAttr}>${this.wleft()}</text>`
        str += `<text x=${w-2} y=${my-2} text-anchor='end' ${textAttr}>${this.wright()}</text>`
        str += `<text x=${mx} y=10 text-anchor='start' transform='rotate(270,${mx+8},10)' ${textAttr}>${this.wtop()}</text>`
        str += `<text x=${mx+8} y=${h-2} text-anchor='start' transform='rotate(270,${mx+8},${h-2})'${textAttr}>${this.wbottom()}</text>`
        return str
    }

    drawZoomCenterLabels(textAttr) {
        const zoom = `Zoom ${this.level}, Scale ${this.upp} ${this.units}/pixel`
        const center = `Center [${this.wcx}, ${this.wcy}]`
        let str = `<text x=${this.width/4} y=10 text-anchor='middle' ${textAttr}>${zoom}</text>`
        str += `<text x=${3*this.width/4} y=10 text-anchor='middle' ${textAttr}>${center}</text>`
        return str
    }

    // Places world coordinates around viewport frame
    drawEdgeLabels(textAttr) {
        let str = ''
        str += `<text x=20 y=10 text-anchor='start' ${textAttr}>${this.wtop()}</text>`
        str += `<text x=${this.width-20} y=10 text-anchor='end' ${textAttr}>${this.wtop()}</text>`

        str += `<text x=5 y=10 text-anchor='end' transform='rotate(270,10,10)' ${textAttr}>${this.wleft()}</text>`
        str += `<text x=${this.width-10} y=10 text-anchor='start' transform='rotate(90,${this.width-10},10)' ${textAttr}>${this.wright()}</text>`
        
        str += `<text x=5 y=${this.height/2} text-anchor='start' transform='rotate(270,10,${this.height/2})' ${textAttr}>${this.wleft()}</text>`
        str += `<text x=${this.width-10} y=${this.height/2} text-anchor='end' transform='rotate(90,${this.width-10},${this.height/2})' ${textAttr}>${this.wright()}</text>`
        
        str += `<text x=20 y=${this.height-5} text-anchor='start' ${textAttr}>${this.wbottom()}</text>`
        str += `<text x=${this.width-20} y=${this.height-5} text-anchor='end' ${textAttr}>${this.wbottom()}</text>`
        
        str += `<text x=5 y=${this.height-10} text-anchor='start' transform='rotate(270,10,${this.height-10})' ${textAttr}>${this.wleft()}</text>`
        str += `<text x=${this.width-10} y=${this.height-10} text-anchor='end' transform='rotate(90,${this.width-10},${this.height-10})' ${textAttr}>${this.wright()}</text>`

        return str
    }
}
