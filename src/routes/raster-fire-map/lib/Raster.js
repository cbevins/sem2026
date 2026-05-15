export class Raster {
    constructor(cols, rows, fillValue=0, oobValue=-1) {
        this.cols = cols
        this.rows = rows
        this.data = new Uint8ClampedArray(rows*cols).fill(fillValue)
        this.oobValue = oobValue
    }

    // Ensures set() stays within bounds
    clamp(col, row) {
        col = Math.min(Math.max(0, col), this.cols-1)
        row = Math.min(Math.max(0, row), this.rows-1)
        return [col, row]
    }
    
    get(col, row) {
        return (col<0 || col >= this.cols || row<0 || row >= this.rows)
            ? this.oobValue : this.data[col + row * this.cols]
    }
    
    set(col, row, value) {
        ;[col, row] = this.clamp(col, row)       // index could wrap if not clamped
        this.data[col + row * this.cols] = value
        return this
    }

    // Uses Bresenham algorithm to set values in a line
    // x1, y1, x2, and y2 must be integer coordinst, either negative or positive
    // client should set each using [Math.round(x), Math.round(y)]
    // Works in all 4 quadrants so negative coords are ok
    setLine(x1, y1, x2, y2, value, setFirst=true, thick=false) {
        let x = x1
        let y = y1
        const dx = Math.abs(x2 - x1)
        const dy = Math.abs(y2 - y1)
        const sx = (x1 < x2) ? 1 : -1
        const sy = (y1 < y2) ? 1 : -1
        
        let err = dx - dy
        if (setFirst) this.set(x, y, value)

        while (x !== x2 || y !== y2) {
            const e2 = 2 * err;
            // Check for supercover: horizontal and vertical steps
            if (thick && e2 > -dy && e2 < dx) {
                // When both steps happen, we are at a diagonal transition
                // We must add the intermediate cell to "cover" the line
                this.set(x + sx, y, value)
                this.set(x, y + sy, value)
            }
            if (e2 > -dy) { err -= dy; x += sx; }
            if (e2 < dx) { err += dx; y += sy; }
            this.set(x, y, value)
        }
        return this
    }

    // Points must be an array of integer coordinates [col, row]
    setPolygon(points, value=1) {
        if (points.length < 3)
            return this

        // Create a list of edges, ignoring hoizontal ones
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
        // Iterate through each scanline (row)
        for(let row=0; row<this.rows; row++) {
            let intersections = []
            // find all edges that intersect
            for (const edge of edges) {
                if (row >= edge.rowMin && row < edge.rowMax) {
                    // calculate x coordinate where the scanline crosses the edge
                    const col = edge.colAtRowMin + edge.slopeInv * (row - edge.rowMin)
                    intersections.push(col)
                }
            }
            // sort intersections from left to right
            intersections.sort((a, b) => a - b)
            // then fill pixels between pairs of intersections
            for(let i=0; i<intersections.length; i+=2) {
                if (i+1 < intersections.length) {
                    let startX = Math.max(0, Math.ceil(intersections[i]))
                    let endX = Math.min(this.cols-1, Math.floor(intersections[i+1]))
                    for(let col=startX; col <=endX; col++) {
                        this.set(col, row, value)
                    }
                }
            }
        }
        return this
    }

    setRect(col, row, width, height, value) {
        ;[col, row] = this.clamp(col, row)       // index could wrap if not clamped
        let [lastCol, lastRow] = this.clamp(col + width, row + height)
        for (let r=row; r<=lastRow; r++) {
            let idx = r * this.cols
            for(let c=col; c<=lastCol; c++)
                this.data[idx + c] = value
        }
        return this
    }
}
