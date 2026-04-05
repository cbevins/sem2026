export class FireEllipseScanLines {
    constructor(ignEast, ignNorth, length, width, bearing, centerEast, centerNorth,
            scanWidth=1, units='ft') {
        this.ignEast = ignEast
        this.ignNorth = ignNorth
        this.length = length
        this.width = width
        this.bearing = bearing
        this.headDeg = (450-bearing) % 360
        this.centerEast = centerEast
        this.centerNorth = centerNorth
        this.scanWidth = scanWidth
        this.units = units
        this.ignIdx = 0
        // Array of scanline rows where aach row is a 3-element array [y, x1, x2]
        this.lines = this.scanEllipse()
        this.bbox = this.boundingBox()
    }

    boundingBox() {
        let [y, x1, x2] = this.lines[0]
        this.bbox = {xmin: x1, xmax: x2, ymin: y, ymax: y}
        for(let i=1; i<this.lines.length; i++) {
        let [y, x1, x2] = this.lines[i]
            this.bbox.xmin = Math.min(this.bbox.xmin, x1)
            this.bbox.xmax = Math.max(this.bbox.xmax, x2)
            this.bbox.ymin = Math.min(this.bbox.ymin, y)
            this.bbox.ymax = Math.max(this.bbox.ymax, y)
        }
    }

    scanEllipse() {
        const lines = []
        // Use the ellipse length as the initial bounding radius
        const xMin = this.ignEast - this.length
        const xMax = this.ignEast + this.length
        const yMin = this.ignNorth - this.length
        const yMax = this.ignNorth + this.length
        const major = this.length / 2
        const minor = this.width / 2
        const radians = this.headDeg * Math.PI / 180

        // Start with ignition point and go north
        for(let y=this.ignNorth; y<= yMax; y+= this.scanWidth) {
            const xs = this.scanLine(xMin, y, xMax, y, this.centerEast, this.centerNorth, major, minor, radians)
            if (xs.length === 1) console.log('scanEllipse() Found just 1 scanline point at row ', y)
            if (xs.length < 2) break
            lines.push([y, xs[0], xs[1]])
        }
        lines.reverse()
        this.ignIdx = lines.length - 1
        // Start with ignition point and go south
        for(let y=this.ignNorth-this.scanWidth; y>= yMin; y-= this.scanWidth) {
            const xs = this.scanLine(xMin, y, xMax, y, this.centerEast, this.centerNorth, major, minor, radians)
            if (xs.length === 1) console.log('scanEllipse() Found just 1 scanline point at row ', y)
            if (xs.length < 2) break
            lines.push([y, xs[0], xs[1]])
        }
        return lines
    }

    // Modified to return a 2-element array of scanline's first and last x-coordinate
    scanLine(x1, y1, x2, y2, cx, cy, rx, ry, angle) {
        // 1. Translate and rotate the line segment to the ellipse's local space
        const cosA = Math.cos(-angle);
        const sinA = Math.sin(-angle);

        const tx1 = x1 - cx;
        const ty1 = y1 - cy;
        const tx2 = x2 - cx;
        const ty2 = y2 - cy;

        const lx1 = tx1 * cosA - ty1 * sinA;
        const ly1 = tx1 * sinA + ty1 * cosA;
        const lx2 = tx2 * cosA - ty2 * sinA;
        const ly2 = tx2 * sinA + ty2 * cosA;

        // 2. Normalize radii (treat ellipse as unit circle)
        const nlX1 = lx1 / rx;
        const nlY1 = ly1 / ry;
        const nlX2 = lx2 / rx;
        const nlY2 = ly2 / ry;

        // 3. Line segment equation: P = P1 + t * (P2 - P1), 0 <= t <= 1
        const dx = nlX2 - nlX1;
        const dy = nlY2 - nlY1;

        // Quadratic coefficients (at^2 + bt + c = 0)
        const a = dx * dx + dy * dy;
        const b = 2 * (nlX1 * dx + nlY1 * dy);
        const c = nlX1 * nlX1 + nlY1 * nlY1 - 1;

        const discriminant = b * b - 4 * a * c;
        const intersections = [];

        if (discriminant >= 0) {
            const sqrtDisc = Math.sqrt(discriminant);
            const t1 = (-b - sqrtDisc) / (2 * a);
            const t2 = (-b + sqrtDisc) / (2 * a);

            // 4. Check if intersections lie on the segment (0 <= t <= 1)
            [t1, t2].forEach(t => {
                if (t >= 0 && t <= 1) {
                    // Find intersection in normalized space
                    const intX = nlX1 + t * dx;
                    const intY = nlY1 + t * dy;

                    // 5. Transform back to original space
                    const finalX = (intX * rx) * Math.cos(angle) - (intY * ry) * Math.sin(angle) + cx;
                    // const finalY = (intX * rx) * Math.sin(angle) + (intY * ry) * Math.cos(angle) + cy;
                    // intersections.push([finalX, finalY])
                    intersections.push(finalX)
                }
            })
        }
        return intersections
    }
}