/**
 * I spent a day condensing getEllipsePerimeterCellsV1() down to a much smaller file seen here
 * by using looping constructs, but it slowed execution down by about 15 to 20%.
 */
export function getEllipsePerimeterCellsV2(cx, cy, rx, ry, rotationDegrees, spacing, limit=10000) {
    const points = new Set()
    // Store each cell in the Raster Coordinate System, not the Projected Coordinate System
    // i.e., y-coordinate should be a row offset from north, not a northing offset 
    function store(pt) {
        points.add({
            col: Math.trunc((cx + pt[0]) / spacing),
            row: -Math.trunc((cy + pt[1]) / spacing)
        })
    }

    // Traverse northerly, preferring to head north, then north-east, and finally east
    // Then, traverse easterly, preferring to head east, then south-east, then south
    // Then, traverse southerly, preferring to head south, then south-west, then west
    // Then, traverse westerly, preferring to head west, then north-west, then north
    const s = spacing
    const move = [                      // [col, row] step distances for moving ...
        [[0, s], [s, s], [s, 0]],       // from north to north, northeast, and east
        [[s, 0], [s, -s], [0, -s]],     // from east to east, southeast, and south
        [[0, -s], [-s, -s], [-s, 0]],   // from south to south, southwest, and west
        [[-s, 0], [-s, s], [0, s]]      // from west to west, northwest, and north
    ]

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

    let travel = 0  // 'north'
    let atStart = false
    let n = 0
    while(! atStart) {
        point = null
        let found = false
        while(! found) {
            for(let towards=0; towards<3; towards++) {
                const [dx, dy] = move[travel][towards]
                if (insideEllipse(px+dx, py+dy, rxsqr, rysqr, cosRot, sinRot)) {  // check to the north
                    px = px + dx
                    py = py + dy
                    point = [px, py]
                    found = true
                    break
                }
            }
            if (! found) travel = (travel+1)%4
        }
        if (point.length) {
            atStart = Math.abs(px - x0) < sigma && Math.abs(py - y0) < sigma
            if (! atStart) store(point)
        }
        if (++n > limit)
            throw new Error(`Exceeded limit of ${limit}`)
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
