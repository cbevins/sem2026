/**
 * Generates a raster grid for a rotated ellipse.
 * @param {number} width - Grid width.
 * @param {number} height - Grid height.
 * @param {number} cx - Center X of ellipse.
 * @param {number} cy - Center Y of ellipse.
 * @param {number} rx - Major axis radius.
 * @param {number} ry - Minor axis radius.
 * @param {number} angle - Rotation in radians.
 */
function createEllipseRaster(width, height, cx, cy, rx, ry, angle) {
    const raster = Array.from({ length: height }, () => new Uint8Array(width));
    const cosA = Math.cos(-angle); // Use inverse rotation
    const sinA = Math.sin(-angle);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // 1. Translate point to origin relative to ellipse center
            const dx = x - cx;
            const dy = y - cy;

            // 2. Rotate point inversely to align with axis
            const rotX = dx * cosA - dy * sinA;
            const rotY = dx * sinA + dy * cosA;

            // 3. Apply the ellipse equation: (x/rx)^2 + (y/ry)^2 <= 1
            if ((rotX * rotX) / (rx * rx) + (rotY * rotY) / (ry * ry) <= 1) {
                raster[y][x] = 1;
            }
        }
    }
    return raster
}
