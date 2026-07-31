import {WfbxState} from '../WfbxState.js'
const state = new WfbxState()
const table = []

function setDeadMc(value) {
    state.fuelMoisture.moistureDead1h = value
    state.fuelMoisture.moistureDead10h = value
    state.fuelMoisture.moistureDead100h = value
}
export function run() {
    console.log('exploreDead1hSensitivity', new Date())
    
    const fuelKeys = state.fuelCatalog.getStringKeys()
    state.fuelCuring.curedHerb = 0
    state.fuelMoisture.moistureLiveHerb = 1
    state.fuelMoisture.moistureLiveStem = 1

    const startFm = 0.1
    const stepFm = 0.01
    for(let fuelKey of fuelKeys) {
        state.fuelKeys.fuelKey1 = fuelKey
        state.makeFuelModel1()
        state.makeFuelBed1()
        if (state.fuelBed1.ovendryLoad>0) {
            setDeadMc(startFm)
            state.makeFuelIgnition1()
            const deadMext = state.fuelIgnition1.dead.mext
            const etam1 = state.fuelIgnition1.dead.moistureDamping
            
            state.fuelMoisture.moistureDead1h = startFm + stepFm
            state.makeFuelIgnition1()
            const etam1h = state.fuelIgnition1.dead.moistureDamping

            // How much do we need to change dead10h to have the same effect?
            setDeadMc(startFm)
            let diff10h = 0
            let etam10h = 0
            for (let fm=startFm; fm<=1; fm+=stepFm) {
                state.fuelMoisture.moistureDead10h = fm
                state.makeFuelIgnition1()
                etam10h = state.fuelIgnition1.dead.moistureDamping
                if (etam10h <= etam1h) break
                diff10h += 0.01
            }
            // How much do we need to change dead100h to have the saem effect?
            setDeadMc(startFm)
            let diff100h = 0
            let etam100h = 0
            for (let fm=startFm; fm<=1; fm+=stepFm) {
                state.fuelMoisture.moistureDead100h = fm
                state.makeFuelIgnition1()
                etam100h = state.fuelIgnition1.dead.moistureDamping
                if (etam100h <= etam1h) break
                diff100h += 0.01
            }

            table.push({fuelKey,
                etam1: etam1.toFixed(4),
                diff1h: 0.01,
                etam1h: etam1h.toFixed(4),
                diff10h: diff10h.toFixed(4), 
                etam10h: etam10h.toFixed(4),
                diff100h: diff100h.toFixed(4),
                etam100h: etam100h.toFixed(4), deadMext})
        }
    }
}

run()
console.table(table)
