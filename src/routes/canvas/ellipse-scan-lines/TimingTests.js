import { fireEllipse } from './lightweightFireEllipse.js'
import { scanEllipse } from './scanEllipseV1.js'
import { getEllipsePerimeterCells } from './getEllipsePerimeterCells.js'
import { getScanLinesPerimeter, getScanLinesPerimeterRaster } from './getScanLinesPerimeter.js'
import { getEllipseRasterPerimeterOffsets } from './getEllipseRasterPerimeterOffsets.js'

// fire ellipse parameters
let lwr = 2
let headRos = 100

// fire ellipse constants
let duration = 1
let ignX = 0
let ignY = 0
let bearing = 90

// Create a set of fire ellipses of varying length/width ratios
const lwrs = [1, 1.1, 1.5, 2, 5, 8, 10]
const ellipses = []
for(let lwr of lwrs)
    ellipses.push(fireEllipse(headRos, lwr, duration, ignX, ignY, bearing))

let reps = 1000
let table = []
let msec, start

if (global.gc) global.gc()
else console.log('Garbage collection unavailable, must pass --expose-gc to node command.')

// ------------------------------------------------------------------------------------
console.log('fireEllipse() creation time')
let e
start = performance.now()
for(let rep=0; rep<reps; rep++) {
    e = fireEllipse(headRos, lwr, duration, ignX, ignY, bearing)
}
msec = performance.now() - start
table.push({lwr: e.lwr.toFixed(2), length: e.length.toFixed(2), width: e.width.toFixed(2),
    msec: (msec/reps).toFixed(2)})
console.table(table)

// ------------------------------------------------------------------------------------
console.log('getEllipseRasterPerimeterOffsets() run time')
table = []
for (let ellipse of ellipses) {
    const {lwr, length, width, cX, cY, majorDist, minorDist, headDeg} = ellipse
    for (let spacing of [1]) {
        let pcells = []
        start = performance.now()
        for(let rep=0; rep<reps; rep++) {
            pcells = getEllipseRasterPerimeterOffsets(cX, cY, majorDist, minorDist, headDeg, spacing)
        }
        msec = performance.now() - start
        table.push({lwr: lwr.toFixed(2), length: length.toFixed(2), width: width.toFixed(2),
            spacing, cells: pcells.length, msec: (msec/reps).toFixed(2)})
    }
}
console.table(table)

// ------------------------------------------------------------------------------------
if (global.gc) global.gc()
console.log('scanEllipse() run time for just perimeter pts (unrasterized)')
table = []
for (let ellipse of ellipses) {
    const {lwr, length, width, cX, cY, headDeg} = ellipse
    for (let scanWidth of [1]) {
        let hlines = [], vlines = [], perimPts = []
        start = performance.now()
        for(let rep=0; rep<reps; rep++) {
            hlines = scanEllipse(length, width, headDeg, ignX, ignY, cX, cY, scanWidth, 'h')
            vlines = scanEllipse(length, width, headDeg, ignX, ignY, cX, cY, scanWidth, 'v')
            perimPts = getScanLinesPerimeter(cX, cY, hlines, vlines)
            // raster = getScanLinesPerimeterRaster(perimPts, 0, 0, scanWidth)
        }
        msec = performance.now() - start
        table.push({lwr: lwr.toFixed(2), length: length.toFixed(2), width: width.toFixed(2),
            scanWidth, perimPts: perimPts.length, msec: (msec/reps).toFixed(2)})
    }
}
console.table(table)

// ------------------------------------------------------------------------------------
if (global.gc) global.gc()
console.log('scanEllipse() run time with rasterized perimeter')
table = []
for (let ellipse of ellipses) {
    const {lwr, length, width, cX, cY, headDeg} = ellipse
    for (let scanWidth of [1]) {
        let hlines = [], vlines = [], perimPts = [], raster=[]
        start = performance.now()
        for(let rep=0; rep<reps; rep++) {
            hlines = scanEllipse(length, width, headDeg, ignX, ignY, cX, cY, scanWidth, 'h')
            vlines = scanEllipse(length, width, headDeg, ignX, ignY, cX, cY, scanWidth, 'v')
            perimPts = getScanLinesPerimeter(cX, cY, hlines, vlines)
            raster = getScanLinesPerimeterRaster(perimPts, 0, 0, scanWidth)
        }
        msec = performance.now() - start
        table.push({lwr: lwr.toFixed(2), length: length.toFixed(2), width: width.toFixed(2),
            scanWidth, cells: raster.length, msec: (msec/reps).toFixed(2)})
    }
}
console.table(table)

// ------------------------------------------------------------------------------------
if (global.gc) global.gc()
console.log('getEllipsePerimeterCells() **AI** run time using incremental theta angles')
table = []
reps = 100
for (let ellipse of ellipses) {
    const {lwr, length, width, cX, cY, majorDist, minorDist, radRot} = ellipse
    for (let degStep of [1, 0.5, 0.1]) {
        const radStep = degStep * Math.PI / 180
        let cells
        start = performance.now()
        for(let rep=0; rep<reps; rep++) {
            cells = getEllipsePerimeterCells(cX, cY, majorDist, minorDist, radRot, radStep)
        }
        msec = performance.now() - start
        table.push({lwr, length: length.toFixed(2), width: width.toFixed(2),
        degStep: degStep, cells: `${cells.length}`, msec: (msec/reps).toFixed(2)})
    }
}
console.table(table)
