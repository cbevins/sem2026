export function getFirletBounds(fireletPerimCells) {
    let {col, row} = fireletPerimCells[0]
    let colMin = col, colMax = col, rowMin = row, rowMax = row;
    for(let {col, row} of fireletPerimCells) {
        colMax = Math.max(colMax, col)
        colMin = Math.min(colMin, col)
        rowMax = Math.max(rowMax, row)
        rowMin = Math.min(rowMin, row)
    }
    return {colMin, colMax, rowMin, rowMax}
}
