export function traverseObject(obj, indent = 0) {
    for (let key in obj) {
        // Check if the property belongs to the object itself
        if (Object.hasOwn(obj, key)) { 
            const value = obj[key]
            const padding = " ".repeat(indent)

            if (typeof value === "object" && value !== null) {
                console.log(`${padding}${key}:`)
                // Recurse into the nested object
                traverseObject(value, indent + 2)
            } else {
                // Display primitive values (string, number, etc.)
                console.log(`${padding}${key}: ${value}`)
            }
        }
    }
}
