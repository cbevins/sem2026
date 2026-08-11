/*
The dead fuel moisture damping coefficient (Rothermel Eq 29) is
    etam = 1 - 2.59 * r + 5.11 * r**2 - 3.52 * r**3
where
    r = fc / fx
and
    fc = dead category fuel moisture content
    fx = dead category extinction fuel moisture
and
    fc = w1 * fm1 + w10 * fm10 + w100 * fm100

Lets assume that in field applications the best precision we can expect
for fuel moisture content is plus/minus 1% ovendry weight.

The question is then: how much does each size class fuel moisture have to change
to affect a change of 1% fuel moisture for the dead category?  The answers are:
delta1 = 1 / wtg1
delta10 = 1 / wtg10
delta100 = 1 / wtg100

We can use the deltas to define fuel moisture band widths for each fuel model.
For example, if a fuel model's 10h or 100h is 4.5, we can use moisture bands
that are 0.04 wide knowing that the affect on the category fm is less than 0.01.

Furthermore, we can identify those fuel models with 10h or 100h fuels whose
fuel moisture content is of NO consequence. This occurs when the delta exceeds
the fuel model's dead mext; changing its moisture content from the dead mext
to zero will NOT change the category moisture by more than 0.01.
*/
import {WfbxState} from '../WfbxState.js'
const state = new WfbxState()

export function fmClassesByFuelModel() {
    console.log(new Date())
    console.log('fmClassesByFuelModel')
    
    const table = []
    const fuelKeys = state.fuelCatalog.getStringKeys()
    state.fuelCuring.curedHerb = 0
    state.fuelMoisture.moistureDead1h = 0.01
    state.fuelMoisture.moistureDead10h = 0.01
    state.fuelMoisture.moistureDead100h = 0.01
    state.updateFuelMoistureDeadFromParticles()

    state.fuelMoisture.moistureLiveHerb = 1.2
    state.fuelMoisture.moistureLiveStem = 1.2
    state.fuelMoisture.moistureLiveCurable = 1.2
    state.updateFuelMoistureLiveFromParticles()

    let grand = 0
    for(let fuelKey of fuelKeys) {
        state.fuelKeys.fuelKey1 = fuelKey
        state.makeFuelModel1()
        state.makeFuelBed1()
        if (state.fuelBed1.ovendryLoad>0) {
            // state.makeFuelIgnition1()
            const deadMext = state.fuelModel1.deadMext
            const wtg = {moistureDead1h: 0, moistureDead10h: 0, moistureDead100h: 0}
            for(let particle of state.fuelBed1.dead.particles) {
                wtg[particle.moistureClass] += particle.surfaceAreaWtg
            }
            const wtg1 = wtg.moistureDead1h
            const wtg10 = wtg.moistureDead10h
            const wtg100 = wtg.moistureDead100h
            const delta1 = 0.01 / wtg1
            const delta10 = (wtg10>0) ? 0.01 / wtg10 : deadMext
            const delta100 = (wtg100>0) ? 0.01 / wtg100 : deadMext
            const use1 = Math.floor(100*delta1) / 100
            const use10 = Math.floor(100*delta10) / 100
            const use100 = Math.floor(100*delta100) / 100
            const n1 = Math.ceil(deadMext / use1)
            const n10 = Math.ceil(deadMext / use10)
            const n100 = Math.ceil(deadMext / use100)
            const total = n1 * n10 * n100
            table.push({fuelKey, deadMext, // ros0: state.fuelIgnition1.noWindSpreadRate,
                wtg1: fmt4(wtg1), delta1: fmt4(delta1), use1, n1,
                wtg10: fmt4(wtg10), delta10: fmt4(delta10), use10, n10,
                wtg100: fmt4(wtg100), delta100: fmt4(delta100), use100, n100, total})
            grand += total
        }
    }
    table.push({fuelKey: 'TOTAL', total: grand})
    console.table(table)
}

function _showNoAffect(fuelKey, fm1, fm10, fm100, msg='') {
    state.fuelMoisture.moistureDead1h = fm1
    state.fuelMoisture.moistureDead10h = fm10
    state.fuelMoisture.moistureDead100h = fm100
    state.updateFuelMoistureDeadFromParticles()
    state.makeFuelIgnition1()
    state.makeSurfaceFireBehavior1()
    let ros = fmt4(state.fireBehavior1.headingSpreadRate)
    let fli = fmt4(state.fireBehavior1.firelineIntensity)
    let flame = fmt4(state.fireBehavior1.flameLength)
    return {fuelKey, msg, fm1, fm10, fm100, ros, fli, flame}
}

