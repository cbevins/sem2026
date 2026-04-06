export class BurnMap {
    static unburned = 0
    static burning = 1
    static burned = 2
    static unburnable = 3
    static outOfBounds = 4

    constructor(width, height) {
        this.width = width
        this.height = height
        this.data = new Uint8ClampedArray(width*height).fill(BurnMap.unburned)
    }

    get(col, row) {
        if (col<0 || col>this.width || row<0 || row>this.height)
            return BurnMap.outOfBounds
        return this.data[col + row * this.width]
    }

    getCounts() {
        const counts = [0,0,0,0]
        for(let d of this.data) counts[d]++
        return counts
    }

    getGaps() {
        const lines = []
        for(let row=0; row<this.height; row++) {
            let first = 0
            let last = 0
            for(let col=0; col<this.width; col++) {
                if (this.get(col,row) === BurnMap.burning) {
                    if (first===0) first=col
                    last = col
                }
            }
            lines.push([first,last])
        }
        let gaps = 0
        for(let row=0; row<this.height; row++) {
            const [first,last] = lines[row]
            if (first && last) {
                for(let col=first; col<=last; col++) {
                    if (this.get(col,row) !== BurnMap.burning) gaps++
                }
            }
        }
        return gaps
    }

    set(col, row, value, n=1) {
        if (col<0 || col>this.width || row<0 || row>this.height) return
        const idx = col + row * this.width
        const end = Math.min(idx+n, this.width*(row+1))
        this.data.fill(value, idx, end)   // 'end' is NOT filled
    }

    setLine(x1, y1, x2, y2, value, superCover=true) {
        // Define differences and direction steps
        const dx = Math.abs(x2 - x1)
        const dy = Math.abs(y2 - y1)
        const sx = (x1 < x2) ? 1 : -1
        const sy = (y1 < y2) ? 1 : -1
        let err = dx - dy   // Initial error parameter

        while (true) {
            this.set(x1, y1, value)

            // Exit the loop if the end point is reached
            if (x1 === x2 && y1 === y2) break

            const e2 = 2 * err
            // Check for supercover: horizontal and vertical steps
            if(superCover) {
                if (e2 > -dy && e2 < dx) {
                    // When both steps happen, we are at a diagonal transition
                    // We must add the intermediate cell to "cover" the line
                    this.set(x1+sx, y1, value)
                    this.set(x1, y1+sy, value)
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
    }

    setRect(col, row, width, height, value) {
        if (col<0) col=0
        else if (col > this.width) col = this.width
        if (row<0) row = 0
        else if (row>this.height) row = this.height
        for(let i=0; i<height; i++) {
            this.set(col, row+i, value, width)
        }
    }

    raycast(x1, y1, x2, y2, superCover=true) {
        // Define differences and direction steps
        const dx = Math.abs(x2 - x1)
        const dy = Math.abs(y2 - y1)
        const sx = (x1 < x2) ? 1 : -1
        const sy = (y1 < y2) ? 1 : -1
        let err = dx - dy   // Initial error parameter

        while (true) {
            // Exit the loop if the cell is not passable
            let state = this.get(x1, y1)
            if (state === BurnMap.unburnable || state === BurnMap.burned) break
            this.set(x1, y1, BurnMap.burning)

            // Exit the loop if the end point is reached
            if (x1 === x2 && y1 === y2) break

            const e2 = 2 * err
            // Check for supercover: horizontal and vertical steps
            if (superCover) {
                if (e2 > -dy && e2 < dx) {
                    // When both steps happen, we are at a diagonal transition
                    // We must add the intermediate cell to "cover" the line
                    state = this.get(x1+sx, y1)
                    if (state !== BurnMap.unburnable && state === BurnMap.unburned)
                        this.set(x1+sx, y1, BurnMap.burning)
                    state = this.get(x1, y1+sy)
                    if (state !== BurnMap.unburnable && state === BurnMap.unburned)
                        this.set(x1, y1+sy, BurnMap.burning)
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
    }
}