// Refer to src/routes/fire/ellipse/growth/Geometry.js for some angle functions
// Refer to lib/fire/lib/geometry for octogon and other polygon vertices
export class FireGeometry {
    // Returns bearing (degrees from north) between directed pair of
    // Projected Coordinate System points
    static bearing(easting1, northing1, easting2, northing2) {
        let dy = northing2 - northing1
        let dx = easting2 - easting1
        let angle = Math.atan2(dy, dx) * 180 / Math.PI
        let bearing = (450 - angle) % 360
        return bearing
    }
    
    static degrees(radians) { return radians * 180 / Math.PI }

    // CHANGE TO EASTING, NORTHING
    static expansionBearing(a, b, c) {
        const i = FireGeometry.midPoint(a, c)
        return FireGeometry.bearingBetweenPoints(i, b)
    }

    // If result < 0, point is to the right.
    // If result > 0, point is to the left.
    // If result===0, point is on the line
    static pointSide(xp, yp, x1, y1, x2, y2) {
        return (x2-x1)*(yp-y1) - (y2-y1)*(xp-x1)
    }
    static isCollinear(pointSide) { return pointSide===0 }
    static isLeft(pointSide) { return pointSide > 0 }
    static isRight(pointSide) { return pointSide < 0 }

    static midPoint(aEast, aNorth, bEast, bNorth) {
        return {east: (aEast + bEast)/2, north: (aNorth + bNorth)/2}
    }

    // Returns an array of fire perimeter re-seed point objects {east, north}
    // such that the distance between any two neighboring point
    // along the fire perimeter never exceeds 'maxDist'
    static getSeedPoints(perim, maxDist=100) {
        const points = []
        console.log(`Reseeding ${perim.length} segments for max dist ${maxDist}`)
        let prev = perim[perim.length-1]
        let segs = 0
        let seeds = 0
        for(let i=0; i<perim.length; i++) {
            const next = perim[i]
            const pts = FireGeometry.getSegmentSeedPoints(prev, next, maxDist)
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
    static getSegmentSeedPoints(prev, next, maxDist=100) {
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

    /**
     * Finds the intersection point of the normal from a point P to a line AB.
     * @param {object} p - The point not on the line (e.g., {x: 5, y: 5}).
     * @param {object} a - The first point on the line (e.g., {x: 0, y: 0}).
     * @param {object} b - The second point on the line (e.g., {x: 10, y: 0}).
     * @returns {object|null} The intersection point {x, y}, or null if the line is a point.
     */
    static normalIntersection(px, py, ax, ay, bx, by) {
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

        return {east: intersectionX, north: intersectionY }
    }

    static radians(degrees) {return degrees * Math.PI / 180 }

    // Returns end point coordinates object {east, north}
    // of some vector at some distance
    static vectorEndpoint(easting, northing, bearing, distance) {
        const radians = bearing * Math.PI / 180
        return {
            east: easting + distance * Math.sin(radians),
            north: northing + distance * Math.cos(radians)
        }
    }
}