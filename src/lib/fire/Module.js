import {Stem} from '../index.js'

/**
 * Module is a specialized Stem for use with DagNode Leafs.
 * - The constructor must define all its sub Modules and DagNodes.
 * - The Module must be stand alone; i.e., all its inputs are defined as Leafs
 *      within the Module substructure, and it must not reference any external
 *      DagNodes (that is done later during configuration).
 * - The constructor must call init() to set all the DagNode initial updaters.
 * - The client may subsequently change DagNode updaters to, for example,
 * link external Module DagNodes as input or use alternate computation methods.
 */
export class Module extends Stem {
    // Sets updaters for all DagNodes
    init() {}

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
}
