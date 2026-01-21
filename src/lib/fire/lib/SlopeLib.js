/**
 * @file Compass functions as implemented by BehavePlus v6.
 * @copyright 2025 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
 */
import {constrain, degrees, radians} from './CompassLib.js'

/**
 * Calculate the slope steepness in degrees from the slope vertical rise / horizontal reach ratio.
 *
 * @param {float} ratio Ratio of the slope vertical rise / horizontal reach (fraction).
 * @returns Slope steepness expressed in degrees.
 */
export function slopeDegrees(ratio) { return degrees(Math.atan(ratio)) }

/**
 * Calculate slope steepness degrees from map measurements.
 *
 * @param {float} mapScale Map scale factor (Greater than 1, i.e., 24000)
 * @param {float} contourInterval Map contour interval (in same units-of-measure as distance)
 * @param {float} contours Number of contours crossed in the measurement
 * @param {float} mapDistance Map distance covered in the measurement
 * @returns Slope steepness degrees
 */
export function slopeDegreesMap(mapScale, contourInterval, contours, mapDistance) {
    return slopeRatio(slopeRatioMap(mapScale, contourInterval, contours, mapDistance))
}

/**
 * Calculate the slope vertical rise / horizontal reach ratio from its steepness in degrees.
 *
 * @param {float} degrees  Slope steepness in degrees.
 * @return float Slope vertical rise / horizontal reach ratio (fraction).
 */
export function slopeRatio(degrees) { return Math.tan(radians(constrain(degrees))) }

/**
 * Calculate slope steepness ratio from map measurements.
 *
 * @param {float} mapScale Map sacle factor (Greater than 1, i.e., 24000)
 * @param {float} contourInterval Map contour interval (in same units-of-measure as distance)
 * @param {float} contours Number of contours crossed in the measurement
 * @param {float} mapDistance Map distance covered in the measurement
 *
 * @return float Slope steepness ratio
 */
export function slopeRatioMap(mapScale, contourInterval, contours, mapDistance) {
    const reach = Math.max(0, mapScale * mapDistance)
    const rise = Math.max(0, contours * contourInterval)
    return (reach <= 0) ? 0 : rise / reach
}
