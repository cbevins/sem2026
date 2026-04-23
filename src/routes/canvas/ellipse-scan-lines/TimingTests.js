import { fireEllipse, updateBehaviors, updateDistances } from './lightweightFireEllipse.js'
import { scanEllipse } from './scanEllipseV1.js'

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

for(let lwr of [1, 2, 10]) {
    let ellipse = fireEllipse(headRos, lwr, duration, ignX, ignY, bearing)
    const {length, width, cX, cY, headDeg} = ellipse
    for (let scanWidth of [1, 0.5, 0.2]) {
        start = performance.now()
        const hlines = scanEllipse(length, width, headDeg, ignX, ignY, cX, cY, scanWidth, 'h')
        const vlines = scanEllipse(length, width, headDeg, ignX, ignY, cX, cY, scanWidth, 'v')
        n = hlines.length + vlines.length
        msec = performance.now() - start
        table.push({lwr, length: length.toFixed(2), width: width.toFixed(2), test: 'scanEllipse()',
            parm: `scanWidth ${scanWidth}`, result: `${n} lines`, msec: msec.toFixed(2)})
    }
}
console.table(table)
