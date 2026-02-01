import { DagModule } from './DagModule.js'
import { DagNode } from './DagNode.js'
import * as FE from '../fire/lib/FireEllipseLib.js'

console.log(new Date())

export class DemoDagModule extends DagModule {
    constructor(key) {
        super(key,
            new DagNode('lwr', 1, 'dl'),
            new DagNode('eccent', 0, 'dl')
        )
        this.assignUpdaters()
    }
    assignUpdaters() {
        const {lwr, eccent} = this
        lwr.input()
        eccent.method(FE.eccentricity, lwr)
    }
}

// Step 1 - create new DagModule (and display its non-enumerable properties)
const demo = new DemoDagModule('demo')
console.log(`key='${demo.key}', type='${demo.type}', parent=${demo.parent}`)

// Step 2 - configure Module options and inter-module linkages

// Step 3 - IMPORTANT !!! determine DagNode consumers
demo.setConsumers()

// Step 4 - select desired outputs
const {lwr, eccent} = demo
eccent.select()

// Step 5 - discover required inputs

console.log('\nAll DagNodes')
for(let node of demo.nodes()) { console.log(node.key, node.value) }

console.log('\nAll Input DagNodes')
for(let node of demo.inputNodes()) { console.log(node.key, node.value) }

console.log('\nAll Selected DagNodes')
for(let node of demo.selectedNodes()) { console.log(node.key, node.value) }

console.log('\nAll Active DagNodes')
for(let node of demo.inputNodes()) { console.log(node.key, node.value) }

// Step 6 - set inputs and get results
for(let i=1; i<=10; i++) {
    lwr.set(i)
    console.log(`lwr ${lwr.value}, eccent=${eccent.get()}`)
}