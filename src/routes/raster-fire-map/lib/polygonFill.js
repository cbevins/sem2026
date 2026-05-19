export function polygonFill(raster, points, fillValue=1) {
    if (points.length < 3)
        return raster

    // 1 create a list of edges, ignoring hoizontal ones
    const edges = []
    for(let i=0; i<points.length; i++) {
        let p1 = points[i]
        let p2 = points[(i+1) % points.length]
        if (p1[1] === p2[1])    // ignore horizonatl points
            continue
        // Ensure p1 is the upper point (smaller Y, lower row)
        if (p1[1] > p2[1])
            [p1, p2] = [p2, p1]
        edges.push({
            rowMin: p1[1],
            rowMax: p2[1],
            colAtRowMin: p1[0],
            slopeInv: (p2[0] - p1[0]) / (p2[1] - p1[1])})
    }
    // 2 iterate through each scanline (row)
    for(let row=0; row<raster.rows; row++) {
        let intersections = []
        // find all edges that intersect
        for (const edge of edges) {
            if (row >= edge.rowMin && row < edge.rowMax) {
                // calculate x coordinate where the scanline crosses the edge
                const col = edge.colAtRowMin + edge.slopeInv * (row - edge.rowMin)
                intersections.push(col)
            }
        }
        // 3 sort intersections from left to right
        intersections.sort((a, b) => a - b)

        // 4 fill pixels between pairs of intersections
        for(let i=0; i<intersections.length; i+=2) {
            if (i+1 < intersections.length) {
                let startX = Math.max(0, Math.ceil(intersections[i]))
                let endX = Math.min(raster.cols-1, Math.floor(intersections[i+1]))
                for(let col=startX; col <=endX; col++) {
                    raster.set(col, row, fillValue)
                }
            }
        }
    }
    return raster
}
