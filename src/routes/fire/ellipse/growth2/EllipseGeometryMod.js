import {DagModule} from '$lib/index.js'
import * as Node from '$lib/fire/Nodes.js'
import * as FE from '$lib/fire/lib/FireEllipseLib.js'
import * as Calc from '$lib/fire/lib/CalcLib.js'
import * as Compass from '$lib/fire/lib/CompassLib.js'

//------------------------------------------------------------------------------
// Modules
//------------------------------------------------------------------------------

// Sub-module for referencing position relative to fire ellipse head and geographical north
export class PointMod extends DagModule {
    constructor(key='position') {
        super(key,
            new Node.HeadX(),
            new Node.HeadY(),
            new Node.GeoEast(),
            new Node.GeoNorth())
    }
}

// Sub-module used by FireEllipseMod
export class EllipseAxisMod extends DagModule {
    constructor(key) {
        super(key,
            new Node.FireVhr(),
            new Node.FireRos(),
            new Node.FireDist()
        )
    }
}

export class EllipseGeometryMod extends DagModule {
    // configVector is 'head' or 'north'
    constructor(key) {
        super(key,
            // INPUTS
            // Ellipse length-to-width ratio(lwr >= 1)
            new Node.FireLwr(),
            // Fire head bearing
            new Node.Bearing(),
            // Head fire spread rate
            new Node.FireRos(),
            // Total elapsed time since ignition
            new Node.FireTime(),

            // Ellipse eccentricity (0 <= e <1)
            new Node.FireEccent(),
            // Ellipse total length
            new EllipseAxisMod('major'),
            // Ellipse total width
            new EllipseAxisMod('minor'),
            // Backing portion of major axis
            new EllipseAxisMod('back'),
            // Heading portion of major axis (f+g)
            new EllipseAxisMod('head'),
            // Center-to-head portion of major axis (Catchpole's 'f')
            new EllipseAxisMod('f'),
            // Ignition-to-center portion of major axis (Catchpole's 'g')
            new EllipseAxisMod('g'),
            // Flanking portion of minor axis (Catchpole's 'h')
            new EllipseAxisMod('h'),
            // Ignition point (and "beta" vector origin point)
            new PointMod('ignition'),
            // Ellipse center point ("theta" vector origin point)
            new PointMod('center'),
        )
        this.assignUpdaters()
    }
    
    assignUpdaters() {
        const {back, bearing, center, eccent, f, g, h, head, ignition,
            lwr, major, minor, time} = this
            
        lwr.input()
        bearing.input()
            
        major.vhr.fix(1)
        minor.vhr.method(Calc.inverse, lwr)
        eccent.method(FE.eccentricity, lwr)
        back.vhr.method(FE.backVhr, eccent)
        head.vhr.method(Calc.subtract, major.vhr, back.vhr)
        f.vhr.method(Calc.half, major.vhr)
        g.vhr.method(Calc.subtract, f.vhr, back.vhr)
        h.vhr.method(Calc.half, minor.vhr)

        head.ros.link(this.ros)
        back.ros.method(FE.backRos, head.ros, eccent)
        major.ros.method(Calc.sum, head.ros, back.ros)
        for(let node of [f, g, h, minor])
            node.ros.method(Calc.multiply, node.vhr, major.ros)

        for(let node of [back, f, g, h, major, minor])
            node.dist.method(Calc.multiply, node.ros, time)

        ignition.x.fix(0)
        ignition.y.fix(0)
    }
}
