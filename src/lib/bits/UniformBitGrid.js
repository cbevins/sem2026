/**
 * Treats each byte as a container of
 *  -  8 1-bit fields,
 *  -  4 2-bit fields, or
 *  -  2 4-bit fields
 * Access is through bit-field 'offset' just as any other array.
 */
import { UniformBitArray } from './UniformBitArray.js'

export class UniformBitGrid extends UniformBitArray {
    constructor(byteField, cols, rows, fill=0) {
        super(byteField, cols*rows, fill)
        this.cols = cols
        this.rows = rows
    }

    get(col, row) {
        return super.get(col + row*this.cols)
    }

    set(col, row, value) {
        return super.get(col + row*this.cols, value)
    }
}