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

    activeInputNodes() { return this.nodes().filter(node => node.isInput() && node.status === DagNode.ACTIVE) }

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

    selectedNodes() { return this.nodes().filter(node => node.status === DagNode.SELECTED) }

    // Usually only called on the topmost Dag
    setConsumers() {
        const nodes = this.nodes()
        for(let node of nodes) node.consumers = []
        for(let node of nodes) {
            node._notifySuppliers()
        }
    }

    updateAll() {
        for (let node of this.selectedNodes()) node.get()
    }
}
