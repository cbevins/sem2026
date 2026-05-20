// Only properties in the 'expected' objected are checked against the 'actual' object
export function compareObjects(expected, actual, indent = 0) {
    let errors = 0
    for (let key in expected) {
        // Check if the property belongs to the object itself
        if (Object.hasOwn(expected, key)) { 
            const expectedValue = expected[key]
            const padding = " ".repeat(indent)

            const actualValue = actual[key]
            if (actualValue === 'undefined') {
                throw new Error(`Actual has no property ${name.join('.')}.`)
            }
            if (typeof expectedValue === "object" && expectedValue !== null) {
                console.log(`${padding}${key}:`)
                // Recurse into the nested object
                compareObjects(expectedValue, actualValue, indent + 2)
            } else {
                // Compare primitive values (string, number, etc.)
                let valid = true
                if (typeof expectedValue === 'number') {
                    if (Number.isInteger(expectedValue)) {
                        valid = (expectedValue === actualValue)
                    } else {
                        valid = (Math.abs(expectedValue-actualValue) < 0.000000001)
                    }
                } else {
                    valid = (expectedValue === actualValue)
                }
                if (! valid) {
                    errors++
                    console.log(`*** ${padding}${key}:`)
                    console.log(`    expected: ${expectedValue}`)
                    console.log(`    received: ${actualValue}`)
                }
            }
        }
    }
    return errors
}
