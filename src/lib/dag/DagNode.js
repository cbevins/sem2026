import {Leaf} from '../stem-leaf/StemLeaf.js'

export class DagNode extends Leaf {
    constructor(key, value, units) {
        super(key)
        this.value = value
        this.units = units
        this.updater = DagNode._input
        this.consumers = []
        this.suppliers = []
        this.dirty = DagNode.DIRTY
        this.status = DagNode.IGNORED
    }

    // DagNode.dirty values
    static CLEAN = 'CLEAN'
    static DIRTY = 'DIRTY'
    // DagNode.status values
    static IGNORED  = 'IGNORED'     // not in the suppliers array of any SELECTED node
    static ACTIVE   = 'ACTIVE'      // in the suppliers array of at least one SELECTED node
    static SELECTED = 'SELECTED'    // a 'selected' node that is a supplier to at least one other selected node
    static LAST     = 'LAST'        // a 'selected' node that supplies no other selected nodes

    //--------------------------------------------------------------------------
    // Functions called by Module.init() for initial (default) configuration
    //--------------------------------------------------------------------------

    static _fixed() {}
    static _input() {}
    static _linked() {}

    link(linkNode) {
        if (linkNode === undefined)
            throw new Error(`Attempt to link() ${this.fullKey()} to an *unedfined* DagNode`)
        this.updater = DagNode._linked
        this.suppliers = [linkNode]
    }
    fix(value) {
        this.updater = DagNode._fixed
        this.value = value
    }
    input() {
        this.updater = DagNode._input
    }
    method(funcRef, ...args) {
        if (funcRef === undefined)
            throw new Error(`${this.fullKey()} method() is *undefined*`)
        this.updater = funcRef
        for(let i=0; i<args.length; i++) {
            if (args[i] === undefined)
                throw new Error(`${this.fullKey()} method() arg ${i} is an *undefined* DagNode`)
        }
        this.suppliers = args
    }
    // Returns an array of this node's supplier fullKeys
    supplierFullKeys() { return this.suppliers.map(node => node.fullKey()) }
    // Returns string representation of updater invocation
    updaterString() { return this.updater.name+'('+this.supplierFullKeys().join(', ')+')'}
    //--------------------------------------------------------------------------
    // Functions called by client to set() and get() node values
    //--------------------------------------------------------------------------
    
    get() {
        if (!this.status === DagNode.SELECTED)
            throw new Error(`${this.fullKey()} is not a SELECTED DagNode and cannot be get()`)
        return this._get()
    }
    _get() {
        // If this DagNode's value is clean, just return the value
        if (this.dirty === DagNode.CLEAN) return this.value
        // If this DagNode is input or fixed, just return its value
        if (this.isInput() || this.isFixed()) {
            this.dirty = DagNode.CLEAN
            return this.value
        }
        // If this DagNode is linked to another, get() the linked node's value and return it
        if (this.isLinked()) {
            this.value = this.suppliers[0]._get()
            this.dirty = DagNode.CLEAN
            return this.value
        }
        // Otherwise DagNode is DIRTY, so get its arguments and call its updater method
        const args = []
        for(let supplier of this.suppliers)
            args.push(supplier._get())      // this may recurse upstream
        this.value = this.updater.apply(this, args)
        this.dirty = DagNode.CLEAN
        return this.value
    }

    isFixed() { return this.updater === DagNode._fixed }
    isInput() { return this.updater === DagNode._input }
    isLinked() { return this.updater === DagNode._linked }
    isMethod() { return !this.isFixed() && !this.isLinked && ! this.isInput }

    /**
     * Notifies all *this* DagNode's suppliers that it is one of their consumers
     */
    _notifySuppliers() {
        // console.log(this.key, 'notifySuppliers...')
        for(let supplier of this.suppliers) {
            supplier.consumers.push(this)
        }
    }

    /**
     * The Dag can be envisioned as a series of waterfalls whose input nodes are at the topmost level.
     * The value ('water') of an input node flows down to lower nodes, and their
     * values flow down and are are consumed, in turn, by even lower nodes, and so forth.
     * Each node 'consumes' values from higher nodes, and 'supplies' values to lower nodes.
     * 
     * The Module constructor defines all its nodes with initial status of 'IGNORED'
     * and 'DIRTY', and with no consumer or supplier nodes.
     * 
     * The Module.init() and any subsequent configuration assigns each node with
     * an updater method and supplier nodes.
     * 
     * Finally, the Module.setConsumers() visits each node and adds itself to each
     * of its suppliers' consumers array.  We now have a Dag that can be traversed
     * from suppliers to consumers, or vice versa.
     * 
     * When select() is called on a node, it is set to 'SELECTED', and each of its
     * suppliers is visited.  If the supplier is 'IGNORED', it is set to 'ACTIVE',
     * and its suppliers are recursively visited.
     */
    select() {
        if (this.status === DagNode.SELECTED) return // nothing to do, already SELECTED
        if (this.status === DagNode.ACTIVE) {   // already active
            this.status = DagNode.SELECTED      // promote from ACTIVE to SELETED
            return                              // no need to propagate
        }
        // Otherwise, this.status === DagNode.IGNORED
        this.status = DagNode.SELECTED          // promote from IGNORED to SELETED
        for(let supplier of this.suppliers) {   // activate any IGNORED suppliers
            supplier._activate()
        }
    }
    _activate() {
        // no need to propagate is this node is already ACTIVE or SELECTED
        if (this.status === DagNode.IGNORED) {
            this.status = DagNode.ACTIVE
            for(let supplier of this.suppliers) {   // activate any IGNORED suppliers
                supplier._activate()
            }
        }
    }

    /**
     * Sets the node's value and propagates the DIRTY flag to all its consumers
     * @param {any} value 
     */
    set(value) {
        if (! this.isInput())
            throw new Error(`${this.fullKey()} is not an input and cannot be set()`)
        this.value = value
        this._setDirty()
    }
    _setDirty() {
        this.dirty = DagNode.DIRTY
        for(let consumer of this.consumers) consumer._setDirty()
    }
}
