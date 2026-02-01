import {FireEllipseMod} from './FireEllipseMod.js'
import * as Compass from '../lib/CompassLib.js'
import * as FE from '../lib/FireEllipseLib.js'
import * as Table from '../../dag/DagTables.js'

console.log('demo.js', new Date)

// Step 1 - compose a Dag of required Modules
const e = new FireEllipseMod('e')

// Step 2 - configure Module options and inter-module linkages

// Step 3 - determine DagNode consumers
e.setConsumers()

// Step 4 - select desired outputs
e.eccent.select()
Table.selectedNodesTable(e)

// Step 5 - discover resulting inputs and set their values
Table.activeInputNodesTable(e, 'Active Input Nodes BEFORE Setting Value')
e.lwr.set(2)
Table.activeInputNodesTable(e, 'Active Input Nodes AFTER Setting Value')

// Step 6 - get updated values of selected nodes
e.updateAll()
Table.selectedNodesTable(e)

// console.log(Util.nodeTable(e))
// console.log('eccent=', e.eccent.get())