import { BurnMap } from './BurnMap.js'
import { Firelet } from './Firelet.js'
import { FireEllipse } from './FireEllipse.js'
import { getFireletPerimeter } from './getFireletPerimeter.js'
import { getFireletPathArrayFromPerimeter, getFireletPathArrayFromScanLines } from './getFireletPathArray.js'
import { getFireletPathTree } from './getFireletPathTree.js'
import { getFireletScanLines, getFireletScanLineCellCount } from './getFireletScanLines.js'

const reps = 100
const times = []
let timer0, timer1

console.log(`runTimes Averaged Over ${reps} Repititions`)

function save(name, info='') {
    timer1 = performance.now()
    const msec = timer1 - timer0
    times.push({name, msec: (msec/reps).toFixed(4), info})
    timer0 = timer1
}

export function runTimes() {
    const headRos = 100
    const lwr = 2
    const duration = 1
    const bearing = 45
    const ignX = 0
    const ignY = 0
    const spacing = 1
    const cols = 512
    const rows = 512
    timer0 = performance.now()

    // -------------------------------------------------------------------------
    // new FireEllipse()
    // -------------------------------------------------------------------------
    let ellipse
    for(let i=0; i<reps; i++) {
        ellipse = new FireEllipse(headRos, lwr, duration, 0, 0, bearing)
    }
    save('new FireEllipse()')

    // -------------------------------------------------------------------------
    // new BurnMap()
    // -------------------------------------------------------------------------
    let burnMap
    for(let i=0; i<reps; i++) {
        burnMap = new BurnMap(cols, rows)
    }
    save('new BurnMap')

    // -------------------------------------------------------------------------
    // new Firelet()
    // -------------------------------------------------------------------------
    let firelet
    for(let i=0; i<reps; i++) {
        firelet = new Firelet(headRos, lwr, duration, bearing, spacing)
    }
    save('new Firelet()')

    // -------------------------------------------------------------------------
    // getFireletPerimeter() derivation
    // -------------------------------------------------------------------------
    let fireletPerimeter = []
    for(let i=0; i<reps; i++) {
        const {centerEast: cx, centerNorth: cy, majorDist: rx, minorDist: ry, degRot} = ellipse
        fireletPerimeter = getFireletPerimeter(cx, cy, rx, ry, degRot, spacing)
    }
    save('    getFireletPerimeter()', `${fireletPerimeter.length} cells`)

    // -------------------------------------------------------------------------
    // getFireletScanLines()
    // -------------------------------------------------------------------------
    let fireletScanLines
    for(let i=0; i<reps; i++) {
        fireletScanLines = getFireletScanLines(fireletPerimeter)
    }
    let fireletScanLineCells = getFireletScanLineCellCount(fireletScanLines)
    save('    getFireletScanLines()', `${fireletScanLines.length} lines, ${fireletScanLineCells} cells`)
    
    // -------------------------------------------------------------------------
    // getFireletPathArrayFromPerimeter() derivation
    // -------------------------------------------------------------------------
    let fireletPathArrayFromPerimeter = []
    for(let i=0; i<reps; i++) {
        fireletPathArrayFromPerimeter = getFireletPathArrayFromPerimeter(fireletPerimeter)
    }
    save('    getFireletPathArrayFromPerimeter()', `${fireletPathArrayFromPerimeter.length} pathways`)
    
    // -------------------------------------------------------------------------
    // getFireletPathArrayFromScanLines() derivation
    // -------------------------------------------------------------------------
    let fireletPathArrayFromScanLines = []
    for(let i=0; i<reps; i++) {
        fireletPathArrayFromScanLines = getFireletPathArrayFromScanLines(fireletScanLines)
    }
    save('    getFireletPathArrayFromScanLines()', `${fireletPathArrayFromScanLines.length} pathways`)

    // -------------------------------------------------------------------------
    // getFireletPathTree() derivation using perimeter cells
    // -------------------------------------------------------------------------
    let fireletPathTreeFromPerimeter
    for(let i=0; i<reps; i++) {
        fireletPathTreeFromPerimeter = getFireletPathTree(fireletPathArrayFromPerimeter)
    }
    let nodesFromPerimeter = firelet.getNodeCount()
    save('    getFireletPathTreeFromPerimeter()', `${nodesFromPerimeter} nodes`)

    // -------------------------------------------------------------------------
    // getFireletPathTree() derivation using scanline cells
    // -------------------------------------------------------------------------
    let fireletPathTreeFromScanLines
    for(let i=0; i<reps; i++) {
        fireletPathTreeFromScanLines = getFireletPathTree(fireletPathArrayFromScanLines)
    }
    let nodesFromScanLines = firelet.getNodeCount()
    save('    getFireletPathTreeFromScanLines()', `${nodesFromScanLines} nodes`)

    // -------------------------------------------------------------------------
    // Firelet.ignitePathTree()
    // -------------------------------------------------------------------------
    for(let i=0; i<reps; i++) {
        burnMap = new BurnMap(cols, rows)
        firelet.ignitePathTree(burnMap, ignX, ignY)
    }
    save('    Firelet.ignitePathTree()', 'with new BurnMap()')

    // -------------------------------------------------------------------------
    // Firelet.ignitePathways()
    // -------------------------------------------------------------------------
    for(let i=0; i<reps; i++) {
        burnMap = new BurnMap(cols, rows)
        firelet.ignitePathways(burnMap, ignX, ignY)
    }
    save('    Firelet.ignitePathways()', 'with new BurnMap()')
    // console.table(scanLines)
}

runTimes()
console.table(times)