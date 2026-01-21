import {Module} from '../Module.js'
import * as Node from '../Nodes.js'
import * as FE from '../lib/FireEllipseLib.js'
import * as Calc from '../lib/CalcLib.js'
import * as Compass from '../lib/CompassLib.js'

//------------------------------------------------------------------------------
// Modules
//------------------------------------------------------------------------------

// Sub-module for referencing angles relative to fire ellipse head and geographical north
export class AngleMod extends Module {
    constructor(key='angle') {
        super(key, new Node.HeadAngle(), new Node.GeoAngle())
    }
}

// Sub-module for referencing x and y relative to the fire ellipse head
export class HeadPointMod extends Module {
    constructor(key='head') {
        super(key, new Node.HeadX(), new Node.HeadY())
    }
}

// Sub-module for referencing position realtive to geographical north
export class GeoPointMod extends Module {
    constructor(key='geo') {
        super(key, new Node.GeoEast(), new Node.GeoNorth())
    }
}

// Sub-module for referencing position relative to fire ellipse head and geographical north
export class PositionMod extends Module {
    constructor(key='position') {
        super(key, new HeadPointMod(), new GeoPointMod())
    }
}

// Sub-module for referencing fire ellipse vectors and their associated fire behavior
export class FireVectorMod extends Module {
    constructor(key) {
        super(key,
            new AngleMod('angle'),
            new Node.FireDist(),
            new Node.FireRos(),
            // new PositionMod('origin'),
            new PositionMod('perim'),
            new Node.FireVhr(),
        )
    }
}

// Sub-module used by FireEllipseMod
export class EllipseAxisMod extends Module {
    constructor(key) {
        super(key, new Node.FireVhr(), new Node.FireRos(), new Node.FireDist())
    }
}

export class FireEllipseMod extends Module {
    constructor(key, input={lwr: null, headRos:null, headDegNorth:null, time:null}) {
        super(key,
            new Node.FireLwr(),
            new Node.FireEccent(),
            new Node.FireTime(),
            new EllipseAxisMod('length'),
            new EllipseAxisMod('width'),
            new EllipseAxisMod('f'),            // major axis radius
            new EllipseAxisMod('g'),            // ignition-to-center
            new EllipseAxisMod('h'),            // minor axis radius
            new PositionMod('ignition'),        // actually, same e,n,x,y as beta vector origin point
            new PositionMod('center'),          // actually, same e,n,x,y as theta vector origin point
            new FireVectorMod('head'),
            new FireVectorMod('back'),
            new FireVectorMod('right'),
            new FireVectorMod('left'),
            new FireVectorMod('beta'),
            new FireVectorMod('psi'),
            new FireVectorMod('theta'),
        )
        this.init()
    }
    init() {
        const {back, beta, eccent, f, g, h, head, ignition, length, lwr,
            psi, theta, time, width} = this
        lwr.input()
        eccent.method(FE.eccentricity, lwr)

        head.angle.head.fix(0)
        head.angle.north.input()
        head.dist.method(Calc.multiply, head.ros, time)
        head.ros.input()
        // head.origin.head.x.link(ignition.head.x)
        // head.origin.head.y.link(ignition.head.y)
        // head.origin.geo.east.link(ignition.geo.east)
        // head.origin.geo.north.link(ignition.geo.north)
        head.perim.head.x.link(head.dist)
        head.perim.head.y.link(ignition.head.y)
        head.vhr.fix(1)     // head-to-head ratio is 1!

    
        back.angle.head.fix(180)
        back.angle.north.method(Compass.opposite, head.angle.north)
        back.dist.method(Calc.multiply, back.ros, time)
        back.ros.method(Calc.multiply, back.vhr, head.ros)
        back.vhr.method(FE.backVhr, eccent)

        length.vhr.method(Calc.sum, head.vhr, back.vhr)
        width.vhr.method(Calc.inverse, length.vhr)
        f.vhr.method(Calc.half, length.vhr)
        h.vhr.method(Calc.half, width.vhr)
        g.vhr.method(Calc.sub, f.vhr, back.vhr)

        beta.angle.north.input()
        beta.angle.head.method(Compass.counter(beta.angle.north, head.angle.north))
        beta.dist.method(Calc.multiply, beta.ros, time)
        beta.ros.method(Calc.multiply, beta.vhr, head.ros)
        beta.vhr.method(FE.betaVhr, beta.angle.head, eccent)
    
        ignition.geo.east.input()
        ignition.geo.north.input()
        ignition.head.x.fix(0)
        ignition.head.y.fix(0)

        time.input()
    }
}
