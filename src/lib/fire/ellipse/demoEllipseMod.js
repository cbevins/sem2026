import {FireEllipseMod} from './FireEllipseMod.js'
import * as Table from '../../dag/DagTables.js'

console.log('demo.js', new Date)

// Step 1 - compose a Dag of required Modules
const ellipse = new FireEllipseMod('e')

// Step 2 - configure Module options and inter-module linkages

// Step 3 - determine DagNode consumers
ellipse.setConsumers()

// Step 4 - select desired outputs
const {back, beta, eccent, f, g, h, head, ignition, length, lwr,
    perimeter, psi, size, theta, time, width} = ellipse
beta.beta.select()
beta.theta.select()
beta.psi.select()
psi.beta.select()
psi.theta.select()
psi.psi.select()
theta.beta.select()
theta.theta.select()
theta.psi.select()
Table.selectedNodesTable(ellipse)

// Step 5 - discover required inputs and set their values
Table.activeInputNodesTable(ellipse, 'Active Input Nodes AFTER Setting Value')
// process.exit()

// Step 6 - set required inputs and get updated selected node values
head.angle.north.set(0)
lwr.set(2)

// beta angle reciprocity
for(let i=0; i<360; i++) {
    beta.angle.north.set(i)
    const a = beta.angle.head.get()
    const b = beta.beta.get()
    const t = beta.theta.get()
    const p = beta.psi.get()
    console.log(`BETA a=${a.toFixed(2)}, beta=${b.toFixed(2)}, theta=${t.toFixed(2)}, psi=${p.toFixed(2)}`)
    if (Math.abs(a-b) > 0.00001) throw new Error(`beta->psi->beta recipricols do not match`)
}

// theta angle reciprocity
for(let i=0; i<360; i++) {
    theta.angle.north.set(i)
    const a = theta.angle.head.get()
    const b = theta.beta.get()
    const t = theta.theta.get()
    const p = theta.psi.get()
    console.log(`THETA a=${a.toFixed(2)}, beta=${b.toFixed(2)}, theta=${t.toFixed(2)}, psi=${p.toFixed(2)}`)
    if (Math.abs(a-t) > 0.00001) throw new Error(`theta->psi->theta recipricols do not match`)
}

// psi angle reciprocity
for(let i=0; i<360; i++) {
    psi.angle.north.set(i)
    const a = psi.angle.head.get()
    const b = psi.beta.get()
    const t = psi.theta.get()
    const p = psi.psi.get()
    console.log(`PSI a=${a.toFixed(2)}, beta=${b.toFixed(2)}, theta=${t.toFixed(2)}, psi=${p.toFixed(2)}`)
    if (Math.abs(a-p) > 0.00001) throw new Error(`psi->beta->psi recipricols do not match`)
}