import {DagNode} from '../dag/DagNode.js'
import * as U from './Units.js'

export class Bearing extends DagNode {
    constructor(value=0, units=U.compass) {
        super('bearing', value, units)
    }
}

// GeoRefMod
// export class GeoAngle extends DagNode {
//     constructor(value=0, units=U.compass) {
//         super('north', value, units)
//     }
// }

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

export class FireBearing extends DagNode {
    constructor(value=0, units=U.compass) {
        super('firebearing', value, units)
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
export class BetaAngle extends DagNode {
    constructor(value=0, units=U.compass) {
        super('beta', value, units)
    }
}

export class HeadAngle extends DagNode {
    constructor(value=0, units=U.compass) {
        super('angle', value, units)
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
export class PsiAngle extends DagNode {
    constructor(value=0, units=U.compass) {
        super('psi', value, units)
    }
}
export class ThetaAngle extends DagNode {
    constructor(value=0, units=U.compass) {
        super('theta', value, units)
    }
}
