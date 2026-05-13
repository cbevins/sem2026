export function getFireletTree(fireletVectors) {
    const root = {col: 0, row: 0, cells: []}
    for(let vector of fireletVectors)
        addFireletTreeNode(root, vector)
    return root
}

function addFireletTreeNode(root, vector) {
    let node = root
    const cells = [...vector]
    while(cells.length) {
        let [cellCol, cellRow] = cells.shift()
        // console.log(`    Looking for cell [${cellCol}, ${cellRow}] at node [${node.col}, ${node.row}] ...`)
        let found = false
        for(let subnode of node.cells) {
            if (subnode.col === cellCol && subnode.row === cellRow) {
                // console.log(`        Found cell [${cellCol}, ${cellRow}] at node [${node.col}, ${node.row}]`)
                found = true            // found this, no need to add it
                break
            }
        }
        if (! found) {
            // console.log(`        Adding missing cell [${cellCol}, ${cellRow}] to node [${node.col}, ${node.row}] list`)
            const next = {col: cellCol, row: cellRow, cells:[]}
            node.cells.push(next)
            node = next
        }
    }
}

export function getFireletTreeCellCount(node) {
    let n = 1
    for(let cell of node.cells)
        n += getFireletTreeCellCount(cell)
    return n
}
