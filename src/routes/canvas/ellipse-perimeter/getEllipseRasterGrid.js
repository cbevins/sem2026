export function getEllipseRasterGrid(length, width, bearing, centerEast, centerNorth) {
    const angle = (450 - bearing) % 360
    const rx = length / 2
    const ry = width / 2
    const cols = Math.ceil(2 * (length + 1))
    const rows = Math.ceil(2 * (length + 1))
    const raster = Array.from({ length: rows }, () => new Uint8Array(cols));
    const cosA = Math.cos(-angle) // Use inverse rotation
    const sinA = Math.sin(-angle)

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            // 1. Translate point to origin relative to ellipse center
            const dx = x - centerEast
            const dy = y - centerNorth

            // 2. Rotate point inversely to align with axis
            const rotX = dx * cosA - dy * sinA
            const rotY = dx * sinA + dy * cosA

            // 3. Apply the ellipse equation: (x/rx)^2 + (y/ry)^2 <= 1
            if ((rotX * rotX) / (rx * rx) + (rotY * rotY) / (ry * ry) <= 1) {
                raster[y][x] = 1
            }
        }
    }
    return raster
}
