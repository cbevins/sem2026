/**
 * This function rasterizes a (posiibly) rotated ellipse perimeter into a continguous clockwise sequence
 * of cell offsets relative to the ellipse center point [0,0].
 * While column offsets increase from left-to-right, row offsets increase from top-to-bottom.
 * 
 * Pavlidi's contour tracing algorithm is adapted specifically for clockwise winding
 * of a convex polygon.
 * 
 * Consider a lattice of points with equadistance spacing on a Cartesian plane.
 * The lattice contains a (possibly) rotated ellipse whose center point is at [0,0]
 * in the user's Projected Coordinate System.
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
 * @returns An array of {col, row} ellipse perimeter raster coordinates objects
 * expressed as integer offsets from the ellipse center.
 * NOTE: the array is NOT explicitly closed.
 */

export function getEllipsePerimeterCells(cx, cy, rx, ry, rotationDegrees, spacing, limit=10000) {
    const points = new Set()
    function store(pt) {
        // Store in Raster Coordinate System, not the Projected Coordinate System
        // i.e., y-coordinate should be a row offset from north, not a northing offset 
        points.add({
            col: Math.trunc((cx + pt[0]) / spacing),
            row: -Math.trunc((cy + pt[1]) / spacing)})
    }

    const north = 0
    const east = 1
    const south = 2
    const west = 3
    const s = spacing
    const rotRad = rotationDegrees * Math.PI / 180
    const cosRot = Math.cos(-rotRad)
    const sinRot = Math.sin(-rotRad)
    const rxsqr = rx * rx
    const rysqr = ry * ry
    const sigma = spacing / 10
    // Travel north until we reach beyond the perimeter
    // Note that if the ellipse is smaller than spacing, there will only be 1 perimeter point
    let px = 0
    let py = 0
    while (insideEllipse(px, py+s, rxsqr, rysqr, cosRot, sinRot)) {
        py += spacing
    }
    let point = [px, py]
    store(point)
    // console.log(points.size, point)
    const x0 = px
    const y0 = py

    // Traverse northerly, preferring to head north, then north-east, and finally east
    let travel = 0  // 'north'
    let done = false
    let n = 0
    while(! done) {
        point = []
        if (travel === north) {   // test sequence is north -> northeast -> east
            if (insideEllipse(px, py+s, rxsqr, rysqr, cosRot, sinRot)) {  // check to the north
                py = py + s
                point = [px, py]
            } else if (insideEllipse(px+s, py+s, rxsqr, rysqr, cosRot, sinRot)) { // check to the north-east
                px = px + s
                py = py + s
                point = [px, py]
            } else if (insideEllipse(px+s, py, rxsqr, rysqr, cosRot, sinRot)) { // check to the east
                px = px + s
                point = [px, py]
            } else {
                travel = east
            }
        }
        else if (travel === east) {   // test sequence is east -> southeast -> south
            if (insideEllipse(px+s, py, rxsqr, rysqr, cosRot, sinRot)) { // check to the east (redundant of coming from north)
                px = px + s
                point = [px, py]
            } else if (insideEllipse(px+s, py-s, rxsqr, rysqr, cosRot, sinRot)) { // check to the south-east
                px = px + s
                py = py - s
                point = [px, py]
            } else if (insideEllipse(px, py-s, rxsqr, rysqr, cosRot, sinRot)) { // check to the south
                py = py - s
                point = [px, py]
            } else {
                travel = south
            }
        }
        else if (travel === south) {  // test sequence is south -> southwest -> west
            if (insideEllipse(px, py-s, rxsqr, rysqr, cosRot, sinRot)) { // check to the south (may be redundant)
                py = py - s
                point = [px, py]
            } else if (insideEllipse(px-s, py-s, rxsqr, rysqr, cosRot, sinRot)) { // check to the south-west
                px = px - s
                py = py - s
                point = [px, py]
            } else if (insideEllipse(px-s, py, rxsqr, rysqr, cosRot, sinRot)) { // check to the west
                px = px - s
                point = [px, py]
            } else {
                travel = west
            }
        }
        else if (travel === west) {   // test sequence is west -> northwest -> north
            if (insideEllipse(px-s, py, rxsqr, rysqr, cosRot, sinRot)) { // check to the west (redundant when coming from the south)
                px = px - s
                point = [px, py]
            } else if (insideEllipse(px-s, py+s, rxsqr, rysqr, cosRot, sinRot)) { // check to the north-west
                px = px - s
                py = py + s
                point = [px, py]
            } else if (insideEllipse(px, py+s, rxsqr, rysqr, cosRot, sinRot)) { // check to the north
                py = py + s
                point = [px, py]
            } else {
                travel = north
            }
        }
        if (point.length) { // if we found a point ...
            if (Math.abs(px - x0) < sigma && Math.abs(py - y0) < sigma) {
                done = true
            } else {
                store(point)
            }
        }
        if (++n > limit) throw new Error(`Exceeded limit of ${limit}`)
    }
    return [...points]  // return an array from the Set
}

/**
 * Checks if a point (dx, dy) is inside a rotated ellipse.
 * @param {number} dx - X-offset of the point from center
 * @param {number} dy - Y-offset of the coordinate of the point.
 * @param {number} rx - Semi-major axis (radius on local x-axis).
 * @param {number} ry - Semi-minor axis (radius on local y-axis).
 * @param {number} cosRot - cosine of the reverse rotation
 * @param {number} sinRot - sin of the reverse rotation
 * @returns {boolean} - True if the point is inside or on the boundary.
 */
function insideEllipse(dx, dy, rxsqr, rysqr, cosRot, sinRot) {
    // Rotate point back by the negative rotation angle (counter-clockwise)
    // to align it with the ellipse's local axis
    const xLocal = dx * cosRot - dy * sinRot
    const yLocal = dx * sinRot + dy * cosRot

    // Apply the standard axis-aligned ellipse formula to get normalized distance
    const ndist = (xLocal * xLocal) / rxsqr + (yLocal * yLocal) / rysqr
    return ndist <= 1.0
}
