/**
 * Represents a point in 2D space.
 * @typedef {object} Point
 * @property {number} x - The x-coordinate.
 * @property {number} y - The y-coordinate.
 */

/**
 * Finds all points where a line segment intersects a grid's graticules.
 * Assumes a grid with uniform cell size starting from (0,0).
 *
 * @param {Point} p1 - The start point of the line segment.
 * @param {Point} p2 - The end point of the line segment.
 * @param {number} [cellSize=1] - The width and height of a grid cell.
 * @returns {Point[]} An array of intersection points, sorted by distance from p1.
 */
export function gridIntersections(p1, p2, cellSize = 1) {
    const intersections = [];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    if (dx === 0 && dy === 0) {
        return []; // No segment, no intersections
    }

    // Find intersections with vertical grid lines (x = i * cellSize)
    const minX = Math.min(p1.x, p2.x);
    const maxX = Math.max(p1.x, p2.x);
    // Start from the first vertical grid line past minX, up to or at maxX
    let startX = Math.ceil(minX / cellSize) * cellSize;

    for (let x = startX; x <= maxX; x += cellSize) {
        if (x === p1.x || x === p2.x) continue; // Skip endpoints if they fall on a grid line
        const t = (x - p1.x) / dx;
        if (t >= 0 && t <= 1) {
            const y = p1.y + t * dy;
            intersections.push({ x, y });
        }
    }

    // Find intersections with horizontal grid lines (y = i * cellSize)
    const minY = Math.min(p1.y, p2.y);
    const maxY = Math.max(p1.y, p2.y);
    // Start from the first horizontal grid line past minY, up to or at maxY
    let startY = Math.ceil(minY / cellSize) * cellSize;

    for (let y = startY; y <= maxY; y += cellSize) {
        if (y === p1.y || y === p2.y) continue; // Skip endpoints if they fall on a grid line
        const t = (y - p1.y) / dy;
        if (t >= 0 && t <= 1) {
            const x = p1.x + t * dx;
            intersections.push({ x, y });
        }
    }

    // Sort the points by their parameter 't' value (distance along the line)
    // This requires calculating 't' again, but is necessary to get ordered points
    intersections.sort((a, b) => {
        // Use the 't' value relative to dx or dy (whichever is larger to avoid division by zero issues)
        const tA = Math.abs(dx) > Math.abs(dy) ? (a.x - p1.x) / dx : (a.y - p1.y) / dy;
        const tB = Math.abs(dx) > Math.abs(dy) ? (b.x - p1.x) / dx : (b.y - p1.y) / dy;
        return tA - tB;
    });

    // Remove potential duplicates where a point lies exactly on a grid corner
    // This simple approach should work for most cases, a more robust solution might use a small epsilon
    const uniqueIntersections = [];
    intersections.forEach(point => {
        if (!uniqueIntersections.some(uniquePoint => uniquePoint.x === point.x && uniquePoint.y === point.y)) {
            uniqueIntersections.push(point);
        }
    });

    return uniqueIntersections;
}
const startPoint = { x: 1.5, y: 0.5 };
const endPoint = { x: 4.5, y: 3.5 };
const cellSize = 1; // Assuming a standard 1x1 grid

const intersections = gridIntersections(startPoint, endPoint, cellSize);
console.log(intersections);
