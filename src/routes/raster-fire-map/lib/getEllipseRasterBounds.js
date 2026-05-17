export function getEllipseRasterBounds(ellipsePerimCells) {
    let {col, row} = ellipsePerimCells[0]
    let colMin = col, colMax = col, rowMin = row, rowMax = row;
    for(let {col, row} of ellipsePerimCells) {
        colMax = Math.max(colMax, col)
        colMin = Math.min(colMin, col)
        rowMax = Math.max(rowMax, row)
        rowMin = Math.min(rowMin, row)
    }
    return {colMin, colMax, rowMin, rowMax}
}
