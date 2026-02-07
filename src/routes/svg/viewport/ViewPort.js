/**
 * For now, update parameters directly as follows:
 * viewport.cx = 16000
 * viewport.cy = 24000
 * viewport.scale = 1/20
 * viewport.units = 'ft'
 * viewport.dec = 2
 */
export class ViewPort {
    constructor(deviceWidth, deviceHeight, scale=1, centerX=0, centerY=0) {
        this.device = {
            width: deviceWidth,
            height: deviceHeight,
            units:'px'},
        this.cx = centerX
        this.cy = centerY
        // Scale is ratio of pixels / world units (i.e., 1 px = 20 ft -> 1/20)
        this.scale = scale
        this.units = 'dl'
        this.dec = 0    // World coordinate display decimal places
        this.mouse = {dx: 0, dy: 0, wx: 0, wy: 0, drag: false}
        this.message = 'Click on ViewPort...'
    }
    // ViewPort dimensions and edges in world units
    height() { return this.device.height / this.scale}
    width() { return this.device.width / this.scale}
    left() { return this.cx - this.width()/2 }
    right() { return this.cx + this.width()/2 }
    top() { return this.cy + this.height()/2 }
    bottom() { return this.cy - this.height()/2 }
    // Returns device (pixel) coordinates given the view (world) coordinates
    dx(vx) { return this.scale * (vx - this.left()) }
    dy(vy) { return this.scale * (this.top() - vy) }
    // Returns view (world) coordinates given the device coordinates
    vx(dx) { return this.left() + dx /this.scale }
    vy(dy) { return this.top() - dy / this.scale }
}
//--------------------------------------------------------------------------
// mouse events in Svelte SVG
// click - fires when mouse is pressed and released on the same element
// dblclick - fires when an element is double clicked
// mousemove - fires continuously as the pointer is moved over an element. 
//
// mousedown - occurs when a mouse button is pressed down over an element.
// mouseup - occurs when a mouse button is released over an element.
//
// mouseenter: occurs when the pointer is moved onto an element, but not its descendants.
// mouseleave: occurs when the pointer is moved off an element and its descendants.
//
// mouseover: similar to mouseenter, but fires when the pointer enters an element or any of its child elements.
// mouseout: similar to mouseleave, but fires when the pointer leaves an element or any of its child elements
//--------------------------------------------------------------------------
export function viewportHandler(vp, e=null) {
    if (e===null) return {type:'', dx:0, dy:0, vx:0, vy:0, drag:false}
    return {
        type: e.type,
        dx: e.offsetX,
        dy: e.offsetY,
        vx: vp.vx(e.offsetX),
        vy: vp.vy(e.offsetY),
        drag: false,
    }
}
