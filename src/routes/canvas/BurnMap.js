export class BurnMap {
    static unburned = 0
    static burning = 1
    static burned = 2
    static unburnable = 3

    constructor(width, height) {
        this.width = width
        this.height = height
        this.data = new Uint8ClampedArray(width*height).fill(BurnMap.unburned)
    }

    get(col, row) { return this.data[col + row * this.width]}

    set(col, row, value, n=1) {
        const idx = col + row * this.width
        this.data.fill(value, idx, idx+n)
    }
 
    setRect(col, row, width, height, value=BurnMap.unburnable) {
        for(let i=0; i<height; i++) {
            this.set(col, row+i, value, width)
        }
    }
    
    raycast(x1, y1, x2, y2) {
        // Define differences and direction steps
        const dx = Math.abs(x2 - x1)
        const dy = Math.abs(y2 - y1)
        const sx = (x1 < x2) ? 1 : -1
        const sy = (y1 < y2) ? 1 : -1
        let err = dx - dy   // Initial error parameter

        while (true) {
            // Exit the loop if the cell is not passable
            const state = this.get(x1, y1)
            if (state === BurnMap.unburnable || state === BurnMap.burned) break

            this.set(x1, y1, BurnMap.burning)

            // Exit the loop if the end point is reached
            if (x1 === x2 && y1 === y2) break

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
    }
}