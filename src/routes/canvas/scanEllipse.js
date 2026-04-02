/**
 * Determines intersection points of a line segment and a rotated ellipse.
 * @param {number} x1, y1 - Line start point
 * @param {number} x2, y2 - Line end point
 * @param {number} cx, cy - Ellipse center
 * @param {number} rx, ry - Ellipse radii
 * @param {number} angle - Rotation angle in radians
 * @returns {Array<{x: number, y: number}>} Array of intersection points
 */
function scanLine(x1, y1, x2, y2, cx, cy, rx, ry, angle) {
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
                const finalY = (intX * rx) * Math.sin(angle) + (intY * ry) * Math.cos(angle) + cy;
                intersections.push({ x: finalX, y: finalY });
            }
        });
    }
    return intersections;
}

export function scanEllipse(e, step=10, dir='h') {
    const lines = []
    // Use the ellipse length as the bounding radius
    const xMin = e.ignX - e.length
    const xMax = e.ignX + e.length
    const yMin = e.ignY - e.length
    const yMax = e.ignY + e.length
    const major = e.length / 2
    const minor = e.width / 2
    const radians = e.headDeg * Math.PI / 180
    if (dir === 'h') {
        // Start with ignition point and go north
        for(let y=e.ignY; y<= yMax; y+= step) {
            const pts = scanLine(xMin, y, xMax, y, e.cX, e.cY, major, minor, radians)
            if (pts.length < 2) break
            lines.push(pts)
        }
        // Start with ignition point and go south
        for(let y=e.ignY-step; y>= yMin; y-= step) {
            const pts = scanLine(xMin, y, xMax, y, e.cX, e.cY, major, minor, radians)
            if (pts.length < 2) break
            lines.push(pts)
        }
    }else {
        // Start with ignition point and east
        for(let x=e.ignX; x<= xMax; x+= step) {
            const pts = scanLine(x, yMin, x, yMax, e.cX, e.cY, major, minor, radians)
            if (pts.length < 2) break
            lines.push(pts)
        }
        // Start with ignition point and go west
        for(let x=e.ignX-step; x>= xMin; x-= step) {
            const pts = scanLine(x, yMin, x, yMax, e.cX, e.cY, major, minor, radians)
            if (pts.length < 2) break
            lines.push(pts)
        }
    }
    return lines
}