/**
 * Treats each byte as a container of varied-length bit fields
 * whose total lengths do not exceed 8.
 *  -  8 1-bit fields,
 *  -  4 2-bit fields, or
 *  -  2 4-bit fields
 * Access is through byte 'offset' and field offset pairs.
 */
import { BitArray } from './BitArray.js'

export class VariedBitArray extends BitArray {
    constructor(byteField, length, fill=0) {
        super(byteField, length, fill)
    }

    getAll(byteOffset) {
        return this.byteField.getAll(this.data[byteOffset])
    }

    getOne(byteOffset, index) {
        return this.byteField.get(this.data[byteOffset], index)
    }

    setOne(byteOffset, index, value) {
        const byte = this.data[byteOffset]
        this.data[byteOffset] = this.byteField.set(byte, index, value)
    }

    setAll(byteOffset, values) {
        const byte = this.data[byteOffset]
        this.data[byteOffset] = this.byteField.setAll(byte, values)
    }
}
