/**
 * Finds the intersection point of the normal from a point P to a line AB.
 * @param {object} p - The point not on the line (e.g., {x: 5, y: 5}).
 * @param {object} a - The first point on the line (e.g., {x: 0, y: 0}).
 * @param {object} b - The second point on the line (e.g., {x: 10, y: 0}).
 * @returns {object|null} The intersection point {x, y}, or null if the line is a point.
 */
export function findNormalIntersection(px, py, ax, ay, bx, by) {
    const dx = bx - ax
    const dy = by - ay

    // If the line segment is a single point, return null or handle as appropriate
    if (dx === 0 && dy === 0) return null

    // Calculate the parameter t for the projection of P onto the line AB
    // t = dot_product(AP, AB) / dot_product(AB, AB)
    const t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)

    // The intersection point (foot of the perpendicular)
    // is found by interpolating along the line AB using parameter t
    const intersectionX = ax + t * dx
    const intersectionY = ay + t * dy

    return { x: intersectionX, y: intersectionY }
}

/**
 * Calculates slope of vector from point 'a' to point 'b'
 * @returns 'm', slope of the line between the two points
 */
export function lineSlope(x1, y1, x2, y2) {
    const dy = y2 - y1
    const dx = x2 - x1
    return (dx===0) ? 9999999 : dy/dx
}

export function lineSlopeToAngle(slope) {
    // 1. Calculate angle in radians from horizontal (atan)
    // 2. Convert to degrees (180/PI)
    return Math.atan(slope) * (180 / Math.PI)
}

export function lineSlopeToBearing(slope) {
    // 1. Calculate angle in radians from horizontal (atan)
    // 2. Convert to degrees (180/PI)
    let angleDegrees = Math.atan(slope) * (180 / Math.PI)
    
    // 3. Convert Cartesian angle to Compass Bearing
    // atan returns -90 to +90 (East-West).
    // Compass North is 0, clockwise.
    let bearing = 90 - angleDegrees
    
    // Normalize to 0-360 range
    return (bearing + 360) % 360
}
