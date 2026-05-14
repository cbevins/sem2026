import { Firelet } from '../lib/Firelet.js'
import { FireMap } from "../lib/FireMap.js"

function elapsed(started) {
    return `[${(performance.now() - started).toFixed(2)} msec]`
}

// new Firelet(headRos=1, lwr=1, duration=1, bearing=0)
const firelet1 = new Firelet(50, 2, 1, 45) // cells: 224 perim, 4430 raster, 180177 path, 28406 tree
function getFirelet(/*col, row, time*/) {
    return firelet1
}

export function Part_3_FireMap() {
    console.log('\nPart 3 - The "FireMap" Fire Status Raster Map')
    let started = performance.now()

    // Step 1 - create a FireMap
    let cols = 512
    let rows = 512
    const fireMap = new FireMap(cols, rows)
    let t = performance.now()
    console.log(`Step 3.1 - created FireMap(cols=${cols}, rows=${rows}) ${elapsed(t)}`)

    // Step 2 - set ignited and unburnable cells in the FireMap
    t = performance.now()
    fireMap.set(256, 256, FireMap.ignited)
    fireMap.set(258, 256, FireMap.unburnable)
    console.log(`Step 3.2 - initialized FireMap with some ignited and unburnable cells ${elapsed(t)}`)

    // Step 3  -loop through time periods
    const table = []
    t = performance.now()
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
    console.table(table)
    console.log(`Step 3.3 - simulated ${lastPeriod} time periods ${elapsed(t)}`)

    console.log('Part 3 elapsed time of', (performance.now() - started).toFixed(2), 'msec includes logging')
}

Part_3_FireMap()