// FireEllipse area
export function area(length, width) {
    return (Math.PI * length * width) / 4
}

// FireELlipse expansion rate at bearing opposite from the head
export function backRos(headRos, eccent) {
    return headRos * (1 - eccent) / (1 + eccent)
}

// Returns degrees given radians
export function degrees(radians) {
    return radians * 180 / Math.PI
}

// FireEllipse eccentricity
export function eccentricity(lwr) {
    return Math.sqrt(lwr * lwr - 1) / lwr
}

// FireEllipse expansion rate of one major semi-axis (radius)
export function fRos(majorRos) {
    return 0.5 * majorRos
}

// FireEllipse expansion rate between the ignition point and center point
export function gRos(fRos, backRos) {
    return fRos - backRos
}

// The following is Catchpole & Alexander Eq 10, which produces same result as BehavePlus
// but requires knowing 'f' (half the major axis ros) in advance 
export function gRos2(fRos, lwr) {
    return fRos * Math.sqrt(1-Math.pow(lwr, -2))
}

// FireEllipse expansion rate of one minor semi-axis (radius)
export function hRos(minorRos) {
    return 0.5 * minorRos
}

// FireEllipse expansion rate of the full major axis (i.e, length expansion rate)
export function majorRos(headRos, backRos) {
    return headRos + backRos
}

// FireEllipse expansion rate of the full minor axis (i.e, width expansion rate)
export function minorRos(majorRos, lwr) {
    return majorRos / lwr
}

/**
 * FireEllipse perimeter length using Ramanujan's approximation.
 * @param {number} a - Semi-major axis distance
 * @param {number} b - Semi-minor axis distance
 */
export function perimeter(a, b) {
    const h = Math.pow((a - b), 2) / Math.pow((a + b), 2);
    return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))
}

// Returns the radians given angular degrees
export function radians(degrees) {return degrees * Math.PI / 180 }
