import { describe, it, expect } from 'vitest';
import { ByteField } from './ByteField.js'
import { UniformBitArray } from './UniformBitArray.js'
import { VariedBitArray } from './VariedBitArray.js'

const uniformByteFields = new ByteField([2,2,2,2])
const variedByteFields = new ByteField([2,6])

describe('BitArray class functions', () => {
    it('Uniform BitArray get/set tests', () =>{
        const ba = new UniformBitArray(uniformByteFields, 101)
        expect(ba.data.length).toEqual(26)

        ba.set(8, 1)
        expect(ba.get(8)).toBe(1)
        ba.set(9, 2)
        expect(ba.get(9)).toBe(2)
        ba.set(10, 3)
        expect(ba.get(10)).toBe(3)
        ba.set(11, 1)
        expect(ba.get(11)).toBe(1)
        ba.set(12, 2)
        expect(ba.get(12)).toBe(2)
        ba.set(13, 3)
        expect(ba.get(13)).toBe(3)
        ba.set(13, 0)
        expect(ba.get(13)).toBe(0)

        ba.set(100, 3)
        expect(ba.get(100)).toBe(3)
        ba.set(0, 3)
        expect(ba.get(0)).toBe(3)
    })

    it('Varied BitArray get/set tests', () =>{
        const ba = new VariedBitArray(variedByteFields, 101)
        expect(ba.data.length).toEqual(101)
        
        ba.setOne(8, 0, 1)
        ba.setOne(8, 1, 15)
        expect(ba.getOne(8,0)).toBe(1)
        expect(ba.getOne(8,1)).toBe(15)

        ba.setAll(22, [3,31])
        expect(ba.getAll(22)).toEqual([3,31])
    })
})
