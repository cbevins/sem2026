/**
 * Class to get/set a sequence of bits from/into an 8-bit byte
 */
export class Bits {
    // 1. Shift right so the range starts at bit 0
    // 2. Create a mask of 'length' 1s using (1 << length) - 1
    // 3. AND them together
    static get(byte, startPos, length) {
        const mask = (1 << length) - 1
        return (byte >> startPos) & mask
    }

    // Clear the range, then OR the new value
    static set(byte, startPos, length, value) {
        const mask = ((1 << length) - 1) << startPos
        return (byte & ~mask) | ((value << startPos) & mask)
    }
}
