import { FireEllipse } from '../index.js'

export function Part_1_FireEllipse() {
    let part = 1
    let step = 0
    let text = 'The "FireEllipse" Fire Shape Geometry Model'
    let from = performance.now(), thru
    const stats = [{part, step, text, msec: from}]

    /*
    The FireEllipse class provides the geometric model behind the fundamental shape
    of a fire spreading through uniform fuel and moisture conditions under the influence
    of a constant slope and aspect, and a steady wind speed and direction.
    */

    // Its basic geometry is parameterized by:
    let lwr = 2         // a length-to-width ratio
    let headRos = 50    // a head fire spread rate
    // which determines its eccentricity and backing spread rate.

    // Its dimensions and position at any time are determined by:
    let duration = 1    // elapsed time since ignition
    let bearing = 45    // the direction of maximum spread as degrees clockwise from North
    let ignEast = 50    // the ignition point false easting
    let ignNorth = 20   // the ignition point false northing

    /*
    FireEllipse points of interest (ignition point, center point, perimeter points)
    are expressed as [easting, northing] real number (positive or negative) coordinates
    on a Cartesian plane where easting increases left-to-right and
    northing increases botton-to-top.
    */
    from = performance.now()
    let fireEllipse = new FireEllipse(headRos, lwr, duration, ignEast, ignNorth, bearing)
    thru = performance.now()
    step = 1
    text = `created FireEllipse(headRos=${headRos}, lwr=${lwr}, bearing=${bearing}) with`
    + ` length=${fireEllipse.length.toFixed(2)}, width=${fireEllipse.width.toFixed(2)}`
    stats.push({part, step, text, msec: thru-from})

    stats[0].msec = performance.now() - stats[0].msec
    return stats
}
