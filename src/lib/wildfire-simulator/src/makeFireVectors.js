import { calcBetaFromTheta, calcPsiFromTheta, calcThetaFromBeta, toRadians } from './ellipseAngles.js'

//------------------------------------------------------------------------------
// Support functions
//------------------------------------------------------------------------------

// 'bearing' is always degrees clockwise from north
// 'vectorBearing' is degrees clockwise from fire head
export function bearingToClockwiseFromHead(vectorBearing, headBearing) {
    return (360 + vectorBearing - headBearing) % 360
}

// 'headBearing' is degrees clockwise from north
// 'clockwiseFromHead' is the vector degrees clockwise from the fire head
export function clockwiseFromHeadToBearing(clockwiseFromHead, headBearing) {
    return (360 + headBearing + clockwiseFromHead) % 360
}

// 'rotation' is always degrees counter-clockwise from fire head
export function clockwiseFromHeadToRotation(clockwiseFromHead) {
    return (360 - clockwiseFromHead) % 360
}

// 'fli' is the fireline intensity (BTU/ft/s)
// Returns flame length (ft)
export function getFlameLength(fli) {
    return (fli > 0) ? 0.45 * fli**0.46 : 0
}

// 'fli' is the fireline intensity (BTU/ft/s)
// 'airTemp' is the ambient air temperature(F)
// 'midflameWindSpeed' is in mi/h
export function getScorchHeight(fli, airTemp=77, midflameWindSpeed=0) {
    const mph = midflameWindSpeed / 88
    return (fli> 0) ?
        ((63 / (140 - airTemp)) * fli**1.166667) /
        Math.sqrt(fli + mph * mph * mph) : 0
}

// 'rotation' is always degrees counter-clockwise from fire head
export function rotationToClockwiseFromHead(rotation) {
    return (360 - rotation) % 360
}

//------------------------------------------------------------------------------
// makeBetaVector()
//------------------------------------------------------------------------------

// 'Beta' fire vectors are anchored at the FireEllipse ignition point
// at [ignX, ignY] in the local coordinate system,
// or at [ignEast, ignNorth] projected coordinate system.
export function makeBetaVector(inputs={}) {
    const {fireSize, fireShape, betaFromHead} = inputs
    const {bearing, eccentricity:e, headingSpreadRate, firelineIntensity, rotationDeg} = fireShape
    const {elapsedTime, ignX, ignY, ignEast, ignNorth,} = fireSize

    // betaRotation is the *counter-clockwise* rotation from fire heading
    const betaRotation = clockwiseFromHeadToRotation(betaFromHead)
    const betaRadians = toRadians(betaRotation + rotationDeg)

    const pod = {}
    pod.angleFromHead = betaFromHead
    pod.bearing = clockwiseFromHeadToBearing(betaFromHead, bearing)

    pod.ratio = (1 - e) / (1 - e * Math.cos(toRadians(betaRotation)))
    pod.spreadRate = pod.ratio * headingSpreadRate
    pod.distance = pod.spreadRate * elapsedTime
    pod.firelineIntensity = pod.ratio * firelineIntensity

    // Perimeter position requires 2 more trancendentals
    pod.x = ignX + pod.distance * Math.cos(betaRadians)
    pod.y = ignY + pod.distance * Math.sin(betaRadians)
    pod.east = pod.x + ignEast - ignX
    pod.north = pod.y + ignNorth - ignY

    // client can add flame length and scorch height as needed
    // pod.flameLength = getFlameLength(pod.firelineIntensity)
    return pod
}

export function makeBeta6Vector(inputs={}) {
    const {fireShape, betaFromHead} = inputs
    const betaRotation = clockwiseFromHeadToRotation(betaFromHead)
    const pod = makeBetaVector(inputs)

    pod.theta = calcThetaFromBeta(fireShape, betaRotation)
    pod.psi = calcPsiFromTheta(fireShape, pod.theta)
    pod.psiRos = calcPsiSpreadRate(fireShape, pod.psi)
    pod.firelineIntensity = fireShape.firelineIntensity * pod.psiRos / fireShape.headingSpreadRate

    // client can add flame length and scorch height as needed
    // pod.flameLength = getFlameLength(pod.firelineIntensity)
    return pod
}

//------------------------------------------------------------------------------
// makePsiVector()
//------------------------------------------------------------------------------

export function makePsiVector(inputs={}) {
    const {fireSize, fireShape, psiFromHead} = inputs
    const {bearing, headingSpreadRate, firelineIntensity, rotationDeg} = fireShape
    const {ignX, ignY, ignEast, ignNorth,} = fireSize

    // betaRotation is the *counter-clockwise* rotation from fire heading
    const psiRotation = clockwiseFromHeadToRotation(psiFromHead)
    const psiRadians = toRadians(psiRotation + rotationDeg)

    const pod = {}
    pod.angleFromHead = psiFromHead
    pod.bearing = clockwiseFromHeadToBearing(psiFromHead, bearing)


    pod.spreadRate = calcPsiSpreadRate(fireShape, psiRotation)
    pod.distance = pod.spreadRate * fireSize.elapsedTime
    pod.ratio = (headingSpreadRate > 0) ? pod.spreadRate / headingSpreadRate : 0
    pod.firelineIntensity = pod.ratio * firelineIntensity

    pod.x = ignX + pod.distance * Math.cos(psiRadians)
    pod.y = ignY + pod.distance * Math.sin(psiRadians)
    pod.east = pod.x + ignEast - ignX
    pod.north = pod.y + ignNorth - ignY

    // client can add flame length and scorch height as needed
    // pod.flameLength = getFlameLength(pod.firelineIntensity)
    return pod
}
    
// Returns spread rate from the ellipse *perimeter* (or 'fire front')
// at 'psiDegrees' *counter-clockwise* rotation from the heading direction
// Catchpole et.al. (1982) Equation 7
export function calcPsiSpreadRate(fireShape, psiDegrees) {
    const f = fireShape.fSpreadRate
    const g = fireShape.gSpreadRate
    const h = fireShape.hSpreadRate
    if (f <=0 || h <=0 || g <= 0) return 0
    const psi = toRadians(psiDegrees)
    const cosPsi = Math.cos(psi)
    const cos2Psi = cosPsi * cosPsi
    const sin2Psi = 1 - cos2Psi
    const ros = g * cosPsi + Math.sqrt((f * f * cos2Psi) + (h * h * sin2Psi))
    return ros
}
