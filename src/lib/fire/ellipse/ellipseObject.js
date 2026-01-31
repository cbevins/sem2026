import * as Compass from '../lib/CompassLib.js'
import * as Calc from '../lib/CalcLib.js'
import * as FE from '../lib/FireEllipseLib.js'

export function getEllipseObject(lwr=3, headRos=1, headNorth=0, time=1, betaNorth=0, thetaNorth=0, psiNorth=0) {
    const eccent = FE.eccentricity(lwr)
    const ignition = {head: {x: 0, y: 0}}
    const head = {
        angle: {head: 0, north: headNorth},
        dist: Calc.multiply(headRos, time),
        ros: headRos,
        vhr: 1
    }

    const back = {
        angle: {
            head: 180,
            north: Compass.opposite(head.angle.north)
        },
        vhr: FE.backVhr(eccent)
    }

    const length = {vhr: Calc.sum(head.vhr, back.vhr)}
    const width = {vhr: Calc.divide(length.vhr, lwr)}
    const f = {vhr: Calc.half(length.vhr)}
    const g = {vhr: Calc.subtract(f.vhr, back.vhr)}
    const h = {vhr: Calc.half(width.vhr)}

    const beta = {angle: {north: betaNorth}}
    beta.angle.head = Compass.rotateCcw(beta.angle.north, head.angle.north)
    beta.vhr = FE.betaVhr(beta.angle.head, eccent)

    const psi = {angle: {north: psiNorth}}
    psi.angle.head = Compass.rotateCcw(psi.angle.north, head.angle.north)
    psi.vhr = FE.psiVhr(psi.angle.head, f.vhr, g.vhr, h.vhr)

    const theta = {angle: {north: thetaNorth}}
    theta.angle.head = Compass.rotateCcw(theta.angle.north, head.angle.north)
    theta.vhr = FE.thetaVhr(theta.angle.head, f.vhr, h.vhr)

    for(let prop of [back, beta, f, g, h, length, psi, theta, width]) {
        prop.ros = Calc.multiply(prop.vhr, head.ros)
        prop.dist = Calc.multiply(prop.vhr, head.dist)
    }

    beta.psi = FE.psiFromBeta(beta.angle.head, f.vhr, g.vhr, h.vhr)
    beta.theta = FE.thetaFromBeta(beta.angle.head, f.vhr, g.vhr, h.vhr)
    psi.beta = FE.betaFromPsi(psi.angle.head, f.vhr, g.vhr, h.vhr)
    psi.theta = FE.thetaFromPsi(psi.angle.head, f.vhr, h.vhr)
    theta.beta = FE.betaFromTheta(theta.angle.head, f.vhr, g.vhr, h.vhr)
    theta.psi = FE.psiFromTheta(theta.angle.head, f.vhr, h.vhr)

    beta.perim = {
        head: {
            x: FE.betaX(beta.angle.head, beta.dist),
            y: FE.betaY(beta.angle.head, beta.dist)
        }
    }

    psi.perim = {
        head: {
            x: FE.betaX(psi.beta, beta.dist),
            y: FE.betaY(psi.beta, beta.dist)
        }
    }

    theta.perim = {
        head: {
            x: FE.betaX(theta.angle.head, f.dist),
            y: FE.betaY(theta.angle.head, h.dist)
        }
    }

    const e = {back, beta, eccent, f, g, h, head, length, lwr, psi, theta, time, width}
    return e
}

