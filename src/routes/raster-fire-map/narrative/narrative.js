import { Part_1_FireEllipse } from "./Part_1_FireEllipse.js"
import { Part_2_Firelet } from "./Part_2_Firelet.js"

export function narrative() {
    console.log('Wildland Fire Behavior Simulation Narrative -', new Date())
    const timer0 = performance.now()

    Part_1_FireEllipse()
    Part_2_Firelet()
    console.log('Elapsed time of', (performance.now() - timer0).toFixed(2), 'msec includes logging')
}

narrative()