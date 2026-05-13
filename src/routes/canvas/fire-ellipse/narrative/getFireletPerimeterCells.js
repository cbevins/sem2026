// TO DO - optimize by passing cos(rotation) and sin(rotation) to insideELlipse() instead of recomputing each time
/**
 * This function rasterizes a fire ellipse perimeter into a continguous clockwise sequence
 * of cell offsets relative to the fire ignition point at [0,0].
 *
 * While the fire ellipse parameters are in the client's Projected Coordinate System (PCS),
 * the returned array contains Raster Coordinate System *offsets* from the fire ignition point at [0,0]
 * as [col, row] pairs where 'row' indices increase from north to south.
 * 
 * Pavlidi's contour tracing algorithm is adapted specifically clockwise winding of a convex polygon.
 * 
 * Consider a lattice of points with equadistance spacing on a Cartesian plane.
 * The lattice contains a (possibly) rotated fire ellipse whose ignition point is at [0,0]
 * and whose center is at [cx, cy] in the user's Projected Coordinate System.
 * 
 * This function locates all the lattice boundary points that are *on* or *inside* the ellipse perimeter
 * and have one or more neighbors that are *outside* the ellipse perimeter.
 * 
 * @param {number} cx Ellipse center x-coordinate in the Projected Coordinate System
 * @param {number} cy Ellipse center y-coordinate in the Projected Coordinate System
 * @param {number} rx Ellipse major semi-axis length (radius) in PCS units
 * @param {number} ry Ellipse minor semi-axis length (radius) in PCS units
 * @param {number} rotationDegrees Ellipse rotation counter clockwise from the Cartesian x-axis
 * @param {number} spacing Distance between lattice points in PCS units (i.e., the raster cell size).
 *  For example, if PCS eastings/northings are in feet, then 1-, 10-, or 100-ft spacing might be appropriate.
 *  But if the PCS is in decimal degrees latitude/longitude, a spacing on the order of 0.0001 (36 ft)
 *  or 0.00001 (3.6 ft) would be better.
 * @returns An array of {col, row} fire ellipse perimeter raster coordinates objects
 * expressed as integer offsets from the ignition point (origin).
 * NOTE 1: The returned array contains spacing *offsets* from the origin, NOT PCS coordinates.
 * NOTE 2: the array is NOT explicitly closed.
 */
export function getFireletPerimeterCells(cx, cy, rx, ry, rotationDegrees, spacing, limit=10000) {
    const points = new Set()
    function store(pt) {
        // Store in Raster Coordinate System, not the Projected Coordinate System
        // i.e., y-coordinate should be a row offset from north, not a northing offset 
        points.add({col: Math.trunc(pt[0] / spacing), row: Math.trunc(pt[1] / spacing)})
    }

    const rotRad = rotationDegrees * Math.PI / 180
    const cosRot = Math.cos(-rotRad)
    const sinRot = Math.sin(-rotRad)
    const rxsqr = rx * rx
    const rysqr = ry * ry
    const s = spacing
    const sigma = spacing / 10
    // Travel north until we reach beyond the perimeter
    // Note that if the ellipse is smaller than spacing, there will only be 1 perimeter point
    let px = cx // + ry
    let py = cy // + ry
    while (insideEllipse(px, py+s, cx, cy, rxsqr, rysqr, cosRot, sinRot)) {
        py += spacing
    }
    let point = [px, py]
    store(point)
    // console.log(points.size, point)
    const x0 = px
    const y0 = py

    // Traverse northerly, preferring to head north, then north-east, and finally east
    let travel = 'north'
    let done = false
    let n = 0
    while(! done) {
        point = []
        if (travel === 'north') {   // test sequence is north -> northeast -> east
            if (insideEllipse(px, py+s, cx, cy, rxsqr, rysqr, cosRot, sinRot)) {  // check to the north
                py = py + s
                point = [px, py]
            } else if (insideEllipse(px+s, py+s, cx, cy, rxsqr, rysqr, cosRot, sinRot)) { // check to the north-east
                px = px + s
                py = py + s
                point = [px, py]
            } else if (insideEllipse(px+s, py, cx, cy, rxsqr, rysqr, cosRot, sinRot)) { // check to the east
                px = px + s
                point = [px, py]
            } else {
                travel = 'east'
            }
        }
        else if (travel === 'east') {   // test sequence is east -> southeast -> south
            if (insideEllipse(px+s, py, cx, cy, rxsqr, rysqr, cosRot, sinRot)) { // check to the east (redundant of coming from north)
                px = px + s
                point = [px, py]
            } else if (insideEllipse(px+s, py-s, cx, cy, rxsqr, rysqr, cosRot, sinRot)) { // check to the south-east
                px = px + s
                py = py - s
                point = [px, py]
            } else if (insideEllipse(px, py-s, cx, cy, rxsqr, rysqr, cosRot, sinRot)) { // check to the south
                py = py - s
                point = [px, py]
            } else {
                travel = 'south'
            }
        }
        else if (travel === 'south') {  // test sequence is south -> southwest -> west
            if (insideEllipse(px, py-s, cx, cy, rxsqr, rysqr, cosRot, sinRot)) { // check to the south (may be redundant)
                py = py - s
                point = [px, py]
            } else if (insideEllipse(px-s, py-s, cx, cy, rxsqr, rysqr, cosRot, sinRot)) { // check to the south-west
                px = px - s
                py = py - s
                point = [px, py]
            } else if (insideEllipse(px-s, py, cx, cy, rxsqr, rysqr, cosRot, sinRot)) { // check to the west
                px = px - s
                point = [px, py]
            } else {
                travel = 'west'
            }
        }
        else if (travel === 'west') {   // test sequence is west -> northwest -> north
            if (insideEllipse(px-s, py, cx, cy, rxsqr, rysqr, cosRot, sinRot)) { // check to the west (redundant when coming from the south)
                px = px - s
                point = [px, py]
            } else if (insideEllipse(px-s, py+s, cx, cy, rxsqr, rysqr, cosRot, sinRot)) { // check to the north-west
                px = px - s
                py = py + s
                point = [px, py]
            } else if (insideEllipse(px, py+s, cx, cy, rxsqr, rysqr, cosRot, sinRot)) { // check to the north
                py = py + s
                point = [px, py]
            } else {
                travel = 'north'
            }
        }
        if (point.length) {
            if (Math.abs(px - x0) < sigma && Math.abs(py - y0) < sigma) {
                done = true
            } else {
                store(point)
                // console.log(points.size, travel, point)
            }
        }
        if (++n > limit) {
            done = true
            throw new Error(`Exceeded limit of ${limit}`)
        }
    }
    return [...points]
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
function insideEllipse(px, py, cx, cy, rxsqr, rysqr, cosRot, sinRot) {
    // 1. Translate point to origin relative to ellipse center
    const dx = px - cx
    const dy = py - cy

    // 2. Rotate point back by the negative rotation angle (counter-clockwise)
    // to align it with the ellipse's local axis
    const xLocal = dx * cosRot - dy * sinRot
    const yLocal = dx * sinRot + dy * cosRot

    // 3. Apply the standard axis-aligned ellipse formula to get normalized distance
    const ndist = (xLocal * xLocal) / rxsqr + (yLocal * yLocal) / rysqr
    return ndist <= 1.0
}
