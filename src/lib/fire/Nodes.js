import {DagNode} from '../index.js'
import * as U from './Units.js'

export class CoordE extends DagNode {
    constructor(value=0, units=U.geocoord) {
        super('e', value, units)
    }
}

export class CoordN extends DagNode {
    constructor(value=0, units=U.geocoord) {
        super('n', value, units)
    }
}

export class CoordX extends DagNode {
    constructor(value=0, units=U.geocoord) {
        super('x', value, units)
    }
}

export class CoordY extends DagNode {
    constructor(value=0, units=U.geocoord) {
        super('y', value, units)
    }
}

export class DegreesHead extends DagNode {
    constructor(value=0, units=U.compass) {
        super('degHead', value, units)
    }
}

export class DegreesNorth extends DagNode {
    constructor(value=0, units=U.compass) {
        super('degNorth', value, units)
    }
}

export class FireDist extends DagNode {
    constructor(value=0, units=U.fireDist) {
        super('dist', value, units)
    }
}

export class FireLwr extends DagNode {
    constructor(value=1, units=U.fireLwr) {
        super('lwr', value, units)
    }
}

export class FireRos extends DagNode {
    constructor(value=0, units=U.fireRos) {
        super('ros', value, units)
    }
}

export class FireTime extends DagNode {
    constructor(value=0, units=U.fireTime) {
        super('time', value, units)
    }
}

export class FireVhr extends DagNode {
    constructor(value=0, units=U.fireVhr) {
        super('vhr', value, units)
    }
}
