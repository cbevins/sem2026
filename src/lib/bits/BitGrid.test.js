import { describe, it, expect } from 'vitest';
import { ByteField } from './ByteField.js'
import { UniformBitGrid } from './UniformBitGrid.js'
// import { VariedBitGrid } from './VariedBitGrid.js'

const uniformByteFields = new ByteField([2,2,2,2])
const variedByteFields = new ByteField([2,6])

describe('BitGrid class functions', () => {
    it('UniformBitGrid get/set tests', () =>{
        const bg = new UniformBitGrid(uniformByteFields, 4, 5)
        expect(bg.data.length).toEqual(5)

        bg.set(0, 0, 3)
        expect(bg.get(0, 0, 3)).toBe(3)
        expect(bg.get(0, 1, 0)).toBe(0)

        bg.set(0, 4, 3)
        expect(bg.get(0, 3, 0)).toBe(0)
        expect(bg.get(0, 4, 3)).toBe(3)
        expect(bg.get(1, 0, 0)).toBe(0)

        bg.set(1, 0, 3)
        expect(bg.get(0, 4, 3)).toBe(3)
        expect(bg.get(1, 0, 0)).toBe(3)
        expect(bg.get(1, 1, 0)).toBe(0)
    })
})