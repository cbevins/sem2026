export class Ellipse {
    constructor({cx=0, cy=0, rx=1, ry=1, bearing=0}={}) {
        if (ry > rx) throw new Error('new Ellipse(): minor radius must be less than or equal to the major radius.')
        if (rx <= 0 || ry <= 0) throw new Error(`new Ellipse(): both the major and minor radii must be larger than zero.`)
        Object.assign(this, {cx, cy, rx, ry, bearing})
        this.init()
    }

    init() {
        this.length = 2 * this.rx
        this.width = 2 * this.ry
        this.lwr = this.length / this.width
        this.angleDeg = (450 - this.bearing) % 360  // angle counter-clockwise from x-axis
        this.angleRad = this.radians(this.angleDeg) // same as above but in radians
        // Rotation of ellipse from normal (counter-clockwise)
        this.cosA = Math.cos(this.angleRad)
        this.sinA = Math.sin(this.angleRad)
        // Inverse rotation of ellipse back to normal (clockwise)
        this.cosInvA = Math.cos(-this.angleRad)
        this.sinInvA = Math.sin(-this.angleRad)

        this.rx2 = this.rx * this.rx
        this.ry2 = this.ry * this.ry
    }

    area() {
        return (Math.PI * this.length * this.width) / 4
    }

    degrees(radians) {
        return (radians * 180) / Math.PI 
    }
    
    eccentricity() {
        return Math.sqrt(this.lwr**2 - 1) / this.lwr
    }

    effectiveWindSpeed() { return 4 * (this.lwr - 1) }

    // perimeter using Ramanujan's Second Formula
    perimeter() {
        const h = (this.rx - this.ry)**2 / (this.rx + this.ry)**2;
        return Math.PI * (this.rx + this.ry) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))
    }

    radians(degrees) {
        return (degrees * Math.PI) / 180
    }

    perimeterPointFromHead(degFromHead) {
        const rad = this.radians(degFromHead)
        const x = this.cx + this.rx * Math.cos(rad)
        const y = this.cy + this.ry * Math.sin(rad)
        return [x,y]
    }

    getPerimeterPointAtGeometricAngle(geomAngleDeg) {
        // Calculate local angle relative to the ellipse's own rotation
        const phi = this.radians(geomAngleDeg - this.angleDeg)

        // Find the distance (radius) from center to the perimeter at this local angle
        // Formula: r = (rx * ry) / sqrt((ry * cos(phi))^2 + (rx * sin(phi))^2)
        const cosPhi = Math.cos(phi)
        const sinPhi = Math.sin(phi)
        const r = (this.rx * this.ry) / Math.sqrt(Math.pow(this.ry * cosPhi, 2)
            + Math.pow(this.rx * sinPhi, 2));

        // Convert polar coordinates (r, geometricAngle) to Cartesian (x, y)
        // Note: We use the original geometricAngle to project from the world-space center
        const rad = this.radians(geomAngleDeg)
        const x = this.cx + r * Math.cos(rad)
        const y = this.cy + r * Math.sin(rad)
        return [x,y]
    }

    /**
     * Calculates the subtended point on the perimeter of a rotated ellipse given
     * the parametric angle from ellipse center to to the subtending circle's perimeter.
     * NOTE: this is NOT the geometric angle!
     */
    getPerimeterPointAtParametricAngle(theta) {
        // Point on unrotated ellipse subtending circle
        const thetaRadians = this.radians(theta)
        const xBase = this.rx * Math.cos(thetaRadians)
        const yBase = this.ry * Math.sin(thetaRadians)

        // Apply the rotation matrix to the base point
        // x' = x*cos(rot) - y*sin(rot)
        // y' = x*sin(rot) + y*cos(rot)
        const xRotated = xBase * this.cosA - yBase * this.sinA
        const yRotated = xBase * this.sinA + yBase * this.cosA

        // 3. Translate back to the ellipse's center
        return [this.cx + xRotated, this.cy + yRotated]
    }
    
    isPointInEllipse(x, y) {
        // Translate point to origin relative to ellipse center
        const dx = x - this.cx
        const dy = y - this.cy

        // Rotate point inversely to align with axis
        const rotX = dx * this.cosInvA - dy * this.sinInvA
        const rotY = dx * this.sinInvA + dy * this.cosInvA

        // Apply the ellipse equation: (x/rx)^2 + (y/ry)^2 <= 1
        const disc = (rotX*rotX) / (this.rx2) + (rotY * rotY) / (this.ry2)
        return disc <= 1
    }

    /**
     * Determines intersection points of line segment [x1, y1] to [x2,y2]
     * and a rotated ellipse.
     */
    scanLine(x1, y1, x2, y2) {
        // Translate and rotate the line segment to the ellipse's local space
        const tx1 = x1 - this.cx
        const ty1 = y1 - this.cy
        const tx2 = x2 - this.cx
        const ty2 = y2 - this.cy

        const lx1 = tx1 * this.cosInvA - ty1 * this.sinInvA
        const ly1 = tx1 * this.sinInvA + ty1 * this.cosInvA
        const lx2 = tx2 * this.cosInvA - ty2 * this.sinInvA
        const ly2 = tx2 * this.sinInvA + ty2 * this.cosInvA

        // Normalize radii (treat ellipse as unit circle)
        const nlX1 = lx1 / this.rx
        const nlY1 = ly1 / this.ry
        const nlX2 = lx2 / this.rx
        const nlY2 = ly2 / this.ry

        // Line segment equation: P = P1 + t * (P2 - P1), 0 <= t <= 1
        const dx = nlX2 - nlX1
        const dy = nlY2 - nlY1

        // Quadratic coefficients (at^2 + bt + c = 0)
        const a = dx*dx + dy*dy
        const b = 2 * (nlX1 * dx + nlY1 * dy)
        const c = nlX1 * nlX1 + nlY1 * nlY1 - 1

        const discriminant = b * b - 4 * a * c
        const intersections = [];

        if (discriminant >= 0) {
            const sqrtDisc = Math.sqrt(discriminant)
            const t1 = (-b - sqrtDisc) / (2 * a)
            const t2 = (-b + sqrtDisc) / (2 * a)

            // Check if intersections lie on the segment (0 <= t <= 1)
            ;[t1, t2].forEach(t => {
                if (t >= 0 && t <= 1) {
                    // Find intersection in normalized space
                    const intX = nlX1 + t * dx
                    const intY = nlY1 + t * dy

                    // Transform intersection pt back to original space
                    const finalX = (intX * this.rx) * this.cosA - (intY * this.ry) * this.sinA + this.cx;
                    const finalY = (intX * this.rx) * this.sinA + (intY * this.ry) * this.cosA + this.cy;
                    intersections.push({ x: finalX, y: finalY });
                }
            });
        }
        return intersections
    }
}