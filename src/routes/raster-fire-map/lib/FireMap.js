export class FireMap {
    static unburned = 0         // has not been ignited (traversible)
    static ignited = 1          // ignited in the current time step (traversible)
    static burned = 2           // ignited in a previous time step (NOT traversible)
    static unburnable = 3       // may not be ignited in this time step (NOT traversible)
    static outOfBounds = 4      // row or col index is out-of-bounds (NOT traversible)

    constructor(cols=512, rows=512) {
        this.cols = cols
        this.rows = rows
        this.data = new Uint8ClampedArray(this.rows*this.cols).fill(FireMap.unburned)
    }
    
    // Returns frequency count of FireMap status
    freq() {
        const f = [0,0,0,0]
        for(let status of this.data)
            f[status]++
        return {unburned: f[0], ignited: f[1], burned: f[2], unburnable: f[3]}
    }

    // Performs bounds checking of col, row before returning the burn status
    get(col, row) {
        if (col<0 || col>this.cols || row<0 || row>this.rows)
            return FireMap.outOfBounds
        return this.data[col + row * this.cols]
    }

    // Returns an array of all cells {col, row} that are burning and next to an unburned neighbor
    getFireFrontCells() {
        const front = []
        for(let row=1; row<this.rows-1; row++) {
            for(let col=1; col<=this.cols-1; col++) {
                const status = this.get(col, row)
                if (status === FireMap.ignited || status === FireMap.burned) {
                    // Reset any ignited cell to burned
                    this.set(col, row, FireMap.burned)
                    // Check for any unburned (but burnable) neighbors
                    if (   this.get(col-1, row-1) === FireMap.unburned
                        || this.get(col-1, row)   === FireMap.unburned
                        || this.get(col-1, row+1) === FireMap.unburned
                        || this.get(col,   row-1) === FireMap.unburned
                        || this.get(col,   row+1) === FireMap.unburned
                        || this.get(col+1, row-1) === FireMap.unburned
                        || this.get(col+1, row)   === FireMap.unburned
                        || this.get(col+1, row+1) === FireMap.unburned
                    ) front.push({col, row})
                }
            }
        }
        return front
    }

    // Places the Firelet [0,0] over FireMap ignited or burned cell at [ignCol, ignRow]
    // and traverses all possible pathways to update the fireMap's status at each cell.
    igniteFirelet(firelet, ignCol, ignRow) {
        this.visits = 0
        let ignited = 0
        ignited += this._igniteFirelet(firelet.start, ignCol, ignRow)
        return ignited
    }
    _igniteFirelet(node, ignCol, ignRow) {
        this.visits++
        let ignited = 0
        for(let next of node.cells) {
            const col = ignCol + next.col
            const row = ignRow + next.row
            const status = this.get(col, row)
            // if(status === FireMap.unburnable) {
            //     console.log(`[${col}, ${row}] = ${status}`)
            // }
            if (status === FireMap.ignited || status === FireMap.unburned) {
                if (status === FireMap.unburned) {
                    this.set(col, row, FireMap.ignited)
                    ignited++
                }
                ignited += this._igniteFirelet(next, ignCol, ignRow)
            }
        }
        return ignited
    }

    igniteFirelet2(firelet, ignCol, ignRow) {
        this.visits = 0
        let ignited = 0
        for(let next of firelet.start.cells)
            ignited += this._igniteFirelet2(next, ignCol, ignRow)
        return ignited
    }
    
    _igniteFirelet2(node, ignCol, ignRow) {
        let ignited = 0
        const status = this.get(node.col + ignCol, node.row + ignRow)
        if (status === FireMap.ignited || status === FireMap.unburned) {
            if (status === FireMap.unburned) {
                this.set(node.col, node.row, FireMap.ignited)
                ignited++
            }
            for(let next of node.cells) {
                ignited += this._igniteFirelet2(next, ignCol, ignRow)
            }
        }
        return ignited
    }

    set(col, row, status, n=1) {
        if (status<0 || status>3) {
            throw new Error(`FireMap.set(${col}, ${row}, ${status}) attempts to set code outside range[0,3].`)
        }
        if (col<0 || col>this.cols || row<0 || row>this.rows) {
            return
        }
        const idx = col + row * this.cols
        const end = Math.min(idx+n, this.cols*(row+1))
        for(let i=idx; i<end; i++) {
            this.data[i] = status
        }
        return this
    }

    igniteVectors(firelet, ignCol, ignRow) {
        let ignited = 0
        for(let vector of firelet.vectors) {
            for(let [colOffset, rowOffset] of vector) {
                const col = ignCol + colOffset
                const row = ignRow + rowOffset
                const status = this.get(col, row)
                if (status !== FireMap.ignited && status !== FireMap.unburned)
                    break
                if (status === FireMap.unburned) {
                    this.set(col, row, FireMap.ignited)
                    ignited++
                }
            }
        }
        return ignited
    }
}
