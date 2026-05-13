/**
 * @param {array} perim  An array as returned by getFireletPerimeterCells()
 * @returns An array of Firelet ellipse scanline objects with propeties {row, from, thru}
 */

export function getFireletScanLines(fireletPerimeterCells) {
    // Make a copy of the perim since sort() will mutate it
    const cells = [...fireletPerimeterCells].sort((a, b) => {
        // sort first by row, then by column
        return (a.row === b.row) ? a.col - b.col : a.row - b.row
    })
    // Start first line with the first cell (i.e., with the lowest row index, top to bottom)
    const lines = []
    let cell = cells[0]
    let line = {row: cell.row, from: cell.col, thru: cell.col}
    // Check all remaining cells
    for(let i=1; i<cells.length; i++) {
        cell = cells[i]
        if (cell.row === line.row) {    // if at the same row ...
            line.thru = cell.col        // update the line's last col
        } else {                        // else if at a new row...
            lines.push(line)            // save the previous line
            line = {row: cell.row, from: cell.col, thru: cell.col}  // start a new line
        }
    }
    lines.push(line)
    return lines
}

export function getFireletScanLineCellCount(fireletScanLines) {
    let n = 0
    for (let {from, thru} of fireletScanLines) {
        n += thru-from+1
    }
    return n
}
