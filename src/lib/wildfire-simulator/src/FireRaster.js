/**
 * FireRaster extends the basic Raster class by
 * - assigning 5 possible values (unburned, ignited, burned, unburnable, and oob)
 * - providing methods for detecting the current fire front, and for spreading the fire
 * through one time period.
 * 
 * getFireFrontCells() returns a list of all the cells that are burned or ignited
 * AND have at least one unburned cell in its Moore neighborhood.
 * 
 * igniteFirelet(firelet, ignCol, ignRow) places the Firelet instance's ignition point
 * at raster [ignCol, ignRow] and proceeds to ignite all the unburned cells along its
 * spread vectors that can be reached (i.e., not blocked by unburnable cells)
 * during the time period.
 */
import { Raster } from './Raster.js'

export class FireRaster extends Raster {
    static unburned = 0         // has not been ignited (traversible)
    static ignited = 1          // ignited in the current time step (traversible)
    static burned = 2           // ignited in a previous time step (NOT traversible)
    static unburnable = 3       // may not be ignited in this time step (NOT traversible)
    static outOfBounds = 4      // row or col index is out-of-bounds (NOT traversible)

    constructor(cols, rows) {
        super(cols, rows, 0, FireRaster.outOfBounds)
    }
    
    // Returns frequency count of FireRaster status
    freq() {
        const f = [0,0,0,0]
        for(let status of this.data)
            f[status]++
        return {unburned: f[0], ignited: f[1], burned: f[2], unburnable: f[3]}
    }

    // Returns an array of all cell objects {col, row}
    // that are ignited or burned AND next to an unburned neighbor
    getFireFrontCells() {
        const front = []
        for(let row=1; row<this.rows-1; row++) {
            for(let col=1; col<=this.cols-1; col++) {
                const status = this.get(col, row)
                if (status === FireRaster.ignited || status === FireRaster.burned) {
                    // Reset any ignited cell to burned
                    this.set(col, row, FireRaster.burned)
                    // Check for any unburned (but burnable) neighbors
                    if (   this.get(col-1, row-1) === FireRaster.unburned
                        || this.get(col-1, row)   === FireRaster.unburned
                        || this.get(col-1, row+1) === FireRaster.unburned
                        || this.get(col,   row-1) === FireRaster.unburned
                        || this.get(col,   row+1) === FireRaster.unburned
                        || this.get(col+1, row-1) === FireRaster.unburned
                        || this.get(col+1, row)   === FireRaster.unburned
                        || this.get(col+1, row+1) === FireRaster.unburned
                    ) front.push({col, row})
                }
            }
        }
        return front
    }

    // Places the Firelet [0,0] over a FireRaster fire front cell
    // and traverses all possible pathways to update the fire's status at each cell.
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
            if (status === FireRaster.ignited || status === FireRaster.unburned) {
                if (status === FireRaster.unburned) {
                    this.set(col, row, FireRaster.ignited)
                    ignited++
                }
                ignited += this._igniteFirelet(next, ignCol, ignRow)
            }
        }
        return ignited
    }
}
