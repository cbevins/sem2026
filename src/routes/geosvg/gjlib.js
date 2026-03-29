// Library of GeoJSON functions

/**
 * Returns a GeoJSOn 'geometries' array
 * @param {array} center [easting, northing] of the regular polygon's center point
 * @param {integer} sides Number of sides (or number of vertices)
 * @param {float} radius Distance from the center point to each vertex
 * @returns A GeoJSON Feature containing a Polygon of [easting, northing] coordinates
 * in right-hand winding order (counter clockwise)
 * with sides+1 elements and whose first and last elements are identical
 */
export function regularPolygon(center, sides, radius, maxSpacing=0) {
    const points =[]
    const degStep = 360 / sides
    for (let i=0; i<sides; i++) {
        const bearing = 360 - i * degStep
        const ep = vectorEndpoint(center, bearing, radius)
        points.push(ep)
    }
    return {
        type: "Feature",
        geometry: {
            type: 'Polygon',
            coordinates: [points],
        },
        properties: {}
    }
}

/**
 * Returns end point coordinate array [easting, northing] of some vector at some distance
 * @param {array} center GeoJSON point array [easting, northing]
 * @param {float} bearing Bearing from north (degrees clockwise)
 * @param {float} distance Distance
 * @returns GeoJSON point array [easting, northing]
 */
export function vectorEndpoint(center, bearing, distance) {
    const radians = bearing * Math.PI / 180
    return [center[0] + distance * Math.sin(radians),
            center[1] + distance * Math.cos(radians)]
}
