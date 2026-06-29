
// 'bearing' is always degrees clockwise from north
// 'vectorBearing' is degrees clockwise from fire head
export function bearingToClockwiseFromHead(vectorBearing, headBearing) {
    return (360 + vectorBearing - headBearing) % 360
}

export function clamp(value, minVal, maxVal) {
    return Math.max(minVal, Math.min(maxVal, value))
}

export function fraction(f) {
    return Math.max(0, Math.min(1, f))
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

export function divide(num, den, whenZero=0) {
    return (den>0) ? (num/den) : whenZero
}

// 'fli' is the fireline intensity (BTU/ft/s)
// Returns flame length (ft)
export function getFlameLength(fli) {
    return (fli > 0) ? 0.45 * fli**0.46 : 0
}

// Calculates the scorch height (ft) estimated from
// fli =  Byram's fireline intensity (BTU/ft/s),
// airTemp = air temperature (oF)
// midflameWindSpeed = midflame wind speed (mi/h)
export function getScorchHeight(fli, airTemp=77, midflameWindSpeed=0) {
    const mph = midflameWindSpeed / 88
    return (fli> 0) ?
        ((63 / (140 - airTemp)) * fli**1.166667) /
        Math.sqrt(fli + mph * mph * mph) : 0
}

export function positive(value) {
    return (value<0) ? 0 : value
}

// 'rotation' is always degrees counter-clockwise from fire head
export function rotationToClockwiseFromHead(rotation) {
    return (360 - rotation) % 360
}

export function toDegrees(radians) {
    return radians * 180 / Math.PI
}

export function toRadians(degrees) {
    return degrees * Math.PI / 180
}
