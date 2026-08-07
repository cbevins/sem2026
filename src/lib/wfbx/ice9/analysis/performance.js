import {WfbxState} from '../WfbxState.js'
const state = new WfbxState()
const fuelKeys = state.fuelCatalog.getStringKeys()

state.slopeSteepness.ratio = 0
state.slopeDirection.aspectDegrees = 180
state.windDirection.bearingDegrees = 0
state.midflameWindSpeed = 0

const table = []

function perform() {
    state.fuelCuring.curedHerb = 0
    state.fuelMoisture.moistureLiveHerb = 1.2
    state.fuelMoisture.moistureLiveStem = 1.2
    state.fuelMoisture.moistureLiveCurable = 1.2
    state.updateFuelMoistureLiveFromParticles()
    for(let fuelKey of ['tl6', 'tl8']) {
        state.fuelKeys.fuelKey1 = fuelKey
        state.makeFuelModel1()
        const deadMext = state.fuelModel1.deadMext
        state.makeFuelBed1()
        const wtg = {moistureDead1h: 0, moistureDead10h: 0, moistureDead100h: 0}
        for(let particle of state.fuelBed1.dead.particles) {
            wtg[particle.moistureClass] += particle.surfaceAreaWtg
        }

        for(let d1h=0.01; d1h<= deadMext; d1h+=0.01) {
        state.fuelMoisture.moistureDead1h = 0.05
        state.fuelMoisture.moistureDead10h = fm1
        state.fuelMoisture.moistureDead100h = fm1
        state.updateFuelMoistureDeadFromParticles()

        state.makeFuelIgnition1()
        state.makeSurfaceFireBehavior1()
        let ros = fmt4(state.fireBehavior1.headingSpreadRate)
        let fli = fmt4(state.fireBehavior1.firelineIntensity)
        let flame = fmt4(state.fireBehavior1.flameLength)
        table.push({fuelKey, mois: fm1, ros, fli, flame})

        state.fuelMoisture.moistureDead10h = fm2
        state.fuelMoisture.moistureDead100h = fm2
        state.updateFuelMoistureDeadFromParticles()
        state.makeFuelIgnition1()
        state.makeSurfaceFireBehavior1()
        ros = fmt4(state.fireBehavior1.headingSpreadRate)
        fli = fmt4(state.fireBehavior1.firelineIntensity)
        flame = fmt4(state.fireBehavior1.flameLength)
        table.push({fuelKey, mois: fmt2(fm2), ros, fli, flame})
    }
    console.table(table)
}
