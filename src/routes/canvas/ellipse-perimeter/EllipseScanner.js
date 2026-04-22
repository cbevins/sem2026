/**
 * This *IS* a bare-bones ellipse with a built-in scanner
 */
export class EllipseScanner {
    constructor(length=1, width=1, bearing=0, ignEast=0, ignNorth=0, centerEast=0, centerNorth=0) {
        this.setEllipse(length, width, bearing, ignEast, ignNorth, centerEast, centerNorth)
    }

    setEllipse(length, width, bearing, ignEast, ignNorth, centerEast, centerNorth) {
        this.length = length
        this.width = width
        this.bearing = bearing
        this.centerEast = centerEast
        this.centerNorth = centerNorth
        this.ignEast = ignEast
        this.ignNorth = ignNorth

        this.rx = this.length / 2
        this.ry = this.width / 2
        this.rotation = (450-bearing) % 360
        const radians = this.rotation * Math.PI / 180
        this.cosUnRot = Math.cos(-radians)
        this.sinUnRot = Math.sin(-radians)
        this.cosRot = Math.cos(radians)
        this.sinRot = Math.sin(radians)
        
        // arbitrary, but sufficient, scanline endpoints
        this.xMin = this.centerEast - this.length
        this.xMax = this.centerEast + this.length
        this.yMin = this.centerNorth - this.length
        this.yMax = this.centerNorth + this.length
    }

    // Determines the ellipse's 2 perimeter points at regular y 'scanWidth' intervals
    // Returns a 3-element array of [y, x1, x2]
    getHorizontalScanLines(scanWidth=1) {
        const lines = []
        // Start with ignition point and go north until we get no more points
        for(let y = this.ignNorth; y <= this.yMax; y += scanWidth) {
            const xs = this._scanLine(this.xMin, y, this.xMax, y)
            if (xs.length < 2) break
            lines.push([y, xs[0], xs[1]])
        }
        lines.reverse()
        this.ignRow = lines.length - 1
        // Start with ignition point and go south
        for(let y = this.ignNorth - scanWidth; y >= this.yMin; y -= scanWidth) {
            const xs = this._scanLine(this.xMin, y, this.xMax, y)
            if (xs.length < 2) break
            lines.push([y, xs[0], xs[1]])
        }
        return lines
    }

    // Determines the ellipse's 2 perimeter points at regular x 'scanWidth' intervals
    // Returns a 3-element array of [x, y1, y2]
    getVerticalScanLines(scanWidth=1) {
        const lines = []
        // Start with ignition point and go east until we get no more points
        for(let x = this.ignEast; x <= this.xMax; x += scanWidth) {
            const ys = this._scanLine(x, this.yMin, x, this.yMax)
            if (ys.length < 2) break
            lines.push([x, ys[0], ys[1]])
        }
        lines.reverse()
        this.ignCol = lines.length - 1
        // Start with ignition point and go south
        for(let x = this.ignEast - scanWidth; x >= this.xMin; x -= scanWidth) {
            const ys = this._scanLine(x, this.yMin, x, this.yMax)
            if (ys.length < 2) break
            lines.push([x, ys[0], ys[1]])
        }
        return lines
    }

    // Modified to return a 2-element array of the scanline's first and last x-coordinate easting
    _scanLine(x1, y1, x2, y2) {
        // 1. Translate and rotate the line segment to the ellipse's local space
        const tx1 = x1 - this.centerEast
        const ty1 = y1 - this.centerNorth
        const tx2 = x2 - this.centerEast
        const ty2 = y2 - this.centerNorth

        const lx1 = tx1 * this.cosUnRot - ty1 * this.sinUnRot
        const ly1 = tx1 * this.sinUnRot + ty1 * this.cosUnRot
        const lx2 = tx2 * this.cosUnRot - ty2 * this.sinUnRot
        const ly2 = tx2 * this.sinUnRot + ty2 * this.cosUnRot

        // 2. Normalize radii (treat ellipse as unit circle)
        const nlX1 = lx1 / this.rx
        const nlY1 = ly1 / this.ry
        const nlX2 = lx2 / this.rx
        const nlY2 = ly2 / this.ry

        // 3. Line segment equation: P = P1 + t * (P2 - P1), 0 <= t <= 1
        const dx = nlX2 - nlX1
        const dy = nlY2 - nlY1

        // Quadratic coefficients (at^2 + bt + c = 0)
        const a = dx * dx + dy * dy
        const b = 2 * (nlX1 * dx + nlY1 * dy)
        const c = nlX1 * nlX1 + nlY1 * nlY1 - 1

        const intersections = []
        const discriminant = b * b - 4 * a * c
        if (discriminant >= 0) {
            const sqrtDisc = Math.sqrt(discriminant)
            const t1 = (-b - sqrtDisc) / (2 * a)
            const t2 = (-b + sqrtDisc) / (2 * a)
            
            // 4. Check if intersections lie on the segment (0 <= t <= 1)
            ;[t1, t2].forEach(t => {
                if (t >= 0 && t <= 1) {
                    // Find intersection in normalized space
                    const intX = nlX1 + t * dx
                    const intY = nlY1 + t * dy

                    // 5. Transform back to original space
                    const finalX = (intX * this.rx) * this.cosRot - (intY * this.ry) * this.sinRot + this.centerEast
                    // const finalY = (intX * this.rx) * this.sinRot + (intY * this.ry) * this.cosRot + this.centerNorth
                    intersections.push(finalX)
                }
            })
        }
        if (intersections.length === 1) {
            console.log('scanEllipse() Found just 1 scanline point at row ', y1)
            intersections.push(intersections[0])
        }
        return intersections
    }

    // lines is an array of scan line triplets: [y, x1, x2]
    getPerimeterRaster(res=1) {
        const points = []
        let y0 = this.lines[0][0]
        let x0 = this.lines[0][1]
        let d2 = 0
        for(let i=0; i<this.lines.length; i++) {
            const [y, x] = this.lines[i]
            d2 = (y-y0)*(y-y0) + (x-x0)*(x-x0)
            points.push([x, y, d2])
            y0 = y
            x0 = x
        }

        y0 = this.lines[this.lines.length-1][0]
        x0 = this.lines[this.lines.length-1][2]
        for(let i=this.lines.length-2; i>=0; i--) {
            const [y, x1, x] = this.lines[i]
            d2 = (y-y0)*(y-y0) + (x-x0)*(x-x0)
            // if (d2 > 2*res) {
            //     for(let t=res/d2; t<1; t+=res/d2) {
            //         let dx = x0 + t * (x-x0)
            //         let dy = y0 + t * (y-y0)
            //         points.push([dx, dy])
            //     }
            // }
            points.push([x, y, d2])
            y0 = y
            x0 = x
        }
        return points
    }
}