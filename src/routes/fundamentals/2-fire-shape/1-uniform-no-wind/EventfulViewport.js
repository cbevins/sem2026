/**
 * EventfulViewport is a base class for implementing interactive SVG images.
 * It is responsible for 
 *  - handling mouse and key events over the SVG image,
 *  - storing state including the svg dimensions, center point, scale, and bounds,
 *  - performing world-to-pixel conversions during drawing operations
 * 
 * Derived classes must re-implement the drawSvg() method which is responsible
 * for returning SVG content based on current state.
 */
import { gxmlStr } from "$lib/gxml/gxmlStr.js"
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
        this.zoomControl = null     // {zx: x, zy: y, zd: d}
    }
    
    // This function must be reimplemented by derived classes
    // Must return proper SVG content to embed within an <svg> element wrapper
    drawSvg() {
        throw new Error('Classes derived from EventfulViewport must re-implement their own drawSvg() method.')
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
    // eslint-disable-next-line no-unused-vars
    click(xy) {
        let {x,y} = xy
        const {zx, zy, zd} = this.zoomControl
        if (x>=zx && x<=zx+zd && y>=zy && y<=zy+2*zd){
            return (y<=zy+zd) ? this.zoomout(xy) : this.zoomin(xy)
        }
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
    mouseenter(xy) { return false; /* not currently used */ }

    // mouseleave cancels any on-going panning action
    mouseleave(xy) {
        if (this.isPanning) {
            this.endPan = {...xy, t: Date.now()}
            this.isPanning = false
        }
        return false
    }
    
    // Currently unused, but could use mousemove update display of current pointer position
    mousemove(xy) {
        this.movexy = xy
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

    //--------------------------------------------------------------------------
    // Gxml convenience funcions
    // All these return Gxml elements, not strings!
    //--------------------------------------------------------------------------

    circle(cx, cy, r, fill, stroke, props) { return {el: 'circle', cx, cy, r, fill, stroke, ...props} }
    ellipse(cx, cy, rx, ry, fill, stroke, props) { return {el: 'ellipse', cx, cy, rx, ry, fill, stroke, ...props} }
    line(x1, y1, x2, y2, props) { return {el: 'line', x1, y1, x2, y2, ...props} }
    rect(x, y, width, height, fill, props) { return {el: 'rect', x, y, width, height, fill, ...props} }
    text(x, y, content, props) { return {el: 'text', x, y, ...props, els: [{el: 'inner', content}]} }
    textBeg(x, y, content, props) { return this.text(x, y, content, {...props, 'text-anchor': 'start'}) }
    textEnd(x, y, content, props) { return this.text(x, y, content, {...props, 'text-anchor': 'end'}) }
    textMid(x, y, content, props) { return this.text(x, y, content, {...props, 'text-anchor': 'middle'}) }

    //--------------------------------------------------------------------------
    // Some shared drawing elements
    // All these return SVG strings
    //--------------------------------------------------------------------------

    // Draws axis and places world coordinates at terminus of each semi-axis
    drawAxis(lineProps, textProps) {
        const w = this.width
        const mx = w/2
        const h = this.height
        const my = h/2
        const rotateTop = `rotate(270,${mx+8},10)`
        const rotateBot = `rotate(270,${mx+8},${h-2})`
        return gxmlStr([
            this.line(0, my, w, my, lineProps),
            this.line(mx, 0, mx, h, lineProps),
            this.textBeg(2, my-2, this.wleft().toString(), textProps),
            this.textEnd(w-2, my-2, this.wright().toString(), textProps),
            this.textBeg(mx, 10, this.wtop().toString(), {...textProps, transform: rotateTop}),
            this.textBeg(mx+8, h-2, this.wbottom().toString(), {...textProps, transform: rotateBot}),
        ])
    }

    // Draws either a bounded or unbounded backdrop rect.
    drawBackdrop(fill) {
        let x = this.bounds ? this.px(this.bounds.l) : 0
        let y = this.bounds ? this.py(this.bounds.t) : 0
        let width = this.bounds ? this.pd(this.bounds.r-this.bounds.l) : this.width
        let height = this.bounds ? this.pd(this.bounds.t-this.bounds.b) : this.height
        return gxmlStr(this.rect(x, y, width, height, fill))
    }

    // Draws units per pixel and viewport center point in world coordinates
    drawCenterScale(textProps) {
        const upp = `${this.upp} ${this.units} per pixel`
        const center = `Center [${this.wcx}, ${this.wcy}]`
        return gxmlStr([
            this.textMid(this.width/4, 10, upp, textProps),
            this.textMid(3*this.width/4, 10, center, textProps)
        ])
    }

    // Places world coordinates around viewport frame
    drawEdgeLabels(textProps) {
        const w = this.width
        const h = this.height
        const top = this.wtop().toString()
        const left = this.wleft().toString()
        const right = this.wright().toString()
        const bottom = this.wbottom().toString()
        return gxmlStr([
            // str += `<text x=20 y=10 text-anchor='start' ${textAttr}>${this.wtop()}</text>`
            this.textBeg(20, 10, top, textProps),
            //str += `<text x=${this.width-20} y=10 text-anchor='end' ${textAttr}>${this.wtop()}</text>`
            this.textEnd(w-20, 10, top, textProps),
            
            // str += `<text x=5 y=10 text-anchor='end' transform='rotate(270,10,10)' ${textAttr}>${this.wleft()}</text>`
            this.textEnd(5, 10, left, textProps),
            // str += `<text x=${this.width-10} y=10 text-anchor='start' transform='rotate(90,${this.width-10},10)' ${textAttr}>${this.wright()}</text>`
            this.textBeg(w-10, 10, right, textProps),
            
        // str += `<text x=5 y=${this.height/2} text-anchor='start' transform='rotate(270,10,${this.height/2})' ${textAttr}>${this.wleft()}</text>`
            this.textBeg(5, h/2, left, textProps),
        // str += `<text x=${this.width-10} y=${this.height/2} text-anchor='end' transform='rotate(90,${this.width-10},${this.height/2})' ${textAttr}>${this.wright()}</text>`
            this.textBeg(w-10, h/2, right, textProps),
        
        // str += `<text x=20 y=${this.height-5} text-anchor='start' ${textAttr}>${this.wbottom()}</text>`
            this.textBeg(20, h-5, bottom, textProps),
        // str += `<text x=${this.width-20} y=${this.height-5} text-anchor='end' ${textAttr}>${this.wbottom()}</text>`
            this.textBeg(w-20, h-5, bottom, textProps),
        
        // str += `<text x=5 y=${this.height-10} text-anchor='start' transform='rotate(270,10,${this.height-10})' ${textAttr}>${this.wleft()}</text>`
            this.textBeg(5, h-10, left, textProps),
        // str += `<text x=${this.width-10} y=${this.height-10} text-anchor='end' transform='rotate(90,${this.width-10},${this.height-10})' ${textAttr}>${this.wright()}</text>`
            this.textBeg(w-10, h-10, right, textProps),
        ])
    }
    drawZoom(x, y, d) {
        this.zoomControl = {zx: x, zy: y, zd: d}
        return gxmlStr([
            this.rect(x, y, d, d, 'red'),
            this.rect(x, y+d, d, d, 'green'),
        ])
    }
}
