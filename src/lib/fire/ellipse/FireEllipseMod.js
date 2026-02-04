import {DagModule} from '../../index.js'
import * as Node from '../Nodes.js'
import * as FE from '../lib/FireEllipseLib.js'
import * as Calc from '../lib/CalcLib.js'
import * as Compass from '../lib/CompassLib.js'

//------------------------------------------------------------------------------
// Modules
//------------------------------------------------------------------------------

// Sub-module for referencing angles relative to fire ellipse head and geographical north
export class AngleMod extends DagModule {
    constructor(key='angle') {
        super(key, new Node.HeadAngle(), new Node.GeoAngle())
    }
}

// Sub-module for referencing x and y relative to the fire ellipse head
export class HeadPointMod extends DagModule {
    constructor(key='head') {
        super(key, new Node.HeadX(), new Node.HeadY())
    }
}

// Sub-module for referencing position realtive to geographical north
export class GeoPointMod extends DagModule {
    constructor(key='geo') {
        super(key, new Node.GeoEast(), new Node.GeoNorth())
    }
}

// Sub-module for referencing position relative to fire ellipse head and geographical north
export class PositionMod extends DagModule {
    constructor(key='position') {
        super(key, new HeadPointMod(), new GeoPointMod())
    }
}

// Sub-module for referencing fire ellipse vectors and their associated fire behavior
export class FireVectorMod extends DagModule {
    constructor(key) {
        super(key,
            new AngleMod('angle'),
            new Node.FireDist(),
            new Node.FireRos(),
            // new PositionMod('origin'),
            new PositionMod('perim'),
            new Node.FireVhr(),
            // Following only used by beta, psi, and theta
            new Node.BetaAngle(),
            new Node.PsiAngle(),
            new Node.ThetaAngle(),
        )
    }
}

// Sub-module used by FireEllipseMod
export class EllipseAxisMod extends DagModule {
    constructor(key) {
        super(key, new Node.FireVhr(), new Node.FireRos(), new Node.FireDist())
    }
}

export class FireEllipseMod extends DagModule {
    // configVector is 'head' or 'north'
    constructor(key, configVector) {
        super(key,
            // Ellipse length-to-width ratio(lwr >= 1)
            new Node.FireLwr(),
            // Ellipse eccentricity (0 <= e <1)
            new Node.FireEccent(),
            // Total elapsed time sing ignition
            new Node.FireTime(),
            new Node.FirePerimeter(),
            new Node.FireSize(),
            // Major axis
            new EllipseAxisMod('length'),
            // Minor axis
            new EllipseAxisMod('width'),
            // Major semi-axis (Catchpole's "f") ratio is half the total ellipse length
            new EllipseAxisMod('f'),
            // Major semi-axis segment (Catchole's "g") from ignition point to ellipse center
            new EllipseAxisMod('g'),
            // Minor semi-axis (Catchpole's "h") ratio is half the total ellipse width
            new EllipseAxisMod('h'),
            // Ignition point (and "beta" vector origin point)
            new PositionMod('ignition'),
            // Ellipse center point ("theta" vector origin point)
            new PositionMod('center'),
            // Major semi-axis segment from ignition point to ellipse head (Catchpole's g+f)
            new FireVectorMod('head'),
            // Major semi-axis segment from ignition point to ellipse back
            new FireVectorMod('back'),
            // Minor semi-axis segment from ellipse center to 90 degrees clockwise of ellipse head
            new FireVectorMod('right'),
            // Minor semi-axis segment from ellipse center to 270 degrees clockwise of ellipse head
            new FireVectorMod('left'),
            // Vector from ignition point to ellipse perimeter at some angle from the ellipse head
            new FireVectorMod('beta'),
            // Vector normal to tangent of ellipse perimeter at some angle from ellipse head
            new FireVectorMod('psi'),
            // Vector from ellipse center point to ellipse perimeter at some angle from ellipse head
            new FireVectorMod('theta'),
        )
        this.assignUpdaters(configVector)
    }

