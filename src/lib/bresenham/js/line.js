export function plotLine(x1, y1, x2, y2, setPixel) {
    for(let [x,y] of linePoints(x1, y1, x2, y2)) setPixel(x,y)
}

/**
 * Generates an array of points (pixels) for a line between two given endpoints 
 * using the Bresenham line algorithm.
 * 
 * @param {number} x1 - The x-coordinate of the starting point.
 * @param {number} y1 - The y-coordinate of the starting point.
 * @param {number} x2 - The x-coordinate of the ending point.
 * @param {number} y2 - The y-coordinate of the ending point.
 * @returns {Array<Object>} An array of point objects {x, y}.
 */
export function linePoints(x1, y1, x2, y2) {
    // Round input coordinates to ensure integer math
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    x2 = Math.round(x2);
    y2 = Math.round(y2);

    const points = [];
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1; // Step direction for x
    const sy = y1 < y2 ? 1 : -1; // Step direction for y
    let err = dx - dy; // Initial error term
    
    let x = x1;
    let y = y1;

    while (true) {
        // Plot the current point
        points.push([x, y]);

        // Check if the end point is reached
        if (x === x2 && y === y2) break;

        const e2 = 2 * err;
        if (e2 > -dy) { // Decision for x-step
            err -= dy;
            x += sx;
        }
        if (e2 < dx) { // Decision for y-step
            err += dx;
            y += sy;
        }
    }

    return points;
}
