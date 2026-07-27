import {WfbxState} from './WfbxState.js'
const state = new WfbxState()

function test() {
    state.fuelMoisture.moistureLiveCurable = 0.5
    state.updateFuelCuringFromLiveMoisture()
    // console.log(state.fuelCuring)

    state.fuelKeys.fuelKey1 = 10
    state.makeFuelModel1()
    // console.log(state.fuelModel1)

    state.fuelKeys.fuelKey2 = 124
    state.makeFuelModel2()
    // console.log(state.fuelModel2)

    state.makeFuelBed1()
    // console.log(state.fuelBed1)
    state.makeFuelBed2()
    // console.log(state.fuelBed2)

    state.fuelMoisture.moistureDead1h = 0.05
    state.fuelMoisture.moistureDead10h = 0.07
    state.fuelMoisture.moistureDead100h = 0.09
    state.fuelMoisture.moistureLiveHerb = 0.5
    state.fuelMoisture.moistureLiveStem = 1.5

    state.makeFuelIgnition1()
    // console.log(state.fuelIgnition1)

    state.makeFuelIgnition2()
    console.log(state.fuelIgnition2)
}

test()