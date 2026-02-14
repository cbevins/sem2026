import {DagModule} from '../../index.js'
import * as Node from '../Nodes.js'
import * as FE from '../lib/FireEllipseLib.js'
import * as Calc from '../lib/CalcLib.js'
import * as Compass from '../lib/CompassLib.js'

//------------------------------------------------------------------------------
// Modules
//------------------------------------------------------------------------------

// Sub-module for referencing position relative to fire ellipse head and geographical north
export class PositionMod extends DagModule {
    constructor(key='position') {
        super(key, new Node.HeadX(), new Node.HeadY(), new Node.GeoEast(), new Node.GeoNorth())
    }
}

// Sub-module for referencing fire ellipse vectors and their associated fire behavior
export class FireVectorMod extends DagModule {
    constructor(key) {
        super(key,
            new Node.Bearing(),
            new Node.HeadAngle(),
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
        head.angle.fix(0)
        head.bearing.input()
        head.dist.method(Calc.multiply, head.ros, time)
        head.perim.east.method(Compass.rotateCw, head.perim.x, head.bearing)
        head.perim.north.method(Compass.rotateCw, head.perim.y, head.bearing)
        head.perim.x.link(head.dist)
        head.perim.y.link(ignition.y)
        head.ros.input()
        head.vhr.fix(1)     // head-to-head ratio is 1!
        head.beta.fix(0)
        head.psi.fix(0)
        head.theta.fix(0)

        // Back  vector is always 180 degrees from head
        back.angle.fix(180)
        back.bearing.method(Compass.opposite, head.bearing)
        back.beta.fix(180)
        back.psi.fix(180)
        back.theta.fix(180)
        back.vhr.method(FE.backVhr, eccent)

        center.x.method(FE.centerX, head.bearing, g.dist, ignition.x)
        center.y.method(FE.centerY, head.bearing, g.dist, ignition.y)

        ignition.east.input()
        ignition.north.input()
        // by definition the ignition pt is the origin of the ellipse's Cartesian coordinates
        ignition.x.fix(0)
        ignition.y.fix(0)

        length.vhr.method(Calc.sum, head.vhr, back.vhr)

        width.vhr.method(Calc.divide, length.vhr, lwr)
        // width.vhr.method(Calc.inverse, length.vhr)
        f.vhr.method(Calc.half, length.vhr)
        h.vhr.method(Calc.half, width.vhr)
        g.vhr.method(Calc.subtract, f.vhr, back.vhr)

        // Left flank vector is by definition ALWAYS 270 degrees clockwise from head
        left.angle.fix(270)
        left.bearing.method(Compass.rotateCw, left.angle, head.bearing)
        left.beta.method(FE.betaFromTheta, left.theta, f.vhr, g.vhr, h.vhr)
        left.psi.method(FE.psiFromTheta, left.theta, f.vhr, h.vhr)
        left.theta.fix(270)
        left.vhr.link(h.vhr)

        // Right flank vector is by definition ALWAYS 90 degrees clockwise from head
        right.angle.fix(90)
        right.bearing.method(Compass.rotateCw, right.angle, head.bearing)
        right.beta.method(FE.betaFromTheta, right.theta, f.vhr, g.vhr, h.vhr)
        right.psi.method(FE.psiFromTheta, right.theta, f.vhr, h.vhr)
        right.theta.fix(90)
        right.vhr.link(h.vhr)

        beta.vhr.method(FE.betaVhr, beta.angle, eccent)
        beta.perim.x.method(FE.betaX, beta.angle, beta.dist, head.bearing, ignition.x)
        beta.perim.y.method(FE.betaY, beta.angle, beta.dist, head.bearing, ignition.y)
        // psi.angle at perim pt intersected by beta.angle
        beta.psi.method(FE.psiFromBeta, beta.angle, f.vhr, g.vhr, h.vhr)
        // theta.angle at perim pt intersected by beta.angle
        beta.theta.method(FE.thetaFromBeta, beta.angle, f.vhr, g.vhr, h.vhr)
        // recipricol of beta.angle -> beta.psi -> beta.beta (first and last should be equal)
        beta.beta.method(FE.betaFromPsi, beta.psi, f.vhr, g.vhr, h.vhr)

        psi.vhr.method(FE.psiVhr, psi.angle, f.vhr, g.vhr, h.vhr)
        psi.perim.x.method(FE.psiX, psi.beta, eccent, head.dist, head.bearing, ignition.x)
        psi.perim.y.method(FE.psiY, psi.beta, eccent, head.dist, head.bearing, ignition.y)

        // beta.angle at perim pt with psi.angle
        psi.beta.method(FE.betaFromPsi, psi.angle, f.vhr, g.vhr, h.vhr)
        // recipricol of psi.angle -> psi.beta -> psi.psi (first and last should be equal)
        psi.psi.method(FE.psiFromBeta, psi.beta, f.vhr, g.vhr, h.vhr)
        // theta.angle at perim pt with psi.angle
        psi.theta.method(FE.thetaFromPsi, psi.angle, f.vhr, h.vhr)
        
        theta.vhr.method(FE.thetaVhr, theta.angle, f.vhr, h.vhr)
        theta.perim.x.method(FE.thetaX, theta.beta, eccent, head.dist, head.bearing, ignition.x)
        theta.perim.y.method(FE.thetaY, theta.beta, eccent, head.dist, head.bearing, ignition.y)
        // beta.angle at perim pt intersected by theta.angle
        theta.beta.method(FE.betaFromTheta, theta.angle, f.vhr, g.vhr, h.vhr)
        // psi.angle at perim pt intersected by theta.angle
        theta.psi.method(FE.psiFromTheta, theta.angle, f.vhr, h.vhr)
        // recipricol theta.angle -> theta.psi.head -> theta.theta (first should equal last)
        theta.theta.method(FE.thetaFromPsi, theta.psi, f.vhr, h.vhr)

        for(let prop of [back, beta, f, g, h, left, length, psi, right, theta, width]) {
            prop.ros.method(Calc.multiply, prop.vhr, head.ros)
            prop.dist.method(Calc.multiply, prop.ros, time)
        }
        time.input()

        if (configVector==='angle') this.configVectorInputFromHead()
        else this.configVectorInputFromNorth()
    }

    configVectorInputFromHead() {
        const {beta, head, psi, theta} = this

        // Input beta, psi, and theta from HEAD
        beta.angle.input()
        psi.angle.input()
        theta.angle.input()

        // Start at head from north and go clockwise to beta-psi-theta from head
        beta.bearing.method(Compass.rotateCw, head.bearing, beta.angle)
        psi.bearing.method(Compass.rotateCw, head.bearing, psi.angle)
        theta.bearing.method(Compass.rotateCw, head.bearing, theta.angle)
        return this
    }

    configVectorInputFromNorth() {
        const {beta, head, psi, theta} = this

        // Input beta, psi, and theta from NORTH
        beta.bearing.input()
        psi.bearing.input()
        theta.bearing.input()

        // Start at beta-psi-theta from north and go counter clockwise to head from north
        beta.angle.method(Compass.rotateCcw, beta.bearing, head.bearing)
        psi.angle.method(Compass.rotateCcw, psi.bearing, head.bearing)
        theta.angle.method(Compass.rotateCcw, theta.bearing, head.bearing)
        return this
    }
}
