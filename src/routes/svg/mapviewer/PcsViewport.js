import { gxmlStr } from "$lib/gxml/gxmlStr.js"

export class PcsViewport {
    constructor(svgPixelWidth, svgPixelHeight,
        centerEasting=0, centerNorthing=0,
        unitsPerPixel=1, unitsLabel='units',
        boundsWest=null, boundsEast=null, boundsSouth=null, boundsNorth=null) {
        // SVG image width and height in pixels
        this.svg = {
            width: svgPixelWidth,
            height: svgPixelHeight
        }
        // SVG image scale in units per pixel. For example, if units are in feet,
        // 20 === 20 feet per pixel, and 0.5 === 6 inches per pixel
        this.scale = {
            units: unitsLabel,
            upp: unitsPerPixel,
        }
        // Viewport center point in PCS easting/northing coordinates
        this.center = {
            east: centerEasting,
            north: centerNorthing
        }
        // If bounds are supploed, they are only used to define panning limits in world coords
        this.bounds = {
            west: boundsWest,
            east: boundsEast,
            south: boundsSouth,
            north: boundsNorth}
        // Store initial view so it can be restored
        this.initial = {
            east: centerEasting,
            north: centerNorthing,
            upp: unitsPerPixel
        }
        // Result of most recent content() call
        this.svgContent = ''
    }
    
    // This function must be reimplemented by derived classes
    // Must return proper SVG content to embed within an <svg> element wrapper
    content() {
        throw new Error('Classes derived from PcsViewport must re-implement their own content() method.')
    }

    //--------------------------------------------------------------------------
    // Methods used by clients to draw at various coordinates
    //--------------------------------------------------------------------------

    // The following return viewport edge easting or northing in PCS units
    west() { return this.center.east - (this.scale.upp * this.svg.width/2) }
    east() { return this.center.east + (this.scale.upp * this.svg.width/2) }
    north() { return this.center.north + (this.scale.upp * this.svg.height/2) }
    south() { return this.center.north - (this.scale.upp * this.svg.height/2) }
    
    // The following return svg pixel offset given PCS easting/northing/distance
    pixels(distance) { return distance / this.scale.upp }
    px(easting) { return (this.svg.width/2) + ((easting - this.center.east) / this.scale.upp) }
    py(northing) { return (this.svg.height/2) - ((northing - this.center.north) / this.scale.upp) }

    // The following returns PCS easting/northing/distance given SVG pixel offset
    distance(svgDistance) { return svgDistance * this.scale.upp }
    easting(svgX) { return this.west() + (this.scale.upp *svgX) }
    northing(svgY) { return this.north() - (this.scale.upp * svgY) }

    //--------------------------------------------------------------------------
    // Gxml convenience funcions
    // All these return Gxml elements, not strings!
    //--------------------------------------------------------------------------

    circle(easting, northing, pcsRadius, props) {
        const cx = this.px(easting)
        const cy = this.py(northing)
        const r = this.pixels(pcsRadius)
        return {el: 'circle', cx, cy, r, ...props}
    }
    ellipse(easting, northing, major, minor, props) {
        const cx = this.px(easting)
        const cy = this.py(northing)
        const rx = this.pixels(major)
        const ry = this.pixels(minor)
        return {el: 'ellipse', cx, cy, rx, ry, ...props}
    }
    line(easting1, northing1, easting2, northing2, props) {
        const x1 = this.px(easting1)
        const y1 = this.py(northing1)
        const x2 = this.px(easting2)
        const y2 = this.py(northing2)
        return {el: 'line', x1, y1, x2, y2, ...props}
    }
    rect(easting, northing, pcsWidth, pcsHeight, props) {
        const x = this.px(easting)
        const y = this.py(northing)
        const width = this.pixels(pcsWidth)
        const height = this.pixels(pcsHeight)
        return {el: 'rect', x, y, width, height, ...props}
    }
    svgText(x, y, content, props) {
        return {el: 'text', x, y, ...props, els: [{el: 'inner', content}]}
    }
    text(easting, northing, content, props) {
        const x = this.px(easting)
        const y = this.py(northing)
        return {el: 'text', x, y, ...props, els: [{el: 'inner', content}]}
    }
    textBeg(easting, northing, content, props) {
        return this.text(easting, northing, content, {...props, 'text-anchor': 'start'}) 
    }
    textEnd(easting, northing, content, props) {
        return this.text(easting, northing, content, {...props, 'text-anchor': 'end'})
    }
    textMid(easting, northing, content, props) {
        return this.text(easting, northing, content, {...props, 'text-anchor': 'middle'})
    }

