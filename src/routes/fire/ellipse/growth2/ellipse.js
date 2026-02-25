/**
 * L/W  b/a     e
 * 1    1       0.000   Circle
 * 1.1  0.909   0.416   Slightly oval
 * 1.5  0.667   0.745   Moderate oval
 * 2    0.500   0.866   Distinct oval
 * 3    0.333   0.943   Elongated oval
 * 5    0.200   0.980   Highly Elongated
 * 10   0.100   0.995   Very thin ellipse
 */

// Assume a fire ignites at some point under uniform burning conditions.
// All we know about the fire is its length-to-width ratio
// Consider the ignition point to be at the origin [0,0] of a Cartesian coordinate system,
// with the head of the fire traveling along the positive x-axis.
export function ellipse(lwr=2) {
    const atan = Math.atan
    const atan2 = Math.atan
    const hypot = Math.hypot
    const cos = Math.cos
    const sin = Math.sin
    const sqrt = Math.sqrt

    // width-to-length ratio
    const wlr =  1 / lwr

    // ignition point
    const ign = {x: 0, y: 0}

    // Allow the length to equal 1, so all other elliptical properties are ratios of the length.
    const L = {dist: 1}          // 'd' is for 'distance'
    const W = {dist: 1 / lwr}

    // The ellipse has 2 major semi-axis 'a1' and 'a2', and two minor semi-axis 'b1' and 'b2'
    const a1 = {dist: L.dist / 2}
    const a2 = {dist: L.dist / 2}
    const b1 = {dist: W.dist / 2}
    const b2 = {dist: W.dist / 2}

    // Eccentricity (0=circle, 1=line) has several forms
    const e = {
        e1: sqrt(lwr**2 - 1) / lwr,     // Behave
        e2: sqrt(1-(b1.dist**2/a1.dist**2)),
        e3: sqrt(1-(b1.dist/a1.dist)**2),
        e4: sqrt((a1.dist**2 - b1.dist**2)) / a1.dist
    }
    // Ellipse foci
    const foci = {dist: sqrt(a1.dist**2 - b1.dist**2)}

    // Heading distance
    const head = {dist: (1+e.e1) * a1.dist}

    // Backing distance
    const back = {dist: (1-e.e1) * a1.dist}

    // Back-to-head ratio
    const hbr = back.dist / head.dist

    // Center point
    const center = {
        dist: a1.dist - back.dist, x: a1.dist - back.dist, y: 0}

    // Points at 0, 90, 135, 180 degrees
    const points = []
    for(let a=0; a<360; a++) {
        const p = pointOnEllipse(a, ign.x, ign.y, a1.dist, b1.dist)
        const dist = distance(center.x, center.y, p.x, p.y)
        points.push({x: p.x, y: p.y, dist})
    }

    return {
        lwr, L, W, a1, a2, b1, b2, e, foci, hbr, head, ign, back, wlr, center, points
    }
}
function distance(x1, y1, x2, y2) { return Math.sqrt((x2-x1)**2, (y2-y1)**2) }
function radians(degrees) { return (degrees * Math.PI) / 180 }
function degrees(radians) { return (radians * 180) / Math.PI }
function pointOnEllipse(angle, cx, cy, a, b) {
    const rad = radians(angle)
    const x = cx + a * Math.cos(rad)
    const y = cy + b * Math.sin(rad)
    return {x, y}
}

//------------------------------------------------------------------------------
// Output
//------------------------------------------------------------------------------

function fix(v, dec=4) { return parseFloat(v.toFixed(dec))}

export function ellipseTable() {
    const table = []
    function row(r) {
        return {
            lwr: fix(r.lwr),
            wlr: fix(r.wlr),
            L: fix(r.L.dist),
            W: fix(r.W.dist),
            a1: fix(r.a1.dist),
            // a2:r.a2.dist,
            b1: fix(r.b1.dist),
            // b2:r.b2.dist,
            e1:fix(r.e.e1),
            // e2:fix(r.e.e2),
            // e3:fix(r.e.e3),
            // e4:fix(r.e.e4),
            head: fix(r.head.dist),
            back: fix(r.back.dist),
            hbr: fix(r.hbr),
            'ctr x': fix(r.center.x),
            px0: fix(r.points[0].x),
            py0: fix(r.points[0].y),
        }
    }
    for(let i=1; i<=2; i+=0.1)
        table.push(row(ellipse(i)))
    for(let i=2.0; i<=10; i+=0.5)
        table.push(row(ellipse(i)))
    return table
}

export function pointsTable() {
    const table = []
    function row(r) {
        return {
            lwr: fix(r.lwr),
            wlr: fix(r.wlr),
            px0: fix(r.points[0].x),
            py0: fix(r.points[0].y),
            dist0: fix(r.points[0].dist),
            px45: fix(r.points[45].x),
            py45: fix(r.points[45].y),
            dist45: fix(r.points[45].dist),
            px90: fix(r.points[90].x),
            py90: fix(r.points[90].y),
            dist90: fix(r.points[90].dist),
            px135: fix(r.points[135].x),
            py135: fix(r.points[135].y),
            dist135: fix(r.points[135].dist),
            px180: fix(r.points[180].x),
            py180: fix(r.points[180].y),
            dist180: fix(r.points[180].dist),
            // px270: fix(r.points[270].x),
            // py270: fix(r.points[270].y),
        }
    }
    for(let i=1; i<=2; i+=0.5)
        table.push(row(ellipse(i)))
    return table
}

// console.table(ellipseTable())
// console.table(pointsTable())