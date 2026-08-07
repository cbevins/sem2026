/*
The fire behavior fuel models have 3 dead fuel size classes.
The dead category fuel moisture is the sum of the 3 class fuel moistures
weighted by their surface area contribution.  The 1h weighting factor
is typically much larger than the 10h or 100h classes.

Assuming that our best precision for estimating dead 1-h fuel moisture
is 1 percent of ovendry weight, for each fuel model discover:
- which 1% change in the range [1..dead mext] causes the greatest change
    in (1) moisture damping coefficient, (2) reation intensity, and
    (3) no-wind, no-slope spread rate and reaction intensity;
- at that fuel moisture point, how much does 10-h and 100-h fuel moisture
    have to change to have the same effect.

# Findings
- Over the range [0..mext], the largest percentage change always occurs at the wet end.
This is usually the situation of least concern.
So, will use range [0..deadMext/2]
*/
import {WfbxState} from '../WfbxState.js'
const state = new WfbxState()
const table = []

function setDeadMc(value) {
    state.fuelMoisture.moistureDead1h = value
    state.fuelMoisture.moistureDead10h = value
    state.fuelMoisture.moistureDead100h = value
}
export function run() {
    console.log(new Date())
    console.log('\ndeadFuelMoistureSensitivityByFuelModel')
    const fuelKeys = state.fuelCatalog.getStringKeys()
    state.fuelCuring.curedHerb = 0
    state.fuelMoisture.moistureLiveHerb = 1.2
    state.fuelMoisture.moistureLiveStem = 1.2
    for(let fuelKey of fuelKeys) {
        state.fuelKeys.fuelKey1 = fuelKey
        state.makeFuelModel1()
        state.makeFuelBed1()
        if (state.fuelBed1.ovendryLoad > 0) {
            const result = findMostSensitiveFmc(fuelKey)
            table.push(result)
        }
    }
}

function findMostSensitiveFmc(fuelKey) {
    const deadMext = state.fuelModel1.deadMext
    const stepFmc = 0.01
    const stopFmc = 0.01
    const startFmc = Math.trunc(100*deadMext/2)/100
    setDeadMc(startFmc)
    state.makeFuelIgnition1()
    let fuel = state.fuelIgnition1
    let rxiPrev = fuel.reactionIntensity
    let rosPrev = fuel.noWindSpreadRate
    let etaPrev = fuel.dead.moistureDamping
    const ranges = []
    for (let fmc=startFmc; fmc>=stopFmc; fmc-=stepFmc) {
        setDeadMc(fmc)
        state.makeFuelIgnition1()
        let rxi = fuel.reactionIntensity
        let ros = fuel.noWindSpreadRate
        let eta = fuel.dead.moistureDamping
        const rxiPct = Math.abs(rxi - rxiPrev) / rxiPrev
        const rosPct = Math.abs(ros - rosPrev) / rosPrev
        const etaPct = Math.abs(eta - etaPrev) / etaPrev
        ranges.push({fmc, eta, etaPrev, etaPct, rxi, rxiPrev, rxiPct, ros, rosPrev, rosPct})
        etaPrev = eta
        rxiPrev = rxi
        rosPrev = ros
    }

    let r = ranges[0]
    let etaFmc = r.fmc
    let etaPctMax = r.etaPct
    let etaVal = r.eta
    let etaPrv = r.etaPrev
    let rxiFmc = r.fmc
    let rxiPctMax = r.rxiPct
    let rxiVal = r.rxi
    let rxiPrv = r.rxiPrev
    let rosFmc = r.fmc
    let rosPctMax = r.rosPct
    let rosVal = r.ros
    let rosPrv = r.rosPrev
    for(let r of ranges) {
        if (r.etaPct > etaPctMax) {
            etaPctMax = r.etaPct
            etaFmc = r.fmc
            etaPrv = r.etaPrev
            etaVal = r.eta
        }
        if (r.rxiPct > rxiPctMax) {
            rxiPctMax = r.rxiPct
            rxiFmc = r.fmc
            rxiPrv = r.rxiPrev
            rxiVal = r.rxi
        }
        if (r.rosPct > rosPctMax) {
            rosPctMax = r.rosPct
            rosFmc = r.fmc
            rosPrv = r.rosPrev
            rosVal = r.ros
        }
    }
    return {fuelKey,
        etaFmc: fmt(etaFmc),
        etaPrv: fmt(etaPrv),
        etaVal: fmt(etaVal),
        etaPctMax: fmt(etaPctMax),
        rxiFmc: fmt(rxiFmc),
        rxiPrv: fmt(rxiPrv),
        rxiVal: fmt(rxiVal),
        rxiPctMax: fmt(rxiPctMax),
        rosFmc: fmt(rosFmc),
        rosPrv: fmt(rosPrv),
        rosVal: fmt(rosVal),
        rosPctMax: fmt(rosPctMax),
        deadMext
    }
}
function fmt(v) {
    return Math.trunc(100 * v) / 100
}

run()
console.table(table)