    //--------------------------------------------------------------------------
    // Some shared drawing elements
    // All these return SVG strings
    //--------------------------------------------------------------------------
    drawAxis(lineProps, textProps) {
        const mx = this.svg.width / 2
        const my = this.svg.height / 2
        const rotateTop = `rotate(270,${mx+8},10)`
        const rotateBot = `rotate(270,${mx+8},${this.svg.height-2})`

        const els = [this.rect(400, 2400, 600, 2600, {fill: 'green'})]
        els.push(this.line(this.west(), this.center.north, this.east(), this.center.north, lineProps))
        els.push(this.line(this.center.east, this.south(), this.center.east, this.north(), lineProps))
        els.push(this.svgText(2, my-4, this.west().toFixed(0), {...textProps, 'text-anchor': 'start'}))
        els.push(this.svgText(this.svg.width-2, my-4, this.east().toFixed(0), {...textProps, 'text-anchor':'end'}))
        els.push(this.svgText(mx-8, -2, this.north().toFixed(0), {...textProps, transform: rotateTop}))
        els.push(this.svgText(mx+8, this.svg.height-14, this.south().toFixed(0), {...textProps, transform: rotateBot}))
        return gxmlStr(els)
    }

    // Draws either a bounded or unbounded backdrop rect.
    drawBackdrop(props) {
        const {north, south, east, west} = this.bounds
        if (east!==null && west!==null && north!==null && south!==null) {
            console.log('bounded:', this.bounds)
            return gxmlStr(this.rect(west, north, east-west, north-south, props))
        }
        console.log('Unbounded:', this.bounds)
        return gxmlStr([{el: 'rect', x:0, y:0,
            width:this.svg.width, height: this.svg.height, ...props}])
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
    drawController() {
        const {x, y, r1, r2, r3, zone} = this.controller
        const active = 'cyan'
        const inactive = 'gray'
        return gxmlStr([
            // Zone 1
            this.circle(x, y, r1, (zone===1)?active:inactive, 'black'),
            // Zone 2 and 3
            this.circle(x, y, r2,  (zone===2 || zone===3)?active:inactive,'black'),
            this.line(x-r2, y, x+r2, y, {stroke: 'black'}),
            this.textMid(x, y-r2/2, '+', {stroke: 'red'}),
            this.textMid(x, y+r2, '-', {stroke: 'red'}),
            // Zone 4
            this.circle(x, y, r3,  (zone===4)?active:inactive, 'black'),
            this.circle(x, y, r3/2, 'red', 'black'),
        ])
    }
    handleControllerClick(xy) {
        const {zone} = this.controller
        if (zone===1) return this.move(xy)
        if (zone===2) return this.zoomin() 
        if (zone===3) return this.zoomout()
        if (zone===4) return this.center()
        return false
    }
    move(xy) {
        const {x,y} = xy
        const dx = x - this.controller.x
        const dy = y - this.controller.y
        this.wcx += this.upp * dx/4
        this.wcy += this.upp * dy/4
        return true // should redraw
    }

    // On each mouse move, returns its location relative to the controller, where
    //  0 = outside controller, 1 = outer ring (pan), 2 = upper middle ring (zoom),
    //  3 = lower middle ring (zoom), or 4 = center ring (center)
    getControllerZone(xy) {
        if (! this.controller.enabled) return false
        let {x,y} = xy
        const {x:cx, y:cy, r1, r2, r3} = this.controller
        let zone = 0
        // Distance squared of mouse click from control center
        const d2 = (x-cx)**2 + (y-cy)**2                // click dist^2 from control center
        if (d2 > r1*r1) zone = 0                        // outside of controller
        else if (d2 <= r3*r3) zone = 4                  // inner ring (center)
        else if (d2 <= r2*r2) zone = (y<=cy) ? 2 : 3    // middle ring (zoom)
        else zone = 1                                   // outer ring (pan)
        if (zone !== this.controller.zone) {
            this.controller.zone = zone
            return true
        }
        return false
    }
}
