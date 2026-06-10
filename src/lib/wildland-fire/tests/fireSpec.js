import * as FE from '../src/FireEllipseLib.js'

const headingSpreadRate = 10
const lengthWidthRatio = 2
const flameLength = 10
const elapsedTime = 1
const ignX = 0, ignY = 0        // CCS progon
const ignEast = 0, ignNorth = 0 // PCS origin
const bearing = 0
const betaHead = 0

// Coordinate Systems

// The Local Coordinate System (LCS) is constrained to the fire ellipse whose
// - origin is always at the the ignition point {x:0, y:0},
// - direction of maximum spread is always aligned with the x-axis (no rotation),
// - x-axis values increase left-to-right,
// - y-axis values increase bottom-to-top,
// - all angles from the origin are in degrees *clockwise* from the fire heading direction,
// - coordinates are represented by property names {x, y}.

// The Cartesian Coordinate System (CCS) extends the LCS in that:
// - the origin may be translated to any {x,y} location, and
// - all angles from the origin, ignition point, or center are 'rotations'
// expressed as degrees *counter-clockwise* from the x-axis,

// The Projected Coordinate System (PCS) extends the CCS in that:
// - coordinates are represented by property names {east, north}
// specifying a false easting and false northing within the PCS,
// - all angles from the origin,ignition point, or center are 'bearings'
// expressed as degrees *clockwise* from PCS north.

//------------------------------------------------------------------------------
// setFireBehavior()
// Fire behavior input dependents of lengthWidthRatio, headingSpreadRate, flameLength (firelineIntensity)
//------------------------------------------------------------------------------

const headRos = headingSpreadRate
const lwr = lengthWidthRatio
const eccent = Math.sqrt(lwr * lwr - 1) / lwr
const backRos = headRos * (1 - eccent) / (1 + eccent)
const majorRos = headRos + backRos              // ellipse major axis expansion rate
const minorRos = majorRos / lwr                 // ellipse minor axis expansion rate
const fRos = 0.5 * majorRos                     // ellipse 'rx' major semi-axis
const hRos = 0.5 * minorRos                     // ellipse 'ry' minor semi-axis
const gRos = fRos - backRos                     // center point ros
const latusRos = hRos * hRos / fRos             // latus rectum exapnsion rate

//------------------------------------------------------------------------------
// setElapsedTime()
// Elapsed time dependents of elaptedTime
//------------------------------------------------------------------------------

const headDist = headRos * elapsedTime
const backDist = backRos * elapsedTime
const fDist = fRos * elapsedTime
const gDist = gRos * elapsedTime
const hDist = hRos * elapsedTime
const length = majorRos * elapsedTime
const width = minorRos * elapsedTime
const latusDist = latusRos * elapsedTime
const area = Math.PI * length * width / 4

//------------------------------------------------------------------------------
// setBearing()
//------------------------------------------------------------------------------

// The term 'rotation' always refers to an angle counter-clockwise from the x-axis,
// and is prefixed by 'deg', 'rad', 'cos', or'sin'.
// Rotation is usually derived from 'bearing'
const degRotation = (450 - bearing) % 360   // ellipse rotation degrees counter-clockwise from x-axis
const radRotation = FE.radians(degRotation)
const cosRotation = Math.cos(radRotation)
const sinRotation = Math.sin(radRotation)
const radBack = FE.radians(180+degRotation)
const cosBack = Math.cos(radBack)
const sinBack = Math.sin(radBack)

const headX = ignX + headDist * cosRotation     // Math.cos(FE.radians(0 + degRotation))
const headY = ignY + headDist * sinRotation     // Math.sin(FE.radians(0 + degRotation))

const backX = ignX + backDist * cosBack         // Math.cos(FE.radians(180 + degRotation))
const backY = ignY + backDist * sinBack         // Math.sin(FE.radians(180 + degRotation))

const centerX = ignX + gDist * cosRotation      // Math.cos(FE.radians(0 + degRotation))
const centerY = ignY + gDist * sinRotation      // Math.sin(FE.radians(0 + degRotation))

//------------------------------------------------------------------------------
// setPcs()
//------------------------------------------------------------------------------

const headE = ignEast + headDist * cosRotation  // Math.cos(FE.radians(0 + degRotation))
const headN = ignNorth + headDist * sinRotation // Math.sin(FE.radians(0 + degRotation))

const backE = ignEast + backDist * cosBack      // Math.cos(FE.radians(180 + degRotation))
const backN = ignNorth + backDist * sinBack     // Math.sin(FE.radians(180 + degRotation))

const centerE = ignEast + gDist * cosRotation   // Math.cos(FE.radians(0 + degRotation))
const centerN = ignNorth + gDist * sinRotation  // Math.sin(FE.radians(0 + degRotation))

//------------------------------------------------------------------------------
// setBeta()
//------------------------------------------------------------------------------

// The term 'beta' always refers to an angle from the ignition point clockwise from
// the *fire heading direction*, and is prefixed by 'deg', 'rad', 'cos', or 'sin'
const betaRos = headRos * (1 - eccent) / (1 - eccent * Math.cos(FE.radians(betaHead)))
const betaDist = betaRos * elapsedTime
const radBeta = FE.radians(betaHead + degRotation)
const cosBeta = Math.cos(radBeta)
const sinBeta = Math.sin(radBeta)

const betaX = ignX + betaDist * cosBeta     // Math.cos(radBeta)
const betaY = ignY + betaDist * sinBeta     // Math.sin(radBeta)

const betaE = ignEast + betaDist * cosBeta  // Math.cos(radBeta)
const betaN = ignNorth + betaDist * sinBeta // Math.sin(radBeta)

const table = []
function add(obj) {
    let {name, x, y, east, north} = obj
    table.push({name, x: x.toFixed(2), y: y.toFixed(2),
        east: east.toFixed(2), north: north.toFixed(2)})
}

console.log(`Bearing Deg from North=${bearing}, Rotation Deg from X-Axis=${degRotation}, Beta Deg from Head=${betaHead}`)
add({name: 'head', x: headX, y: headY, east: headE, north: headN})
add({name: 'back', x: backX, y: backY, east: backE, north: backN})
add({name: 'center', x: centerX, y: centerY, east: centerE, north: centerN})
add({name: 'beta', x: betaX, y: betaY, east: betaE, north: betaN})
console.table(table)
