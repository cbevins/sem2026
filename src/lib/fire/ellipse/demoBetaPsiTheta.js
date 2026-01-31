import * as Compass from '../lib/CompassLib.js'
import * as Calc from '../lib/CalcLib.js'
import * as FE from '../lib/FireEllipseLib.js'
import * as Util from './utils.js'

//------------------------------------------------------------------------------
// Inputs
//------------------------------------------------------------------------------
const lwr = 3
const time = 1
const headNorth = 0
const headRos = 1
const betaNorth = 0
const psiNorth = 0
const thetaNorth = 0

//------------------------------------------------------------------------------
// Ellipse
//------------------------------------------------------------------------------
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

const e = {back, beta, eccent, f, g, h, head, length, lwr, time, width}
console.log('demo1.js run at', new Date)

// -----------------------------------------------------------------------------
// This section demonstrates the reciprocity of the beta-psi-theta functions.
//------------------------------------------------------------------------------

const betaTable = []
const psiTable= []
const thetaTable=[]
for(let deg=0; deg<360; deg+=0.5) {
    beta.angle.head = deg
    beta.vhr = FE.betaVhr(beta.angle.head, eccent)
    beta.ros = Calc.multiply(beta.vhr, head.ros)
    beta.dist = Calc.multiply(beta.vhr, head.dist)
    beta.psi = FE.psiFromBeta(beta.angle.head, f.vhr, g.vhr, h.vhr)
    beta.theta = FE.thetaFromBeta(beta.angle.head, f.vhr, g.vhr, h.vhr)
    beta.perim.head.x = FE.betaX(beta.angle.head, beta.dist)
    beta.perim.head.y = FE.betaY(beta.angle.head, beta.dist)

    psi.angle.head = deg
    psi.vhr = FE.psiVhr(psi.angle.head, f.vhr, g.vhr, h.vhr)
    psi.ros = Calc.multiply(psi.vhr, head.ros)
    psi.dist = Calc.multiply(psi.vhr, head.dist)
    psi.beta = FE.betaFromPsi(psi.angle.head, f.vhr, g.vhr, h.vhr)
    psi.theta = FE.thetaFromPsi(psi.angle.head, f.vhr, h.vhr)
    psi.perim.head.x = FE.betaX(psi.beta, beta.dist)
    psi.perim.head.y = FE.betaY(psi.beta, beta.dist)

    theta.angle.head = deg
    theta.vhr = FE.thetaVhr(theta.angle.head, f.vhr, h.vhr)
    theta.ros = Calc.multiply(theta.vhr, head.ros)
    theta.dist = Calc.multiply(theta.vhr, head.dist)
    theta.beta = FE.betaFromTheta(theta.angle.head, f.vhr, g.vhr, h.vhr)
    theta.psi = FE.psiFromTheta(theta.angle.head, f.vhr, h.vhr)
    theta.perim.head.x = FE.betaX(theta.angle.head, f.dist)
    theta.perim.head.y = FE.betaY(theta.angle.head, h.dist)

    // Ensure beta-psi-theta derivations are recipricol
    let psiFromBeta = FE.psiFromBeta(beta.angle.head, f.vhr, g.vhr, h.vhr)
    let betaFromPsi = FE.betaFromPsi(psiFromBeta, f.vhr, g.vhr, h.vhr)
    let thetaFromBeta = FE.thetaFromBeta(beta.angle.head, f.vhr, g.vhr, h.vhr)
    let betaFromTheta = FE.betaFromTheta(thetaFromBeta, f.vhr, g.vhr, h.vhr)
    betaTable.push([deg, beta.angle.head, psiFromBeta, betaFromPsi, thetaFromBeta, betaFromTheta])

    if(deg>=265 && deg <=275) {
        console.log('Beta', deg.toFixed(2), beta.angle.head.toFixed(2), psiFromBeta.toFixed(2),
            '>', betaFromPsi.toFixed(2), '<', thetaFromBeta.toFixed(2), betaFromTheta.toFixed(2))
    }
    betaFromPsi = FE.betaFromPsi(psi.angle.head, f.vhr, g.vhr, h.vhr)
    psiFromBeta = FE.psiFromBeta(betaFromPsi, f.vhr, g.vhr, h.vhr)
    let thetaFromPsi = FE.thetaFromPsi(psi.angle.head, f.vhr, h.vhr)
    let psiFromTheta = FE.psiFromTheta(thetaFromPsi, f.vhr, h.vhr)
    psiTable.push([deg, psi.angle.head, betaFromPsi, psiFromBeta, thetaFromPsi, psiFromTheta])

    betaFromTheta = FE.betaFromTheta(theta.angle.head, f.vhr, g.vhr, h.vhr)
    thetaFromBeta = FE.thetaFromBeta(betaFromTheta, f.vhr, g.vhr, h.vhr)
    psiFromTheta = FE.psiFromTheta(theta.angle.head, f.vhr, h.vhr)
    thetaFromPsi = FE.thetaFromPsi(psiFromTheta.head, f.vhr, h.vhr)
    thetaTable.push([deg, theta.angle.head, betaFromTheta, thetaFromBeta, psiFromTheta, thetaFromPsi])
}

