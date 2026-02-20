/**
 * Takes an array of polygon points as {x,y} objects and calculates
 * an expansion bearing for each point based on its neighbors.
 * For each A-B-C triplet, the bearing is the vector from
 * the midpoint of AB to C.
 * @param {Array} pts array of perimeter points as {x,y} objects 
 *      AND whose last element is the same as the first element
 * @param {string} x Maps point[x] as the x coordinate 
 * @param {string} y Maps point[y] as the y coordinate 
 * @returns Polygon points array with a 'bearing' property at each point.
 */
export function addBearings(pts, x='x', y='y') {
    let prev = pts[pts.length-2]
    for(let i=0; i<pts.length-1; i++) {
        const a = {x: prev[x], y: prev[y]}
        const b = {x: pts[i][x], y: pts[i][y]}
        const c = {x: pts[i+1][x], y: pts[i+1][y]}
        const m = midPoint(a, c)
        // pts[i].mx = m.x
        // pts[i].my = m.y
        // pts[i].angle = angleBetweenPoints(m, b)
        pts[i].bearing = bearingBetweenPoints(m, b)
        prev = pts[i]
    }
    pts[pts.length-1].bearing = pts[0].bearing
    return pts
}

// All points are objects with {x, y} as *easting* and *northing*
export function angleBetweenPoints(a, b) {
    let dy = b.y - a.y
    let dx = b.x - a.x
    return Math.atan2(dy, dx) * 180 / Math.PI
}

// All points are objects with {x, y} as *easting* and *northing*
export function bearingBetweenPoints(a, b) {
    let dy = b.y - a.y
    let dx = b.x - a.x
    let angle = Math.atan2(dy, dx) * 180 / Math.PI
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

export function midPoint(a, b) {
    return {x: (a.x + b.x)/2, y: (a.y + b.y)/2}
}

export function degrees(radians) { return radians * 180 / Math.PI }
export function radians(degrees) {return degrees * Math.PI / 180 }
