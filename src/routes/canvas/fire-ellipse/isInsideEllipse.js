/**
 * Checks if a point (px, py) is inside a rotated ellipse.
 * @param {number} px - X-coordinate of the point.
 * @param {number} py - Y-coordinate of the point.
 * @param {number} cx - X-coordinate of the ellipse center.
 * @param {number} cy - Y-coordinate of the ellipse center.
 * @param {number} rx - Semi-major axis (radius on local x-axis).
 * @param {number} ry - Semi-minor axis (radius on local y-axis).
 * @param {number} rotation - Rotation angle in radians (clockwise).
 * @returns {boolean} - True if the point is inside or on the boundary.
 */
export function isInsideEllipse(px, py, cx, cy, rx, ry, rotation) {
    // 1. Translate point to origin relative to ellipse center
    const dx = px - cx
    const dy = py - cy

    // 2. Rotate point back by the negative rotation angle (counter-clockwise)
    // to align it with the ellipse's local axis
    const cosA = Math.cos(-rotation)
    const sinA = Math.sin(-rotation)

    const xLocal = dx * cosA - dy * sinA
    const yLocal = dx * sinA + dy * cosA

    // 3. Apply the standard axis-aligned ellipse formula to get normalized distance
    const ndist = (xLocal * xLocal) / (rx * rx) + (yLocal * yLocal) / (ry * ry)
    return ndist <= 1.0
}

/**
 * 
 * @param {*} rx2 rx squared
 * @param {*} ry2 ry squared
 * @param {*} cosRot  cos(-rotation)
 * @param {*} sinRot  sin(-rotation)
 * @returns 
 */
export function isInsideEllipseFast(px, py, cx, cy, rx2, ry2, cosRot, sinRot) {
    // 1. Translate point to origin relative to ellipse center
    const dx = px - cx
    const dy = py - cy
    const xLocal = dx * cosRot - dy * sinRot
    const yLocal = dx * sinRot + dy * cosRot

    // 2. Apply the standard axis-aligned ellipse formula to get normalized distance
    const ndist = (xLocal * xLocal) / rx2 + (yLocal * yLocal) / ry2
    return ndist <= 1.0
}
