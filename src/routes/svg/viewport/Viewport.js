export class Viewport {
    constructor(svgWidth, svgHeight, centerX=0, centerY=0, unitsPerPixel=1,
            units='', scales=[1], level=0) {
        this.cx     = centerX       // viewport center x in client units
        this.cy     = centerY       // viewport center y in client units
        this.width  = svgWidth      // Svg image width in pixels
        this.height = svgHeight     // Svg image height in pixels
        this.level  = level         // current scale is this.scales[this.level]
        this.scales = scales        // array of unitsPerPixel at various scale (zoom) levels
        this.upp    = unitsPerPixel // i.e., 20 ft per pixel is 20
        this.units  = units         // informative, such as 'ft'
        
        // Store initial view so it can be restored
        this.cx0    = centerX       // initial viewport center x in client units
        this.cy0    = centerY       // initial viewport center y in client units
        this.level0 = level         // current scale is scales[level]
        
        // Not sure these are really needed ...
        this.clickxy = {x: 0, y: 0}
        this.dblxy   = {x: 0, y: 0}
        this.downxy  = {x: 0, y: 0}
        this.enterxy = {x: 0, y: 0}
        this.keyxy   = {x: 0, y: 0}
        this.leavexy = {x: 0, y: 0}
        this.movexy  = {x: 0, y: 0}
        this.upxy    = {x: 0, y: 0}
        this.zoomxy  = {x: 0, y: 0}

        this.panning = false
        this.begPan = {x: 0, y: 0, t: 0}
        this.endPan = {x: 0, y: 0, t: 0}
        this.svgContent = ''
    }

    create(e=null) {
        if(e) this.handleEvent(e)
        return this.drawSvg()
    }

    // Currently unused
    click(xy) { this.clickxy = xy }
    
    // Currently unused
    dblclick(xy) { this.dblxy = xy }

    // Catch '+' and '-' keys for zoom control
    key(xy) {
        this.keyxy = xy
        const e = this.event
        if (e.key === '+') this.zoomin(xy)
        else if (e.key === '-') this.zoomout(xy)
    }

    // mousedown starts the panning action or possibly a click action
    mousedown(xy) {
        this.downxy = xy
        this.begPan =  {...xy, t: Date.now()}
        this.isPanning = true
    }

    // Currently unused
    mouseenter(xy) { this.enterxy = xy }

    // mouseleave cancels any on-going panning action
    mouseleave(xy) {
        this.leavexy = xy
        if (this.isPanning) {
            this.endPan = {...xy, t: Date.now()}
            this.isPanning = false
        }
    }
    
    // Currently unused, but could use mousemove update display of current pointer position
    mousemove(xy) { this.movexy = xy }

    // mouseup ends a 'panning' OR 'click' action
    mouseup(xy) {
        this.upxy = xy
        // only consider a mouseup that follows a mousedown on this element
        if (this.isPanning) {
            this.endPan = {...xy, t: Date.now()}
            this.isPanning = false
            // if this mouseup was fast (an far?) enough to be a click ...
            let delay = this.endPan.t - this.begPan.t
            if (delay < 200) this.click(xy)
            else this.pan(xy)
        }
    }

    pan(xy) {

    }

    zoomin(xy) {
        this.zoomxy = xy
    }

    zoomout(xy) {
        this.zoomxy = xy
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
    
    drawSvg() {
        const cx = this.width/2
        const cy = this.height/2
        const fill = ['red', 'green', 'blue']
        const textAttr = "stroke='black' font-size=10 text-anchor='middle'"
            + " 'font-family'='sans-serif' font-weight='light'"
        let str = `<rect x=0 y=0 width=${this.width} height=${this.height} fill='green'/>`
        str += `<ellipse cx=${cx} cy=${cy} rx=200 ry=200 fill='blue'/>`
        str += `<ellipse cx=${cx} cy=${cy} rx=180 ry=160 fill='yellow'/>`
        str += `<ellipse cx=${cx} cy=${cy} rx=160 ry=120 fill='magenta'/>`
        str += `<ellipse cx=${cx} cy=${cy} rx=120 ry=80 fill='cyan'/>`
        str += `<ellipse cx=${cx} cy=${cy} rx=80 ry=80 fill='red'/>`
        this.svgContent = str
        return str
    }
}
