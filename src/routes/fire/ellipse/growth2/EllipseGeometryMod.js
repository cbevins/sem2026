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
// Adds a PointMod toan EllipseSxis Mod
export class EllipseVectorMod extends DagModule {
    constructor(key) {
        super(key,
            new Node.FireVhr(),
            new Node.FireRos(),
            new Node.FireDist(),
            new Node.HeadX(),
            new Node.HeadY(),
            new Node.GeoEast(),
            new Node.GeoNorth(),
            new Node.Bearing(),
            new Node.HeadAngle(),
            // Following only used by beta, psi, and theta
            new Node.BetaAngle(),
            new Node.PsiAngle(),
            new Node.ThetaAngle(),
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
            new EllipseVectorMod('back'),
            // Heading portion of major axis (f+g)
            new EllipseVectorMod('head'),
            // Center-to-head portion of major axis (Catchpole's 'f')
            new EllipseVectorMod('f'),
            // Ignition-to-center portion of major axis (Catchpole's 'g')
            new EllipseVectorMod('g'),
            // Flanking portion of minor axis (Catchpole's 'h')
            new EllipseVectorMod('h'),
            // Ignition point (and "beta" vector origin point)
            new PointMod('ignition'),
            // Ellipse center point ("theta" vector origin point)
            new PointMod('center'),
            // Vector from ignition point to ellipse perimeter at some angle from the ellipse head
            new EllipseVectorMod('beta'),
            // Vector normal to tangent of ellipse perimeter at some angle from ellipse head
            new EllipseVectorMod('psi'),
            // Vector from ellipse center point to ellipse perimeter at some angle from ellipse head
            new EllipseVectorMod('theta'),
        )
        this.assignUpdaters()
    }
    
    assignUpdaters() {
        const {back, bearing, beta, center, eccent, f, g, h, head, ignition,
            lwr, major, minor, psi, theta, time} = this
            
        lwr.input()
        bearing.input()
        eccent.method(FE.eccentricity, lwr)
        head.bearing.link(bearing)
        head.vhr.fix(1)
        
        back.vhr.method(FE.backVhr, eccent)
        major.vhr.method(Calc.sum, head.vhr, back.vhr)
        minor.vhr.method(Calc.divide, major.vhr, lwr)
        f.vhr.method(Calc.half, major.vhr)
        h.vhr.method(Calc.half, minor.vhr)
        g.vhr.method(Calc.subtract, f.vhr, back.vhr)

        head.ros.link(this.ros)
        back.ros.method(FE.backRos, head.ros, eccent)
        major.ros.method(Calc.sum, head.ros, back.ros)
        for(let node of [beta, f, g, h, minor, psi, theta])
            node.ros.method(Calc.multiply, node.vhr, head.ros)

        for(let node of [back, beta, f, g, h, head, major, minor, psi, theta])
            node.dist.method(Calc.multiply, node.ros, time)

        ignition.x.fix(0)
        ignition.y.fix(0)
        
        head.x.method(Calc.sum, ignition.x, head.dist)
        head.y.fix(0)

        back.x.method(Calc.subtract, ignition.x, back.dist)
        back.y.fix(0)

        center.x.method(Calc.sum, ignition.x, g.dist)
        center.y.fix(0)

        beta.angle.input()
        beta.bearing.method(Compass.rotateCw, head.bearing, beta.angle)
        beta.vhr.method(FE.betaVhr, beta.angle, eccent)
        beta.east.method(FE.betaE, beta.angle, beta.dist, head.bearing, ignition.east)
        beta.north.method(FE.betaN, beta.angle, beta.dist, head.bearing, ignition.east)
        beta.x.method(FE.betaX, beta.angle, beta.dist, head.bearing, ignition.x)
        beta.y.method(FE.betaY, beta.angle, beta.dist, head.bearing, ignition.y)
        // psi.angle at perim pt intersected by beta.angle
        beta.psi.method(FE.psiFromBeta, beta.angle, f.vhr, g.vhr, h.vhr)
        // theta.angle at perim pt intersected by beta.angle
        beta.theta.method(FE.thetaFromBeta, beta.angle, f.vhr, g.vhr, h.vhr)
        // recipricol of beta.angle -> beta.psi -> beta.beta (first and last should be equal)
        beta.beta.method(FE.betaFromPsi, beta.psi, f.vhr, g.vhr, h.vhr)

        psi.vhr.method(FE.psiVhr, psi.angle, f.vhr, g.vhr, h.vhr)
        psi.east.method(FE.psiE, psi.beta, eccent, head.dist, head.bearing, ignition.east)
        psi.north.method(FE.psiN, psi.beta, eccent, head.dist, head.bearing, ignition.north)
        psi.x.method(FE.psiX, psi.beta, eccent, head.dist, head.bearing, ignition.x)
        psi.y.method(FE.psiY, psi.beta, eccent, head.dist, head.bearing, ignition.y)
        // beta.angle at perim pt with psi.angle
        psi.beta.method(FE.betaFromPsi, psi.angle, f.vhr, g.vhr, h.vhr)
        // recipricol of psi.angle -> psi.beta -> psi.psi (first and last should be equal)
        psi.psi.method(FE.psiFromBeta, psi.beta, f.vhr, g.vhr, h.vhr)
        // theta.angle at perim pt with psi.angle
        psi.theta.method(FE.thetaFromPsi, psi.angle, f.vhr, h.vhr)
        
        theta.angle.input()
        theta.bearing.method(Compass.rotateCw, bearing, theta.angle)
        theta.vhr.method(FE.thetaVhr, theta.angle, f.vhr, h.vhr)
        theta.east.method(FE.thetaE, theta.beta, eccent, head.dist, head.bearing, ignition.east)
        theta.north.method(FE.thetaN, theta.beta, eccent, head.dist, head.bearing, ignition.north)
        theta.x.method(FE.thetaX, theta.beta, eccent, head.dist, head.bearing, ignition.x)
        theta.y.method(FE.thetaY, theta.beta, eccent, head.dist, head.bearing, ignition.y)
        
        // beta.angle at perim pt intersected by theta.angle
        theta.beta.method(FE.betaFromTheta, theta.angle, f.vhr, g.vhr, h.vhr)
        // psi.angle at perim pt intersected by theta.angle
        theta.psi.method(FE.psiFromTheta, theta.angle, f.vhr, h.vhr)
        // recipricol theta.angle -> theta.psi.head -> theta.theta (first should equal last)
        theta.theta.method(FE.thetaFromPsi, theta.psi, f.vhr, h.vhr)
        // psi.bearing.method(Compass.rotateCw, head.bearing, psi.angle)
        theta.bearing.method(Compass.rotateCw, head.bearing, theta.angle)
    }
}
