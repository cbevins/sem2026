/**
 * Returns an array of fire ellipse perimeter points and other info
 * @param {*} e FireEllipseMod instance
 * @param {*} vector Reference to e.beta, e.psi, or e.theta
 * @param {*} deg Degrees increment 
 * @param {*} src Angle configuration parameter, either 'head' or 'north'
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
export function perimeterPoints(e, vector, deg=5, src='head') {
    const pts = []
    let len = 0
    let lastX = 0
    let lastY = 0
    for(let i=0; i<=360; i+=deg) {
        vector.angle[src].set(i)
        e.updateAll()
        // Determine segment length and cumulative perimeter length
        if (i) {
            const dx = vector.perim.head.x.value - lastX
            const dy = vector.perim.head.y.value - lastY
            const dl = Math.sqrt(dx*dx + dy*dy)
            len += dl
        }
        pts.push([i, fmt(vector.perim.head.x), fmt(vector.perim.head.y),
            fmt(vector.beta), fmt(vector.psi), fmt(vector.theta), fmt(vector.vhr),
            len.toFixed(8)])
        lastX = vector.perim.head.x.value
        lastY = vector.perim.head.y.value
    }
    return pts
}
