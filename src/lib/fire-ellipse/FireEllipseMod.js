import {Stem} from '../stem-leaf/StemLeaf.js'
import * as Node from './Nodes.js'

//------------------------------------------------------------------------------
// Modules
//------------------------------------------------------------------------------

export class PointMod extends Stem {
    constructor(key) {
        super(key, new Node.CoordE(), new Node.CoordN(), new Node.CoordX(), new Node.CoordY())
    }
}

export class FireVectorMod extends Stem {
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

export class EllipseAxisMod extends Stem {
    constructor(key) {
        super(key, new Node.FireVhr(), new Node.FireRos(), new Node.FireDist())
    }
}

export class FireEllipseMod extends Stem {
    constructor(key) {
        super(key,
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
    }
}
