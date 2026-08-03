import {WfbxState} from '../WfbxState.js'

const state = new WfbxState()
const table = []

export function run() {
    console.log(new Date())
    console.log('exploreFuelModelExtremes - what are the upper limit of fire behavior of each fuel model?')

    state.fuelMoisture.moistureDead1h = 0.01
    state.fuelMoisture.moistureDead10h = 0.01
    state.fuelMoisture.moistureDead100h = 0.01
    state.fuelMoisture.moistureLiveHerb = 0.3
    state.fuelMoisture.moistureLiveStem = 0.3
    state.fuelCuring.curedHerb = 1
    state.windDirection.bearingDegrees = 0
    state.slopeDirection.aspectDegrees = 180
    state.slopeSteepness.ratio = 0

    let debug = false
    if (debug) {
        state.fuelKeys.fuelKey1 = '1'
        state.makeFuelModel1()
        state.makeFuelBed1()
        state.makeFuelIgnition1()
        state.makeSurfaceFireBehavior1()
        console.log(`${state.fuelKeys.fuelKey1} FireBehavior1 = {`, state.fireBehavior1)
        console.log(`${state.fuelKeys.fuelKey1} FuelIgnition1 = {`, state.fuelIgnition1)
        console.log(`${state.fuelKeys.fuelKey1} FuelBed1 = {`, state.fuelBed1)
        console.log(`${state.fuelKeys.fuelKey1} FuelModel1 = {`, state.fuelModel1)
    } else {
        const fuelKeys = state.fuelCatalog.getStringKeys()
        for(let fuelKey of fuelKeys) {
        // for(let fuelKey of ['1']) {
            state.fuelKeys.fuelKey1 = fuelKey
            state.makeFuelModel1()
            state.makeFuelBed1()
            if (state.fuelBed1.ovendryLoad>0) {
                state.makeFuelIgnition1()
                let prevRos = 0
                for(let wind=0; wind<100; wind+=1) {
                    state.midflame.windSpeed = 88 * wind
                    state.makeSurfaceFireBehavior1()
                    const ros = state.fireBehavior1.headingSpreadRate
                    if (ros <= prevRos) {
                        table.push({fuelKey,
                            savr: state.fuelBed1.savr.toFixed(0),
                            wind,
                            ros: prevRos.toFixed(2),
                            fli: state.fireBehavior1.firelineIntensity.toFixed(2),
                            flame: state.fireBehavior1.flameLength.toFixed(2),
                        })
                        break
                    }
                    prevRos = ros
                }
            }
        }
    }
}

run()
console.table(table)
