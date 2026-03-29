/**
 * Plots pixels in all eight octants of a circle using symmetry.
 * @param {number} xc - The x-coordinate of the circle's center.
 * @param {number} yc - The y-coordinate of the circle's center.
 * @param {number} x - The current x-offset from the center.
 * @param {number} y - The current y-offset from the center.
 * @param {function} setPixel - A function to draw a pixel at a given (x, y) coordinate.
 */
export function plotPoints(xc, yc, x, y, setPixel) {
    setPixel(xc + x, yc + y);
    setPixel(xc - x, yc + y);
    setPixel(xc + x, yc - y);
    setPixel(xc - x, yc - y);
    setPixel(xc + y, yc + x);
    setPixel(xc - y, yc + x);
    setPixel(xc + y, yc - x);
    setPixel(xc - y, yc - x);
}

/**
 * Draws a circle using the Bresenham circle algorithm.
 * @param {number} xc - The x-coordinate of the circle's center.
 * @param {number} yc - The y-coordinate of the circle's center.
 * @param {number} r - The radius of the circle.
 * @param {function} setPixel - A function to draw a pixel at a given (x, y) coordinate.
 */
export function plotCircle(xc, yc, r, setPixel) {
    let x = 0;
    let y = r;
    // Initial decision parameter d (or p)
    let d = 3 - 2 * r;

    plotPoints(xc, yc, x, y, setPixel);

    while (y >= x) {
        // Increment x for each step
        x++;

        // Check the decision parameter to decide the next pixel
        if (d > 0) {
            // Move to (x+1, y-1) i.e. South East (SE)
            y--;
            d = d + 4 * (x - y) + 10;
        } else {
            // Move to (x+1, y) i.e. East (E)
            d = d + 4 * x + 6;
        }
        
        plotPoints(xc, yc, x, y, setPixel);
    }
}
