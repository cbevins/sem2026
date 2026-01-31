import {FireEllipseMod} from './FireEllipseMod.js'
import * as Compass from '../lib/CompassLib.js'
import * as FE from '../lib/FireEllipseLib.js'
import * as Util from './utils.js'
console.log('demo.js', new Date)

function activeInputsTable(root) {
    console.log('Active Input Nodes')
    const a = []
    for(let node of root.activeInputNodes())
        a.push({key: node.fullKey(), value: node.value})
    console.table(a)
}

function selectedTable(root) {
    console.log('Selected Nodes')
    const a = []
    for(let node of root.selectedNodes())
        a.push({key: node.fullKey(), value: node.value})
    console.table(a)
}

// Step 1 - compose a Dag of required Modules
const e = new FireEllipseMod('e')
// Step 2 - configure Module options and inter-module linkages

// Step 3 - determine DagNode consumers
e.setConsumers()

// Step 4 - select desired outputs
e.head.perim.head.x.select()
e.head.perim.head.y.select()
e.head.perim.geo.east.select()
e.head.perim.geo.north.select()
selectedTable(e)

// Step 5 - discover resulting inputs and set their values
activeInputsTable(e)
e.time.set(1)
e.head.ros.set(1)
e.head.angle.north.set(30)
activeInputsTable(e)

// Step 6 - get updated values of selected nodes
e.updateAll()
selectedTable(e)

// console.log(Util.nodeTable(e))
// console.log('eccent=', e.eccent.get())