import {
    clockwiseFromHeadToBearing,
    clockwiseFromHeadToRotation,
    toRadians,
} from './utils.js'

import { calcPsiFromTheta, calcThetaFromBeta } from './getEllipseAngles.js'

//------------------------------------------------------------------------------
// Support functions
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// makeBetaVector()
//------------------------------------------------------------------------------

// 'Beta' fire vectors are anchored at the FireEllipse ignition point
// at [ignX, ignY] in the local coordinate system,
// or at [ignEast, ignNorth] projected coordinate system.
export function makeBetaVector(inputs={}, configs={}) {
    const {fireSize, betaFromHead} = inputs
    const {bearing, eccentricity:e, headingSpreadRate, firelineIntensity, rotationDeg,
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

    // client can add flame length and scorch height as needed
    // pod.flameLength = getFlameLength(pod.firelineIntensity)
    return pod
}

export function makeBeta6Vector(inputs={}, configs={}) {
    const {fireSize, betaFromHead} = inputs
    const betaRotation = clockwiseFromHeadToRotation(betaFromHead)
    const pod = makeBetaVector(inputs)

    pod.theta = calcThetaFromBeta(fireSize, betaRotation)
    pod.psi = calcPsiFromTheta(fireSize, pod.theta)
    pod.psiRos = calcPsiSpreadRate(fireSize, pod.psi)
    pod.firelineIntensity = fireSize.firelineIntensity * pod.psiRos / fireSize.headingSpreadRate

    // client can add flame length and scorch height as needed
    // pod.flameLength = getFlameLength(pod.firelineIntensity)
    return pod
}

//------------------------------------------------------------------------------
// makePsiVector()
//------------------------------------------------------------------------------

export function makePsiVector(inputs={}, configs={}) {
    const {fireSize, psiFromHead} = inputs
    const {bearing, headingSpreadRate, firelineIntensity, rotationDeg,
        ignX, ignY, ignEast, ignNorth} = fireSize

    // betaRotation is the *counter-clockwise* rotation from fire heading
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

    // client can add flame length and scorch height as needed
    // pod.flameLength = getFlameLength(pod.firelineIntensity)
    return pod
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
