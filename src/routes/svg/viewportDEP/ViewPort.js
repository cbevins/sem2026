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
            units:'px'}
        // current center point in world view units
        this.cx = centerX
        this.cy = centerY
        // initial center point in world viel units
        this.cx0 = centerX
        this.cy0 = centerY
        // Scale is ratio of pixels / world units (i.e., 1 px = 20 ft -> 1/20)
        this.scale = scale
        // zoom factor is world view units / pixel (i.e., 20 ft per pixel)
        this.zoom = 1 / this.scale
        this.units = 'dl'
        this.dec = 0    // World coordinate display decimal places
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
    dd(vd) { return vd * this.scale }   // device distance given world distance
    // Returns view (world) coordinates given the device coordinates
    vx(dx) { return this.left() + dx /this.scale }
    vy(dy) { return this.top() - dy / this.scale }
    vd(dd) { return dd / this.scale }   // world distance given pixels
}
