import { FireEllipse } from "../lib/FireEllipse.js"
import { getEllipsePerimeterCellsV1 } from "./getEllipsePerimeterCellsV1.js"
import { getEllipsePerimeterCellsV2 } from "./getEllipsePerimeterCellsV2.js"

function ellipsePerimeterTiming() {
    let lwr = 2         // a length-to-width ratio
    let headRos = 100    // a head fire spread rate
    let duration = 1    // elapsed time since ignition
    let bearing = 45    // the direction of maximum spread as degrees clockwise from North
    let ignEast = 0     // the ignition point false easting
    let ignNorth = 0    // the ignition point false northing
    const fireEllipse = new FireEllipse(headRos, lwr, duration, ignEast, ignNorth, bearing)
    const {centerEast: cx, centerNorth: cy, majorDist: rx, minorDist: ry, degRot} = fireEllipse

    const reps = 10000
    console.log(process.argv[0], `reps = ${reps}`)
    const spacing = 1
    const results = []
    let cells, cellsv1, cellsv2
    let from = performance.now(), thru

    // -----------------------------------------------------------------------
    from = performance.now()
    for(let i=0; i<reps; i++) {
        cellsv1 = getEllipsePerimeterCellsV1(cx, cy, rx, ry, degRot, spacing)
    }
    thru = performance.now()
    results.push({func: 'getEllipsePerimeterCellsV1', cells: cellsv1.length, msec: (thru-from)})

    // -----------------------------------------------------------------------
    from = performance.now()
    for(let i=0; i<reps; i++) {
        cellsv2 = getEllipsePerimeterCellsV2(cx, cy, rx, ry, degRot, spacing)
    }
    thru = performance.now()
    results.push({func: 'getEllipsePerimeterCellsV2', cells: cellsv2.length, msec: (thru-from)})

    console.table(results)
    for(let i=0; i<cells.length; i++) {
        if (cells[i].col !== cellsv1[i].col) console.log('v0,v1', cells[i], cellsv1[i])
        if (cells[i].row !== cellsv1[i].row) console.log('V0,V1',cells[i], cellsv1[i])
        if (cells[i].col !== cellsv2[i].col) console.log('V0,V2', cells[i], cellsv2[i])
        if (cells[i].row !== cellsv2[i].row) console.log('V0,V2', cells[i], cellsv2[i])
    }
}
ellipsePerimeterTiming()
