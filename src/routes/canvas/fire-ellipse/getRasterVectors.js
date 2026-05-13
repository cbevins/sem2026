/**
 * Finds the minimum set of unique line segments that start at [0,0]
 * and pass through the center of every cell in a cols x rows grid.
 * Each cell center is at (x + 0.5, y + 0.5) for integers 0<=x, y<100. 
 * 
 * To find the minimum set of line segments that pass through the center of every cell
 * we must identify all unique slopes originating from the origin [0,0].
 * Each cell center is located at (x + 0.5, y + 0.5) for integers 0<=x, y<100.
 * The slope of a line passing through a cell center is
 *      m = (y + 0.5) / (x + 0.5)
 *        = (2y + 1) / (2x + 1).
 * To find the unique slopes, we need to find all unique fractions A/B where A and B
 * are odd integers between 1 and 199.
 * Two fractions are identical if they reduce to the same simplest form a/b where
 * greatest common divisor gcd(a, b) = 1 and both (a, b) are odd.
 */
export function getRasterVectors(cols=100, rows=100) {
    const uniqueSlopes = new Set()
    uniqueSlopes.add('0/1') // Include the slope for the vertical line through the center of the first column

    // Helper function to find the greatest common divisor
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b))

    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            // Center coordinates are (x + 0.5, y + 0.5)
            // Slope m = (y + 0.5) / (x + 0.5) = (2y + 1) / (2x + 1)
            let numerator = 2 * y + 1
            let denominator = 2 * x + 1

            // Simplify the fraction to find the unique representation
            const common = gcd(numerator, denominator)
            const reducedNumerator = numerator / common
            const reducedDenominator = denominator / common

            // Store as a string key "num/den" in the Set
            uniqueSlopes.add(`${reducedNumerator}/${reducedDenominator}`)
        }
    }

    return Array.from(uniqueSlopes).map(slope => {
        const [dy, dx] = slope.split('/').map(Number)
        return { dy, dx, slope: dy / dx}
    })
}
