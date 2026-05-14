export function getFireletTree(fireletVectors) {
    const root = {col:0, row:0, cells: []}
    for(let vector of fireletVectors) {
        let node = root
        while(vector.length) {
            const [col, row] = vector.shift()
            let next = findNodeWithCell(node.cells, col, row)
            if (!next) {
                next = {col, row, cells: []}
                node.cells.push(next)
            }
            node = next
        }
    }
    return root
}

function findNodeWithCell(cells, col, row) {
    for(let cell of cells) {
        if (cell.col === col && cell.row === row)
            return cell
    }
    return null
}

export function getFireletTreeCellCount(node) {
    let n = 1
    for(let cell of node.cells)
        n += getFireletTreeCellCount(cell)
    return n
}
