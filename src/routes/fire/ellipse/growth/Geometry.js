// All points are objects with {x, y}
// as *easting* and *northing*
// NOTE: So although Math.atan2() normaly take (dy, dx) as its arguments,
// we reverse the order here becaase easting/northing are reversed
// from their Cartesian counterparts
export function angleBetweenPoints(a, b) {
    let dy = b.y - a.y
    let dx = b.x - a.x
    return Math.atan2(dx, dy) * 180 / Math.PI
}

// Returns angle (radians) between 3 points A, B, and C,
// where each point is an object with {x, y}
export function angleRadians(A, B, C) {
    // Vectors AB and BC
    var AB = { x: A.x - B.x, y: A.y - B.y }
    var CB = { x: C.x - B.x, y: C.y - B.y }
    // Calculate angles of each vector relative to x-axis
    var dot = AB.x * CB.x + AB.y * CB.y
    var cross = AB.x * CB.y - AB.y * CB.x
    // Returns angle in range -PI to PI
    return Math.atan2(cross, dot)
}

export function degrees(radians) { return radians * 180 / Math.PI }
export function radians(degrees) {return degrees * Math.PI / 180 }

// All points are objects with {x, y}
// as *easting* and *northing*
// NOTE: So although Math.atan2() normaly take (dy, dx) as its arguments,
// we reverse the order here becaase easting/northing are reversed
// from their Cartesian counterparts
export function bearingBetweenPoints(a, b) {
    let dy = b.y - a.y
    let dx = b.x - a.x
    let angle = Math.atan2(dx, dy) * 180 / Math.PI
    let bearing = (450 - angle) % 360
    return bearing
}

// Given a vector starting point, bearing, and distance,
// returns its end point
export function bearingEndpoint(pt, bearing, dist) {
    const radians = bearing * Math.PI / 180
    return {
        x: pt.x + dist * Math.cos(radians),
        y: pt.y + dist * Math.sin(radians)
    }
}

export function expansionBearing(a, b, c) {
    const i = midPoint(a, c)
    return bearingBetweenPoints(i, b)
}

export function midPoint(a, b) {
    return {x: (a.x + b.x)/2, y: (a.y + b.y)/2}
}

// Adds bearings to an array of points
// Each pt must be object with {x,y}
export function addBearings(pts, x='x', y='y') {
    let prev = pts[pts.length-2]
    for(let i=0; i<pts.length-1; i++) {
        const a = {x: prev[x], y: prev[y]}
        const b = {x: pts[i][x], y: pts[i][y]}
        const c = {x: pts[i+1][x], y: pts[i+1][y]}
        const m = midPoint(a, c)
        pts[i].mx = m.x
        pts[i].my = m.y
        pts[i].angle = angleBetweenPoints(m, b)
        pts[i].bearing = bearingBetweenPoints(m, b)
        prev = pts[i]
    }
    pts[pts.length-1].bearing = pts[0].bearing
    return pts
}

/**
 * Finds the intersection point of the normal from a point P to a line AB.
 * @param {object} p - The point not on the line (e.g., {x: 5, y: 5}).
 * @param {object} a - The first point on the line (e.g., {x: 0, y: 0}).
 * @param {object} b - The second point on the line (e.g., {x: 10, y: 0}).
 * @returns {object|null} The intersection point {x, y}, or null if the line is a point.
 */
export function normalIntersection(px, py, ax, ay, bx, by) {
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
