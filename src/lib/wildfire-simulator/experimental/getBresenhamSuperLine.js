export function getBresenhamSuperLine(x1, y1, x2, y2) {
    // Ensure coordinates are integers (Bresenham is an integer algorithm)
    x1 = Math.floor(x1)
    y1 = Math.floor(y1)
    x2 = Math.floor(x2)
    y2 = Math.floor(y2)

    let x = x1;
    let y = y1;
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = (x1 < x2) ? 1 : -1;
    const sy = (y1 < y2) ? 1 : -1;
    
    let err = dx - dy;
    const points = [[x, y]];

    while (x !== x2 || y !== y2) {
        const e2 = 2 * err;
        // Check for supercover: horizontal and vertical steps
        if (e2 > -dy && e2 < dx) {
            // When both steps happen, we are at a diagonal transition
            // We must add the intermediate cell to "cover" the line
            points.push([x + sx, y]);
            points.push([x, y + sy]);
        }
        if (e2 > -dy) {
            err -= dy;
            x += sx;
        }
        if (e2 < dx) {
            err += dx;
            y += sy;
        }
        points.push([x, y]);
    }
    return points;
}
