/**
 * @file Compass functions as implemented by BehavePlus v6.
 * @copyright 2025 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
 */

// Returns 'base' angle (deg) rotated clockwise by 'degrees' 
export function clockwise(base, degrees) { return constrain(base + degrees) }

// Returns degrees where 0 <= degrees < 360
export function constrain (degrees) {
    while (degrees >= 360) degrees -= 360
    while (degrees < 0) degrees += 360
    return degrees
}

// Returns 'base' angle (deg) rotated counter-clockwise by 'degrees' 
export function counter(x, y) { return constrain(x - y) }

// Returns degrees from radians
export function degrees(radians) { return (radians * 180) / Math.PI }

// Returns opposite of degrees
export function opposite(degrees) { return constrain(degrees - 180) }

// Returns 'degrees' rotated by 90 degrees clockwise
export function rotate90(degrees) { return constrain(degrees + 90) }

// Returns 'degrees' rotated by 180 degrees
export function rotate180(degrees) { return constrain(degrees + 180) }

// Returns 'degrees' rotated by 270 degrees clockwise
export function compass270(degrees) { return constrain(degrees + 270) }

// Returns radians of degrees
export function radians(degrees) { return (degrees * Math.PI) / 180 }
