export class BurnMap {
    static unburned = 0         // has not been ignited (traversible)
    static ignited = 1          // ignited in the current time step (traversible)
    static burned = 2           // ignited in a previous time step (NOT traversible)
    static unburnable = 3       // may not be ignited in this time step (NOT traversible)
    static outOfBounds = 4      // row or col index is out-of-bounds (NOT traversible)

    constructor(cols=512, rows=512) {
        this.cols = cols
        this.rows = rows
        this.data = new Uint8ClampedArray(this.rows*this.cols).fill(BurnMap.unburned)
    }
    
    // Performs bounds checking of col, row before returning the burn status
    get(col, row) {
        if (col<0 || col>this.cols || row<0 || row>this.rows)
            return BurnMap.outOfBounds
        return this.data[col + row * this.cols]
    }

    set(col, row, status, n=1) {
        if (status<0 || status>3) {
            throw new Error(`BurnMap.set(${col}, ${row}, ${status}) attempts to set code outside range[0,3].`)
        }
        if (col<0 || col>this.cols || row<0 || row>this.rows) {
            return
        }
        const idx = col + row * this.cols
        const end = Math.min(idx+n, this.cols*(row+1))
        for(let i=idx; i<end; i++) {
            this.data[i] = status
        }
        return this
    }

    setRect(col, row, width, height, status) {
        const begCol = Math.max(0, col)
        const endCol = Math.min(this.cols, begCol + width)
        const begRow = Math.max(0, row)
        const endRow = Math.min(this.rows, begRow + height)
        for(let row=begRow; row<endRow; row++) {
            let idx = begCol + row*this.cols
            for(let col=begCol; col<endCol; col++) {
                this.data[idx++] = status
            }
        }
        return this
    }

    // Uses Bresenham algorithm to set a line of codes
    setLine(x1, y1, x2, y2, status, superCover=true) {
        // Define differences and direction steps
        const dx = Math.abs(x2 - x1)
        const dy = Math.abs(y2 - y1)
        const sx = (x1 < x2) ? 1 : -1
        const sy = (y1 < y2) ? 1 : -1
        let err = dx - dy   // Initial error parameter

        while (true) {
            this.set(x1, y1, status)
            // Exit the loop if the end point is reached
            if (x1 === x2 && y1 === y2) break

            const e2 = 2 * err
            // Check for supercover: horizontal and vertical steps
            if(superCover) {
                if (e2 > -dy && e2 < dx) {
                    // When both steps happen, we are at a diagonal transition
                    // We must add the intermediate cell to "cover" the line
                    this.set(x1+sx, y1, status)
                    this.set(x1, y1+sy, status)
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