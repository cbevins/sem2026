import {FireEllipseMod} from './FireEllipseMod.js'
import * as Table from '../../dag/DagTables.js'
import {startBanner} from '../../utils/terminal.js'

startBanner()

// Step 1 - compose a Dag of required Modules
const ellipse = new FireEllipseMod('e')

// Step 2 - configure Module options and inter-module linkages

// Step 3 - determine DagNode consumers (and get destructured items for convenience)
ellipse.setConsumers()
const {back, head, left, lwr, perimeter, right, size, time} = ellipse

// Step 4 - select desired outputs
perimeter.select()
size.select()
back.ros.select()
right.ros.select()
left.ros.select()
Table.selectedNodesTable(ellipse)
// process.exit()

// Step 5 - discover required inputs and set their values
Table.activeInputNodesTable(ellipse, 'Active Input Nodes BEFORE Setting Values')

// Step 6 - set required inputs and get updated selected node values
head.ros.set(1)
lwr.set(2)
time.set(1)
Table.activeInputNodesTable(ellipse, 'Active Input Nodes AFTER Setting Values')
ellipse.updateAll()
Table.selectedNodesTable(ellipse)
