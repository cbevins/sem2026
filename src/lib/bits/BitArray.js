/**
 * BitArray is the base class for UniformBitArray and variedBitArray.
*/
export class BitArray {
    constructor(byteField, length, fill=0) {
        this.byteField = byteField
        this.length = length
        this.data = new Uint8ClampedArray(length).fill(fill)
    }

    getByte(byteOffset) {
        return this.data[byteOffset]
    }

    setByte(byteOffset, value) {
        this.data[byteOffset] = value
    }
}
