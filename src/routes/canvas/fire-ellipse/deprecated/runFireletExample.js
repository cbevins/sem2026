import { BurnMap } from './BurnMap.js'
import { Firelet } from './Firelet.js'

function runFireletExample() {
    console.log('runFireletExample', new Date())

    const cols = 512
    const rows = 512
    const timer0 = performance.now()
    const burnMap1 = new BurnMap(cols, rows)
    const burnMap2 = new BurnMap(cols, rows)
    const ignX = 256
    const ignY = 256

    // 1 - Create the Firelet
    const timer1 = performance.now()
    let headRos = 100
    let lwr = 2
    let duration = 1
    let bearing = 90
    let spacing = 1
    let firelet = new Firelet(headRos, lwr, duration, bearing, spacing)
    return
    // 2 - Ignite firelet cells using pathways
    const timer2 = performance.now()
    firelet.ignitePathways(burnMap1, ignX, ignY)
    const pathVisits = firelet.visits

    // 3 - Ignite firelet cells using tree
    const timer3 = performance.now()
    firelet.ignitePathTree(burnMap2, ignX, ignY)
    const treeVisits = firelet.visits
    const timer4 = performance.now()

    // Report
    console.log(`new BurnMap()   : ${(timer1-timer0).toFixed(2)} ms`)
    console.log(`new Firelet()   : ${(timer2-timer1).toFixed(2)} ms`)
    console.log(`ignitePathways(): ${(timer3-timer2).toFixed(2)} ms for ${pathVisits} visits`)
    console.log(`igniteTree()    : ${(timer4-timer3).toFixed(2)} ms for ${treeVisits} visits`)
}
runFireletExample()