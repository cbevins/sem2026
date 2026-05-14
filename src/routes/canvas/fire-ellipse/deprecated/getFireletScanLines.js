/**
 * @param {array} perim  An array as returned by getFireletPerimeter()
 * @returns An array of Firelet ellipse scanlines of {row, from, thru}
 */

export function getFireletScanLines(perim) {
    // Make a copy of the perim since sort() will mutate it
    const pairs = [...perim].sort((a, b) => {
        // sort first by row, then by column
        const [colA, rowA] = a
        const [colB, rowB] = b
        return (rowA === rowB) ? colA - colB : rowA - rowB
    })
    // Start first line with the first cell (i.e., with the lowest row index, top to bottom)
    const lines = []
    let [col, row] = pairs[0]
    let line = {row, from: col, thru: col}
    // Check all remaining cells
    for(let i=1; i<pairs.length; i++) {
        ;[col, row] = pairs[i]
        if (row === line.row) {         // if at the same row ...
            line.thru = col             // update the line's last col
        } else {                        // else if at a new row...
            lines.push(line)            // save the previous line
            line = {row, from: col, thru: col}  // start a new line
        }
    }
    lines.push(line)
    return lines
}

export function getFireletScanLineCellCount(scanLines) {
    let n = 0
    for (let line of scanLines) {
        const {from, thru} = line
        n += thru-from+1
    }
    return n
}
