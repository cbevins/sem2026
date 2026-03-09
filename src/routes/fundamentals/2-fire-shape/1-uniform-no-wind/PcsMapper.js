import { gxmlStr } from "$lib/gxml/gxmlStr.js"

export class PcsMapper {
    constructor(svgPixelWidth, svgPixelHeight,
        west, east, south, north,           // PCS map bounds
        unitsPerPixel=1, unitsLabel='units',
        focusEast=null, focusNorth=null) {

        // West, east, south, and north bounds
        this.bounds = {west, east, south, north,
            width: east-west, height: north-south}
        
        // SVG image width and height in pixels
        this.svg = { width: svgPixelWidth, height: svgPixelHeight }
        
        // SVG image scale in units per pixel. For example, if units are in feet,
        // 20 === 20 feet per pixel, and 0.5 === 6 inches per pixel
        this.scale = { units: unitsLabel, upp: unitsPerPixel }

        // Viewport center focus point in PCS easting/northing coordinates
        this.focus = {
            east: (east + west)/2,
            north: (north + south)/2 }
        if (focusEast) this.focus.east = focusEast
        if (focusNorth) this.focus.north = focusNorth

        // Store initial view so it can be restored
        this.initial = {
            east: this.focus.east,
            north: this.focus.north,
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
    
    viewbox() {
        const {svg, bounds} = this
        const x = (svg.width - bounds.width) / 2
        const y = (svg.height - bounds.height) / 2
        return `${x} ${y} ${bounds.width} ${bounds.height}`
    }

    //--------------------------------------------------------------------------
    // Methods used by clients to draw at various coordinates
    //--------------------------------------------------------------------------

    // The following return viewport edge easting or northing in PCS units
    west() { return this.focus.east - (this.scale.upp * this.svg.width/2) }
    east() { return this.focus.east + (this.scale.upp * this.svg.width/2) }
    north() { return this.focus.north + (this.scale.upp * this.svg.height/2) }
    south() { return this.focus.north - (this.scale.upp * this.svg.height/2) }
    
    // The following return svg pixel offset given PCS easting/northing/distance
    pixels(distance) { return distance / this.scale.upp }
    px(easting) { return (this.svg.width/2) + ((easting - this.focus.east) / this.scale.upp) }
    py(northing) { return (this.svg.height/2) - ((northing - this.focus.north) / this.scale.upp) }

    // The following return PCS easting/northing/distance given SVG pixel offset
    distance(svgDistance) { return svgDistance * this.scale.upp }
    easting(svgX) { return this.west() + (this.scale.upp *svgX) }
    northing(svgY) { return this.north() - (this.scale.upp * svgY) }

    //--------------------------------------------------------------------------
    // Gxml convenience funcions: all these return Gxml elements, not strings!
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
    addCentralAxis(lineProps, textProps) {
        const {north, south, east, west} = this.bounds
        const midEast = west+(east-west)/2
        const midNorth = south + (north-south)/2
        const mt = -20 * this.scale.upp
        const mb = 10 * this.scale.upp
        const ml = 10 * this.scale.upp
        const mr = -ml
        return gxmlStr([
            this.line(west, this.focus.north, east, this.focus.north, lineProps),
            this.line(this.focus.east, south, this.focus.east, north, lineProps),
            this.textBeg(west+ml, midNorth, west.toFixed(0), textProps),
            this.textEnd(east+mr, midNorth, east.toFixed(0), textProps),
            this.textMid(midEast, north+mt, north.toFixed(0), textProps),
            this.textMid(midEast, south+mb, south.toFixed(0), textProps),
        ])
    }

    // Draws either a bounded or unbounded backdrop rect.
    addBoundsRect(props) {
        const {north, south, east, west} = this.bounds
        if (east!==null && west!==null && north!==null && south!==null) {
            return gxmlStr(this.rect(west, north, east-west, north-south, props))
        }
        return gxmlStr([{el: 'rect', x:0, y:0,
            width: this.svg.width, height: this.svg.height, ...props}])
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

    // // Places world coordinates around viewport frame
    // drawEdgeLabels(textProps) {
    //     const w = this.width
    //     const h = this.height
    //     const top = this.wtop().toString()
    //     const left = this.wleft().toString()
    //     const right = this.wright().toString()
    //     const bottom = this.wbottom().toString()
    //     return gxmlStr([
    //         this.textBeg(20, 10, top, textProps),
    //         this.textEnd(w-20, 10, top, textProps),
            
    //         this.textEnd(5, 10, left, textProps),
    //         this.textBeg(w-10, 10, right, textProps),
            
    //         this.textBeg(5, h/2, left, textProps),
    //         this.textBeg(w-10, h/2, right, textProps),
        
    //         this.textBeg(20, h-5, bottom, textProps),
    //         this.textBeg(w-20, h-5, bottom, textProps),
        
    //         this.textBeg(5, h-10, left, textProps),
    //         this.textBeg(w-10, h-10, right, textProps),
    //     ])
    // }

    addGridLines(eastStep, northStep, decimals=0,
        lineProps={stroke: 'white'},
        textProps={stroke: 'black', 'font-size':16}) {
        let {north, south, east, west} = this.bounds
        const ml = 10 * this.scale.upp
        const mr = -ml
        const els = []
        // north-south longitudinal lines with laebls at top and bottom
        for(let e=west; e<=east; e+=eastStep) {
            els.push(this.line(e, south, e, north, lineProps))
            if (e>west && e<east) {
                els.push(this.textMid(e, south, e.toFixed(decimals),
                    {...textProps, 'alignment-baseline': 'after-edge'}))
                els.push(this.textMid(e, north, e.toFixed(decimals),
                    {...textProps, 'alignment-baseline': 'before-edge'}))
            }
        }
        // west-east latitudinal lines
        for(let n=south; n<=north; n+=northStep) {
            els.push(this.line(west, n, east, n, lineProps))
            if (n>south && n<north) {
                els.push(this.textBeg(west+ml, n, n.toFixed(decimals),
                    {...textProps, 'alignment-baseline': 'middle'}))
                els.push(this.textEnd(east+mr, n, n.toFixed(decimals),
                    {...textProps, 'alignment-baseline': 'middle'}))
            }
        }
        return gxmlStr(els)
    }
}
