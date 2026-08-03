import {WfbxState} from '../WfbxState.js'

const state = new WfbxState()
const table = []

export function run(wind1, slope1, wind2, slope2) {
    console.log(new Date())
    console.log('exploreWindFactor - how do wind and slope factors and spread rate change')
    console.log(`when going from wind ${wind1} slope ${slope1} to wind ${wind2} slope ${slope2}?`)

    state.fuelMoisture.moistureDead1h = 0.01
    state.fuelMoisture.moistureDead10h = 0.01
    state.fuelMoisture.moistureDead100h = 0.01
    state.fuelMoisture.moistureLiveHerb = 0.5
    state.fuelMoisture.moistureLiveStem = 1.0
    state.fuelCuring.curedHerb = 0
    state.windDirection.bearingDegrees = 0
    state.slopeDirection.aspectDegrees = 180
    
    const fuelKeys = state.fuelCatalog.getStringKeys()
    for(let fuelKey of fuelKeys) {
        state.fuelKeys.fuelKey1 = fuelKey
        state.makeFuelModel1()
        state.makeFuelBed1()
        if (state.fuelBed1.ovendryLoad>0) {
            state.makeFuelIgnition1()
            state.midflame.windSpeed = 88
            state.slopeSteepness.ratio = 0.1
            state.makeSurfaceFireBehavior1()
            const phiw1 = state.fireBehavior1.windFactor.toFixed(4)
            const phis1 = state.fireBehavior1.slopeFactor.toFixed(4)
            const ros1 = state.fireBehavior1.headingSpreadRate.toFixed(4)

            state.midflame.windSpeed = 10 * 88
            state.slopeSteepness.ratio = 1
            state.makeSurfaceFireBehavior1()
            const phiw2 = state.fireBehavior1.windFactor.toFixed(4)
            const phis2 = state.fireBehavior1.slopeFactor.toFixed(4)
            const ros2 = state.fireBehavior1.headingSpreadRate.toFixed(4)

            table.push({fuelKey,
                savr: state.fuelBed1.savr.toFixed(0),
                // packingRatio: state.fuelBed1.packingRatio.toFixed(4),
                // windB: state.fuelBed1.windB.toFixed(4),
                ros0: state.fuelIgnition1.noWindSpreadRate.toFixed(4),
                phiw1, phis1, ros1, phiw2, phis2, ros2})
        }
    }
}

run(88, 0.1, 880, 1)
console.table(table)
