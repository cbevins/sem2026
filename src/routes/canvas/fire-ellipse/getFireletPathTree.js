/**
 * Converts a getFireletPathArray() into a hierarchical pathway tree.
 * This should (???) improve path traversal times by reducing the number of
 * raster cells visited and queried during each Firlet iteration.
 * @param {Array} paths As returned by getFireletPathArray()
 * @returns Tree structure of {x, y, paths}
 */
export function getFireletPathTree(paths) {
    const tree = {x:0, y:0, paths:[]}
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
                const child = {x: cell[0], y: cell[1], paths:[]}
                parent.paths.push(child)
                parent = child
            }
        }
    }
    return tree
}
