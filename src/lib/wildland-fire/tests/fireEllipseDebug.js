/**
 * While the FireBehavior class produces fire spread rate and intensity in its direction
 * of maximum spread, The FireEllipse class expands fire behavior to two dimensions
 * under the assumption of uniform fuel, moisture, wind, and slope.  Under such
 * conditions, the fire assumes an elliptical shape with the perimeter expanding fastest
 * at the fire head and slowest at the fire back.  FireEllipse generates fire size,
 * location, and behavior estimates for any point along the perimeter at any time since
 * ignition, as long as the assumption of continuous conditions is valid.  It also
 * places the fire within the geographical context of a projected coordinate system.
 * 
 * The general shape of the FireEllipse is determined from the fire heading spread rate
 * and ellipse length-to-width ratio, and its intensity by the flame length at head.
 * These three input parameters are available from a FireBehavior instance, or from
 * direct field observation.  The elapsed time parameter determines the ellipse area,
 * length, width, perimeter length, and perimeter position at any time. Finally, by
 * providing an ignition point location and fire bearing, the ellipse can be placed
 * into a geographical context.
 */
import { FireEllipse } from "../src/FireEllipse.js"
import { calcBetaFromTheta, toRadians } from '../src/ellipseAngles.js'

const table = []
function add(name, vector) {
    let {angle, bearing, x, y, east, north, distance, spreadRate} = vector
    table.push({name,
        angle: angle.toFixed(2), bearing: bearing.toFixed(2),
        x: x.toFixed(2), y: y.toFixed(2),
        // east: east.toFixed(2), north: north.toFixed(2),
        ros: spreadRate.toFixed(2),
        dist: distance.toFixed(2)})
}

const fe = new FireEllipse({headingSpreadRate: 10, lengthWidthRatio: 2, bearing: 0,
    elapsedTime: 1, ignEast: 0, ignNorth: 0, flameLength: 10})

console.log(`Fire Bearing = ${fe.bearing}, Fire Rotation = ${fe.rotationDeg}, L/W=${fe.lengthWidthRatio}`)

add('head', fe.getBetaFireVector(0))
add('back', fe.getBetaFireVector(180))

add('center', {angle: 0, bearing: fe.bearing, x: fe.centerX, y: fe.centerY,
    east: fe.centerE, north: fe.centerN,
    distance: fe.gDistance, spreadRate: fe.gSpreadRate,
    firelineIntensity: fe.firelineIntensity, flameLength: fe.flameLength})

add('right', fe.getThetaFireVector(90))
add('left', fe.getThetaFireVector(270))

add('beta45', fe.getBetaFireVector(45))
add('beta315', fe.getBetaFireVector(315))
console.table(table)

console.log(fe)

const b = calcBetaFromTheta(fe, 90)
console.log(`At theta=90, beta=${b}`)
let v = fe.getBetaFireVector(180)
console.log(v)