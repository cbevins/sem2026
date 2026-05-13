import { FireEllipse } from './FireEllipse.js'

function elapsed(from, thru) { return `in ${(thru-from).toFixed(2)} msec.` }

export function Part_1_FireEllipse() {
    console.log('\nPart 1 - The "FireEllipse" Fire Shape Geometry Model')
    const timer0 = performance.now()

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
    let fireEllipse = new FireEllipse(headRos, lwr, duration, ignEast, ignNorth, bearing)
    const timer1 = performance.now()
    console.log(`Step 1.1 - created FireEllipse(headRos=${headRos}, lwr=${lwr}, bearing=${bearing}) with`
        + ` length=${fireEllipse.length.toFixed(2)}, width=${fireEllipse.width.toFixed(2)} ${elapsed(timer0, timer1)}`)
    // console.log(fireEllipse)
    
    console.log('Part 1 elapsed time of', (performance.now() - timer0).toFixed(2), 'msec includes logging')
}
