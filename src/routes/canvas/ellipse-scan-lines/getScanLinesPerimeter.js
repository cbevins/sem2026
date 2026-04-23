import * as FE from './LightweightFireEllipseEquations.js'

export function getScanLinesPerimeter(cx, cy, hlines, vlines=[]) {
    const perim = []
    const A ={x: 0, y: 1000}    // north pole
    const B ={x: cx, y: cy}     // center
    for(let lineSet of [hlines, vlines]) {
        for(let line of lineSet) {
            for(let point of line) {
                const [x, y] = point
                const angle = FE.angle(A, B, {x,y})
                perim.push([x, y, angle])
            }
        }
    }
    perim.sort((a, b) => { return a[2] - b[2] })
    return perim
}

// Uses snap-to-center of each raster cell
// x0 and y0 are the translation point coordinates from the ellipse center
export function getScanLinesPerimeterRaster(perimPts, x0=0, y0=0, dim=1) {
    const raster = []
    let [x, y] = perimPts[0]
    let col = Math.trunc((x - x0) / dim)
    let row = Math.trunc((y - y0) / dim)
    let pcol = col
    let prow = row
    raster.push([col, row])
    for(let i=1; i<perimPts.length; i++) {
        ;[x, y] = perimPts[i]
        col = Math.trunc((x - x0) / dim)
        row = Math.trunc((y - y0) / dim)
        if (col !== pcol && row !== prow) {
            raster.push([col, row])
            pcol = col
            prow = row
        }
    }
    // console.table(raster)
    return raster
}
