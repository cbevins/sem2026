import { fireEllipse } from './lightweightFireEllipse.js'

export function perimeterWalker(cx, cy, rx, ry, rotationDegrees, step) {
    const rotRad = rotationDegrees * Math.PI / 180
    const cells = new Set()
    cx = Math.round(cx)
    cy = Math.round(cy)

    // Travel north until we reach beyong the perimeter
    // Note that if the ellipse is smaller than step, there will only be 1 perimeter cell
    let px = cx
    let py = cy
    while (insideEllipse(px, py+1, cx, cy, rx, ry, rotRad)) {
        py += step
    }
    let cell = [px, py, 'O']
    cells.add(cell)
    // console.log(cells.size, cell)
    const x0 = px
    const y0 = py
    const limit = 5000

    // Traverse northerly, preferring to head north, then north-east, and finally east
    let travel = 'north'
    let done = false
    let n = 0
    while(! done) {
        cell = []
        if (travel === 'north') {   // test sequence is north -> northeast -> east
            if (insideEllipse(px, py+1, cx, cy, rx, ry, rotRad)) {    // check to the north
                py = py + 1
                cell =[px, py, 'N']
            } else if (insideEllipse(px+1, py+1, cx, cy, rx, ry, rotRad)) {    // check to the north-east
                px = px + 1
                py = py + 1
                cell =[px, py, 'NE']
            } else if (insideEllipse(px+1, py, cx, cy, rx, ry, rotRad)) { // check to the east
                px = px + 1
                cell = [px, py, 'E']
            } else {
                travel = 'east'
            }
        }
        else if (travel === 'east') {   // test sequence is east -> southeast -> south
            if (insideEllipse(px+1, py, cx, cy, rx, ry, rotRad)) { // check to the east (redundant of coming from north)
                px = px + 1
                cell = [px, py, 'E']
            } else if (insideEllipse(px+1, py-1, cx, cy, rx, ry, rotRad)) { // check to the south-east
                px = px + 1
                py = py - 1
                cell =  [px, py, 'SE']
            } else if (insideEllipse(px, py-1, cx, cy, rx, ry, rotRad)) { // check to the south
                py = py - 1
                cell = [px, py, 'S']
            } else {
                travel = 'south'
            }
        }
        else if (travel === 'south') {  // test sequence is south -> southwest -> west
            if (insideEllipse(px, py-1, cx, cy, rx, ry, rotRad)) { // check to the south (may be redundant)
                py = py - 1
                cell = [px, py, 'S']
            } else if (insideEllipse(px-1, py-1, cx, cy, rx, ry, rotRad)) { // check to the south-west
                px = px - 1
                py = py - 1
                cell = [px, py, 'SW']
            } else if (insideEllipse(px-1, py, cx, cy, rx, ry, rotRad)) { // check to the west
                px = px - 1
                cell = [px, py, 'W']
            } else {
                travel = 'west'
            }
        }
        else if (travel === 'west') {   // test sequence is west -> northwest -> north
            if (insideEllipse(px-1, py, cx, cy, rx, ry, rotRad)) { // check to the west (redundant when coming from the south)
                px = px - 1
                cell = [px, py, 'W']
            } else if (insideEllipse(px-1, py+1, cx, cy, rx, ry, rotRad)) { // check to the north-west
                px = px - 1
                py = py + 1
                cell = [px, py, 'NW']
            } else if (insideEllipse(px, py+1, cx, cy, rx, ry, rotRad)) { // check to the north
                py = py + 1
                cell = [px, py, 'N']
            } else {
                travel = 'north'
            }
        }
        if (cell.length) {
            if (px === x0 && py === y0) {
                done = true
            } else {
                cells.add(cell)
                // console.log(cells.size, travel, cell)
            }
        }
        if (++n > limit) {
            done = true
            console.log('Exceeded limit of', limit)
            console.log(`cx=${cx}, cy=${cy}, rx=${rx}, ry=${ry}, rot=${rotationDegrees}, step=${step}`)
        }
    }
    return [...cells]
}
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
function insideEllipse(px, py, cx, cy, rx, ry, rotation) {
    // 1. Translate point to origin relative to ellipse center
    const dx = px - cx;
    const dy = py - cy;

    // 2. Rotate point back by the negative rotation angle (counter-clockwise)
    // to align it with the ellipse's local axis
    const cosA = Math.cos(-rotation);
    const sinA = Math.sin(-rotation);

    const xLocal = dx * cosA - dy * sinA;
    const yLocal = dx * sinA + dy * cosA;

    // 3. Apply the standard axis-aligned ellipse formula to get normalized distance
    // Use multiplication instead of Math.pow for better performance
    const ndist = (xLocal * xLocal) / (rx * rx) + (yLocal * yLocal) / (ry * ry);
    return ndist <= 1.0;
}

function example() {
    // parameters
    let lwr = 1.1   // 1.1 fails, but 1.4 is ok
    let headRos = 100

    // constants
    let duration = 1
    let ignX = 0
    let ignY = 0
    let bearing = 90

    let ellipse = fireEllipse(headRos, lwr, duration, ignX, ignY, bearing)
    const {length, width, cX, cY, majorDist, minorDist, headDeg, radRot} = ellipse

    const step = 1
    const cells = perimeterWalker(cX, cY, majorDist, minorDist, headDeg, step)
    console.log(cells)
}
example()