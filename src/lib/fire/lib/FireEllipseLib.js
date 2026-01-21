import {degrees, radians} from './CompassLib.js'

export function angle(A, B, C) {
    // Vectors AB and BC
    var AB = { x: A.x - B.x, y: A.y - B.y }
    var CB = { x: C.x - B.x, y: C.y - B.y }
    // Calculate angles of each vector relative to x-axis
    var dot = AB.x * CB.x + AB.y * CB.y
    var cross = AB.x * CB.y - AB.y * CB.x
    // Return angle in range -PI to PI
    return Math.atan2(cross, dot)
}

export function area(length, width) {return (Math.PI * length * width) / 4}
    
//------------------------------------------------------------------------------
// back
//------------------------------------------------------------------------------

/**
 *  Calculate the fire spread rate (ft+1 min-1) at the ellipse back
 *  given the fire spread rate at ellipse head and fire ellipse eccentricity.
 *
 * @param headRos Fire spread rate at ellipse head (ft+1 min-1).
 * @param eccent Fire ellipse eccentricity (ratio).
 * @returns The fire spread rate at the ellipse back (ft+1 min-1).
 */
export function backRos(headRos, eccent) { return headRos * (1 - eccent) / (1 + eccent) }

// Returns ratio of back-to-head velocity or distance
export function backVhr(eccent) { return (1 - eccent) / (1 + eccent) }
    
//------------------------------------------------------------------------------
// beta
//------------------------------------------------------------------------------

// Given the 'psi' degrees, returns the corresponding 'beta' degrees to the same perimeter point.
// 'Psi' is the angle between (1) the normal to the tanget of the ellipse
// (i.e., the direction of elliptical expansion) at the point, and (2) the ellipse head orientation.
// 'Beta' is the angle between (1) the fire ignition point and  (2) the ellipse head orientation.
// Unimplemented by BehavePlus
export function betaFromPsi(psiHead, f, g, h) {
    const thetaHead = thetaFromPsi(psiHead, f, h)
    return betaFromTheta(thetaHead, f, g, h)
}

// Used only by betaFromPsi(), Unused by BehavePlus
// Note: at thetaHead 162, betaHead suddenly drops from 87.52 deg to 0
// where it remains until thetaHead 199 when it pops back up to -87.52
export function betaFromTheta(thetaHead, fVhr, gVhr, hVhr) {
    const theta = radians(thetaHead)
    // The following are from Catchpole (1982) Eq 2
    const y = hVhr * Math.sin(theta)        // y = R * t * h * sin(theta)
    const x = gVhr + fVhr * Math.cos(theta) // x = R * t * (g + f * cos(theta))
    // if (x === 0) { console.log(`*** FireEllipseEquations.betaFromTheta() - x is zero at theta ${thetaHead}`)}
    let beta = (x === 0) ? theta : Math.atan(y/x)
    // Quandrant adjustment
    if (beta < 0) beta +=  Math.PI
    if (thetaHead > 180) beta += Math.PI
    return degrees(beta)
}

export function betaX(betaHead, betaDist) {
    return betaDist * Math.cos(radians(betaHead))
}
    
export function betaY(betaHead, betaDist) {
    return betaDist * Math.sin(radians(betaHead))
}

/**
 * Calculate the ratio of beta-to-head velocity or distance
 *
 * @param betaHead Degrees clockwise from ellipse head
 * @param eccent Fire ellipse eccentricity (ratio).
 */
export function betaVhr(betaHead, eccent) {
    return (1 - eccent) / (1 - eccent * Math.cos(radians(betaHead)))
}

/**
 * Calculate the fire ellipse eccentricity.
 *
 * Ellipse eccentricity 'e' measures how much an ellipse deviates from a perfect circle,
 * calculated as the ratio of the distance from the center to a focus 'c'
 * to the length of the semi-major axis 'a' (i.e., e=c/a).
 * Its value ranges from 0 (a circle) to just under 1 (a very elongated ellipse),
 * with higher values indicating more "squashed" or oval shapes. 
 *    e = c/a
 * Use the relationship c^2 =a^2 - b^2, so c = sqrt(a^2 - b^2)
 *
 * @param {real} lwr Fire ellipse length-to-width ratio.
 * @returns The fire ellipse eccentricity (ratio).
 */
