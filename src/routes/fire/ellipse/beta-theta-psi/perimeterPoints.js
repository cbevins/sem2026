/**
 * Returns an array of fire ellipse perimeter points and other info
 * @param {*} ellipseMod FireEllipseMod instance
 * @param {*} vector Reference to e.beta, e.psi, or e.theta
 * @param {*} deg Degrees increment 
 * @param {*} src Angle configuration parameter, either 'angle' or 'bearing'
 * @returns Array of arrays of following properties at each degStep:
 *  0: x coordinate wrt head
 *  1: y coordinate wrt head
 *  2: beta cooresponding to the vector deg 
 *  3: psi cooresponding to the vector deg 
 *  4: theta cooresponding to the vector deg 
 *  5: vector rate (or distance) ratio to head rate (or distance)
 *  6: cumulative perimeter distance from head
 */
function fmt(node) { return node.value.toFixed(8) }

export function perimeterPoints(ellipseMod, vector, deg=5, src='angle') {
    const state = ellipseMod.getState()
    const pts = []
    let len = 0
    let arclen = 0
    let lastX = 0
    let lastY = 0
    for(let i=0; i<=360; i+=deg) {
        vector[src].set(i)
        ellipseMod.updateAll()
        // Determine segment length and cumulative perimeter length
        if (i) {
            const dx = vector.perim.x.value - lastX
            const dy = vector.perim.y.value - lastY
            len = Math.sqrt(dx*dx + dy*dy)
            arclen += len
        }
        pts.push({deg: i,
            x: fmt(vector.perim.x), y: fmt(vector.perim.y),
            east: fmt(vector.perim.east), north: fmt(vector.perim.north),
            beta: fmt(vector.beta), psi: fmt(vector.psi), theta:fmt(vector.theta),
            vhr: fmt(vector.vhr),
            segleng: len.toFixed(8), arcleng: arclen.toFixed(8)})
        lastX = vector.perim.x.value
        lastY = vector.perim.y.value
    }
    ellipseMod.setState(state)
    return pts
}
