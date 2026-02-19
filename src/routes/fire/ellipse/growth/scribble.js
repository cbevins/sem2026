import {findNormalIntersection, lineSlope, lineSlopeToAngle, lineSlopeToBearing,
        vectorEndpoint, calculateDestinationPoint } from './Geometry.js'

const a = {x:100, y: 300}
const b = {x:300, y:300}
const c = {x:300, y:100}

// Intersection point between line segment AC and point B
const i = findNormalIntersection(b.x, b.y, a.x, a.y, c.x, c.y)

function vector(fromPt, toPt) {
    let a = fromPt
    let b = toPt
    let dy = b.y - a.y
    let dx = b.x - a.x
    let angle = Math.atan2(dy, dx) * 180 / Math.PI
    let slope = (dx===0) ? 9999999 : dy/dx
    let bearing = (450 - angle) % 360
    // Back-calculate B from I using angle and length
    let radians = bearing * Math.PI / 180
    let length = Math.sqrt(dx*dx + dy*dy)
    let endpoint = {
        x: a.x + length * Math.cos(radians),
        y: a.y + length * Math.sin(radians)
    }
    return {dx, dy, slope, angle, bearing, length, endpoint}
}

console.log('\nI -> B')
let {dx, dy, slope, angle, bearing, length, endpoint:e} = vector(i, b)
console.log(`\nI->B : dy=${dy}, dx=${dx}, slope=${slope} angle=${angle} bearing=${bearing} length=${length}`)
console.log(`Vector from I at bearing ${bearing} ends at B [${e.x}, ${e.y}]`);

console.log('\nB -> I')
({dx, dy, slope, angle, bearing, length, endpoint:e} = vector(b, i))
console.log(`dy=${dy}, dx=${dx}, slope=${slope} angle=${angle} bearing=${bearing} length=${length}`)
console.log(`Vector from B at bearing ${bearing} ends at I [${e.x}, ${e.y}]`)
