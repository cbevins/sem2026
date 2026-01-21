/**
 * @file Safe and/or constrained math functions
 * @copyright 2025 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
 */
import {degrees, radians} from './CompassLib.js'

export function divide(a,b) {return (b === 0) ? 0 : a/b }

export function divideSeries(...numbers) {
    numbers.reduce((a, b) => (b === 0 ? 0 : a / b), numbers[0] * numbers[0])
}

export function dx(degrees, distance) { return distance * Math.cos(radians(degrees)) }

export function dy(degrees, distance) { return distance * Math.sin(radians(degrees)) }

// Ensures number is in the range [0,1]
export function fraction(number) { return Math.max(0, Math.min(1, number)) }

export function fromOne(number)  { return 1-number }

export function greaterThan(a, b) {return a > b}

export function half(number) { return number / 2 }

export function inverse(number) { return divide(1, number) }

export function multiply(a, b) { return a * b }

export function multiplySeries(...numbers) { numbers.reduce((a, b) => a * b, 1) }

export function or(a, b) { return a || b }

// Ensure number is >= 0
export function positive(number) { return Math.max(0, number) }

export function subtract(a, b) { return a-b }

export function subtractSeries(...numbers) {
    return numbers.reduce((a, b) => a - b, 2 * numbers[0])
}

export function sum(a, b) { return a+b }

export function sumSeries(...numbers) { return numbers.reduce((a, b) => a + b, 0) }

export function sumOfProducts(...numbers) {
    const mid = Math.floor(numbers.length / 2)
    const a1 = numbers.slice(0, mid)
    return a1.reduce((acc, number, idx) => acc + a1[idx] * numbers[mid + idx], 0)
}
