import {FireEllipseMod} from './FireEllipseMod.js'
import * as Table from '../../dag/DagTables.js'
import {startBanner} from '../../utils/startBanner.js'

startBanner()

// Step 1 - compose a Dag of required Modules
const ellipse = new FireEllipseMod('e')
// Step 2 - configure Module options and inter-module linkages
// Step 3 - determine DagNode consumers (and get destructured items for convenience)
ellipse.setConsumers()
const {back, head, left, right} = ellipse

// Step 4 - select desired outputs
back.angle.north.select()
right.angle.north.select()
left.angle.north.select()
Table.selectedNodesTable(ellipse)

// Step 5 - discover required inputs and set their values
Table.activeInputNodesTable(ellipse, 'Active Input Nodes BEFORE Setting Values')

// Step 6 - set required inputs and get updated selected node values
for(let i=0; i<360; i+=15) {
    head.angle.north.set(i)
    const b = back.angle.north.get()
    const r = right.angle.north.get()
    const l = left.angle.north.get()
    console.log(`head=${i}, right=${r}, back=${b}, left=${l}`)
}
