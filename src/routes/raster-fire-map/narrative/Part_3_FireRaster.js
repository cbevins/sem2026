import { Firelet, FireRaster } from '../index.js'

// new Firelet(headRos=1, lwr=1, duration=1, bearing=0)
const firelet1 = new Firelet(50, 2, 1, 45) // cells: 224 perim, 4430 raster, 180177 path, 28406 tree
function getFirelet(/*col, row, time*/) {
    return firelet1
}

export function Part_3_FireRaster() {
    let part = 3
    let step = 0
    let text = 'The "FireRaster" Fire Status Raster Map'
    let from = performance.now(), thru
    const stats = [{part, step, text, msec: from}]

    // Step 1 - create a FireRaster
    step = 1
    from = performance.now()
    let cols = 512
    let rows = 512
    const fireMap = new FireRaster(cols, rows)
    thru = performance.now()
    text = `created FireRaster(cols=${cols}, rows=${rows})`
    stats.push({part, step, text, msec: thru-from})

    // Step 2 - set ignited and unburnable cells in the FireRaster
    step = 2
    from = performance.now()
    fireMap.set(256, 256, FireRaster.ignited)
    fireMap.set(258, 256, FireRaster.unburnable)
    thru = performance.now()
    text = `initialized FireRaster with some ignited and unburnable cells`
    stats.push({part, step, text, msec: thru-from})

    // Step 3  -loop through time periods
    step = 3
    from = performance.now()
    const table = []
    let periods = 200
    let lastPeriod = 1
    for(let period=1; period<=periods; period++) {
        const t0 = performance.now()
        // get the current fire front cells for period 1
        const fireFrontCells = fireMap.getFireFrontCells()
        const frontal = fireFrontCells.length
        // start a Firelet at each fire front cell for period 1
        let torched = 0
        for(let {col, row} of fireFrontCells) {
            const firelet = getFirelet(col, row)        // get appropriate Firelet
            torched += fireMap.igniteFirelet(firelet, col, row)
        }
        const {unburned, ignited, burned, unburnable} = fireMap.freq()
        const msec = Math.round((performance.now() - t0)*100)/100
        table.push({period, frontal, torched, unburned, ignited, burned, unburnable, msec})
        lastPeriod = period
        if (! frontal || ! unburned) break
    }
    thru = performance.now()
    // console.table(table)
    text = `simulated ${lastPeriod} time periods`
    stats.push({part, step, text, msec: thru-from})

    stats[0].msec = performance.now() - stats[0].msec
    return stats
}