    assignUpdaters(configVector) {
        const {back, beta, center, eccent, f, g, h, head, ignition,
            left, length, lwr, perimeter, psi, right, size, theta, time, width} = this

        lwr.input()
        eccent.method(FE.eccentricity, lwr)
        size.method(FE.area, length.dist, width.dist)
        perimeter.method(FE.perimeterRamanujan, f.dist, h.dist)

        // Head vector is be definition ALWAYS at 0 degrees from head
        head.angle.head.fix(0)
        head.angle.north.input()
        head.dist.method(Calc.multiply, head.ros, time)
        head.perim.geo.east.method(Compass.rotateCw, head.perim.head.x, head.angle.north)
        head.perim.geo.north.method(Compass.rotateCw, head.perim.head.y, head.angle.north)
        head.perim.head.x.link(head.dist)
        head.perim.head.y.link(ignition.head.y)
        head.ros.input()
        head.vhr.fix(1)     // head-to-head ratio is 1!
        head.beta.fix(0)
        head.psi.fix(0)
        head.theta.fix(0)

        // Back  vector is always 180 degrees from head
        back.angle.head.fix(180)
        back.angle.north.method(Compass.opposite, head.angle.north)
        back.beta.fix(180)
        back.psi.fix(180)
        back.theta.fix(180)
        back.vhr.method(FE.backVhr, eccent)

        center.head.x.method(FE.centerX, head.angle.north, g.dist, ignition.head.x)
        center.head.y.method(FE.centerY, head.angle.north, g.dist, ignition.head.y)

        ignition.geo.east.input()
        ignition.geo.north.input()
        ignition.head.x.input()
        ignition.head.y.input()

        length.vhr.method(Calc.sum, head.vhr, back.vhr)

        width.vhr.method(Calc.divide, length.vhr, lwr)
        // width.vhr.method(Calc.inverse, length.vhr)
        f.vhr.method(Calc.half, length.vhr)
        h.vhr.method(Calc.half, width.vhr)
        g.vhr.method(Calc.subtract, f.vhr, back.vhr)

        // Left flank vector is by definition ALWAYS 270 degrees clockwise from head
        left.angle.head.fix(270)
        left.angle.north.method(Compass.rotateCw, left.angle.head, head.angle.north)
        left.beta.method(FE.betaFromTheta, left.theta, f.vhr, g.vhr, h.vhr)
        left.psi.method(FE.psiFromTheta, left.theta, f.vhr, h.vhr)
        left.theta.fix(270)
        left.vhr.link(h.vhr)

        // Right flank vector is by definition ALWAYS 90 degrees clockwise from head
        right.angle.head.fix(90)
        right.angle.north.method(Compass.rotateCw, right.angle.head, head.angle.north)
        right.beta.method(FE.betaFromTheta, right.theta, f.vhr, g.vhr, h.vhr)
        right.psi.method(FE.psiFromTheta, right.theta, f.vhr, h.vhr)
        right.theta.fix(90)
        right.vhr.link(h.vhr)

        beta.vhr.method(FE.betaVhr, beta.angle.head, eccent)
        beta.perim.head.x.method(FE.betaX, beta.angle.head, beta.dist, head.angle.north, ignition.head.x)
        beta.perim.head.y.method(FE.betaY, beta.angle.head, beta.dist, head.angle.north, ignition.head.y)
        // psi.angle.head at perim pt intersected by beta.angle.head
        beta.psi.method(FE.psiFromBeta, beta.angle.head, f.vhr, g.vhr, h.vhr)
        // theta.angle.head at perim pt intersected by beta.angle.head
        beta.theta.method(FE.thetaFromBeta, beta.angle.head, f.vhr, g.vhr, h.vhr)
        // recipricol of beta.angle.head -> beta.psi -> beta.beta (first and last should be equal)
        beta.beta.method(FE.betaFromPsi, beta.psi, f.vhr, g.vhr, h.vhr)

        psi.vhr.method(FE.psiVhr, psi.angle.head, f.vhr, g.vhr, h.vhr)
        psi.perim.head.x.method(FE.psiX, psi.beta, eccent, head.dist, head.angle.north, ignition.head.x)
        psi.perim.head.y.method(FE.psiY, psi.beta, eccent, head.dist, head.angle.north, ignition.head.y)

        // beta.angle.head at perim pt with psi.angle.head
        psi.beta.method(FE.betaFromPsi, psi.angle.head, f.vhr, g.vhr, h.vhr)
        // recipricol of psi.angle.head -> psi.beta -> psi.psi (first and last should be equal)
        psi.psi.method(FE.psiFromBeta, psi.beta, f.vhr, g.vhr, h.vhr)
        // theta.angle.head at perim pt with psi.angle.head
        psi.theta.method(FE.thetaFromPsi, psi.angle.head, f.vhr, h.vhr)
        
        theta.vhr.method(FE.thetaVhr, theta.angle.head, f.vhr, h.vhr)
        theta.perim.head.x.method(FE.thetaX, theta.beta, eccent, head.dist, head.angle.north, ignition.head.x)
        theta.perim.head.y.method(FE.thetaY, theta.beta, eccent, head.dist, head.angle.north, ignition.head.y)
        // beta.angle.head at perim pt intersected by theta.angle.head
        theta.beta.method(FE.betaFromTheta, theta.angle.head, f.vhr, g.vhr, h.vhr)
        // psi.angle.head at perim pt intersected by theta.angle.head
        theta.psi.method(FE.psiFromTheta, theta.angle.head, f.vhr, h.vhr)
        // recipricol theta.angle.head -> theta.psi.head -> theta.theta (first should equal last)
        theta.theta.method(FE.thetaFromPsi, theta.psi, f.vhr, h.vhr)

        for(let prop of [back, beta, f, g, h, left, length, psi, right, theta, width]) {
            prop.ros.method(Calc.multiply, prop.vhr, head.ros)
            prop.dist.method(Calc.multiply, prop.ros, time)
        }
        time.input()

        if (configVector==='head') this.configVectorInputFromHead()
        else this.configVectorInputFromNorth()
    }

    configVectorInputFromHead() {
        const {beta, head, psi, theta} = this

        // Input beta, psi, and theta from HEAD
        beta.angle.head.input()
        psi.angle.head.input()
        theta.angle.head.input()

        // Start at head from north and go clockwise to beta-psi-theta from head
        beta.angle.north.method(Compass.rotateCw, head.angle.north, beta.angle.head)
        psi.angle.north.method(Compass.rotateCw, head.angle.north, psi.angle.head)
        theta.angle.north.method(Compass.rotateCw, head.angle.north, theta.angle.head)
        return this
    }

    configVectorInputFromNorth() {
        const {beta, head, psi, theta} = this

        // Input beta, psi, and theta from NORTH
        beta.angle.north.input()
        psi.angle.north.input()
        theta.angle.north.input()

        // Start at beta-psi-theta from north and go counter clockwise to head from north
        beta.angle.head.method(Compass.rotateCcw, beta.angle.north, head.angle.north)
        psi.angle.head.method(Compass.rotateCcw, psi.angle.north, head.angle.north)
        theta.angle.head.method(Compass.rotateCcw, theta.angle.north, head.angle.north)
        return this
    }
}
