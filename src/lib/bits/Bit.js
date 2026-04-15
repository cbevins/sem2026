 /* Class to get/set/clear a single bit from/into an 8-bit byte
 */
export class Bit {

    // Create a mask with 0 at the position and 1s everywhere else
    static clear(byte, position) {
        return byte & ~(1 << position)
    }

    // Shift the bit at 'position' to the rightmost spot, then mask everything else
    static get(byte, position) {
        return (byte >> position) & 1
    }

    // Create a mask with a 1 at the desired position and OR it
    static set(byte, position) {
        return byte | (1 << position)
    }
}
