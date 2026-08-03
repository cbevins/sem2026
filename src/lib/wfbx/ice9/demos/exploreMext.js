import {WfbxState} from '../WfbxState.js'

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

export function run(deadMc, liveMc) {
    console.log(new Date())
    console.log('exploreMext - How does fuel moisture affect live mext when:')
    console.log('dead moisture =', deadMc, 'and live moisture =', liveMc, '?')
    setDeadMc(deadMc)
    setLiveMc(liveMc)

    const fuelKeys = state.fuelCatalog.getStringKeys()
    state.fuelCuring.curedHerb = 0
    for(let fuelKey of fuelKeys) {
        state.fuelKeys.fuelKey1 = fuelKey
        state.makeFuelModel1()
        state.makeFuelBed1()
        if (state.fuelBed1.ovendryLoad>0) {
            state.makeFuelIgnition1()
            table.push({fuelKey,
                deadMext: state.fuelIgnition1.dead.mext.toFixed(4),
                liveMext: state.fuelIgnition1.live.mext.toFixed(4),
                liveMextFactor: state.fuelBed1.liveMextFactor.toFixed(4),
            })
        }
    }
}

run(0.10, 0.50)
console.table(table)
