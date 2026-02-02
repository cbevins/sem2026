export class Geometry {
    static getOctogonVertices(centerX, centerY, radius, startDeg=22.5) {
        return Geometry.getRegularPolygonVertices(centerX, centerY, radius, 8, startDeg)
    }
    
    // For an octogon, use sides=8 and 22.5 degrees for flat top or 0 degrees for vertice top
    static getRegularPolygonVertices(centerX, centerY, radius, sides=8, startDeg=0) {
        const vertices = []
        // The angle step between each vertex is 2*PI / number of sides
        const angleStep = (2 * Math.PI) / sides
        const startAngle = startDeg * Math.PI / 180
        for (let i = 0; i < sides; i++) {
            // Calculate the current angle for the vertex
            const currentAngle = startAngle + (i * angleStep);

            // Calculate the x and y coordinates using sine and cosine
            const x = centerX + (radius * Math.cos(currentAngle))
            const y = centerY + (radius * Math.sin(currentAngle))
            vertices.push({ x: x, y: y })
        }
        return vertices
    }
    static svgPath(points) {
        let path = 'M' + points[0].x + ' ' + points[0].y
        for (let i=1; i<points.length; i++) {
            const {x,y} = points[i]
            path += ` L${x} ${y}`
        }
        path += 'L' + points[0].x + ' ' + points[0].y
        return path
    }
}