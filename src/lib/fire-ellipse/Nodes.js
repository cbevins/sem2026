import {Leaf} from '../stem-leaf/StemLeaf.js'
import * as U from './Units.js'

// DagNode
export class Node extends Leaf {
    constructor(key, value, units) {
        super(key)
        this.value = value
        this.units = units
    }
}

export class CoordE extends Node {
    constructor(value=0, units=U.coordinate) {
        super('e', value, units)
    }
}

export class CoordN extends Node {
    constructor(value=0, units=U.coordinate) {
        super('n', value, units)
    }
}

export class CoordX extends Node {
    constructor(value=0, units=U.coordinate) {
        super('x', value, units)
    }
}

export class CoordY extends Node {
    constructor(value=0, units=U.coordinate) {
        super('y', value, units)
    }
}

export class DegreesHead extends Node {
    constructor(value=0, units=U.compass) {
        super('degHead', value, units)
    }
}

export class DegreesNorth extends Node {
    constructor(value=0, units=U.compass) {
        super('degNorth', value, units)
    }
}

export class FireDist extends Node {
    constructor(value=0, units=U.fireDist) {
        super('dist', value, units)
    }
}

export class FireRos extends Node {
    constructor(value=0, units=U.fireRos) {
        super('ros', value, units)
    }
}

export class FireVhr extends Node {
    constructor(value=0, units=U.fireVhr) {
        super('vhr', value, units)
    }
}
