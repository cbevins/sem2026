import { getBresenhamVector } from "../experimental/getBresenhamVector.js"

export function getFireletVectors(fireletScanLines) {
    const vectors = []
    // get the Bresenham vector from center to each cell in the bounds
    // let n = 0
    for(let {row, from, thru} of fireletScanLines) {
        for(let col=from; col<=thru; col++) {
            if (row !== 0 || col !== 0) {
                const vector = getBresenhamVector(col, row)
                // console.log(`At Vector ${n++} to [${col}, ${row}] which has ${vector.length} cells:`)
                // for(let v of vector) console.log(`    ${v}`)
                vector.shift()      // remove cell [0,0]
                vectors.push(vector)
            }
        }
    }
    return vectors.sort()
}

export function getFireletVectorsCellCount(vectors) {
    let n = 0
    for(let vector of vectors)
        n += vector.length
    return n
}
