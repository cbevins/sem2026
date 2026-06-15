import { calcBetaFromTheta, calcPsiFromTheta, calcThetaFromBeta, toRadians } from './ellipseAngles.js'

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
    pod.angle = betaFromHead
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

export function bearingToClockwiseFromHead(vectorBearing, headBearing) {
    return (360 + vectorBearing - headBearing) % 360
}

// 'bearing' is always clockwise from north
export function clockwiseFromHeadToBearing(clockwiseFromHead, headBearing) {
    return (360 + headBearing + clockwiseFromHead) % 360
}

// 'rotation' is always counter-clockwise from fire head
export function clockwiseFromHeadToRotation(clockwiseFromHead) {
    return (360 - clockwiseFromHead) % 360
}

// 'rotation' is always counter-clockwise from fire head
export function rotationToClockwiseFromHead(rotation) {
    return (360 - rotation) % 360
}

export function getFlameLength(fli) {
    return (fli > 0) ? 0.45 * fli**0.46 : 0
}

export function getScorchHeight(fli, airTemp=77, midflameWindSpeed=0) {
    const mph = midflameWindSpeed / 88
    return (fli> 0) ?
        ((63 / (140 - airTemp)) * fli**1.166667) /
        Math.sqrt(fli + mph * mph * mph) : 0
}
