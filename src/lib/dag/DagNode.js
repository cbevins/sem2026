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

    static CLEAN = 'CLEAN'
    static DIRTY = 'DIRTY'

    static IGNORED = 'IGNORED'              // not in the computation chain
    static ACTIVE = 'ACTIVE'                // active but not selected or terminus
    static SELECTED ='SELECTED'             // active and selected but not a terminus
    static LASTSELECTED = 'LASTSELECTED'    // active, selected, and terminus of the chain

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

    //--------------------------------------------------------------------------
    // Functions called by client to set() and get() node values
    //--------------------------------------------------------------------------

    get() {
        if (!this.isSelected())
            throw new Error(`${this.fullKey()} is not a SELECTED DagNode and cannot be get()`)

        // If this DagNode is fixed, just return its value
        if (this.isInput() || this.isFixed()) return this.value
        // If this DagNode's value is clean, just return the value
        if (this.isClean()) return this.value
        // If this DagNode is linked to another, get() its value and return it
        if (this.isLinked()) return this.suppliers[0].value
        // Otherwise DagNode is dirty and has a method updater, so get its arguments
        const args = []
        for(let supplier of this.suppliers) args.push(supplier.get())
        this.value = this.updater.apply(this, args)
        // The DagNode is now CLEAN
        this.dirty = DagNode.CLEAN
        return value
    }

    isActive() { return this.status !== DagNode.IGNORED }
    isIgnored() { return this.status === DagNode.IGNORED }
    isSelected() { return this.status === DagNode.SELECTED || this.status === DagNode.LASTSELECTED }

    isClean() { return this.dirty === DagNode.CLEAN }
    isDirty() { return this.dirty === DagNode.DIRTY }
    
    isFixed() { return this.updater === DagNode._fixed }
    isInput() { return this.updater === DagNode._input }
    isLinked() { return this.updater === DagNode._linked }
    isMethod() { return this.isFixed() && !this.isLinked && ! this.isInput }

    set(value) {
        if (! this.isInput())
            throw new Error(`${this.fullKey()} is not an input and cannot be set()`)
        this.value = value
        this.setDirty()
    }
    setDirty(dirty=DagNode.DIRTY) {
        this.dirty = DagNode.DIRTY
        for(let consumer of this.consumers) consumer.setDirty(dirty)
    }
}

