import { fireEllipse } from './lightweightFireEllipse.js'
import { getEllipseRasterPerimeterOffsets } from './getEllipseRasterPerimeterOffsets.js'
import { getEllipseRasterPathways } from './getEllipseRasterPathways.js'
import { getEllipseRasterTree, processEllipseRasterTree, processEllipseRasterPathways } from './getEllipseRasterTree.js'

function example() {
    console.log(new Date())
    
    // 1 - Create the fire ellipse
    const timer0 = performance.now()
    let headRos = 100
    let lwr = 2
    let duration = 1
    let ignX = 0
    let ignY = 0
    let bearing = 90
    let ellipse = fireEllipse(headRos, lwr, duration, ignX, ignY, bearing)
    
    // 2 - Get array of perimeter cell offsets from the [0,0] ignition point
    const timer1 = performance.now()
    const {cX, cY, majorDist, minorDist, headDeg} = ellipse
    const spacing = 1
    const cells = getEllipseRasterPerimeterOffsets(cX, cY, majorDist, minorDist, headDeg, spacing)
    
    // 3 - Determine all the pathways from ignition point to every perimeter cell
    const timer2 = performance.now()
    const paths = getEllipseRasterPathways(cells)
    const timer3 = performance.now()
    
    // 4 - Create pathway tree
    const tree = getEllipseRasterTree(paths)
    const timer4 = performance.now()

    // 5 - Run time using pathways
    const pathVisits = processEllipseRasterPathways(paths)
    const timer5 = performance.now()

    // 6 - Run time using tree
    const treeVisits = processEllipseRasterTree(tree)
    const timer6 = performance.now()
    
    // Report
    console.log(`fireEllipse()                     : ${(timer1-timer0).toFixed(2)} ms`)
    console.log(`getEllipseRasterPerimeterOffsets(): ${(timer2-timer1).toFixed(2)} ms for ${cells.length} cells`)
    console.log(`getEllipseRasterPathways()        : ${(timer3-timer2).toFixed(2)} ms for ${paths.length} paths`)
    console.log(`getEllipseRasterTree()            : ${(timer4-timer3).toFixed(2)} ms`)
    console.log(`processEllipseRasterPathways()    : ${(timer5-timer4).toFixed(2)} ms for ${pathVisits} visits`)
    console.log(`processEllipseRasterTree()        : ${(timer6-timer5).toFixed(2)} ms for ${treeVisits} visits`)
}
example()