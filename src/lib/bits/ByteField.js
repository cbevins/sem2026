import { Bits } from './Bits.js'

export class ByteField{
    constructor(lengths=[8]) {
        this.fields = []
        let position = 0
        for(let i=0; i<lengths.length; i++) {
            const length = lengths[i]
            if (position + length > 8)
                throw new Error('ByteField length exceeds 8 bits.')
            this.fields.push({position, length})
            position += length
        }
    }

    get(byte, index) {
        const {position, length} = this.fields[index]
        return Bits.get(byte, position, length)
    }
    
    getAll(byte) {
        const values = []
        for(let i=0; i<this.fields.length; i++) {
            values.push(this.get(byte, i))
        }
        return values
    }

    set(byte, index, value) {
        const {position, length} = this.fields[index]
        return Bits.set(byte, position, length, value)
    }
    
    setAll(byte, values) {
        let newByte = byte
        const last = Math.min(values.length, this.fields.length)
        for(let i=0; i<last; i++) {
            newByte = this.set(newByte, i, values[i])
        }
        return newByte
    }
}
