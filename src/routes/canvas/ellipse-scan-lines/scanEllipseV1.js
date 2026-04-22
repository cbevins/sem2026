export function scanEllipse(length, width, headDeg, ignX, ignY, cX, cY, step=1, dir='h') {
    const lines = []
    // Use the ellipse length as the bounding radius
    const xMin = ignX - length
    const xMax = ignX + length
    const yMin = ignY - length
    const yMax = ignY + length
    const rx = length / 2
    const ry = width / 2

    const angle = headDeg * Math.PI / 180
    const cosUnrotate = Math.cos(-angle);
    const sinUnrotate = Math.sin(-angle);
    const cosRotate = Math.cos(angle);
    const sinRotate = Math.sin(angle);

    if (dir === 'h') {
        // Start with ignition point and go north
        for(let y=ignY; y<= yMax; y+= step) {
            const pts = scanLine(xMin, y, xMax, y, cX, cY, rx, ry,
                cosRotate, sinRotate, cosUnrotate, sinUnrotate)
            if (pts.length < 2) break
            lines.push(pts)
        }
        // Start with ignition point and go south
        for(let y=ignY-step; y>= yMin; y-= step) {
            const pts = scanLine(xMin, y, xMax, y, cX, cY, rx, ry,
                cosRotate, sinRotate, cosUnrotate, sinUnrotate)
            if (pts.length < 2) break
            lines.push(pts)
        }
    }else {
        // Start with ignition point and east
        for(let x=ignX; x<= xMax; x+= step) {
            const pts = scanLine(x, yMin, x, yMax, cX, cY, rx, ry,
                cosRotate, sinRotate, cosUnrotate, sinUnrotate)
            if (pts.length < 2) break
            lines.push(pts)
        }
        // Start with ignition point and go west
        for(let x=ignX-step; x>= xMin; x-= step) {
            const pts = scanLine(x, yMin, x, yMax, cX, cY, rx, ry,
                cosRotate, sinRotate, cosUnrotate, sinUnrotate)
            if (pts.length < 2) break
            lines.push(pts)
        }
    }
    return lines
}

/**
 * Determines intersection points of a line segment and a rotated ellips
 * @param {number} x1, y1 - Line start point
 * @param {number} x2, y2 - Line end point
 * @param {number} cx, cy - Ellipse center
 * @param {number} rx, ry - Ellipse radii
 * @param {number} angle - Rotation angle in radians
 * @returns {Array<{x: number, y: number}>} Array of intersection points
 */
function scanLine(x1, y1, x2, y2, cx, cy, rx, ry,
        cosRotate, sinRotate, cosUnrotate, sinUnrotate) {
    // 1. Translate and rotate the line segment to the ellipse's local space
    const tx1 = x1 - cx;
    const ty1 = y1 - cy;
    const tx2 = x2 - cx;
    const ty2 = y2 - cy;

    const lx1 = tx1 * cosUnrotate - ty1 * sinUnrotate;
    const ly1 = tx1 * sinUnrotate + ty1 * cosUnrotate;
    const lx2 = tx2 * cosUnrotate - ty2 * sinUnrotate;
    const ly2 = tx2 * sinUnrotate + ty2 * cosUnrotate;

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
                const finalX = (intX * rx) * cosRotate - (intY * ry) * sinRotate + cx;
                const finalY = (intX * rx) * sinRotate + (intY * ry) * cosRotate + cy;
                intersections.push([finalX, finalY]);
            }
        });
        if (intersections.length === 1) {
            console.log(`scanEllipse() Found just 1 scanline point for [${x1}, ${y1}], [${x2}, ${y2}]`)
            intersections.push(intersections[0])
        }
    }
    return intersections;
}
