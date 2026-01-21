import * as Compass from '../lib/CompassLib.js'
import * as Calc from '../lib/CalcLib.js'
import * as FE from '../lib/FireEllipseLib.js'
import * as Util from './utils.js'

const lwr = 1
const time = 1
const headNorth = 0
const headRos = 1
const betaNorth = 0
const psiNorth = 0
const thetaNorth = 0

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
beta.angle.head = Compass.counter(beta.angle.north, head.angle.north)
beta.vhr = FE.betaVhr(beta.angle.head, eccent)

const psi = {angle: {north: psiNorth}}
psi.angle.head = Compass.counter(psi.angle.north, head.angle.north)
psi.vhr = FE.psiVhr(psi.angle.head, f.vhr, g.vhr, h.vhr)

const theta = {angle: {north: thetaNorth}}
theta.angle.head = Compass.counter(theta.angle.north, head.angle.north)
theta.vhr = FE.thetaVhr(theta.angle.head, f.vhr, h.vhr)

for(let prop of [back, beta, f, g, h, length, psi, theta, width]) {
    prop.ros = Calc.multiply(prop.vhr, head.ros)
    prop.dist = Calc.multiply(prop.vhr, head.dist)
}

beta.perim = {
    head: {
        x: Calc.multiply(beta.dist, beta.angle.cos),
        y: Calc.multiply(beta.dist, beta.angle.sin)
    }
}

const e = {back, beta, eccent, f, g, h, head, length, lwr, time, width}

//------------------------------------------------------------------------------
console.log('demo1.js run at', new Date)
console.log(`INPUTS: lwr=${lwr}, headRos=${headRos}, headNorth=${headNorth}, time=${time}, `
    + `beta=${betaNorth}, psi=${psiNorth}, theta=${thetaNorth}`)

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
console.log(Util.table(table1))

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
console.log(Util.table(table2))