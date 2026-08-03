import {WfbxState} from '../WfbxState.js'

const state = new WfbxState()
const table = []

export function run() {
    console.log(new Date())
    console.log('exploreSizeClassWtg - What are the 1h, 10h,, and 100h weighting factors for each fuel model?')
    
    const fuelKeys = state.fuelCatalog.getStringKeys()
    state.fuelCuring.curedHerb = 0
    for(let fuelKey of fuelKeys) {
        state.fuelKeys.fuelKey1 = fuelKey
        state.makeFuelModel1()
        state.makeFuelBed1()
        if (state.fuelBed1.ovendryLoad>0) {
            const wtg = {moistureDead1h: 0, moistureDead10h: 0, moistureDead100h: 0}
            for(let particle of state.fuelBed1.dead.particles) {
                wtg[particle.moistureClass] += particle.surfaceAreaWtg
            }
            table.push({fuelKey,
                dead1h: wtg.moistureDead1h.toFixed(4),
                dead10h: wtg.moistureDead10h.toFixed(4),
                dead100h: wtg.moistureDead100h.toFixed(4)
            })
        }
    }
}

run()
console.table(table)
