import { FireEllipse } from './FireEllipse.js'
import { getFireletPerimeter } from './getFireletPerimeter.js'
import { getFireletPathArrayFromPerimeter, getFireletPathArrayFromScanLines } from './getFireletPathArray.js'
import { getFireletPathTree } from './getFireletPathTree.js'
import { getFireletScanLines } from './getFireletScanLines.js'

function runFireletCoverageTest() {
    console.log('runFireletCoverageTest.js on', new Date())

    // 1 - Create the Firelet functional equivalent
    const timer1 = performance.now()
    let headRos = 100
    let lwr = 5
    let duration = 1
    let bearing = 45
    let spacing = 1
    const ellipse = new FireEllipse(headRos, lwr, duration, 0, 0, bearing)
    const {centerEast: cx, centerNorth: cy, majorDist: rx, minorDist: ry, degRot} = ellipse

    // 2 - get the Firelet perimeter cells, scanlines, and pathways
    const perim = getFireletPerimeter(cx, cy, rx, ry, degRot, spacing)
    const bounds = getBoundsByQuadrant(perim)

    // 3 - get pathways to each perimeter cell, and count the total number of cells in all pathways
    const paths = getFireletPathArrayFromPerimeter(perim)
    let pathCells = 0
    for(let path of paths) pathCells += path.length

    // 4 - Store all the path cells in a Map
    const pathCellMap = new Map()
    for(let path of paths) {
        for(let cell of path) {
            const key = `${cell[0]},${cell[1]}`
            if (pathCellMap.has(key)) {
                pathCellMap.set(key, pathCellMap.get(key) + 1)
            } else {
                pathCellMap.set(key, 1)
            }
        }
    }

    // 5 - get scanlines for all cells in the Firelet, and count the total number of cells in all scanlines
    const scanLines = getFireletScanLines(perim)
    let scanCells = 0
    for(let line of scanLines) {
        const {row, from, thru} = line
        scanCells += thru-from+1
    }

    // 6 - Check all scanLines cells against the path cell map for any missing path cells
    let missing = 0
    for(let line of scanLines) {
        const {row, from, thru} = line
        for(let col=from; col<=thru; col++) {
            const key = `${col},${row}`
            if (!pathCellMap.has(key)) {
                // console.log(`Missing path cell at ${key}`)
                missing++
            }
        }
    }
        
    // 7 - Build a pathway tree and count the total number of unique nodes in the tree
    const tree = getFireletPathTree(paths)
    const treeNodes = getNodeCount(tree)
    const timer2 = performance.now()

    console.log(`lwr=${lwr}, ros=${headRos}, bearing=${bearing}, length=${ellipse.length}, area=${ellipse.area.toFixed(0)}:`)
    console.log(`${perim.length} perimeter cells`)
    console.log(`${paths.length} paths to perimeter cells traverse ${pathCells} total and ${pathCellMap.size} unique cells`)
    console.log(`${scanLines.length} scan lines defining ${scanCells} cells`)
    console.log(`${missing} (${(missing/scanCells*100).toFixed(2)}%) of the scan cells are missing from the paths`)
    // console.log('Bounds', bounds)
    console.log(`${treeNodes} unique nodes in the pathway tree`)
    console.log(`${(timer2-timer1).toFixed(2)} ms`)
}
function getNodeCount(node) {
    let n = 1
    for(let path of node.paths) {
        n += getNodeCount(path)
    }
    return n
}
// Get normalized bounds of each quadrant
function getBoundsByQuadrant(perim) {
    const bounds = {NE: {x:0, y:0}, SE: {x:0, y:0}, SW: {x:0, y:0}, NW: {x:0, y:0}}
    for(let cell of perim) {
        const [col, row] = cell
        let quad = '??'
        if (col >= 0 && row <= 0) quad = 'NE'
        else if (col >= 0 && row >= 0) quad = 'SE'
        else if (col < 0 && row >= 0) quad = 'SW'
        else if (col < 0 && row <= 0) quad = 'NW'
        const c = Math.abs(col)
        const r = Math.abs(row)
        bounds[quad].x = Math.max(bounds[quad].x, c)
        bounds[quad].y = Math.max(bounds[quad].y, r)
    }
    return bounds
}

runFireletCoverageTest()