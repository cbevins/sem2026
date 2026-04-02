/**
 * Temporary functions to create and update a fire ellipse object
 * using the local FireEllipseEquations.js function library.
 * 
 * Use:
 * 1 fireEllipse() returns a new fire ellipse object.
 * 2 invoke ellipseSize() to update distance properties whenever the elapsed time changes
 * 3 invoke ellipseBeta() to update beta-theta-psi angles and points for a new beta angle
 */
import * as FE from './LightweightFireEllipseEquations.js'

//------------------------------------------------------------------------------
// FireEllipse construction and update functions
//------------------------------------------------------------------------------

export function LightweightFireEllipse(headRos=1, lwr=1, ignX=0, ignY=0, headDeg=0,
        minutes=1, betaDeg=0) {
    // Initialize all input parameters
    const e = {headRos, lwr, ignX, ignY, headDeg, minutes, betaDeg}
    ellipseShape(e)
    ellipseSize(e, e.minutes)
    ellipseBeta(e, e.betaDeg)
    return e
}

// Adds basic axis & shape properties
export function ellipseShape(e) {
    e.eccent = FE.eccent(e.lwr)
    e.backRos = FE.backRos(e.headRos, e.eccent)
    e.majorRos = FE.majorRos(e.headRos, e.backRos)
    e.minorRos = FE.minorRos(e.majorRos, e.lwr)
    e.fRos = FE.fRos(e.majorRos)
    e.gRos = FE.gRos(e.fRos, e.backRos)
    e.hRos = FE.hRos(e.minorRos)
    return e
}

// Updates all size properties, which depend upon elapsed time
export function ellipseSize(e, minutes) {
    e.minutes = minutes
    e.headDist = FE.distance(e.headRos, e.minutes)
    e.backDist = FE.distance(e.backRos, e.minutes)
    e.fDist = FE.distance(e.fRos, e.minutes)
    e.gDist = FE.distance(e.gRos, e.minutes)
    e.hDist = FE.distance(e.hRos, e.minutes)
    e.length = FE.distance(e.majorRos, e.minutes)
    e.width = FE.distance(e.minorRos, e.minutes)
    e.majorDist = e.length / 2
    e.minorDist = e.width / 2
    e.perimR = FE.perimeterRamanujan(e.length/2, e.width/2)
    e.perimS = FE.perimeterSimpleApprox(e.length/2, e.width/2)
    e.perimN = FE.perimeterNumericalIntegration(e.length/2, e.width/2, 10000)
    e.area = FE.area(e.length, e.width)
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
    e.betaDist = FE.distance(e.betaRos, e.minutes)
    e.psiRos = FE.psiRos(e.psiDeg, e.fRos, e.gRos, e.hRos)
    e.psiDist = FE.distance(e.psiRos, e.minutes)

    const head = FE.radians(e.headDeg)
    e.cX = e.ignX + e.gDist * Math.cos(head)
    e.cY = e.ignY + e.gDist * Math.sin(head)

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
