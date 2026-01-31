import { Stem } from '../stem-leaf/StemLeaf.js'
import { DagNode } from './DagNode.js'

export class ExperimentalDag {
    constructor(rootModule) {
        this.root = rootModule
        this.nodes = rootModule.nodes()
    }
}
/**
 * DagModule is a specialized Stem for use with DagNode Leafs.
 * - The constructor must define all its sub Modules and DagNodes.
 * - The Module must be stand alone; i.e., all its inputs are defined as Leafs
 *      within the Module substructure, and it must not reference any external
 *      DagNodes (that is done later during configuration).
 * - The constructor must call init() to set all the DagNode initial updaters.
 * - The client may subsequently change DagNode updaters to, for example,
 *      link external Module DagNodes as input or use alternate computation methods.
 */
export class DagModule extends Stem {
    // Sets updaters and suppliers for all DagNodes
    init() {}

    activeNodes() {
        const a = []
        for(let node of this.nodes()) {
            if (node.status === DagNode.ACTIVE) a.push(node)
        }
        return a
    }

    activeInputNodes() {
        const a = []
        for(let node of this.nodes()) {
            if (node.isInput() && node.status === DagNode.ACTIVE) a.push(node)
        }
        return a
    }

    inputNodes() {
        const a = []
        for(let node of this.nodes()) {
            if (node.isInput()) a.push(node)
        }
        return a
    }

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

    selectedNodes() {
        const a = []
        for(let node of this.nodes()) {
            if (node.status === DagNode.SELECTED) a.push(node)
        }
        return a
    }

    // Usually only called on the topmost Dag
    setConsumers() {
        const nodes = this.nodes()
        for(let node of nodes) node.consumers = []
        for(let node of nodes) node._notifySuppliers()
    }

    updateAll() {
        for (let node of this.selectedNodes())
            node.get()
    }
}
