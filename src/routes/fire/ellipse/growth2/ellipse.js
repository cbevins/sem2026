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
const atan = Math.atan
const atan2 = Math.atan
const hypot = Math.hypot
const cos = Math.cos
const sin = Math.sin
const sqrt = Math.sqrt

function distance(x1, y1, x2, y2) { return Math.sqrt((x2-x1)**2 + (y2-y1)**2) }
function degrees(radians) { return (radians * 180) / Math.PI }
function radians(degrees) { return (degrees * Math.PI) / 180 }
// Following is same as Behave thetaPerimeterPoint()
function pointOnEllipse(angle, cx, cy, a, b, headDeg=0) {
    const rad = radians(angle+headDeg)
    const x = cx + a * Math.cos(rad)
    const y = cy + b * Math.sin(rad)
    return {x, y}
}
function angle3(ax, ay, bx, by, cx, cy) {
    // Calculate the vectors BA and BC
    const bax = ax - bx
    const bay = ay - by
    const bcx = cx - bx
    const bcy = cy - by

    // Calculate the angle using atan2
    // Math.atan2(y, x) returns the angle in the range (-PI, PI]
    const angleA = Math.atan2(bay, bax)
    const angleC = Math.atan2(bcy, bcx)

    // Calculate the difference and normalize to the range [0, 2*PI)
    let angle = angleC - angleA
    if (angle < 0) angle += 2 * Math.PI
    return degrees(angle)
}

// Assume a fire ignites at some point under uniform burning conditions.
// All we know about the fire is its length-to-width ratio
// Consider the ignition point to be at the origin [0,0] of a Cartesian coordinate system,
// with the head of the fire traveling along the positive x-axis.
export class Ellipse {
    constructor(lwr=2) {
        // Length-to-width ratio
        this.lwr = lwr

        // Width-to-length ratio
        this.wlr =  1 / this.lwr

        // Ignition point
        this.ign = {x: 0, y: 0}

        // Allow the length to equal 1, so all other elliptical properties are ratios of the length.
        this.L = {dist: 1}
        this.W = {dist: 1 / this.lwr}

        // The ellipse has a major semi-axis 'a' and a minor semi-axis 'b'
        this.a = {dist: this.L.dist / 2}
        this.b = {dist: this.W.dist / 2}
        const a = this.a.dist   // shorthand
        const b = this.b.dist   // shorthand
        
        // Eccentricity (0=circle, 1=line) has several forms
        this.e1 = sqrt(this.lwr**2 - 1) / this.lwr     // Behave
        this.e2 = sqrt(1-(b**2/a**2))
        this.e3 = sqrt(1-(b/a)**2)
        this.e4 = sqrt((a**2 - b**2)) / a
        this.e = this.e1        // prefer to use this method
        const e = this.e        // shorthand
    
        // Ellipse foci
        this.foci = {dist: sqrt(a**2 - b**2)}

        // Heading distance
        this.head = {
            dist: (1+e) * a,
            x: (1+e) * a,
            y: 0}

        // Backing distance
        this.back = {
            dist: (1-e) * a,
            x: -(1-e) * a,
            y: 0}

        // Back-to-head ratio
        this.hbr = this.back.dist / this.head.dist

        // Center point
        this.center = {
            dist: a - this.back.dist,
            x: a - this.back.dist,
            y: 0}
    }
    betaAngle(perimX, perimY) {
        return angle3(
            this.center.x, this.center.y,
            this.ign.x, this.ign.y,
            perimX, perimY)
    }
    betaDist(perimX, perimY) {
        return distance(perimX, perimY, this.ign.x, this.ign.y)
    }

    thetaPoint(deg) {
        const {a, b, center} = this
        const p = pointOnEllipse(deg, center.x, center.y, a.dist, b.dist)
        const dist = distance(center.x, center.y, p.x, p.y)
        const betaAngle = this.betaAngle(p.x, p.y)
        const betaDist = this.betaDist(p.x, p.y)
        return {x: p.x, y: p.y, dist, betaDist, betaAngle}
    }
}

//------------------------------------------------------------------------------
// Output
//------------------------------------------------------------------------------

function fix(v, dec=4) { return parseFloat(v.toFixed(dec))}

export function ellipseData(e) {
    return {
        lwr: fix(e.lwr),
        wlr: fix(e.wlr),
        L: fix(e.L.dist),
        W: fix(e.W.dist),
        a: fix(e.a.dist),
        b: fix(e.b.dist),
        e: fix(e.e),
        head: fix(e.head.dist),
        back: fix(e.back.dist),
        hbr: fix(e.hbr),
        'ctr x': fix(e.center.x)
    }
}

export function pointsData(e, degStep) {
    const data = []
    for(let deg=0; deg<=360; deg+=degStep) {
        const p = e.thetaPoint(deg)
        data.push({
            theta: deg,
            x: fix(p.x),
            y: fix(p.y),
            dist: fix(p.dist),
            betaDist: fix(p.betaDist),
            betaAngle: fix(p.betaAngle),
        })
    }
    return data
}