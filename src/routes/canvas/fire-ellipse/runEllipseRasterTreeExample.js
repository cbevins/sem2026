import { FireEllipse } from './FireEllipse.js'
import { getFireletPerimeter } from './getFireletPerimeter.js'
import { getFireletPathArray } from './getFireletPathArray.js'
import { getFireletPathTree } from './getFireletPathTree.js'

function runEllipseRasterTreeExample() {
    console.log(new Date())

    // 1 - Create the fire ellipse
    const timer0 = performance.now()
    let headRos = 100
    let lwr = 2
    let duration = 1
    let ignX = 0
    let ignY = 0
    let bearing = 90
    let ellipse = new FireEllipse(headRos, lwr, duration, ignX, ignY, bearing)
    
    // 2 - Get array of perimeter cell offsets from the [0,0] ignition point
    const timer1 = performance.now()
    const spacing = 1
    const {centerEast: cx, centerNorth: cy, majorDist: rx, minorDist: ry, degRot} = ellipse
    const cells = getFireletPerimeter(cx, cy, rx, ry, degRot, spacing)
    
    // 3 - Determine all the pathways from ignition point to every perimeter cell
    const timer2 = performance.now()
    const paths = getFireletPathArray(cells)
    const timer3 = performance.now()
    
    // 4 - Create pathway tree
    const tree = getFireletPathTree(paths)
    const timer4 = performance.now()

    // 5 - Run time using pathways
    const pathVisits = processEllipseRasterPathways(paths)
    const timer5 = performance.now()

    // 6 - Run time using tree
    const treeVisits = processEllipseRasterTree(tree)
    const timer6 = performance.now()
    
    // Report
    console.log(`new FireEllipse()                 : ${(timer1-timer0).toFixed(2)} ms`)
    console.log(`getFireletPerimeter(): ${(timer2-timer1).toFixed(2)} ms for ${cells.length} cells`)
    console.log(`getFireletPathArray()        : ${(timer3-timer2).toFixed(2)} ms for ${paths.length} paths`)
    console.log(`getFireletPathTree()            : ${(timer4-timer3).toFixed(2)} ms`)
    console.log(`processEllipseRasterPathways()    : ${(timer5-timer4).toFixed(2)} ms for ${pathVisits} visits`)
    console.log(`processEllipseRasterTree()        : ${(timer6-timer5).toFixed(2)} ms for ${treeVisits} visits`)
}

// Function to time pathway array traversal with status check
function processEllipseRasterPathways(paths) {
    let visits = 0
    for(let path of paths) {
        for(let cell of path) {
            const [x, y] = cell
            visits++
            if (! isBurnable(x, y)) break
            setBurning(x,y)
        }
    }
    return visits
}

// Function to time pathway tree traversal with status check
let treeVisits = 0
export function processEllipseRasterTree(tree) {
    _walk(tree)
    return treeVisits
}

function _walk(cell, level=0) {
    treeVisits++
    const {x, y, status, paths} = cell
    if (isBurnable(x, y)) {
        setBurning(x,y)
        for(let path of paths) {
            _walk(path, level+1)
        }
    }
}

function isBurnable(x, y) { return (x!==20 && y!==20) }
function setBurning(x, y) { return }
runEllipseRasterTreeExample()