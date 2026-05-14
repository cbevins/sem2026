/**
 * Calculates intersections of a line with a Cartesian graticule.
 * @param {number} x1, y1 - Line start
 * @param {number} x2, y2 - Line end
 * @param {number} xStep - Width of grid cells
 * @param {number} yStep - Height of grid cells
 */
export function getRasterVectorIntersections(x1, y1, x2, y2, xStep=1, yStep=1) {
    const intersections = [];
    const dx = x2 - x1;
    const dy = y2 - y1;

    // Boundary lines to check (vertical and horizontal lines)
    const xBounds = new Set()
    const yBounds = new Set()

    // Determine grid lines between start and end
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x += xStep) {
        xBounds.add(Math.round(x / xStep) * xStep)
    }
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y += yStep) {
        yBounds.add(Math.round(y / yStep) * yStep)
    }

    // Check intersection with Vertical Lines (x = const)
    xBounds.forEach(x => {
        if (dx === 0) return // Parallel to vertical line
        const t = (x - x1) / dx
        if (t >= 0 && t <= 1) {
            intersections.push({ x: x, y: y1 + t * dy, n: 1 })
        }
    })

    // Check intersection with Horizontal Lines (y = const)
    yBounds.forEach(y => {
        if (dy === 0) return // Parallel to horizontal line
        const t = (y - y1) / dy
        if (t >= 0 && t <= 1) {
            intersections.push({ x: x1 + t* dx, y: y, n: 1 })
        }
    })

    // Include the line segment end points
    intersections.push({ x: x1, y: y1, n: 1 })
    intersections.push({ x: x2, y: y2, n: 1 })

    // Determine distance of each intersection from the origin
    for(let inter of intersections) {
        inter.d = Math.hypot(inter.x - x1, inter.y - y1)
    }

    // Sort intersections by distance from start
    // and remove double intersections after marking them as such
    intersections.sort((a, b) => a.d - b.d)
    for(let i=0; i<intersections.length-1; i++) {
        const a = intersections[i]
        const b = intersections[i+1]
        if (Math.abs(a.x - b.x) < 1e-10 && Math.abs(a.y - b.y) < 1e-10) {
            // Merge into single intersection if they are effectively the same point
            intersections[i] = { x: a.x, y: a.y, n: 2 }
            intersections.splice(i+1, 1)
        }
    }
    return intersections
}

const x1 = 0.5, y1 = 0.5, x2 = 4.5, y2 = 2.5, xStep = 1, yStep = 1;
console.log(`Cell Intersections from [${x1}, ${y1}] to [${x2}, ${y2}]:`)
const gridIntersections = getRasterVectorIntersections(x1, y1, x2, y2, xStep, yStep);
console.table(gridIntersections);
