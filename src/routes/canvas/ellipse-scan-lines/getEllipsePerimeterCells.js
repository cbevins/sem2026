/**
 * Finds all grid cells containing the perimeter of a rotated ellipse.
 * @param {number} xc - Center X
 * @param {number} yc - Center Y
 * @param {number} a - Semi-major axis
 * @param {number} b - Semi-minor axis
 * @param {number} angle - Rotation angle in radians
 * @returns {Array<{x: number, y: number}>} Array of unique cell coordinates
 */
export function getEllipsePerimeterCells(xc, yc, a, b, angle, radStep=0.01) {
    const points = new Set();
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    
    for (let t = 0; t < Math.PI * 2; t += radStep) {
        // 1. Parametric equation of unrotated ellipse
        let x = a * Math.cos(t);
        let y = b * Math.sin(t);

        // 2. Rotate and Translate
        let rotX = x * cosA - y * sinA + xc;
        let rotY = x * sinA + y * cosA + yc;

        // 3. Map to Discrete Grid Cell
        let cellX = Math.floor(rotX);
        let cellY = Math.floor(rotY);

        points.add(`${cellX},${cellY}`);
    }

    // Convert Set back to Array of {x, y} objects
    return Array.from(points).map(p => {
        const [x, y] = p.split(',').map(Number);
        return { x, y };
    });
}
