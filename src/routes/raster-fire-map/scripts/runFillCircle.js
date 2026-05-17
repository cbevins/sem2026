function fillCircle1(centerCol, centerRow, r, value) {
    const points = []
    const colMin = Math.floor(centerCol - r)
    const colMax = Math.ceil(centerCol + r)
    const rowMin = Math.floor(centerRow - r)
    const rowMax = Math.ceil(centerRow + r)
    const rSquared = r*r
    for(let row=rowMin; row<=rowMax; row++) {
        const dy = row - centerRow;
        const dy2 = dy * dy
        for(let col=colMin; col<=colMax; col++) {
            const dx = col - centerCol;
            if ((dx * dx + dy2) <= rSquared) {
                points.push({col, row})
            }
        }
    }
    return points
}

function fillCircle2(centerCol, centerRow, r, value) {
    const points = []
    const colMin = Math.floor(centerCol - r)
    const colMax = Math.ceil(centerCol + r)
    const rowMin = Math.floor(centerRow - r)
    const rowMax = Math.ceil(centerRow + r)
    const rSquared = r*r
    // for(let row=rowMin; row<=rowMax; row++) {
    for(let r=0, row=rowMin; row<=centerRow; row++, r++) {
        const dy = row - centerRow;
        const dy2 = dy * dy
        for(let col=colMin; col<=colMax; col++) {
            const dx = col - centerCol;
            if ((dx * dx + dy2) <= rSquared) {
                points.push({col, row})
                points.push({col, row: rowMax-r})
            }
        }
    }
    return points
}

function strokeCircle(cx, cy, radius, value) {
    let x = radius
    let y = 0
    let err = 0
    const cells = []

    while (x >= y) {
        // Draw all 8 octants
        cells.push({col: cx + x, row: cy + y})
        cells.push({col: cx + y, row: cy + x})
        cells.push({col: cx - y, row: cy + x})
        cells.push({col: cx - x, row: cy + y})
        cells.push({col: cx - x, row: cy - y})
        cells.push({col: cx - y, row: cy - x})
        cells.push({col: cx + y, row: cy - x})
        cells.push({col: cx + x, row: cy - y})

        if (err <= 0) { y += 1; err += 2 * y + 1 }
        if (err > 0) { x -= 1; err -= 2 * x + 1 }
    }
    return cells
}

function strokeScanCircle(cx, cy, radius, value) {
    const cells = strokeCircle(cx, cy, radius, value)
    cells.sort((a, b) => { // sort first by row, then by column
        return (a.row === b.row) ? a.col - b.col : a.row - b.row
    })

    // Start first line with the first cell (i.e., with the lowest row index, top to bottom)
    let cell = cells[0]
    const lines = []
    let line = {row: cell.row, from: cell.col, thru: cell.col}
    // Check all remaining cells
    for(let i=1; i<cells.length; i++) {
        cell = cells[i]
        if (cell.row === line.row) {    // if at the same row ...
            line.thru = cell.col        // update the line's last col
        } else {                        // else if at a new row...
            lines.push(line)
            line = {row: cell.row, from: cell.col, thru: cell.col}  // start a new line
        }
    }
    return lines
}

function strokeScanFillCircle(cx, cy, radius, value) {
    const lines = strokeScanCircle(cx, cy, radius, value)
    const points = []
    for(let {row, from, thru} of lines) {
        for(let col=from; col<=thru; col++)
            points.push({col, row})
    }
    return points
}

const reps = 1000
let from, thru, points1, points2, cells, lines, points3
const results = []
// ---------------------------------------------------
from = performance.now()
for(let i=0; i<reps; i++) {
    points1 = fillCircle1(0, 0, 101, 1)
}
thru = performance.now()
results.push({name: 'fillCircle1()', items: points1.length, msec: thru-from} )

from = performance.now()
for(let i=0; i<reps; i++) {
    points2 = fillCircle2(0, 0, 101, 1)
}
thru = performance.now()
results.push({name: 'fillCircle2()', items: points2.length, msec: thru-from} )

from = performance.now()
for(let i=0; i<reps; i++) {
    cells = strokeCircle(0, 0, 101, 1)
}
thru = performance.now()
results.push({name: 'strokeCircle()', items: cells.length, msec: thru-from} )

from = performance.now()
for(let i=0; i<reps; i++) {
    lines = strokeScanCircle(0, 0, 101, 1)
}
thru = performance.now()
results.push({name: 'strokeScanCircle()', items: lines.length, msec: thru-from} )

from = performance.now()
for(let i=0; i<reps; i++) {
    points3 = strokeScanFillCircle(0, 0, 101, 1)
}
thru = performance.now()
results.push({name: 'strokeScanFillCircle()', items: points3.length, msec: thru-from} )

console.table(results)