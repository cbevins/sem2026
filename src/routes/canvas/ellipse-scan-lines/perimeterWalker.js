/**
 * 
 * @param {number} cx Ellipse center x-coordinate in Projected Coordinate System
 * @param {number} cy Ellipse center y-coordinate in Projected Coordinate System
 * @param {number} rx Ellipse major semi-axis (radius) in PCS units
 * @param {number} ry Ellipse minor semi-axis (radius) in PCS units
 * @param {number} rotationDegrees Ellipse rotation counter clockwise from Cartesian x-axis
 * @param {number} cellSize raster cell size in PCS units.
 *  For example, if PCS eastings/northings  are in feet, then 1, 10, or 100-ft cell size might be appropriate.
 *  But if the PCS is in decimal degrees latitude/longitude, then a cell size of 0.00001 (3.6 ft) is better.
 * @param {number} sigma Tolerance for determining if current point is back at the starting point.
 * @returns 
 */
export function perimeterWalker(cx, cy, rx, ry, rotationDegrees, cellSize, sigma=0.000001) {
    const rotRad = rotationDegrees * Math.PI / 180
    const cells = new Set()

    // Travel north until we reach beyong the perimeter
    // Note that if the ellipse is smaller than cellSize, there will only be 1 perimeter cell
    let px = cx
    let py = cy
    while (insideEllipse(px, py+1, cx, cy, rx, ry, rotRad)) {
        py += cellSize
    }
    let cell = [px, py]
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
                cell = [px, py]
            } else if (insideEllipse(px+1, py+1, cx, cy, rx, ry, rotRad)) {    // check to the north-east
                px = px + 1
                py = py + 1
                cell = [px, py]
            } else if (insideEllipse(px+1, py, cx, cy, rx, ry, rotRad)) { // check to the east
                px = px + 1
                cell = [px, py]
            } else {
                travel = 'east'
            }
        }
        else if (travel === 'east') {   // test sequence is east -> southeast -> south
            if (insideEllipse(px+1, py, cx, cy, rx, ry, rotRad)) { // check to the east (redundant of coming from north)
                px = px + 1
                cell = [px, py]
            } else if (insideEllipse(px+1, py-1, cx, cy, rx, ry, rotRad)) { // check to the south-east
                px = px + 1
                py = py - 1
                cell = [px, py]
            } else if (insideEllipse(px, py-1, cx, cy, rx, ry, rotRad)) { // check to the south
                py = py - 1
                cell = [px, py]
            } else {
                travel = 'south'
            }
        }
        else if (travel === 'south') {  // test sequence is south -> southwest -> west
            if (insideEllipse(px, py-1, cx, cy, rx, ry, rotRad)) { // check to the south (may be redundant)
                py = py - 1
                cell = [px, py]
            } else if (insideEllipse(px-1, py-1, cx, cy, rx, ry, rotRad)) { // check to the south-west
                px = px - 1
                py = py - 1
                cell = [px, py]
            } else if (insideEllipse(px-1, py, cx, cy, rx, ry, rotRad)) { // check to the west
                px = px - 1
                cell = [px, py]
            } else {
                travel = 'west'
            }
        }
        else if (travel === 'west') {   // test sequence is west -> northwest -> north
            if (insideEllipse(px-1, py, cx, cy, rx, ry, rotRad)) { // check to the west (redundant when coming from the south)
                px = px - 1
                cell = [px, py]
            } else if (insideEllipse(px-1, py+1, cx, cy, rx, ry, rotRad)) { // check to the north-west
                px = px - 1
                py = py + 1
                cell = [px, py]
            } else if (insideEllipse(px, py+1, cx, cy, rx, ry, rotRad)) { // check to the north
                py = py + 1
                cell = [px, py]
            } else {
                travel = 'north'
            }
        }
        if (cell.length) {
            if (Math.abs(px - x0) < sigma && Math.abs(py - y0) < sigma) {
                done = true
            } else {
                cells.add(cell)
                // console.log(cells.size, travel, cell)
            }
        }
        if (++n > limit) {
            done = true
            console.log('Exceeded limit of', limit)
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
