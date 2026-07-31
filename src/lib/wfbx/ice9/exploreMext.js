import {WfbxState} from './WfbxState.js'
const state = new WfbxState()
const table = []

function setDeadMc(value) {
    state.fuelMoisture.moistureDead1h = value
    state.fuelMoisture.moistureDead10h = value
    state.fuelMoisture.moistureDead100h = value
}

function setLiveMc(value) {
    state.fuelMoisture.moistureLiveHerb = value
    state.fuelMoisture.moistureLiveStem = value
}

export function run() {
    console.log('exploreMext - How Does Fuel Moisture Affect Live Mext?', new Date())
    
    const fuelKeys = state.fuelCatalog.getStringKeys()
    state.fuelCuring.curedHerb = 0
    for(let fuelKey of fuelKeys) {
        state.fuelKeys.fuelKey1 = fuelKey
        state.makeFuelModel1()
        state.makeFuelBed1()
        if (state.fuelBed1.ovendryLoad>0) {
            setDeadMc(0.1)
            setLiveMc(0.5)
            state.makeFuelIgnition1()
            table.push({fuelKey,
                deadMext: state.fuelIgnition1.dead.mext.toFixed(4),
                liveMext: state.fuelIgnition1.live.mext.toFixed(4),
                liveMextFactor: state.fuelBed1.liveMextFactor.toFixed(4),
            })
        }
    }
}

run()
console.table(table)
