export function degrees(radians) {return radians * 180 / Math.PI}
export function radians(degrees) {return degrees * Math.PI / 180 }

/**
 * This fire ellipse model employes the following coordinate geometry:
 * - the ignition point located at the origin of the Cartesian coordinate system;
 * - the direction of maximum fire spread (fire head) is along the x axis,
 * - all polar angles are in the counter-clockwise direction from the x axis (fire head),
 * - 'beta' polar angles are from the fire ignition point (origin),
 * - 'psi' polar angles are the normal from some arbitrary point on the ellipse perimeter
 * 
 * All function arguments and return values are documented here:
 * @param {float} fRos half the major axis' expansion rate
 * @param {float} gRos "speed at which the center of the fire is moving downwind"
 * @param {float} hRos half the minor axis' expansion rate
 * @param {float} betaDeg polar angle at the *fire ignition point*
 *  between the fire heading vector and some point on the fire ellipse perimeter
 * @param {float} psiDeg angle between some point on the fire ellipse perimeter
 *  between the wind vector and the normal to the fire ellipse front.
 * @param {float} thetaDeg polar angle at the *fire ellipse center*
 *  between the fire heading vector and some point on the fire ellipse perimeter
 * Note that the backing spread rate 'c' = f - g
 */
//--------------------------------------------------------------------------
// Ellipse shape functions
//--------------------------------------------------------------------------

/**
 * Calculates the angle (in radians) at point B between line segment AB and BC
 * where A, B, C are point objects with {x, y} properties
 */
export function angle(A, B, C) {
    // Vectors AB and BC
    var AB = { x: A.x - B.x, y: A.y - B.y }
    var CB = { x: C.x - B.x, y: C.y - B.y }
    // Calculate angles of each vector relative to x-axis
    var dot = AB.x * CB.x + AB.y * CB.y
    var cross = AB.x * CB.y - AB.y * CB.x
    // Returns angle in range -PI to PI
    return Math.atan2(cross, dot);
}

export function angleDegrees(A, B, C) { return degrees(angle(A, B, C)) }

export function area(length, width) { return (Math.PI * length * width) / 4 }

export function distance(rate, time) { return rate * time }

export function eccent(lwr) { return Math.sqrt(lwr * lwr - 1) / lwr }

// BehavePlus method using lwr arg
export function _backRos(headRos, lwr) {
    const eccent = eccent(lwr)
    return headRos * (1 - eccent) / (1 + eccent)
}
export function backRos(headRos, eccent) { return headRos * (1 - eccent) / (1 + eccent) }

export function majorRos(headRos, backRos) { return headRos + backRos }
export function _majorRos(headRos, lwr) { return headRos + backRos(headRos, lwr) }

export function minorRos(majorRos, lwr) { return majorRos / lwr }
export function _minorRos(headRos, lwr) { return majorRos(headRos, lwr) / lwr }

export function fRos(majorRos) { return 0.5 * majorRos }
export function _fRos(headRos, lwr) { return 0.5 * majorRos(headRos, lwr) }

export function hRos(minorRos) { return 0.5 * minorRos }
export function _hRos(headRos, lwr) { return 0.5 * minorRos(headRos, lwr) }

export function gRos(fRos, backRos) { return fRos - backRos }
export function _gRos(headRos, lwr) { return fRos(headRos, lwr) - backRos(headRos, lwr) }

// The following is Catchpole & Alexander Eq 10, which produces same result as BP
// but requires knowing 'f' (half the major axis ros) in advance 
export function gRos2(fRos, lwr) { return fRos * Math.sqrt(1-Math.pow(lwr, -2)) }
// export function _gRos2(lwr) { return f(headRos, lwr) * Math.sqrt(1-Math.pow(lwr, -2)) }

//--------------------------------------------------------------------------
// Fire behavior at beta and psi
//--------------------------------------------------------------------------

export function betaRos(headRos, lwr, betaDeg) {
    if (betaDeg === 0) return headRos
    const beta = radians(betaDeg)
    const eccent = eccent(lwr)
    return (headRos * (1 - eccent)) / (1 - eccent * Math.cos(beta))
}

/**
 * Catchpole et.al. (1982) Equation 7
 */
export function psiRos(psiDeg, f, g, h) {
    if (f * g * h <= 0) return 0
    const psi = radians(psiDeg)
    const cosPsi = Math.cos(psi)
    const cos2Psi = cosPsi * cosPsi
    const sin2Psi = 1 - cos2Psi
    const ros = g * cosPsi + Math.sqrt((f * f * cos2Psi) + (h * h * sin2Psi))
    return ros
}

//--------------------------------------------------------------------------
// Angle computation functions for beta, theta, and psi    
//--------------------------------------------------------------------------

// Returns beta degrees at fire ellipse ignition point given the psi degrees
// Unimplemented by BehavePlus
export function betaFromPsi(psiDeg, f, g, h) {
    const thetaDeg = thetaFromPsi(psiDeg, f, h)
    const betaDeg = betaFromTheta(thetaDeg, f, g, h)
    return betaDeg
}

/**
 * Catchpole et.al. (1982) Equation 5.
 * Used only by psiFromBeta()
 */
export function thetaFromBeta(betaDeg, f, g, h) {
    if (f <= 0 || h <= 0) return 0
    const b = radians(betaDeg)
    const cosB = Math.cos(b)
    const cos2B = cosB * cosB
    const sin2B = 1 - cos2B
    const f2 = f * f
    const g2 = g * g
    const h2 = h * h
    const term = Math.sqrt(h2 * cos2B + (f2 - g2) * sin2B)  // term used in numerator
    const num = h * cosB * term - f * g * sin2B
    const denom = h2 * cos2B + f2 * sin2B
    const cosTheta = num / denom
    let theta = Math.acos(cosTheta)               // theta in radians when beta radians < PI
    if (b >= Math.PI) theta = 2 * Math.PI - theta // theta in radians when beta >= PI
    // Convert theta radians to degrees
    let thetaDeg = degrees(theta)
    // if (betaDeg > 180) thetaDeg = 360 - thetaDeg
    return thetaDeg
}

