import {Module} from '../Module.js'
import * as Node from '../Nodes.js'

//------------------------------------------------------------------------------
// Modules
//------------------------------------------------------------------------------

export class PointMod extends Module {
    constructor(key) {
        super(key, new Node.CoordE(), new Node.CoordN(), new Node.CoordX(), new Node.CoordY())
    }
}

export class FireVectorMod extends Module {
    constructor(key) {
        super(key,
            new Node.DegreesHead(),
            new Node.DegreesNorth(),
            new Node.FireVhr(),
            new Node.FireRos(),
            new Node.FireDist(),
            new PointMod('origin'),
            new PointMod('perim')
        )
    }
}

export class EllipseAxisMod extends Module {
    constructor(key) {
        super(key, new Node.FireVhr(), new Node.FireRos(), new Node.FireDist())
    }
}

export class FireEllipseMod extends Module {
    constructor(key, input={lwr: null, headRos:null, headDegNorth:null, time:null}) {
        super(key,
            new Node.FireLwr(),
            new Node.FireTime(),
            new EllipseAxisMod('length'),
            new EllipseAxisMod('width'),
            new EllipseAxisMod('majorRadius'),
            new EllipseAxisMod('minorRadius'),
            new PointMod('ignition'),      // actually, same e,n,x,y as beta vector origin point
            new PointMod('center'),        // actually, same e,n,x,y as theta vector origin point
            new FireVectorMod('head'),
            new FireVectorMod('back'),
            new FireVectorMod('right'),
            new FireVectorMod('left'),
            new FireVectorMod('beta'),
            new FireVectorMod('psi'),
            new FireVectorMod('theta'),
        )
        Object.defineProperty(this, 'input', {
            value: input,           // reference to this object's parent object
            enumerable: false,      // not visible to loops like for...in or to Object.keys()
            configurable: true,     // prevents propery deletion
            writable: true,         // *** must to be able to set this after instantiation
        })

    }
}
