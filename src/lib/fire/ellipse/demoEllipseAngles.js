import {FireEllipseMod} from './FireEllipseMod.js'
import * as Table from '../../dag/DagTables.js'
import {start} from './utils.js'

start() // console.log(`\n-------------------\n${process.argv[1].split('\\').pop()} started at`, new Date)
process.exit()

// Step 1 - compose a Dag of required Modules
const ellipse = new FireEllipseMod('e')
// Step 2 - configure Module options and inter-module linkages
// Step 3 - determine DagNode consumers (and get destructured items for convenience)
ellipse.setConsumers()
const {back, beta, eccent, f, g, h, head, ignition, left, length, lwr,
    perimeter, psi, right, size, theta, time, width} = ellipse

// Step 4 - select desired outputs
right.angle.north.select()
Table.selectedNodesTable(ellipse)

// Step 5 - discover required inputs and set their values
Table.activeInputNodesTable(ellipse, 'Active Input Nodes BEFORE Setting Values')

// Step 6 - set required inputs and get updated selected node values
for(let i=0; i<360; i+=15) {
    head.angle.north.set(i)
    const r = right.angle.north.get()
    console.log(i,r)
}
