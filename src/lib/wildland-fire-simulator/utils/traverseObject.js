export function traverseObject(obj, indent=1) {
    for (let key in obj) {
        // Check if the property belongs to the object itself
        if (Object.hasOwn(obj, key)) { 
            const value = obj[key]
            const padding = " ".repeat(4*indent)

            if (typeof value === "object" && value !== null) {
                console.log(`${indent}: ${padding}${key}:`)
                // Recurse into the nested object
                traverseObject(value, indent + 1)
            } else {
                // Display primitive values (string, number, etc.)
                console.log(`${indent}: ${padding}${key}: ${value}`)
            }
        }
    }
}
