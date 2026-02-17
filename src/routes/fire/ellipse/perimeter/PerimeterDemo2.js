/**
 * Marshalls all the data required by Page1.svelte
 */
import {FireEllipseMod} from '$lib/fire/ellipse/FireEllipseMod.js'
import * as FE from '$lib/fire/lib/FireEllipseLib'
import { perimeterPoints } from './perimeterPoints.js'

export class PerimeterDemo2 {
    constructor(lwRatio=1, headRos=1, bearing=0, elapsed=1, src='angle') {
        this.bearing = bearing
        this.elapsed = elapsed
        this.headRos = headRos
        this.lwRatio = lwRatio
        this.src = 'angle'  // 'angle' or 'bearing'
        let e = new FireEllipseMod('e', src).ready()

        // Select required nodes
        for(let v of [e.beta, e.psi, e.theta]) {
            for(let node of [v.perim.x, v.perim.y, v.perim.east, v.perim.north,
                v.beta, v.psi, v.theta, v.vhr])
                node.select()
        }
        for(let node of [e.center.x, e.center.y, e.f.dist, e.h.dist, e.length.dist])
            node.select()

        // Set required inputs
        e.head.bearing.set(bearing)
        e.head.ros.set(headRos)
        e.lwr.set(lwRatio)
        e.time.set(elapsed)
        e.updateAll()
        this.ellipse = e
    }

    betaPerimeterPoints(degStep) {
        return perimeterPoints(this.ellipse, this.ellipse.beta, degStep, this.src)
    }

    psiPerimeterPoints(degStep) {
        return perimeterPoints(this.ellipse, this.ellipse.psi, degStep, this.src)
    }

    thetaPerimeterPoints(degStep) {
        return perimeterPoints(this.ellipse, this.ellipse.theta, degStep, this.src)
    }

    perimeterTable(majorSemi, minorSemi, degStep) {
        const betaPts = this.betaPerimeterPoints(degStep)
        const psiPts = this.psiPerimeterPoints(degStep)
        const thetaPts = this.thetaPerimeterPoints(degStep)
        let last = betaPts.length-1
        return ([
            [`${degStep}-deg beta intervals`, betaPts[last].arcleng],
            [`${degStep}-deg theta intervals`, thetaPts[last].arcleng],
            [`${degStep}-deg psi intervals`, psiPts[last].arcleng],
            ['10k numerical integration', FE.perimeterNumericalIntegration(majorSemi, minorSemi).toFixed(8)],
            ['Ramanujan method', FE.perimeterRamanujan(majorSemi, minorSemi).toFixed(8)],
            ['Simple Approximation', FE.perimeterSimpleApprox(majorSemi, minorSemi).toFixed(8)],
        ])
    }
}
