import { describe, it, expect } from 'vitest';
import { ByteField } from './ByteField.js'

function bitLengthsTooLong() {
    return new ByteField([2,6,2])
}

describe('ByteField class functions', () => {
    it('ByteField get/set tests', () =>{
        const byteField = new ByteField([2,6])
		expect(byteField.get(0b10101111, 0)).toBe(0b00000011)
		expect(byteField.get(0b10101111, 1)).toBe(0b00101011)

        let byte = 0
        byte = byteField.set(byte, 0, 3)
		expect(byteField.get(byte, 0)).toBe(3)

        byte = byteField.set(byte, 1, 31)
		expect(byteField.get(byte, 1)).toBe(31)

        byte = byteField.set(byte, 1, 0)        // clear the upper field
        byte = byteField.set(byte, 0, 63)       // try to set a value too long for a 2-bit sequence
		expect(byteField.get(byte, 0)).toBe(3)  // just the last 2 bits of decimal 63 are set
		expect(byteField.get(byte, 1)).toBe(0)  // the upper biys should remain unset
    })

    it('ByteField.getAll() tests', () =>{
        const byteField = new ByteField([2,6])

        let byte = 0
        byte = byteField.set(byte, 0, 3)
        byte = byteField.set(byte, 1, 31)
		expect(byteField.getAll(byte)).toEqual([3,31])

        byte = 0
        byte = byteField.setAll(byte, [2,15])
		expect(byteField.get(byte, 0)).toEqual(2)
		expect(byteField.get(byte, 1)).toEqual(15)
		expect(byteField.getAll(byte)).toEqual([2, 15])
    })

    it('ByteField throws Error if field lengths exceed 8 bits', () =>{
        expect(() => bitLengthsTooLong()).toThrow()
    })
})
