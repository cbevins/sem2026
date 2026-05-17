import { FireEllipse,
// getFirletBounds,
    getEllipsePerimeterCells,
    getFireletScanLines, getFireletScanLineCellCount,
    getFireletTree, getFireletTreeCellCount,
    getFireletVectors, getFireletVectorsCellCount } from '../index.js'

export function Part_2_Firelet() {
    let part = 2
    let step = 0
    let text = 'The "Firelet" Fire Growth Pathways Data Structure'
    let from = performance.now(), thru
    const stats = [{part, step, text, msec: from}]

    /* -------------------------------------------------------------------------
    Simulating fire growth using Huygen's Principle requires starting numerous
    small fire ellipses all along the active fire front. The smaller the fire
    ellipse size the more closely we approximates our assumption of uniform burning
    conditions within the ellipse while faithfully propagating the basic fire shape.
    We will call these small fire ellipses 'Firelet's.

    The Firelet is also the level at which we want to detect barriers to fire
    pread so the fire front can realistically be stopped by or expand around them.
    To do so, we need to cast a sufficient number of spread vectors in many compass directions.
    Each cast begins at the Firelet's ignition point and stops when it reaches
    (1) an unburnable barrier or (2) its perimeter point at that direction.

    The Firelet class is a data structure defining all the possible fire spread
    pathways of a rasterized FireEllipse from its ignition point to every other
    cell within its perimeter. Each pathway is a collection of cells expressed
    as relative [col, row] integer coordinates indicating its position offset from
    the ignition cell at [0,0].  The coordinates may be negative or positive,
    where 'col' increases from left to right (west-to-east), and 'row' increases
    from top-to-bottom (north-to-south), the *opposite* of a geographic y-axis.
    
    A Firelet is constructed via the following steps:
    */

    // Step 1 - create a FireEllipse with ignition point [0,0] so we can determine the
    // Firelet's center point, major and minor radii, and rotation:
    step = 1
    from = performance.now()
    let lwr = 2         // a length-to-width ratio
    let headRos = 100    // a head fire spread rate
    let duration = 1    // elapsed time since ignition
    let bearing = 45    // the direction of maximum spread as degrees clockwise from North
    let ignEast = 0     // the ignition point false easting
    let ignNorth = 0    // the ignition point false northing
    const fireEllipse = new FireEllipse(headRos, lwr, duration, ignEast, ignNorth, bearing)
    thru = performance.now()
    text = `created FireEllipse(headRos=${headRos}, lwr=${lwr}, bearing=${bearing}) with`
    + ` length=${fireEllipse.length.toFixed(2)}, width=${fireEllipse.width.toFixed(2)}`
    stats.push({part, step, text, msec: thru-from})

    // Step 2 - determine the contiguous sequence of perimeter raster cells for this Firelet

    const spacing = 1
    const {centerEast: cx, centerNorth: cy, majorDist: rx, minorDist: ry, degRot} = fireEllipse
    const fireletPerimCells = getEllipsePerimeterCells(cx, cy, rx, ry, degRot, spacing)
    thru = performance.now()
    text = `derived ${fireletPerimCells.length} Firelet perimeter cells`
    // console.table(fireletPerimCells)
    stats.push({part, step, text, msec: thru-from})

    // Note: we can optionally get the Firelet raster bounds as follows:
    // const fireletBounds = getFirletBounds(fireletPerimCells)
    // console.log ('\nFirelet Bounds:', fireletBounds)

    // Step 3 - identify all the raster cells within the Firelet perimeter using a compact scan line format
    step = 3
    from = performance.now()
    const fireletScanLines = getFireletScanLines(fireletPerimCells)
    const fireletScanLineCells = getFireletScanLineCellCount(fireletScanLines)
    thru = performance.now()
    text = `derived ${fireletScanLines.length} Firelet scan lines with ${fireletScanLineCells} cells`
    // console.table(fireletScanLines)
    stats.push({part, step, text, msec: thru-from})

    // Step 4 - determine spread vectors from center cell to every other cell using Bresenham algoithm
    step = 4
    from = performance.now()
    const fireletVectors = getFireletVectors(fireletScanLines)
    const fireletVectorCells = getFireletVectorsCellCount(fireletVectors)
    thru = performance.now()
    text = `derived ${fireletVectors.length} Firelet Bresenham vectors with ${fireletVectorCells} cells`
    // console.table(vectors)
    stats.push({part, step, text, msec: thru-from})

    // Step 5 - pack the Bresenham vectors into a hierarchical cell path network tree
    step = 5
    from = performance.now()
    const fireletTreeRoot = getFireletTree(fireletVectors)
    const fireletTreeCells = getFireletTreeCellCount(fireletTreeRoot)
    thru = performance.now()
    text = `packed Firelet vector cells into a tree with ${fireletTreeCells} tree cells`
    stats.push({part, step, text, msec: thru-from})

    stats[0].msec = performance.now() - stats[0].msec
    return stats
}
