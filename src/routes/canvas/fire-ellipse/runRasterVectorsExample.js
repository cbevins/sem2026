/**
 * Example useage of getRasterVectors() to find the minimum set of unique line segments (slopes)
 * starting at [0,0] that pass through the center of every cell in a cols x rows grid.
 * The function returns the lines for the positive x and positive y values of a Cartesian plane,
 * i.e., for the NE quandrant. 
 */
import { getRasterVectors } from './getRasterVectors.js'
import { getRasterVectorIntersections } from './getRasterVectorIntersections.js'

function vectorsByQuadrantSize() {
    console.log(`Minimum vectors from origin to intersect all cells of a quadrant`)
    const table = []
    for(let dim of [10, 50, 100, 200, 500]) {
        let timer1 = performance.now()
        const vectors = getRasterVectors(dim, dim)
        const msec = Math.trunc((performance.now() - timer1)*100)/100
            table.push({cols: dim, rows: dim, cells: dim*dim, vectors: vectors.length, msec})
    }
    console.table(table)
}

function vectorTable(dim) {
    const vectors = getRasterVectors(dim, dim)
    vectors.sort((a, b) => a.slope - b.slope)
    console.log(`It requires ${vectors.length} vectors to intersect all ${dim*dim} cells of a ${dim}x${dim} quadrant:`)
    console.table(vectors)
}

//--------------------------------------------------------

function getMasterTemplate(dim, spacing=1) {
    const vectors = getRasterVectors(dim, dim)
    const dist = Math.hypot(dim, dim)
    for(let {slope} of vectors) {
        // Determine a line segment end-point beyond the grid boundary along the vector direction
        const theta = Math.atan(slope)
        const dx = dist * Math.cos(theta) + spacing
        const dy = dist * Math.sin(theta) + spacing
        const intersections = getRasterVectorIntersections(0.5, 0.5, dx, dy, spacing, spacing)
    }
}

// Spread fire front point along every vector based on the lwr and headRos at the point's [x,y] at time t
function spread(x, y, t) {
    
}

const timer0 = performance.now()
vectorTable(10)
// vectorsByQuadrantSize()
console.log(`Total time: ${Math.trunc((performance.now() - timer0)*100)/100} msec`)