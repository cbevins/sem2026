import {Stem} from '../index.js'

/**
 * Module is a specialized Stem for use with DagNode Leafs.
 * - The constructor must declare all its sub Modules and DagNodes
 * - The Module must be stand alone; i.e., must not reference any external DagNodes
 *      (that is done later during configuration).
 * - All inputs must be declared as internal DagNodes.
 * - The constructor must call init() to set all DagNode updaters.
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
