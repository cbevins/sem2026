/**
 * Converts the array of fire ellipse raster pathways into a hierarchical tree.
 * This should (???) improve fire ellipse growth simulation by reducing cell traversal.
 * @param {Array} paths As returned by getEllipseRasterpathways()
 * @returns Tree structure of {x, y, status, paths}
 */
export function getEllipseRasterTree(paths) {
    const tree = {x:0, y:0, status: 0, paths: []}
    paths.sort()
    for(let path of paths) {
        let parent = tree
        for(let cell of path) {
            let found = false
            for(let child of parent.paths) {
                if (child.x === cell[0] && child.y === cell[1]) {
                    parent = child
                    found = true
                    break
                }
            }
            if (! found) {
                const child = {x: cell[0], y: cell[1], status: 0, paths:[]}
                parent.paths.push(child)
                parent = child
            }
        }
    }
    return tree
}

// Function to time pathway array traversal with status check
export function processEllipseRasterPathways(paths) {
    let visits = 0
    for(let path of paths) {
        for(let cell of path) {
            const [x, y] = cell
            visits++
            if (! isBurnable(x, y)) break
            setBurning(x,y)
        }
    }
    return visits
}

// Function to time pathway tree traversal with status check
let treeVisits = 0
export function processEllipseRasterTree(tree) {
    _walk(tree)
    return treeVisits
}

function _walk(cell, level=0) {
    treeVisits++
    const {x, y, status, paths} = cell
    // const pad = ''.padStart(2*level)
    // console.log(`${pad}[${x},${y}] status=${status} paths=${paths.length}`)
    if (isBurnable(x, y)) {
        setBurning(x,y)
        for(let path of paths) {
            _walk(path, level+1)
        }
    }
}

function isBurnable(x, y) { return (x!==20 && y!==20) }
function setBurning(x, y) { return }