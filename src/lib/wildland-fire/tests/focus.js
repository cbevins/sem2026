// Q: Is the BehavePlus ignition point the same as the ellipse focus?

//---------------------------------------------------------------------
//---------------------------------------------------------------------

const lwr  = 3.5015680219321221
const headRos = 18.551680325448835
const elapsed = 60
const betaDeg = 45

//---------------------------------------------------------------------
// BehavePlus equations
//---------------------------------------------------------------------

const e = Math.sqrt(lwr * lwr - 1) / lwr    // 0.95835298387126711
const backRos = headRos * (1 - e) / (1 + e) // 0.39452649041938642
const headDist = headRos * elapsed          // 1113.1008195269301
const backDist = backRos * elapsed          // 23.671589425163184
const length = headDist + backDist          // 1136.7724089520932
const width = length / lwr                  // 324.64667309956644
const majorDist = length / 2
const minorDist = width / 2
const centerDist = majorDist - backDist     // 9.0785769175147255 * 60
const betaRos = (headRos * (1 - e)) / (1 - e * Math.cos(betaDeg))
const betaDist = betaRos * elapsed

//---------------------------------------------------------------------
// Standard ellipse equations
//---------------------------------------------------------------------

// major semi-axis
const rx = majorDist
// minor semi-axis
const ry = minorDist
// focal distance
const focalDist = Math.sqrt(rx*rx-ry*ry)

// eccentricity (again)
const e2 = Math.sqrt(1 - ry**2 / rx**2)

// Returns the distance from focal point (fire ignition point)
// to the ellipse perimeter at angle 'betaDeg'
function getFocalPerimDist(betaDeg, e, rx) {
    const radians = betaDeg * Math.PI / 180
    const dist = rx * (1 - e**2) / (1 - e * Math.cos(radians) )
    return dist
}
const focalPerimDist = getFocalPerimDist(betaDeg, e, rx)

// Returns the perimeter point at 'betaDeg' angle from the
// focal (fire ignition) point at [0,0]
function getFocalPerimeterPoint(betaDeg, e, rx) {
    const radians = betaDeg * Math.PI / 180
    const dist = rx * (1 - e**2) / (1 - e * Math.cos(radians) )
    const x = dist * Math.cos(radians)
    const y = dist * Math.sin(radians)
    return {x, y}
}

//---------------------------------------------------------------------------
// Comparisons
//---------------------------------------------------------------------------

console.log(
    `Fire Ellipse center dist = ${centerDist}\n`
    +`Ellipse focal distance   = ${focalDist}\n`
    +`Difference               = ${centerDist-focalDist}\n`)

console.log(
    `FireEllipse eccentricity = ${e}\n`
    +`Ellipse eccentricity     = ${e2}\n`
    +`Difference               = ${e-e2}\n`)

console.log(
    `FireEllipse betaDist    = ${betaDist}\n`
    +`Ellipse focalPerimDist = ${focalPerimDist}\n`
    +`Difference             = ${betaDist-focalPerimDist}\n`)
