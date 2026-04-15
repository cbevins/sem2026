/**
 * Class for managing a UnitClampArray byte map containing 2 values per byte
 */
export class ByteMap {
    constructor(width, height, highBits) {
        this.cols = width
        this.rows = height
        
        this.highBits = highBits
        this.lowBits = 8-highBits

        this.highMax = 2**highBits - 1
        this.highShift = 8 - this.lowBits   // right shift bits to get high value
        this.lowMax = 2**this.low - 1
        this.lowAnd = 3                 // 3 in binary is '00000011
        // this.mask2 = 0x01   // Mask to keep only the lowest 1 bits (00000001)
        // this.mask2 = 0x03   // Mask to keep only the lowest 2 bits (00000011)
        // this.mask3 = 0x07   // Mask to keep only the lowest 3 bits (00000111)
        // this.mask4 = 0xa    // Mask to keep only the lowest 4 bits (00001111)
        this.data = new Uint8ClampedArray(width*height).fill(0)
    }

    // Splits lowest 2-bits into burnCode and highest 6 bits into featureCode
    getBoth(col, row) {
        const byteValue = this.getByte(col, row)
        return { high: byteValue >> this.highShift, low: byteValue & this.lowAnd }
    }

    // Performs bounds checking of [col, row], which may be any sized neg/pos integer
    getByte(col, row) {
        if (col<0 || col>this.cols || row<0 || row>this.rows) return undefined
        const byte = this.data[col + row * this.cols]
        return byte
    }
    
    // Return BurnMap featureCode at col, row
    getHigh(col, row) {
        const byteValue = this.getByte(col, row)
        return byteValue >> (8-this.highShift)
    }

    getLow(col, row) {
        const byteValue = this.getByte(col, row)
        return byteValue & this.lowAnd
    }

    // Combines lowest bits of featureCode and lowest 2-bits of burnCode into an 8-bit byte
    join(highByte, lowByte) {
        if (highByte<0 || highByte > this.highMax)
            throw new Error(`ByteMap.join() attempt to set high bits outside range[0,${this.highMax}].`)
        if (lowByte<0 || lowByte > this.lowMax)
            throw new Error(`ByteMap.join() attempt to set low bits outside range[0,${this.lowMax}].`)
        const newByte = (lowByte & this.lowAnd) | (highByte << this.highShift)
        return newByte
    }

    setBoth(col, row, highByte, lowByte, n=1) {
        if (col<0 || col>this.cols || row<0 || row>this.rows) return
        const byte = this.join(highByte, lowByte)

        this.setLow(col, row, lowValue, n)
        this.setHigh(col, row, highValue, n)
    }

    // These methods set just low bits value 
    setLow(col, row, lowByte, n=1) {
        if (col<0 || col>this.cols || row<0 || row>this.rows) return
        if (lowByte<0 || lowByte > this.lowMax)
            throw new Error(`ByteMap.set() attempt to set low bits outside range[0,${this.lowMax}].`)
        const idx = col + row * this.cols
        const end = Math.min(idx+n, this.cols*(row+1))
        for(let i=idx; i<end; i++) {
            const oldByte = this.data[i]
            // Clear the lowest 2 bits using the mask ~3 (0b11111100)
            // then combine with the new value using OR
            const newByte = (oldByte & ~this.lowAnd) | (lowByte & this.lowAnd)
            this.data[i] = newByte
        }
    }

    setHigh(col, row, highValue, n=1) {
        if (col<0 || col>this.cols || row<0 || row>this.rows) return
        if (highValue<0 || highValue > this.highMax)
            throw new Error(`ByteMap.setHigh() attempt to set high bits outside range[0,${this.highMax}].`)
        const idx = col + row * this.cols
        const end = Math.min(idx+n, this.cols*(row+1))
        for(let i=idx; i<end; i++) {
            const oldByte = this.data[i]
            // Clear high bits of oldByte, then OR with the new highValue shifted into place.
            // highValue is shifted left by lowBits to occupy the highBits highest positions
            const newByte = (oldByte & this.lowAnd) | (highValue << this.lowBits)
            this.data[i] = newByte
        }
    }
}

function showMap(bm) {
    let str = ''
    for (let row=0; row<bm.rows; row++) {
        str += '\n'
        for (let col=0; col<bm.cols; col++) {
            str += `  [${bm.getHigh(col, row)}, ${bm.getLow(col,row)}]`
        }
    }
    str += '\n'
    console.log(str)
}
const bm = new ByteMap(5, 4, 6)
bm.setHigh(3,3,32)
bm.setLow(3,3,3)
const low = bm.getLow(3,3)
const high = bm.getHigh(3,3)
console.log(low, high)
showMap(bm)