function showNoAffect() {
    const table = []
    state.fuelCuring.curedHerb = 0
    state.fuelMoisture.moistureLiveHerb = 1.2
    state.fuelMoisture.moistureLiveStem = 1.2
    state.fuelMoisture.moistureLiveCurable = 1.2
    state.updateFuelMoistureLiveFromParticles()
    state.slopeSteepness.ratio = 0
    state.slopeDirection.aspectDegrees = 180
    state.windDirection.bearingDegrees = 0
    for(let fuelKey of ['tl6', 'tl8']) {    // deadmext tl6=0.25, tl8=0.35
        const fm0 = 0.04
        const fm1 = 0.0
        state.fuelKeys.fuelKey1 = fuelKey
        state.makeFuelModel1()
        // const deadMext = state.fuelModel1.deadMext
        // const fmx = Math.trunc(100 * (deadMext - 0.01))/100
        state.makeFuelBed1()
        state.midflameWindSpeed = 0
        table.push(_showNoAffect(fuelKey, fm0, fm0, fm0, `Baseline all at ${fm0}% fm`))
        table.push(_showNoAffect(fuelKey, fm0-0.01, fm0, fm0, `Change 1h to ${fm0-0.01}% fm`))
        table.push(_showNoAffect(fuelKey, fm0, fm1, fm0, `Change 10h to ${fm1}% fm`))
        // table.push(_showNoAffect(fuelKey, fm0, fmx, fm0, `10h @ ${fmx}% fm`))
        table.push(_showNoAffect(fuelKey, fm0, fm0, fm1,`Change 100h to ${fm1}% fm`))
        // table.push(_showNoAffect(fuelKey, fm0, fm0, fmx, `100h @ ${fmx}% fm`))
    }
    console.table(table)
}
export function etamAtMext(mext) {
    const table = []
    for(let fm=0.01; fm<=mext; fm+=0.01) {
        const r = fm / mext
        const etam = 1 - 2.59*r + 5.11*r*r - 3.52*r*r*r
        table.push({mext, fm: fmt2(fm), fmRatio: fmt2(r), etam: fmt4(etam)})
    }
    console.log(`etamAtMext: EtaM at ${100*mext} fm/fx intervals for mext ${mext}`)
    console.table(table)
}

function fmt2(v) { return Math.trunc(100*v)/100 }
function fmt4(v) { return Math.trunc(10000*v)/10000 }

export function etamRatios() {
    const table = []
    for(let r=0; r<=1; r+=0.01) {
        const etam = 1 - 2.59*r + 5.11*r*r - 3.52*r*r*r
        const fm12 = r * 0.12
        const fm15 = r * 0.15
        const fm20 = r * 0.20
        const fm25 = r * 0.25
        const fm30 = r * 0.30
        const fm35 = r * 0.35
        const fm40 = r * 0.40
        table.push({fmRatio: fmt2(r), etam: fmt4(etam), fm12: fmt4(fm12),
            fm15: fmt4(fm15), fm20: fmt4(fm20), fm25: fmt4(fm25),
            fm30: fmt4(fm30), fm35: fmt4(fm35), fm40: fmt4(fm40)})
    }
    console.log('\netamRatios: EtaM and fuel moisture values at 0.01 fm/fx intervales')
    console.table(table)
}

export function rAtEtam(eStep=0.05) {
    const table = []
    for(let e=1; e>=eStep; e-=eStep) {
        const r = solveRForE(e)
        const etaM = Math.trunc(100*e)/100
        const fmRatio = Math.trunc(10000*r)/10000
        const fm12 = Math.trunc(10000*r * 0.12)/10000
        table.push({etaM, fmRatio, fm12})
    }
    console.table(table)
}

function solveRForE(e, initialGuess=0.5, tolerance=1e-7, maxIterations=100) {
    let r = initialGuess;
    for (let i = 0; i < maxIterations; i++) {
        // f(r) = 3.52*r^3 - 5.11*r^2 + 2.59*r + (e - 1)
        const f = 3.52 * Math.pow(r, 3) - 5.11 * Math.pow(r, 2) + 2.59 * r + (e - 1);
        // Derivative f'(r) = 10.56*r^2 - 10.22*r + 2.59
        const fPrime = 10.56 * Math.pow(r, 2) - 10.22 * r + 2.59;
        const nextR = r - f / fPrime;
        if (Math.abs(nextR - r) < tolerance) {
            return nextR;
        }
        r = nextR;
    }
    return r; // Returns best approximation after max iterations
}
export function fmCombos() {
    const t =
       2 * 12**3
    + 12 * 15**3
    +  5 * 20**3
    + 15 * 25**3
    +  8 * 30**3
    +  2 * 35**3
    +  9 * 40**3
    console.log('Total 1h-10-h100- fm combinations for 53 fuel models:', t)
}
// rAtEtam()
// etamAtMext(0.25)
// etamRatios()
// console.table(table)
// fmCombos()
// fmClassesByFuelModel()
showNoAffect()