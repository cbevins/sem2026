import { Part_1_FireEllipse } from "./Part_1_FireEllipse.js"
import { Part_2_Firelet } from "./Part_2_Firelet.js"
import { Part_3_FireRaster } from "./Part_3_FireRaster.js"

export function narrative() {
    console.log('Wildland Fire Behavior Simulation Narrative -', new Date())
    let stats = []
    let from = performance.now()

    console.log('Part 1 - FireEllipse')
    stats = stats.concat(Part_1_FireEllipse())
    console.log('Part 2 - Firelet')
    stats = stats.concat(Part_2_Firelet())
    console.log('Part 3 - FireRaster')
    stats = stats.concat(Part_3_FireRaster())

    for(let stat of stats) {
        if (stat.step) stat.text = '    ' + stat.text
        stat.msec = Math.trunc(100*stat.msec)/100
    }
    console.table(stats)
    console.log('Elapsed time of', (performance.now() - from).toFixed(2), 'msec includes logging')
}

narrative()