import { clockwiseFromHeadToBearing, clockwiseFromHeadToRotation,
    getFlameLength, toRadians } from './utils.js'
import { calcBetaFromTheta, calcPsiFromTheta, calcThetaFromBeta } from './getEllipseAngles.js'

//------------------------------------------------------------------------------
// makeBetaVector()
// 'Beta' fire vectors are anchored at the FireEllipse ignition point
// at [ignX, ignY] in the local coordinate system,
// or at [ignEast, ignNorth] projected coordinate system.
//------------------------------------------------------------------------------
export function makeBetaVector(fireSize, betaFromHead=0, includeFlameLength=true) {
    // Get required fireSize (and fireEllipse) input properties
    let {bearing, eccentricity:e, headingSpreadRate, firelineIntensity, rotationDeg,
        elapsedTime, ignX, ignY, ignEast, ignNorth,} = fireSize

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

    if (includeFlameLength)
        pod.flameLength = getFlameLength(pod.firelineIntensity)
    return pod
}

//------------------------------------------------------------------------------
// makeBeta6Vector()
//------------------------------------------------------------------------------

export function makeBeta6Vector(fireSize, betaFromHead=0, includeFlameLength=true) {
    // betaRotation is the *counter-clockwise* rotation from fire heading
    const betaRotation = clockwiseFromHeadToRotation(betaFromHead)

    // Let makeBetaVector() create the initial values
    const pod = makeBetaVector(fireSize, betaFromHead, false)

    // Adjust fireline intensity to use psi distance
    pod.theta = calcThetaFromBeta(fireSize, betaRotation)
    pod.psi = calcPsiFromTheta(fireSize, pod.theta)
    pod.psiRos = calcPsiSpreadRate(fireSize, pod.psi)
    pod.firelineIntensity = fireSize.firelineIntensity * pod.psiRos / fireSize.headingSpreadRate

    if (includeFlameLength)
        pod.flameLength = getFlameLength(pod.firelineIntensity)
    return pod
}

//------------------------------------------------------------------------------
// makePsiVector()
//------------------------------------------------------------------------------

export function makePsiVector(fireSize, psiFromHead, includeFlameLength=true) {
    // Get required fireEllipse/fireSize/firePosition input properties from fireSize
    let {bearing, headingSpreadRate, firelineIntensity, rotationDeg,
        ignX, ignY, ignEast, ignNorth} = fireSize

    // psiRotation is the *counter-clockwise* rotation from fire heading
    const psiRotation = clockwiseFromHeadToRotation(psiFromHead)
    const psiRadians = toRadians(psiRotation + rotationDeg)

    const pod = {}
    pod.angleFromHead = psiFromHead
    pod.bearing = clockwiseFromHeadToBearing(psiFromHead, bearing)

    pod.spreadRate = calcPsiSpreadRate(fireSize, psiRotation)
    pod.distance = pod.spreadRate * fireSize.elapsedTime
    pod.ratio = (headingSpreadRate > 0) ? pod.spreadRate / headingSpreadRate : 0
    pod.firelineIntensity = pod.ratio * firelineIntensity

    pod.x = ignX + pod.distance * Math.cos(psiRadians)
    pod.y = ignY + pod.distance * Math.sin(psiRadians)
    pod.east = pod.x + ignEast - ignX
    pod.north = pod.y + ignNorth - ignY

    if (includeFlameLength)
        pod.flameLength = getFlameLength(pod.firelineIntensity)
    return pod
}

export function makeBackVector(fireEllipse) {
    return makeBetaVector(fireEllipse, 180)
}

export function makeHeadVector(fireEllipse) {
    return makeBetaVector(fireEllipse, 0)
}

export function makeLeftFlankVector(fireEllipse) {
    const beta = calcBetaFromTheta(fireEllipse, 270)
    return makeBetaVector(fireEllipse, beta)
}

export function makeRightFlankVector(fireEllipse) {
    const beta = calcBetaFromTheta(fireEllipse, 90)
    return makeBetaVector(fireEllipse, beta)
}
// Returns spread rate from the ellipse *perimeter* (or 'fire front')
// at 'psiDegrees' *counter-clockwise* rotation from the heading direction
// Catchpole et.al. (1982) Equation 7
export function calcPsiSpreadRate(fireEllipse, psiDegrees) {
    const f = fireEllipse.fSpreadRate
    const g = fireEllipse.gSpreadRate
    const h = fireEllipse.hSpreadRate
    if (f <=0 || h <=0 || g <= 0) return 0
    const psi = toRadians(psiDegrees)
    const cosPsi = Math.cos(psi)
    const cos2Psi = cosPsi * cosPsi
    const sin2Psi = 1 - cos2Psi
    const ros = g * cosPsi + Math.sqrt((f * f * cos2Psi) + (h * h * sin2Psi))
    return ros
}
