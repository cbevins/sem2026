import { fireEllipse } from './lightweightFireEllipse.js'
import { scanEllipse } from './scanEllipseV1.js'
import { getEllipsePerimeterCells } from './getEllipsePerimeterCells.js'
import { getScanLinesPerimeter, getScanLinesPerimeterRaster } from './getScanLinesPerimeter.js'
import { perimeterWalker } from './perimeterWalker.js'

// parameters
let lwr = 1
let headRos = 100

// constants
let duration = 1
let ignX = 0
let ignY = 0
let bearing = 90

const table = []
let start, msec, n

for(let lwr of [2]) {
    let ellipse = fireEllipse(headRos, lwr, duration, ignX, ignY, bearing)
    const {length, width, cX, cY, majorDist, minorDist, headDeg, radRot} = ellipse
    
    // for (let scanWidth of [1, 0.5, 0.1]) {
    //     start = performance.now()
    //     const hlines = scanEllipse(length, width, headDeg, ignX, ignY, cX, cY, scanWidth, 'h')
    //     const vlines = scanEllipse(length, width, headDeg, ignX, ignY, cX, cY, scanWidth, 'v')
    //     const perimPts = getScanLinesPerimeter(cX, cY, hlines, vlines)
    //     const perimRaster = getScanLinesPerimeterRaster(perimPts, 0, 0, scanWidth)
    //     msec = performance.now() - start
    //     table.push({lwr, length: length.toFixed(2), width: width.toFixed(2), test: 'scanEllipse()',
    //         parm: `scanWidth ${scanWidth}`, cells: `${perimRaster.length}`, msec: msec.toFixed(2)})
    // }

    // for (let degStep of [1, 0.5, 0.1, 0.01]) {
    //     start = performance.now()
    //     const radStep = degStep * Math.PI / 180
    //     const cells = getEllipsePerimeterCells(cX, cY, majorDist, minorDist, radRot, radStep)
    //     msec = performance.now() - start
    //     table.push({lwr, length: length.toFixed(2), width: width.toFixed(2),
    //         test: 'perimeterCells()',
    //         parm: `degStep ${degStep}`, cells: `${cells.length}`, msec: msec.toFixed(2)})
    // }

    for (let step of [1, 0.5, 0.1]) {
        start = performance.now()
        const pcells = perimeterWalker(cX, cY, majorDist, minorDist, headDeg, step)
        msec = performance.now() - start
        table.push({lwr: lwr.toFixed(2), length: length.toFixed(2), width: width.toFixed(2),
            test: 'perimeterWalker()',
            parm: `cell dim ${step}`, cells: `${pcells.length}`, msec: msec.toFixed(2)})
    }
}
console.table(table)
