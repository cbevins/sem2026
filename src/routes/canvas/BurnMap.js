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

    // Performs bounds checking for other get<Something>() methods
    get(col, row) {
        if (col<0 || col>this.width || row<0 || row>this.height)
            return BurnMap.outOfBounds
        return this.data[col + row * this.width]
    }

    getBurnCode(col, row) {
        const byteValue = this.get(col, row)
        return byteValue & 3; // 3 in binary is '00000011
    }

    getCounts() {
        const counts = [0,0,0,0]
        for(let d of this.data) counts[d]++
        return counts
    }

    getFeatureCode(col, row) {
        const byteValue = this.get(col, row)
        return byteValue >> 2
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

    setBurnCode(col, row, newValue2Bits, n=1) {
        if (newValue2Bits<0 || newValue2Bits > 3)
            throw new Error('BurnMap.setBurnCode() attempt to set code outside range[0,3].')
        if (col<0 || col>this.width || row<0 || row>this.height) return
        const idx = col + row * this.width
        const end = Math.min(idx+n, this.width*(row+1))
        for(let i=idx; i<end; i++) {
            const originalByte = this.data[i]
            // Clear the lowest 2 bits using the mask ~3 (0b11111100)
            // then combine with the new value using OR
            const newByte = (originalByte & ~3) | (newValue2Bits & 3)
            this.data[i] = newByte
        }
    }

    setBurnCodeLine(x1, y1, x2, y2, value, superCover=true) {
        // Define differences and direction steps
        const dx = Math.abs(x2 - x1)
        const dy = Math.abs(y2 - y1)
        const sx = (x1 < x2) ? 1 : -1
        const sy = (y1 < y2) ? 1 : -1
        let err = dx - dy   // Initial error parameter

        while (true) {
            this.setBurnCode(x1, y1, value)

            // Exit the loop if the end point is reached
            if (x1 === x2 && y1 === y2) break

            const e2 = 2 * err
            // Check for supercover: horizontal and vertical steps
            if(superCover) {
                if (e2 > -dy && e2 < dx) {
                    // When both steps happen, we are at a diagonal transition
                    // We must add the intermediate cell to "cover" the line
                    this.setBurnCode(x1+sx, y1, value)
                    this.setBurnCode(x1, y1+sy, value)
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

    setBurnCodeRect(col, row, width, height, value) {
        if (col<0) col=0
        else if (col > this.width) col = this.width
        if (row<0) row = 0
        else if (row>this.height) row = this.height
        for(let i=0; i<height; i++) {
            this.setBurnCode(col, row+i, value, width)
        }
    }

    setFeatureCode(col, row, newValue6Bits, n=1) {
        if (newValue6Bits<0 || newValue6Bits > 63)
            throw new Error('BurnMap.setClassCode() attempt to set code outside range[0,63].')
        const idx = col + row * this.width
        const end = Math.min(idx+n, this.width*(row+1))
        for(let i=idx; i<end; i++) {
            const originalByte = this.data[i]
            const mask = 0x03   // Mask to keep only the lowest 2 bits (00000011)
            // Clear highest 6 bits of original, then OR with the new value shifted into place
            // newValue6Bits is shifted left by 2 to occupy the 6 highest positions
            const newByte = (originalByte & mask) | (newValue6Bits << 2)
            this.data[i] = newByte
        }
    }

    // Casts a line of BurnMap.burning from [x1,y1] thru [x2,y2]
    // unless an unburnable or burned cell blocks its path
    castBurnLine(x1, y1, x2, y2, superCover=true) {
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
            this.setBurnCode(x1, y1, BurnMap.burning)

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
                        this.setBurnCode(x1+sx, y1, BurnMap.burning)
                    state = this.get(x1, y1+sy)
                    if (state !== BurnMap.unburnable && state === BurnMap.unburned)
                        this.setBurnCode(x1, y1+sy, BurnMap.burning)
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