/**
 * 
 * @param {array} perim Closed polygon array of [east, north] coordinates
 * where the first and last array elements are neighbors
 * @param {function} method Function with signature:
 *          method(east, north, time, duration, bearing)
 *      that returns an expansion point [east, north].
 * @returns A new (same sized) array of expansion points
 *  without any intersection detection or removal
 */
export function expandPerim(perim, method=demoMethod, time=1, duration=1, clockwise=true) {
    const perim1 = []
    let prev = perim[0]
    for(let i=0; i<perim.length; i++) {
        const ctr = perim[i]
        const next = (i<perim.length-1) ? perim[i+1] : perim[0]
        perim1.push(expandPoint(prev, ctr, next, method, time, duration, clockwise))
        prev = ctr
    }
    return perim1
}

export function expandPoint(prev, ctr, next, method=demoMethod, time=1, duration=1, clockwise=true) {
    // Midpoint of base line segment connecting the prev and next neighbors
    const baseMid = midPoint(prev, next)
    // Bearing of line from baseline midpoint to the center point
    let bearing = vectorBearing(baseMid, ctr)
    // Determine if center point lies to left, right, or co-linear of base line
    const side = pointSide(ctr, prev, next)
    // If perimeter has a clockwise winding sequence...
    if (clockwise) {
        // expansion MUST be to the 'Left'
        if (isRight(side)) {
            bearing = (bearing>=180) ? bearing - 180 : bearing + 180
        }
        // Co-linear center point MUST use left-hand normal
        else if (isColinear(side)) {
            bearing = (bearing >= 90) ? bearing - 90 : 270 + bearing
        }
    }
    // new expansion point [east, west]
    return method(ctr, time, duration, bearing)
}

function demoMethod(pt, time, duration, bearing) {
    const dist = 100
    return vectorEndpoint(pt, bearing, dist)
}

export function midPoint(p1, p2) {
    return {east: (p1.east + p2.east)/2, north: (p1.north + p2.north)/2}
}

// If result < 0, point is to the right.
// If result > 0, point is to the left.
// If result===0, point is on the line
export function pointSide(x, p1, p2) {
    return (p2.east-p1.east)*(x.north-p1.north) - (p2.north-p1.north)*(x.east-p1.east)
}
export function side(x, p1, p2) {
    const d = pointSide(x, p1, p2)
    if (d < 0) return 'R'
    if (d > 0) return 'L'
    return 'C'
}
export function isColinear(pointSide) { return pointSide===0 }
export function isLeft(pointSide) { return pointSide > 0 }
export function isRight(pointSide) { return pointSide < 0 }

// Returns an array of fire perimeter re-seed point objects {east, north}
// such that the distance between any two neighboring point
// along the fire perimeter never exceeds 'maxDist'
export function perimSeedPoints(perim, maxDist=100) {
    const points = []
    console.log(`Reseeding ${perim.length} segments for max dist ${maxDist}`)
    let prev = perim[perim.length-1]
    let segs = 0
    let seeds = 0
    for(let i=0; i<perim.length; i++) {
        const next = perim[i]
        const pts = segmentSeedPoints(prev, next, maxDist)
        if (pts.length) {
            seeds += pts.length
            segs++
            points.push(...pts)
        }
        prev = next
    }
    console.log(`Need to reseed ${segs} segments with ${seeds} seed points.`)
    return points
}

// Returns an array of fire perimeter re-seed point objects {east, north}
// such that the distance between the 'prev' and 'next' neighboring ponts
// never exceeds 'maxDist'
export function segmentSeedPoints(prev, next, maxDist=100) {
    const points = []
    const dx = next.east - prev.east
    const dy = next.north - prev.north
    const dist = Math.sqrt((dx*dx)+(dy*dy))
    if (dist > maxDist) {
        const seeds = Math.trunc(dist/maxDist)
        const ratio = 1 / (seeds+1)
        // n++
        // console.log(`Need ${seeds} seeds between Points ${i-1} and ${i}`)
        // console.log('    prev', prev.east.toFixed(2), prev.north.toFixed(2))
        // console.log('    next', next.east.toFixed(2), next.north.toFixed(2))
        // console.log('    dist', dist.toFixed(2))
        for(let j=0; j<seeds; j++) {
            const east = prev.east + (j+1)* ratio * dx  // or p1.x + t * (p2.x - p1.x)
            const north = prev.north + (j+1) * ratio * dy // or p1.y + t * (p2.y - p1.y)
            points.push({east, north})
            // console.log('    seed', east.toFixed(2), north.toFixed(2))
        }
    }
    return points
}

// Returns vector bearing (degrees from north)
// between directed pair of Projected Coordinate System points
export function vectorBearing(p1, p2) {
    let dy = p2.north - p1.north
    let dx = p2.east - p1.east
    let angle = Math.atan2(dy, dx) * 180 / Math.PI
    let bearing = (450 - angle) % 360
    return bearing
}

// Returns Projected Coordinate System end point coordinates {east, north}
// given a vector start point {east, north} and a distance
export function vectorEndpoint(pt, bearing, distance) {
    const radians = bearing * Math.PI / 180
    return {
        east: pt.east + distance * Math.sin(radians),
        north: pt.north + distance * Math.cos(radians)
    }
}