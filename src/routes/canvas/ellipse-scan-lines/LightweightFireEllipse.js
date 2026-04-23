/**
 * Creates a lightweight fire ellipse object that is sequentially updatable.
 * 
 * Usage Sequence:
 * 1 call fireEllipse() to obtain a new fire ellipse object.
 * 2 call updateBehavior(ellipse, headRos lwr) whenever headRos or lwr changes,
 *      then call the following:
 * 3 call updateDistances(ellipse, duration) whenever 'duration' changes,
 *      then call the following:
 * 4 call updatePositions(ellipse, ignX, ignY, bearing) whenever the ignition point or bearing changes
 */
import * as FE from './LightweightFireEllipseEquations.js'

//------------------------------------------------------------------------------
// FireEllipse construction and update functions
//------------------------------------------------------------------------------

export function fireEllipse(headRos=1, lwr=1, duration=1, ignX=0, ignY=0, bearing=0) {
    const e = {}
    updateBehaviors(e, headRos, lwr)
    updateDistances(e, duration)
    updatePositions(e, ignX, ignY, bearing)
    return e
}

// Adds/updates basic axis & shape properties dependent upon headRos, lwr
export function updateBehaviors(e, headRos, lwr) {
    e.headRos = headRos
    e.lwr = lwr
    e.eccent = FE.eccent(e.lwr)
    e.backRos = FE.backRos(e.headRos, e.eccent)
    e.majorRos = FE.majorRos(e.headRos, e.backRos)
    e.minorRos = FE.minorRos(e.majorRos, e.lwr)
    e.fRos = FE.fRos(e.majorRos)
    e.gRos = FE.gRos(e.fRos, e.backRos)
    e.hRos = FE.hRos(e.minorRos)
    return e
}

// Adds/updates distance and size properties dependent upon duration
export function updateDistances(e, duration) {
    e.duration = duration
    e.headDist = FE.distance(e.headRos, e.duration)
    e.backDist = FE.distance(e.backRos, e.duration)
    e.fDist = FE.distance(e.fRos, e.duration)
    e.gDist = FE.distance(e.gRos, e.duration)
    e.hDist = FE.distance(e.hRos, e.duration)
    e.length = FE.distance(e.majorRos, e.duration)
    e.width = FE.distance(e.minorRos, e.duration)
    e.majorDist = e.length / 2
    e.minorDist = e.width / 2
    e.perim = FE.perimeterRamanujan(e.majorDist, e.minorDist)
    e.perimSimple = FE.perimeterSimpleApprox(e.majorDist, e.minorDist)
    e.perimNumInt = FE.perimeterNumericalIntegration(e.majorDist, e.minorDist, 10000)
    e.area = FE.area(e.length, e.width)
    return e
}

// Adds/updates ignition, center, head, and back positions
// dependent upon ignition point and bearing
export function updatePositions(e, ignX, ignY, bearing) {
    e.bearing = bearing
    e.ignX = ignX
    e.ignY = ignY
    e.headDeg = (450-e.bearing ) % 360      // rename to 'rotation' ?
    const radians = FE.radians(e.headDeg)
    e.cosRot = Math.cos(radians)
    e.sinRot = Math.sin(radians)
    e.cX = e.ignX + e.gDist * e.cosRot
    e.cY = e.ignY + e.gDist * e.sinRot
    e.headX = e.ignX + e.headDist * e.cosRot
    e.headY = e.ignY + e.headDist * e.sinRot
    e.backX = e.ignX + e.backDist * e.cosRot
    e.backY = e.ignY + e.backDist * e.sinRot
    return e
}

//------------------------------------------------------------------------------
// FireEllipse beta-theta-psi relationships
//------------------------------------------------------------------------------

// Sets the current betaDeg and updates the corresponding thetaDeg amd psiDeg
// and their related spread rates, distances, and perimeter points
export function ellipseBeta(e, betaDeg) {
    // Forward: betaDeg -> thetaDeg -> psiDeg -> psiRos
    e.betaDeg = betaDeg
    e.thetaDeg = FE.thetaFromBeta(e.betaDeg, e.fRos, e.gRos, e.hRos)
    e.psiDeg = FE.psiFromTheta(e.thetaDeg, e.fRos, e.hRos)

    // Reverse: psiDeg -> thetaDeg -> betaDeg
    // e.thetaFromPsi = FE.thetaFromPsi(e.psiDeg, e.fRos, e.hRos)
    // e.betaFromTheta = FE.betaFromTheta(e.thetaFromPsi, e.fRos, e.gRos, e.hRos)
    return updateAngles(e)
}

// Sets the current thetaDeg and updates the corresponding betaDeg and psiDeg
// and their related spread rates, distances, and perimeter points
export function ellipseTheta(e, thetaDeg) {
    e.thetaDeg = thetaDeg
    e.betaDeg = FE.betaFromTheta(e.thetaDeg, e.fRos, e.gRos, e.hRos)
    e.psiDeg = FE.psiFromTheta(e.thetaDeg, e.fRos, e.hRos)
    return updateAngles(e)
}

// Sets the current psiDeg and updates corresponding betaDeg amd thetaDeg
// and their related spread rates, distances, and perimeter points
export function ellipsePsi(e, psiDeg) {
    e.psiDeg = psiDeg
    e.thetaDeg = FE.thetaFromPsi(e.psiDeg, e.fRos, e.hRos)
    e.betaDeg = FE.betaFromTheta(e.thetaDeg, e.fRos, e.gRos, e.hRos)
    return updateAngles(e)
}

// Updates the ellipse orientation and related center and perimeter points
export function ellipseHeadDeg(e, headDeg) {
    e.headDeg = headDeg
    return updateAngles(e)
}

// Updates spread rates, distances, and perimeter points after an angle change
function updateAngles(e) {
    e.betaRos = FE.betaRos(e.headRos, e.lwr, e.betaDeg)
    e.betaDist = FE.distance(e.betaRos, e.duration)
    e.psiRos = FE.psiRos(e.psiDeg, e.fRos, e.gRos, e.hRos)
    e.psiDist = FE.distance(e.psiRos, e.duration)

    let [hx, hy] = FE.betaPerimeterPoint(0, e.headDist, e.ignX, e.ignY, e.headDeg)
    e.headX = hx
    e.headY = hy

    let [x,y] = FE.betaPerimeterPoint(e.betaDeg, e.betaDist, e.ignX, e.ignY, e.headDeg)
    e.betaX = x
    e.betaY = y
    // Common perimeter point at current beta-theta-psi angles
    e.perimX = x
    e.perimY = y

    let [tx,ty] = FE.thetaPerimeterPoint(e.thetaDeg, e.fDist, e.hDist, e.cX, e.cY, e.headDeg)
    e.thetaX = tx
    e.thetaY = ty

    e.subtendX = e.cX + e.fDist * Math.cos(FE.radians(e.thetaDeg+e.headDeg))
    e.subtendY = e.cY + e.fDist * Math.sin(FE.radians(e.thetaDeg+e.headDeg))
    return e
}

export function lwrFromWind(mph) { return 1 + 0.25 * mph }
export function windFromLwr(lwr) { return 4 * (lwr - 1) }
