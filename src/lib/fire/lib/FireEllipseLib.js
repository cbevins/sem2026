import * as Compass from './CompassLib.js'

/**
 *  Calculate the fire spread rate (ft+1 min-1) at the ellipse back
 *  given the fire spread rate at ellipse head and fire ellipse eccentricity.
 *
 *  NOTE this differs from FireSpread::spreadRateAtBack() which takes the
 *  length-to-width ratio as the second parameter, rather than ellipse eccentricity.
 *
 * @param headRos Fire spread rate at ellipse head (ft+1 min-1).
 * @param eccent Fire ellipse eccentricity (ratio).
 * @returns The fire spread rate at the ellipse back (ft+1 min-1).
 */
export function backRos(headRos, eccent) {
    return headRos * (1 - eccent) / (1 + eccent)
}

// Returns ratio of back-to-head velocity or distance
export function backVhr(eccent) { return (1 - eccent) / (1 + eccent) }

/**
 * Calculate the ratio of beta-to-head velocity or distance
 *
 * @param betaHead Degrees clockwise from ellipse head
 * @param eccent Fire ellipse eccentricity (ratio).
 */
export function betaVhr(betaHead, eccent) {
    return (1 - eccent) / (1 - eccent * Math.cos(Compass.radians(betaHead)))
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

export function psiVhr(psiHead, fVhr, gVhr, hVhr) {
    if (fVhr * gVhr * hVhr <= 0) return 1
    const rad = Compass.radians(psiHead)
    const cosPsi = Math.cos(rad)
    const cos2Psi = cosPsi * cosPsi
    const sin2Psi = 1 - cos2Psi
    return gVhr * cosPsi + Math.sqrt((fVhr * fVhr * cos2Psi) + (hVhr * hVhr * sin2Psi))
}

export function thetaVhr(thetaHead, fVhr, hVhr) {
    if (fVhr * hVhr <= 0) return 1
    const rad = Compass.radians(thetaHead)
    const x = fVhr * Math.cos(rad)
    const y = hVhr * Math.sin(rad)
    const sumsq = x*x + y*y
    return (sumsq>0) ? Math.sqrt(sumsq) : 0
}
