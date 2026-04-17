/**
 * Treats each byte as a container of
 *  -  8 1-bit fields,
 *  -  4 2-bit fields, or
 *  -  2 4-bit fields
 * Access is through bit-field 'offset' just as any other array.
 */
import { BitArray } from './BitArray.js'
import { ByteField } from './ByteField.js'

export class UniformBitArray extends BitArray {
    constructor(byteField, length, fill=0) {
        const superLength = Math.ceil(length / byteField.fields.length)
        super(byteField, superLength, fill)
        this.fieldsPerByte = this.byteField.fields.length
    }

    get(bitsOffset) {
        const byte = this.data[Math.trunc(bitsOffset / this.fieldsPerByte)]
        const bitIndex = bitsOffset % this.fieldsPerByte
        return this.byteField.get(byte, bitIndex)
    }
        
    set(bitsOffset, value) {
        const byteIndex = Math.trunc(bitsOffset / this.fieldsPerByte)
        const bitIndex = bitsOffset % this.fieldsPerByte
        let oldByte = this.data[byteIndex]
        this.data[byteIndex] = this.byteField.set(oldByte, bitIndex, value)
    }
}

export class Uniform1BitArray extends UniformBitArray {
    constructor(length, fill=0) {
        super(new ByteField([1,1,1,1,1,1,1,1]), length, fill)
    }
}

export class Uniform2BitArray extends UniformBitArray {
    constructor(length, fill=0) {
        super(new ByteField([2,2,2,2]), length, fill)
    }
}

export class Uniform4BitArray extends UniformBitArray {
    constructor(length, fill=0) {
        super(new ByteField([4,4]), length, fill)
    }
}