export class FireMapDraw {
    constructor() {}
    
    static rect(fireMap, col, row, width, height, status) {
        const begCol = Math.max(0, col)
        const endCol = Math.min(fireMap.cols, begCol + width)
        const begRow = Math.max(0, row)
        const endRow = Math.min(fireMap.rows, begRow + height)
        for(let row=begRow; row<endRow; row++) {
            let idx = begCol + row*fireMap.cols
            for(let col=begCol; col<endCol; col++) {
                fireMap.data[idx++] = status
            }
        }
        return this
    }

    // Uses Bresenham algorithm to set a line of fire status codes
    static line(fireMap, x1, y1, x2, y2, status, superCover=true) {
        // Define differences and direction steps
        const dx = Math.abs(x2 - x1)
        const dy = Math.abs(y2 - y1)
        const sx = (x1 < x2) ? 1 : -1
        const sy = (y1 < y2) ? 1 : -1
        let err = dx - dy   // Initial error parameter

        while (true) {
            fireMap.set(x1, y1, status)
            // Exit the loop if the end point is reached
            if (x1 === x2 && y1 === y2) break

            const e2 = 2 * err
            // Check for supercover: horizontal and vertical steps
            if(superCover) {
                if (e2 > -dy && e2 < dx) {
                    // When both steps happen, we are at a diagonal transition
                    // We must add the intermediate cell to "cover" the line
                    fireMap.set(x1+sx, y1, status)
                    fireMap.set(x1, y1+sy, status)
                }
            }
            if (e2 > -dy) {
                err -= dy
                x1 += sx
            }
            if (e2 < dx) {
                err += dx
                y1 += sy
            }
        }
        return this
    }

}