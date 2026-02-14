import {FireEllipseMod} from './FireEllipseMod.js'
import * as Table from '../../dag/DagTables.js'
import {startBanner, table} from '../../utils/terminal.js'

startBanner()

// Step 1 - compose a Dag of required Modules
const ellipse = new FireEllipseMod('e')
// Step 2 - configure Module options and inter-module linkages
// Step 3 - determine DagNode consumers (and get destructured items for convenience)
ellipse.setConsumers()
const {back, head, left, right} = ellipse

// Step 4 - select desired outputs
back.bearing.select()
right.bearing.select()
left.bearing.select()
Table.selectedNodesTable(ellipse)

// Step 5 - discover required inputs and set their values
Table.activeInputNodesTable(ellipse, 'Active Input Nodes BEFORE Setting Values')

// Step 6 - set required inputs and get updated selected node values
const data = []
for(let i=0; i<360; i+=15) {
    head.bearing.set(i)
    const b = back.bearing.get()
    const r = right.bearing.get()
    const l = left.bearing.get()
    data.push([i.toFixed(0), r.toFixed(0), b.toFixed(0), l.toFixed(0)])
}
table(data, ['Head', 'Right', 'Back', 'Left'], 'Principal Axis Angles from North')
Table.allNodesTable(ellipse)