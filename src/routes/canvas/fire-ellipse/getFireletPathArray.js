/**
 * Creates an array of pathways from the fire ellipse origin to each perimeter raster.
 * @param {Array} cells Array of Firelet raster cell offsets as returned by getFireletPerimeter()
 */
export function getFireletPathArrayFromPerimeter(cells) {
    const paths = []
    for(let cell of cells) {
        const path = bresenhamPath(cell[0], cell[1])
        path.shift()        // remove origin cell
        paths.push(path)
    }
    return paths
}

/**
 * Creates an array of pathways from the fire ellipse origin to each cell in the Firelet
 * @param {Array} scanLines Array of Firelet scanline {x, y, paths} objects as returned by getFireletScanLines()
 */
export function getFireletPathArrayFromScanLines(scanLines) {
    const paths = []
    for(let line of scanLines) {
        const {row, from, thru} = line
        for(let col=from; col<=thru; col++) {
            const path = bresenhamPath(col, row)
            path.shift()        // remove origin cell
            paths.push(path)
        }
    }
    return paths
}

/**
 * Determines pathway of raster cells from origin at [0,0]
 * to a cell at integer offset [x2, y2]
 * @param {integer} x2 Cell column offset from origin
 * @param {integer} y2 Cell row offset from origin
 * @returns An array of all cells traversed from [0,0] through [x2, y2]
 */
export function bresenhamPath(x2, y2) {
    const points = []
    // Define differences and direction steps
    let x1 = 0
    let y1 = 0
    const dx = Math.abs(x2 - x1)
    const dy = Math.abs(y2 - y1)
    const sx = (x1 < x2) ? 1 : -1
    const sy = (y1 < y2) ? 1 : -1
    let err = dx - dy                       // Initial error parameter

    while (true) {
        points.push([x1,y1])                // Store or plot the current point
        if (x1 === x2 && y1 === y2) break   // Exit the loop if the end point is reached

        const e2 = 2 * err
        if (e2 > -dy) {
            err -= dy
            x1 += sx
        }
        if (e2 < dx) {
            err += dx
            y1 += sy
        }
    }
    return points
}
