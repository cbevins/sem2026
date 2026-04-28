import { fireEllipse } from './lightweightFireEllipse.js'
import { perimeterWalker } from './perimeterWalker.js'

function example() {
    console.log(new Date())
    // ellipse parameters
    let lwr = 2
    let headRos = 100
    let duration = 1
    let ignX = 0
    let ignY = 0
    let bearing = 90
    let ellipse = fireEllipse(headRos, lwr, duration, ignX, ignY, bearing)
    const {cX, cY, majorDist, minorDist, headDeg} = ellipse

    const cellSize = 1
    const cells = perimeterWalker(cX, cY, majorDist, minorDist, headDeg, cellSize)
    console.log(`There are ${cells.length} perimeter raster cells.`)
}
example()