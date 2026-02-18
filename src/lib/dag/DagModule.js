import { Stem } from '../stem-leaf/StemLeaf.js'
import { DagNode } from './DagNode.js'

/**
 * DagModule is a specialized Stem class for use with DagNode specialized Leafs.
 * - DagModules are self-contained DAGs that define all their required input and derived DagNodes
 *   and assigns updater methods to each of its DagNodes.
 * - Modules are composed of DagNodes and possibly sub-modules.
 * - Derived DagModule classes define all their DagNodes and sub-modules in the constructor's
 *   invocation of (super(key, ...structure).
 * - Sub-modules are partial sub-graphs that also define all their own DagNodes via defineStructure(),
 *   but whose updater methods are assigned by a higher level Module so they may reference other DagNodes.
 *   Sub-modules are useful for repeated instances.
 */
export class DagModule extends Stem {
    // Full DagModules SHOULD override the assignStructure() method, 
    // but sub-modules are not required to override it.
    assignUpdaters() {}

    activeNodes() { return this.nodes().filter(node => node.status === DagNode.ACTIVE) }

    activeInputNodes() { return this.nodes().filter(node => node.isInput() && node.status !== DagNode.IGNORED) }

    inputNodes() { return this.nodes().filter(node => node.isInput()) }

    nodes() {
        const a = []
        return this._nodes(a)
    }        
    _nodes(a) {
        for(let key of Object.keys(this)) {
            const item = this[key]
            if(item.isLeaf()) a.push(item)
            else item._nodes(a)
        }
        return a
    }

    // MUST BE CALLED AFTER ALL CONFIGURATION IS COMPLETED
    // AND BEFORE ANY Node.select(), set(), get(), etc
    ready() {
        this.setConsumers()
        return this
    }

    // Sets all this module's DagNodes to IGNORED and DIRTY
    reset() { for(let key of Object.keys(this)) this[key].reset() }

    // Selects all the DagNodes for this module
    select() { for(let key of Object.keys(this)) this[key].select() }

    selectedNodes() { return this.nodes().filter(node => node.status === DagNode.SELECTED) }

    // Usually only called on the topmost Dag
    setConsumers() {
        const nodes = this.nodes()
        for(let node of nodes) node.consumers = []
        for(let node of nodes) node._notifySuppliers()
        for(let node of nodes) {
            const stack = []
            this._checkCyclicalSelfRef(node, node, stack)
        }
        return this
    }
    _checkCyclicalSelfRef(node, startNode, stack) {
        for(let supplier of node.suppliers) {
            if(supplier === startNode) {
                console.log(stack)
                throw new Error(`Cyclical dep found for node ${startNode.fullKey()}: check stack list above`)
            }
            stack.push(node.fullKey())
            this._checkCyclicalSelfRef(supplier, startNode, stack)
        }
        stack.pop()
    }

    getState() {
        const inputs = []
        for(let node of this.activeInputNodes()) inputs.push([node, node.value])
        return { inputs, selects: this.selectedNodes() }
    }
    
    setState(state) {
        const {inputs, selects} = state
        this.reset()
        for(let node of selects) node.select()
        for(let [node, value] of inputs) node.set(value)
    }

    sortNodes(nodes) { return nodes.sort((a, b) => a.fullKey().localeCompare(b.fullKey())) }
    
    // Traverses all Stems of a module and invokes 'method' on each Leaf.  Use as follows:
    //      function showName(node) { console.log('Node:', node)}
    //      mod.traverse(showName)
    traverse(method) {
        console.log(`traverse(${this.fullKey()}, ${method.name})`)
        for(let key of Object.keys(this)) {
            const item = this[key]
            if(item.isLeaf()) method.call(this, item.fullKey())
            else item.traverse(method)
        }
    }

    updateAll() {
        for (let node of this.selectedNodes()) node.get()
    }
}
