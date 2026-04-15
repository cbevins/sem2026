import { describe, it, expect } from 'vitest';
import { Bits } from './Bits.js'

describe('Bit sequence manipulation functions', () => {
    it('Bits.get() tests', () =>{
		expect(0b11111111).toBe(255)
		expect(Bits.get(0b10101111, 0, 2)).toBe(0b00000011)
		expect(Bits.get(0b10101111, 1, 2)).toBe(0b00000011)
		expect(Bits.get(0b10101111, 2, 2)).toBe(0b00000011)
		expect(Bits.get(0b10101111, 3, 2)).toBe(0b00000001)
		expect(Bits.get(0b10101111, 4, 2)).toBe(0b00000010)
		expect(Bits.get(0b10101111, 5, 2)).toBe(0b00000001)
		expect(Bits.get(0b10101111, 6, 2)).toBe(0b00000010)
		expect(Bits.get(0b10101111, 4, 4)).toBe(0b00001010)
    })

    it('Bits.set() tests', () =>{
		expect(Bits.set(0b00000000, 0, 2, 3)).toBe(0b00000011)
		expect(Bits.set(0b00000000, 1, 2, 3)).toBe(0b00000110)
		expect(Bits.set(0b00000000, 2, 2, 3)).toBe(0b00001100)
		expect(Bits.set(0b00000000, 3, 2, 3)).toBe(0b00011000)
		expect(Bits.set(0b00000000, 4, 2, 3)).toBe(0b00110000)
		expect(Bits.set(0b00000000, 5, 2, 3)).toBe(0b01100000)
		expect(Bits.set(0b00000000, 6, 2, 3)).toBe(0b11000000)
    })

    it('Bits.set() and Bits.set() tests', () =>{
        let byte = 0
        byte = Bits.set(byte, 2, 6, 31)
		expect(byte).toBe(0b01111100)
        byte = Bits.set(byte, 0, 2, 3)
		expect(byte).toBe(0b01111111)
		expect(Bits.get(byte, 2, 6)).toBe(31)
		expect(Bits.get(byte, 0, 2)).toBe(3)
    })
})
