import { DefaultFeaturePalette } from "./FeaturePalette"

export class BurnMap {
    static unburned = 0
    static burning = 1
    static burned = 2
    static unburnable = 3
    static outOfBounds = 4

    constructor(pcsWest, pcsNorth, pcsWidth, pcsHeight, scale) {
        this.pcs = {
            east: pcsWest+pcsWidth,
            west: pcsWest,
            north: pcsNorth,
            south: pcsNorth-pcsHeight,
            width: pcsWidth,
            height: pcsHeight,
            scale
        }
        this.raster = {
            cols: Math.trunc((0.5+pcsWidth)/scale),
            rows: Math.trunc((0.5+pcsHeight)/scale),
        } 
        this.data = new Uint8ClampedArray(this.raster.rows*this.raster.cols).fill(BurnMap.unburned)
    }

    // Casts a line of BurnMap.burning from cell [x1,y1] thru cell [x2,y2]
    // unless/until an unburnable or burned cell blocks its path
    castBurnLine(x1, y1, x2, y2, superCover=true) {
        // Define differences and direction steps
        const dx = Math.abs(x2 - x1)
        const dy = Math.abs(y2 - y1)
        const sx = (x1 < x2) ? 1 : -1
        const sy = (y1 < y2) ? 1 : -1
        let err = dx - dy   // Initial error parameter

        while (true) {
            // Exit the loop if the cell is not passable
            let state = this.getBurnCode(x1, y1)
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
                    state = this.getBurnCode(x1+sx, y1)
                    if (state !== BurnMap.unburnable && state === BurnMap.unburned)
                        this.setBurnCode(x1+sx, y1, BurnMap.burning)
                    state = this.getBurnCode(x1, y1+sy)
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

    // Draws the BurnMap onto a canvas context imageData using a FeaturePalette
    drawToCanvas(ctx, palette=DefaultFeaturePalette) {
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
        const d = imageData.data
        for(let j=0; j<this.data.length; j++) {
            const byte = this.data[j]
            const burnCode = byte & 3       // 3 in binary is '00000011
            const featureCode = byte >> 2
            const rgba = palette[featureCode].rgba[burnCode]
            const i = 4*j
            d[i] = rgba[0]
            d[i+1] = rgba[1]
            d[i+2] = rgba[2]
            d[i+3] = rgba[3]
        }
        ctx.putImageData(imageData, 0, 0)
    }

    // Performs bounds checking of col, row for other get<Something>() methods
    get(col, row) {
        if (col<0 || col>this.raster.cols || row<0 || row>this.raster.rows)
            return BurnMap.outOfBounds
        return this.data[col + row * this.raster.cols]
    }

    // Returns BurnMap burn code at col, row
    getBurnCode(col, row) {
        const byteValue = this.get(col, row)
        return byteValue & 3; // 3 in binary is '00000011
    }

    // Returns array of BurnMap.[unburned, burning, burned, unburnable] counts
    getBurnCounts() {
        const counts = [0,0,0,0]
        for(let byteValue of this.data) {
            counts[byteValue & 3]++ // 3 in binary is '00000011
        }
        return counts
    }

    // Returns {featureCode, burnCode} at col, row
    getCodes(col, row) {
        const byteValue = this.get(col, row)
        const burnCode = byteValue & 3      // 3 in binary is '00000011
        const featureCode = byteValue >> 2
        return {featureCode, burnCode}
    }

    // Return BurnMap featureCode at col, row
    getFeatureCode(col, row) {
        const byteValue = this.get(col, row)
        return byteValue >> 2
    }

    // Used during development to determine sufficiency of the degrees increment
    getGaps() {
        const lines = []
        for(let row=0; row<this.raster.rows; row++) {
            let first = 0
            let last = 0
            for(let col=0; col<this.raster.cols; col++) {
                if (this.get(col,row) === BurnMap.burning) {
                    if (first===0) first=col
                    last = col
                }
            }
            lines.push([first,last])
        }
        let gaps = 0
        for(let row=0; row<this.raster.rows; row++) {
            const [first,last] = lines[row]
            if (first && last) {
                for(let col=first; col<=last; col++) {
                    if (this.get(col,row) !== BurnMap.burning) gaps++
                }
            }
        }
        return gaps
    }

    // Combines lowest 6 bits of featureCode and lowest 2-bits of burnCode into an 8-bit byte
    joinedCode(featureCode, burnCode) {
        if (featureCode<0 || featureCode > 63)
            throw new Error('BurnMap.fillCodes() attempt to set featureCode outside range[0,63].')
        if (burnCode<0 || burnCode > 3)
            throw new Error('BurnMap.fillCodes() attempt to set burnCode outside range[0,3].')
        const mask = 0x03   // Mask to keep only the lowest 2 bits (00000011)
        // Clear highest 6 bits of original, then OR with the new value shifted into place
        // featureCode is shifted left by 2 to occupy the 6 highest positions
        const newByte = (burnCode & mask) | (featureCode << 2)
        return newByte
    }
    
    // Splites lowest 2-bits into burnCode and highest 6 bits into featureCode
    splitCodes(byteValue) {
        return {
            featureCode: byteValue >> 2,
            burnCode: byteValue & 3 // 3 in binary is '00000011
        }
    }

    fillCodes(featureCode, burnCode) {
        const newByte = this.joinedCode(featureCode, burnCode)
        for(let i=0; i<this.data.length; i++) this.data[i] = newByte
    }

    // These methods set just the burnCode 
    setBurnCode(col, row, newValue2Bits, n=1) {
        if (newValue2Bits<0 || newValue2Bits > 3)
            throw new Error('BurnMap.setBurnCode() attempt to set code outside range[0,3].')
        if (col<0 || col>this.raster.cols || row<0 || row>this.raster.rows) return
        const idx = col + row * this.raster.cols
        const end = Math.min(idx+n, this.raster.cols*(row+1))
        for(let i=idx; i<end; i++) {
            const originalByte = this.data[i]
            // Clear the lowest 2 bits using the mask ~3 (0b11111100)
            // then combine with the new value using OR
            const newByte = (originalByte & ~3) | (newValue2Bits & 3)
            this.data[i] = newByte
        }
    }

    setBurnCodeLine(x1, y1, x2, y2, burnCode, superCover=true) {
        this.setLine(x1, y1, x2, y2, null, burnCode, superCover)
    }

    setBurnCodeRect(col, row, width, height, value) {
        if (col<0) col=0
        else if (col > this.raster.cols) col = this.raster.cols
        if (row<0) row = 0
        else if (row>this.raster.rows) row = this.raster.rows
        for(let i=0; i<height; i++) {
            this.setBurnCode(col, row+i, value, width)
        }
    }

    // These methods set both the featureCode and burnCode 
    setCodes(col, row, featureCode, burnCode, n=1) {
        this.setBurnCode(col, row, burnCode, n)
        this.setFeatureCode(col, row, featureCode, n)
    }

    setCodesLine(x1, y1, x2, y2, featureCode, burnCode, superCover=true) {
        this.setLine(x1, y1, x2, y2, featureCode, burnCode, superCover)
    }

    setCodesRect(col, row, width, height, newValue6Bits, newValue2Bits) {
        this.setBurnCodeRect(col, row, width, height, newValue2Bits)
        this.setFeatureCodeRect(col, row, width, height, newValue6Bits)
    }

    // These methods set just the featureCode 
    setFeatureCode(col, row, newValue6Bits, n=1) {
        if (newValue6Bits<0 || newValue6Bits > 63)
            throw new Error('BurnMap.setFeatureCode() attempt to set code outside range[0,63].')
        const idx = col + row * this.raster.cols
        const end = Math.min(idx+n, this.raster.cols*(row+1))
        for(let i=idx; i<end; i++) {
            const originalByte = this.data[i]
            const mask = 0x03   // Mask to keep only the lowest 2 bits (00000011)
            // Clear highest 6 bits of original, then OR with the new value shifted into place
            // newValue6Bits is shifted left by 2 to occupy the 6 highest positions
            const newByte = (originalByte & mask) | (newValue6Bits << 2)
            this.data[i] = newByte
        }
    }

    setFeatureCodeLine(x1, y1, x2, y2, featureCode, superCover=true) {
        this.setLine(x1, y1, x2, y2, featureCode, null, superCover)
    }

    setFeatureCodeRect(col, row, width, height, value) {
        if (col<0) col=0
        else if (col > this.raster.cols) col = this.raster.cols
        if (row<0) row = 0
        else if (row>this.raster.rows) row = this.raster.rows
        for(let i=0; i<height; i++) {
            this.setFeatureCode(col, row+i, value, width)
        }
    }

    // Uses Bresenham algorithm to set a line of featureCodes and/or burnCodes
    setLine(x1, y1, x2, y2, featureCode, burnCode, superCover=true) {
        // Define differences and direction steps
        const dx = Math.abs(x2 - x1)
        const dy = Math.abs(y2 - y1)
        const sx = (x1 < x2) ? 1 : -1
        const sy = (y1 < y2) ? 1 : -1
        let err = dx - dy   // Initial error parameter

        while (true) {
            if (burnCode !==null ) this.setBurnCode(x1, y1, burnCode)
            if (featureCode !== null) this.setFeatureCode(x1, y1, featureCode)

            // Exit the loop if the end point is reached
            if (x1 === x2 && y1 === y2) break

            const e2 = 2 * err
            // Check for supercover: horizontal and vertical steps
            if(superCover) {
                if (e2 > -dy && e2 < dx) {
                    // When both steps happen, we are at a diagonal transition
                    // We must add the intermediate cell to "cover" the line
                    if (burnCode !== null) {
                        this.setBurnCode(x1+sx, y1, burnCode)
                        this.setBurnCode(x1, y1+sy, burnCode)
                    }
                    if (featureCode !== null) {
                        this.setFeatureCode(x1+sx, y1, featureCode)
                        this.setFeatureCode(x1, y1+sy, featureCode)
                    }
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
