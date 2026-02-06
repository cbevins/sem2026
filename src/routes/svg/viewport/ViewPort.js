export class ViewPort {
    constructor(deviceWidth, deviceHeight, scale, centerX, centerY) {
        this.device = {
            width: deviceWidth,
            height: deviceHeight,
            cx: deviceWidth/2,
            cy: deviceHeight/2,
            units:'px'}
        this.view = {
            cx: centerX,
            cy: centerY,
            units: 'ft',
        }
        this.scale = scale  // world units/device pixel
    }
    // ViewPort edges in world units
    left() { return this.view.cx - this.scale*this.device.cx }
    right() { return this.view.cx + this.scale*this.device.cx }
    top() { return this.view.cy + this.scale*this.device.cy }
    bottom() { return this.view.cy - this.scale*this.device.cy }
    dx(vx) { return this.device.cx }

    x(east) { return east - this.scale*this.left() }
    y(north) { return (this.north() - north) * this.scale()},
}