export function eccentricity(lwr) {return Math.sqrt(lwr * lwr - 1) / lwr}

export function lwrFromWind(mph) { return 1 + 0.25 * mph }

export function windFromLwr(lwr) { return 4 * (lwr - 1) }

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
export function perimeterNumericalIntegration(a, b, steps=10000) {
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

//------------------------------------------------------------------------------
// psi
//------------------------------------------------------------------------------

// Returns psi degrees given beta degrees
export function psiFromBeta(betaHead, f, g, h) {
    const thetaHead = thetaFromBeta(betaHead, f, g, h)
    return psiFromTheta(thetaHead, f, h)
}

// Catchpole et.al. (1982) Equation 6. (used only by psiFromBeta())
export function psiFromTheta(thetaHead, f, h) {
    if (f * h * thetaHead <= 0) return 0
    const theta = radians(thetaHead)
    const tanPsi = (Math.tan(theta) * f) / h
    let psi = Math.atan(tanPsi)
    // psi += ( psi < 0) ? pi : 0
    // psi += ( theta > pi) ? pi : 0
    // Quadrant adjustment
    // 1st quadrant needs no adjustment
    if (theta <= 0.5 * Math.PI) {}
    // 2nd and 3rd quadrants
    else if (theta > 0.5 * Math.PI && theta <= 1.5 * Math.PI) { psi += Math.PI }
    // 4th quadrant
    else if (theta > 1.5 * Math.PI) { psi += 2 * Math.PI }
    return degrees(psi)
}

export function psiVhr(psiHead, fVhr, gVhr, hVhr) {
    if (fVhr * gVhr * hVhr <= 0) return 1
    const rad = radians(psiHead)
    const cosPsi = Math.cos(rad)
    const cos2Psi = cosPsi * cosPsi
    const sin2Psi = 1 - cos2Psi
    return gVhr * cosPsi + Math.sqrt((fVhr * fVhr * cos2Psi) + (hVhr * hVhr * sin2Psi))
}
    
//------------------------------------------------------------------------------
// theta
//------------------------------------------------------------------------------

// Catchpole et.al. (1982) Equation 5. (Used only by psiFromBeta())
export function thetaFromBeta(betaHead, f, g, h) {
    if (f <= 0 || h <= 0) return 0
    const beta = radians(betaHead)
    const cosB = Math.cos(beta)
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
    if (beta >= Math.PI) theta = 2 * Math.PI - theta // theta in radians when beta >= PI
    // Convert theta radians to degrees
    let thetaHead = degrees(theta)
    // if (betaHead > 180) thetaHead = 360 - thetaHead
    return thetaHead
}

// Used only by betaFromPsi() (unused by BehavePlus)
export function thetaFromPsi(psiHead, fVhr, hVhr) {
    if (fVhr <= 0) return 0
    const psi = radians(psiHead)
    const tanTheta = Math.tan(psi) * hVhr / fVhr
    let theta = Math.atan(tanTheta)
    // Quadrant adjustment
    if (psi <= 0.5 * Math.PI) {}
    else if (psi > 0.5 * Math.PI && psi <= 1.5 * Math.PI ) { theta += Math.PI }
    else if (psi > 1.5 * Math.PI ) { theta += 2 * Math.PI }
    //theta += (theta < 0. || psi > pi ) ? pi : 0.
    return degrees(theta)
}

export function thetaX(thetaHead, fDist) {
    return fDist * Math.cos(radians(thetaHead))
}

export function thetaY(thetaHead, hDist) {
    return hDist * Math.sin(radians(thetaHead))
}

export function thetaVhr(thetaHead, fVhr, hVhr) {
    if (fVhr * hVhr <= 0) return 1
    const rad = radians(thetaHead)
    const x = fVhr * Math.cos(rad)
    const y = hVhr * Math.sin(rad)
    const sumsq = x*x + y*y
    return (sumsq>0) ? Math.sqrt(sumsq) : 0
}

export function subtendX(thetaHead, centerX, fDist) {
    return centerX + fDist * Math.cos(radians(thetaHead))
}
export function subtendY(thetaHead, centerX, fDist) {
    return centerY + fDist * Math.sin(radians(thetaHead))
}