/**
 * Catchpole et.al. (1982) Equation 6
 * Used only by psiFromBeta()
 */
export function psiFromTheta(thetaDeg, f, h) {
    if (f * h * thetaDeg <= 0) return 0
    const theta = radians(thetaDeg)
    const tanPsi = (Math.tan(theta) * f) / h
    let psi = Math.atan(tanPsi)
    // psi += ( psi < 0) ? pi : 0
    // psi += ( theta > pi) ? pi : 0
    // Quadrant adjustment
    // 1st quadrant needs no adjustment
    if (theta <= 0.5 * Math.PI) { /* do nothing */ }
    // 2nd and 3rd quadrants
    else if (theta > 0.5 * Math.PI && theta <= 1.5 * Math.PI) { psi += Math.PI }
    // 4th quadrant
    else if (theta > 1.5 * Math.PI) { psi += 2 * Math.PI }
    const psiDeg = degrees(psi)
    return psiDeg
}

// Returns psi degrees given beta degrees
export function psiFromBeta(betaDeg, f, g, h) {
    const thetaDeg = thetaFromBeta(betaDeg, f, g, h)
    const psiDeg = psiFromTheta(thetaDeg, f, h)
    return psiDeg
}

// Used only by betaFromPsi()
// Unused by BehavePlus
// Note: at thetaDeg 162, betaDeg suddenly drops from 87.52 deg to 0
// where it remains until thetaDeg 199 when it pops back up to -87.52
export function betaFromTheta(thetaDeg, f, g, h) {
    const theta = radians(thetaDeg)
    // The following are from Catchpole (1982) Eq 2
    const y = h * Math.sin(theta)         // y = R * t * h * sin(theta)
    const x = g + f * Math.cos(theta)   // x = R * t * (g + f * cos(theta))
    if (x === 0) { console.log(`*** betaFromTheta() - x is zero at theta ${thetaDeg}`)}
    let beta = ( x === 0) ? theta : Math.atan(y/x)
    // Quandrant adjustment
    if (beta < 0) beta +=  Math.PI
    if (thetaDeg > 180) beta += Math.PI
    return degrees(beta)
}

// Used only by betaFromPsi()
// Unused by BehavePlus
export function thetaFromPsi(psiDeg, f, h) {
    if ( f <= 0 ) return 0
    const psi = radians(psiDeg)
    const tanTheta = Math.tan(psi) * h / f
    let theta = Math.atan(tanTheta)
    // Quadrant adjustment
    if (psi <= 0.5 * Math.PI) { /* do nothing */ }
    else if (psi > 0.5 * Math.PI && psi <= 1.5 * Math.PI ) { theta += Math.PI }
    else if (psi > 1.5 * Math.PI ) { theta += 2 * Math.PI }
    //theta += (theta < 0. || psi > pi ) ? pi : 0.
    // Convert theta radians to degrees
    return degrees(theta)
}

// Unused???
// export function thetaRadius(thetaDeg, majorDist, minorDist, cx=0, cy=0) {
//     const [x,y] = thetaPoint(thetaDeg, majorDist, minorDist, cx, cy)
//     const dist = Math.sqrt(x*x + y+y)
//     return dist
// }

export function betaPerimeterPoint(betaDeg, betaDist, x0=0, y0=0, headDeg=0) {
    const rad = radians(betaDeg+headDeg)
    const dx = x0 + betaDist * Math.cos(rad)
    const dy = y0 + betaDist * Math.sin(rad)
    return [dx, dy]
}

export function thetaPerimeterPoint(thetaDeg, majorDist, minorDist, x0=0, y0=0, headDeg=0) {
    let rad = radians(thetaDeg+headDeg)
    const dx = x0 + majorDist * Math.cos(rad)
    const dy = y0 + minorDist * Math.sin(rad)
    return [dx, dy]
}

/**
 * Calculates the perimeter of an ellipse using Ramanujan's approximation.
 * @param {number} a - Semi-major axis
 * @param {number} b - Semi-minor axis
 * @returns {number} Perimeter
 */
export function perimeterRamanujan(a, b) {
    const h = Math.pow((a - b), 2) / Math.pow((a + b), 2);
    const perimeter = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))
    return perimeter
}
export function perimeterSimpleApprox(a, b) {
    return 2 * Math.PI * Math.sqrt((Math.pow(a, 2) + Math.pow(b, 2)) / 2);
}
/**
 * Calculates perimeter using numerical integration.
 * @param {number} a - Semi-major axis
 * @param {number} b - Semi-minor axis
 * @param {number} steps - Number of steps for integration (higher = more precise)
 */
export function perimeterNumericalIntegration(a, b, steps = 10000) {
    let perimeter = 0
    const da = (Math.PI / 2) / steps
    
    // Parametric equation: x = a*cos(theta), y = b*sin(theta)
    for (let i = 0; i < steps; i++) {
        let t1 = i * da
        let t2 = (i + 1) * da
        
        let x1 = a * Math.cos(t1)
        let y1 = b * Math.sin(t1)
        let x2 = a * Math.cos(t2)
        let y2 = b * Math.sin(t2)
        
        // Sum the lengths of tiny line segments
        perimeter += Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    }
    // Multiply by 4 because we only calculated 1/4 of the ellipse
    return perimeter * 4
}
