import { FireEllipse,
// getFirletBounds,
    getFireletPerimeterCells,
    getFireletScanLines, getFireletScanLineCellCount,
    getFireletTree, getFireletTreeCellCount,
    getFireletVectors, getFireletVectorsCellCount } from '../index.js'

function elapsed(from, thru) {
    return `in ${(thru-from).toFixed(2)} msec.`
}

export function Part_2_Firelet() {
    console.log('\nPart 2 - The "Firelet" Fire Growth Pathways Data Structure')
    const timer0 = performance.now()

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
    let lwr = 2         // a length-to-width ratio
    let headRos = 100    // a head fire spread rate
    let duration = 1    // elapsed time since ignition
    let bearing = 45    // the direction of maximum spread as degrees clockwise from North
    let ignEast = 0     // the ignition point false easting
    let ignNorth = 0    // the ignition point false northing
    const fireEllipse = new FireEllipse(headRos, lwr, duration, ignEast, ignNorth, bearing)
    const timer1 = performance.now()
    console.log(`Step 2.1 - created FireEllipse(headRos=${headRos}, lwr=${lwr}, bearing=${bearing}) with`
        + ` length=${fireEllipse.length.toFixed(2)}, width=${fireEllipse.width.toFixed(2)} ${elapsed(timer0, timer1)}`)

    // Step 2 - determine the contiguous sequence of perimeter raster cells for this Firelet
    const spacing = 1
    const {centerEast: cx, centerNorth: cy, majorDist: rx, minorDist: ry, degRot} = fireEllipse
    const fireletPerimCells = getFireletPerimeterCells(cx, cy, rx, ry, degRot, spacing)
    const timer2 = performance.now()
    console.log(`Step 2.2 - derived ${fireletPerimCells.length} Firelet perimeter cells ${elapsed(timer1, timer2)}`)
    // console.table(fireletPerimCells)

    // Note: we can optionally get the Firelet raster bounds as follows:
    // const fireletBounds = getFirletBounds(fireletPerimCells)
    // console.log ('\nFirelet Bounds:', fireletBounds)

    // Step 3 - identify all the raster cells within the Firelet perimeter using a compact scan line format
    const fireletScanLines = getFireletScanLines(fireletPerimCells)
    const fireletScanLineCells = getFireletScanLineCellCount(fireletScanLines)
    const timer3 = performance.now()
    console.log(`Step 2.3 - derived ${fireletScanLines.length} Firelet scan lines with ${fireletScanLineCells} cells `
        + elapsed(timer2, timer3))
    // console.table(fireletScanLines)

    // Step 4 - determine spread vectors from center cell to every other cell using Bresenham algoithm
    const fireletVectors = getFireletVectors(fireletScanLines)
    const fireletVectorCells = getFireletVectorsCellCount(fireletVectors)
    const timer4 = performance.now()
    console.log(`Step 2.4 - derived ${fireletVectors.length} Firelet Bresenham vectors with ${fireletVectorCells} cells `
        + elapsed(timer3, timer4))
    // console.table(vectors)

    // Step 5 - pack the Bresenham vectors into a hierarchical cell path network tree
    const fireletTreeRoot = getFireletTree(fireletVectors)
    const fireletTreeCells = getFireletTreeCellCount(fireletTreeRoot)
    const timer5 = performance.now()
    console.log(`Step 2.5 - packed Firelet vector cells into a tree with ${fireletTreeCells} tree cells `
        + elapsed(timer4, timer5))

    console.log('Part 2 elapsed time of', (performance.now() - timer0).toFixed(2), 'msec includes logging')
}
