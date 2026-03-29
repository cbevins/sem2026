/**
 * Generates an array of coordinates for a line between two points using Bresenham's algorithm.
 * 
 * @param {number} x1 - The starting x-coordinate (integer).
 * @param {number} y1 - The starting y-coordinate (integer).
 * @param {number} x2 - The ending x-coordinate (integer).
 * @param {number} y2 - The ending y-coordinate (integer).
 * @returns {Array<{x: number, y: number}>} An array of points forming the line.
 */
export function getBresenhamLinePoints(x1, y1, x2, y2) {
    // Ensure coordinates are integers (Bresenham is an integer algorithm)
    x1 = Math.floor(x1)
    y1 = Math.floor(y1)
    x2 = Math.floor(x2)
    y2 = Math.floor(y2)

    const coordinatesArray = []
    // Define differences and direction steps
    const dx = Math.abs(x2 - x1)
    const dy = Math.abs(y2 - y1)
    const sx = (x1 < x2) ? 1 : -1
    const sy = (y1 < y2) ? 1 : -1
    let err = dx - dy   // Initial error parameter

    while (true) {
        // Store or plot the current point
        coordinatesArray.push({ x: x1, y: y1 })

        if (x1 === x2 && y1 === y2) {
            break // Exit the loop if the end point is reached
        }

        const e2 = 2 * err
        if (e2 > -dy) {
            err -= dy
            x1 += sx
        }
        if (e2 < dx) {
            err += dx
            y1 += sy
        }
    }

    return coordinatesArray
}
