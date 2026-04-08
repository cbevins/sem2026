export class VectorGrid {
    constructor(gridRadius, cellSize=1) {
        this.cellSize = cellSize
        this.gridDim = 1 + 2 * gridRadius
        this.gridMid = gridRadius // index of middle x,y
        this.rows = []
        // Angle derivation point 'A' is top center
        const a = {x:this.gridMid, y:0}
        // Angle derivation point 'B' is grid center
        const b = {x:this.gridMid, y:this.gridMid}
        for(let row=0; row<this.gridDim; row++) {
            const dy = row - this.gridMid           // row offset from center row
            const y = dy * this.cellSize            // row distance to center row
            // console.log(`Row ${row} dy=${dy} y=${y}`)
            this.rows.push({dy,y,cols:[]})
            for(let col=0; col<this.gridDim; col++) {
                const dx = col - this.gridMid       // col offset to middle col
                const x = dx * this.cellSize        // col distance to middle col
                const dist = Math.sqrt((dy*dy)+(dx*dx)) // cell distance to center cell
                const c = {x:dx, y:dy}              // point 'C' for angle derivation
                const radians = angle(a, b, c)
                const deg = radians * 180 / Math.PI
                const int = gridIntersections(0, 0, x, y, this.cellSize, this.cellSize)
                this.rows[row].cols.push({dx, x, dist, deg, int})
            }
        }
    }
}

// Returns angle (radians) between 3 points A, B, and C,
// where each point is an object with cordinate properties {x, y}
export function angle(A, B, C) {
    // Vectors AB and BC
    var AB = { x: A.x - B.x, y: A.y - B.y }
    var CB = { x: C.x - B.x, y: C.y - B.y }
    // Calculate angles of each vector relative to x-axis
    var dot = AB.x * CB.x + AB.y * CB.y
    var cross = AB.x * CB.y - AB.y * CB.x
    // Returns angle in range -PI to PI
    return Math.atan2(cross, dot)
}

export function degrees(radians) { return radians * 180 / Math.PI }
export function radians(degrees) {return degrees * Math.PI / 180 }

// Returns {x, y, ...} of line segment intersection point, or NULL.
export function segmentsIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    // Calculate denominator to check for parallel lines
    const denom = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1))

    // If denom is 0, lines are parallel (or collinear)
    if (denom === 0) { return null }

    // Calculate ua and ub to determine where intersection occurs
    const ua = ((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))
    const ub = ((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3))

    const uNumeratorA = ua / denom
    const uNumeratorB = ub / denom

    // If uNumeratorA and uNumeratorB are between 0 and 1,
    // the intersection is within both line segments.
    if (uNumeratorA >= 0 && uNumeratorA <= 1 && uNumeratorB >= 0 && uNumeratorB <= 1) {
        return {
            x: x1 + (uNumeratorA * (x2 - x1)),
            y: y1 + (uNumeratorA * (y2 - y1)),
            // Included for segment-specific checks
            onLine1: true,
            onLine2: true
        }
    }
    // Lines intersect, but outside the segments
    return null
}
/**
 * Determines intersection points of a line segment with a 2D grid.
 * @param {number} x1 - Start x-coordinate
 * @param {number} y1 - Start y-coordinate
 * @param {number} x2 - End x-coordinate
 * @param {number} y2 - End y-coordinate
 * @param {number} gridWidth - Horizontal spacing of grid lines
 * @param {number} gridHeight - Vertical spacing of grid lines
 * @returns {Array<{x: number, y: number, dist: number, axis: ['h','v']}>} Array of intersection points
 */
