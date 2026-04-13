import { SpriteServer } from './SpriteServer.js'

export class BurnMap {
    static unburned = 253
    static unburnable = 254
    static outOfBounds = 255

    constructor(geoServer, pcsWest, pcsNorth, cellDim, cols, rows) {
        this.geoServer = geoServer
        this.pcs = {
            east: pcsWest + cols*cellDim,
            west: pcsWest,
            north: pcsNorth,
            south: pcsNorth - rows*cellDim,
            width: cols * cellDim,
            height: rows * cellDim
        }
        this.cols = cols
        this.rows = rows
        this.dim = cellDim
        this.time = 0
        this.data = new Uint8ClampedArray(cols*rows).fill(BurnMap.unburned)
        this.midCol = Math.trunc(this.cols/2)
        this.midRow = Math.trunc(this.rows/2)
    }

    // Converts PCS easting/northing to BurnMap col/row
    col(easting) { return Math.round((easting-this.pcs.west)/this.dim) }
    // row(northing) { return this.midRow - Math.round(northing) }
    row(northing) { return Math.round((this.midRow - northing)/this.dim) }

    // Returns *center* easting/northing of cell at [col, row]
    centerEasting(col) { return this.pcs.west + this.dim * (col+0.5) }
    centerNorthing(row) { return this.pcs.north - this.dim * (row+0.5) }

    // Returns an array of all raster cells [col,row]
    // that are on the fire front and therefore a fire front growth cell
    getFireFront() {
        const front = []
        for(let row=0; row<this.rows; row++) {
            for(let col=0; col<this.cols; col++) {
                const status = this.getStatus(col, row)
                if (status === this.time) {
                    // Check for any unburned neighbors
                    if (   this.isUnburned(col-1, row-1)
                        || this.isUnburned(col-1, row)
                        || this.isUnburned(col-1, row+1)
                        || this.isUnburned(col,   row-1)
                        || this.isUnburned(col,   row+1)
                        || this.isUnburned(col+1, row-1)
                        || this.isUnburned(col+1, row)
                        || this.isUnburned(col+1, row+1)
                    ) front.push([col,row])
                }
            }
        }
        return front
    }

    _toCell(easting, northing) { return [this.col(easting), this.row(northing)] }
    getPerimeterCells(scanLines, ignEast, ignNorth) {
        const cells = []

        // East across the top row
        let [yPrev, x1Prev, x2Prev] = scanLines[0]
        for(let x=x1Prev; x<=x2Prev; x+=this.dim)
            cells.push(this._toCell(x+ignEast, yPrev+ignNorth))

        // Continue clockwise down the east side
        for (let i=1; i<scanLines.length-1; i++) {
            let [y, , x2] = scanLines[i]
            // if this extends even with or beyond the previous row's endpoint
            if (x2 >= x2Prev) {
                for(let x=x2Prev; x<=x2; x+=this.dim)
                cells.push(this._toCell(x+ignEast, y+ignNorth))
            } else {
                cells.push(this._toCell(x2+ignEast, y+ignNorth))
            }
            x2Prev = x2
        }

        // Continue west across bottom row
        ;[yPrev, x1Prev, x2Prev] = scanLines[scanLines.length-1]
        for(let x=x2Prev; x>=x1Prev; x-=this.dim)
            cells.push(this._toCell(x+ignEast, yPrev+ignNorth))

        // Continue clockwise up the west side
        for (let i=scanLines.length-2; i>=0; i--) {
            let [y, x1] = scanLines[i]
            // if this extends even with or beyond the previous row's endpoint
            if (x1 <= x1Prev) {
                for(let x=x1; x<=x1Prev; x+=this.dim)
                    cells.push(this._toCell(x+ignEast, y+ignNorth))
            } else { // if col1 <= pcol1
                cells.push(this._toCell(x1+ignEast, y+ignNorth))
            }
            x1Prev = x1
        }
        return cells
    }
    getEndPointCells(scanLines, ignEast, ignNorth) {
        const cells = []
        for(let line of scanLines) {
            let [y, x1, x2] = line
            const first = this._toCell(x1+ignEast, y+ignNorth)
            const last = this._toCell(x2+ignEast, y+ignNorth)
            cells.push([first, last])
        }
        return cells
    }

    // Returns TRUE if unburned, burned, or burning and not unburnable or out-of-bounds
    isPassable(col, row) {
        const status = this.getCounts(col, row)
        return (status !== BurnMap.outOfBounds && status !== BurnMap.unburnable)
    }

    getStatus(col, row) {
        return this.isInBounds(col, row) ? this.data[col+row*this.cols] : BurnMap.outOfBounds
    }

    getCounts() {
        const counts = {unburned: 0, unburnable: 0, burning: 0, burned: 0}
        for(let status of this.data) {
            if (status === BurnMap.unburnable) counts.unburnable++
            else if(status === BurnMap.unburned) counts.unburned++
            else if (status === this.time) counts.burning++
            else if (status < this.time) counts.burned++
        }
        return counts
    }

    isInBounds(col, row) {
        return (col<0 || col>this.cols || row<0 || row>this.rows) ? false : true
    }

    isOutOfBounds(col, row) { return ! this.isInBounds(col, row) }

    // Returns TRUE if not unburnable or out-of-bounds, regardless of burning state.
    isBurnable(col, row) { return ! this.isUnburnable(col, row) }

    isBurned(col, row) {
        const status = this.getStatus(col,row)
        return (status !== BurnMap.unburnable && status !== BurnMap.outOfBounds
            && status < this.time)
    }

    isBurning(col, row) {
        const status = this.getStatus(col,row)
        return (status !== BurnMap.unburnable && status !== BurnMap.outOfBounds
            && status === this.time)
    }
    
    isUnburnable(col, row) {
        const status = this.getStatus(col,row)
        return status === BurnMap.unburnable || status === BurnMap.outOfBounds
    }

    isUnburned(col, row) {
        const status = this.getStatus(col, row)
        return status !== BurnMap.unburnable || status !== BurnMap.outOfBounds
            && status > this.time
    }

    set(col, row, status) {
        if (this.isOutOfBounds(col, row)) return false
        this.data[col+row*this.cols] = status
        return true
    }

}