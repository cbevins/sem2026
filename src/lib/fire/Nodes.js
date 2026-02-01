import {DagNode} from '../index.js'
import * as U from './Units.js'

// GeoRefMod
export class GeoAngle extends DagNode {
    constructor(value=0, units=U.compass) {
        super('north', value, units)
    }
}

export class GeoEast extends DagNode {
    constructor(value=0, units=U.geoCoord) {
        super('east', value, units)
    }
}

export class GeoNorth extends DagNode {
    constructor(value=0, units=U.geoCoord) {
        super('north', value, units)
    }
}

export class FireDist extends DagNode {
    constructor(value=0, units=U.fireDist) {
        super('dist', value, units)
    }
}

export class FireEccent extends DagNode {
    constructor(value=0, units=U.fireEccent) {
        super('eccent', value, units)
    }
}

export class FireLwr extends DagNode {
    constructor(value=1, units=U.fireLwr) {
        super('lwr', value, units)
    }
}

export class FirePerimeter extends DagNode {
    constructor(value=0, units=U.fireDist) {
        super('perimeter', value, units)
    }
}

export class FireRos extends DagNode {
    constructor(value=0, units=U.fireRos) {
        super('ros', value, units)
    }
}

export class FireSize extends DagNode {
    constructor(value=0, units=U.fireSize) {
        super('size', value, units)
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

// HeadRefMod
export class HeadAngle extends DagNode {
    constructor(value=0, units=U.compass) {
        super('head', value, units)
    }
}

export class HeadX extends DagNode {
    constructor(value=0, units=U.fireCoord) {
        super('x', value, units)
    }
}

export class HeadY extends DagNode {
    constructor(value=0, units=U.fireCoord) {
        super('y', value, units)
    }
}