let msg1 = ''
let msg2 = ''

console.log(`\nBeta Reciprocity Errors for INPUTS: lwr=${lwr}, headRos=${headRos}, headNorth=${headNorth}, time=${time}, `
    + `beta=${betaNorth}, psi=${psiNorth}, theta=${thetaNorth}`)
for(let [deg, beta, psiFromBeta, betaFromPsi, thetaFromBeta, betaFromTheta] of betaTable) {
    msg1 = `beta ${beta} => psi   ${psiFromBeta.toFixed(2)} => beta ${betaFromPsi.toFixed(2)}`
    if(Math.abs(beta-betaFromPsi)>0.1) console.log(msg1)
    msg2 = `beta ${beta} => theta ${thetaFromBeta.toFixed(2)} => beta ${betaFromTheta.toFixed(2)}`
    if(Math.abs(beta-betaFromTheta)>0.1) console.log(msg2)
}

console.log(`\nPsi Reciprocity Errors for INPUTS: lwr=${lwr}, headRos=${headRos}, headNorth=${headNorth}, time=${time}, `
    + `beta=${betaNorth}, psi=${psiNorth}, theta=${thetaNorth}`)
for(let [deg, psi, betaFromPsi, psiFromBeta, thetaFromPsi, psiFromTheta] of psiTable) {
    msg1 = `psi ${psi} => beta  ${betaFromPsi.toFixed(2)} => psi ${psiFromBeta.toFixed(2)}`
    if(Math.abs(psi-psiFromBeta)>0.1) console.log(msg1)
    msg2 = `psi ${psi} => theta ${thetaFromPsi.toFixed(2)} => psi ${psiFromTheta.toFixed(2)}`
    if(Math.abs(psi-psiFromTheta)>0.1) console.log(msg2)
}

console.log(`\nTheta Reciprocity Errors for INPUTS: lwr=${lwr}, headRos=${headRos}, headNorth=${headNorth}, time=${time}, `
    + `beta=${betaNorth}, psi=${psiNorth}, theta=${thetaNorth}`)
for(let [deg, theta, betaFromTheta, thetaFromBeta, psiFromTheta, thetaFromPsi] of psiTable) {
    msg1 = `theta ${theta} => beta ${betaFromTheta.toFixed(2)} => psi ${thetaFromBeta.toFixed(2)}`
    if(Math.abs(theta-thetaFromBeta)>0.1) console.log(msg1)
    msg2 = `theta ${theta} => psi  ${psiFromTheta.toFixed(2)} => psi ${thetaFromPsi.toFixed(2)}`
    if(Math.abs(theta-thetaFromPsi)>0.1) console.log(msg2)
}

//------------------------------------------------------------------------------
// Table of inputs
//------------------------------------------------------------------------------

const table1 = [['Prop', 'Vhr', 'RoS', 'Dist']]
function row1(label, item) {
    return [label, item.vhr.toFixed(4), item.ros.toFixed(2), item.dist.toFixed(2)]
}
table1.push(
    row1('head', head),
    row1('back', back),
    row1('length', length),
    row1('width', width),
    row1('f', f),
    row1('g', g),
    row1('h', h),
    row1('beta', beta),
    row1('psi', psi),
    row1('theta', theta))
// console.log(Util.table(table1))

//------------------------------------------------------------------------------
// This section demonstrates head.x, head.y and geo.x, geo.y
//------------------------------------------------------------------------------
function row2(label, item) {
    return [label, item.angle.north.toFixed(0), item.angle.head.toFixed(0),
        item.vhr.toFixed(4)]
}
const table2 = [['Angle','North', 'Head', 'Vhr']]
table2.push(
    row2('Head', head),
    row2('Beta', beta),
    row2('Psi', psi),
    row2('Theta', theta),
)
// console.log(Util.table(table2))