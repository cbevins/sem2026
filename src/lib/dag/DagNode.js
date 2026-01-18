import {Leaf} from '../stem-leaf/StemLeaf.js'

export class DagNode extends Leaf {
    constructor(key, value, units) {
        super(key)
        this.value = value
        this.units = units
        this.updater = DagNode._input
        this.producers = []
    }

    static _bind() {}
    static _input() {}
    static _constant() {}

    bind(node) {
        this.updater = DagNode._bind
        this.producers = [node]
    }
    constant(value) {
        this.updater = DagNode._constant
        this.value = value
    }
    input() {
        this.updater = DagNode._input
    }
    use(method, ...args) {
        this.updater = method
        this.producers = args
    }
}