function gridIntersections(x1, y1, x2, y2, gridWidth, gridHeight) {
    const intersections = []
    const dx = x2 - x1
    const dy = y2 - y1

    // Find Vertical Grid Line Intersections (x = constant)
    const startX = Math.min(x1, x2)
    const endX = Math.max(x1, x2)
    let axis = 'v'
    for (let x = Math.ceil(startX / gridWidth) * gridWidth; x <= endX; x += gridWidth) {
        if (dx === 0) break; // Vertical line, no intersections with vertical grid
        const t = (x - x1) / dx
        const y = y1 + t * dy
        const dist = Math.sqrt((x-x1)*(x-x1)+(y-y1)*(y-y1))
        intersections.push({x, y, dist, axis})
    }

    // Find Horizontal Grid Line Intersections (y = constant)
    const startY = Math.min(y1, y2)
    const endY = Math.max(y1, y2)
    axis = 'h'
    for (let y = Math.ceil(startY / gridHeight) * gridHeight; y <= endY; y += gridHeight) {
        if (dy === 0) break; // Horizontal line, no intersections with horizontal grid
        const t = (y - y1) / dy
        const x = x1 + t * dx
        const dist = Math.sqrt((x-x1)*(x-x1)+(y-y1)*(y-y1))
        intersections.push({x, y, dist, axis})
    }

    // Return intersections sorted by distance from starting point (x1, y1)
    intersections.sort((a, b) => { return a.dist - b.dist })
    return intersections
}

// ------------------------------------------------------------------------------
console.log(new Date())
// const grid = new VectorGrid(3,1)
// // Display in a table
// const data = []
// for(let r=0; r<grid.rows.length; r++) {
//     const {dy, y, cols} = grid.rows[r]
//     for (let c=0; c<cols.length; c++) {
//         const {dx, x, dist, deg, int} = grid.rows[r].cols[c]
//         data.push({x, y, dist: dist.toFixed(2), deg:deg.toFixed(2), cells: int.length})
//     }
// }
// console.log('7x7 VectorGrid')
// console.table(data)

// console.log('Diagonal from [-3,-3] to [0,0]')
// const row = grid.rows[0]
// console.log(row.dy, row.y, row.cols[3])
// const v = {x1: 0, y1: 0, x2: 1, y2: 20, w: 1, h: 1}
// const points = gridIntersections(v.x1, v.y1, v.x2, v.y2, v.w, v.h)
// const a = degrees(angle( {x:v.x2, y:v.y2},{x:v.x1, y:v.y1},{x:v.x1, y:v.y1+10}))
// console.table(points)
// console.log(`There are ${points.length} intersection points between [${v.x1},${v.y1}] and [${v.x2},${v.y2}] at angle ${a.toFixed(2)}`)

function getAngle(x1, y1, x2, y2) {
    const dy = y2-y1
    const dx = x2-x1
    const rad = Math.atan2(dy, dx)
    const deg = degrees(rad).toFixed(2).padStart(7)
    const bearing = ((450-deg)%360).toFixed(2).padStart(7)
    let slope = (dy/dx).toFixed(2).padStart(7)
    return {x1,y1,dx,x2,y2,dy,deg,bearing,slope}
}
const data = []
data.push(getAngle(0,0,0,3))
data.push(getAngle(0,0,1,3))
data.push(getAngle(0,0,2,3))
data.push(getAngle(0,0,3,3))
data.push(getAngle(0,0,3,0))
data.push(getAngle(0,0,3,-1))
data.push(getAngle(0,0,3,-2))
data.push(getAngle(0,0,3,-3))
data.push(getAngle(0,0,2,-3))
data.push(getAngle(0,0,1,-3))
data.push(getAngle(0,0,0,-3))
data.push(getAngle(0,0,-1,-3))
data.push(getAngle(0,0,-2,-3))
data.push(getAngle(0,0,-3,-3))
data.push(getAngle(0,0,-3,-2))
data.push(getAngle(0,0,-3,-1))
data.push(getAngle(0,0,-3,0))
data.push(getAngle(0,0,-3,1))
data.push(getAngle(0,0,-3,2))
data.push(getAngle(0,0,-3,3))
console.table(data)