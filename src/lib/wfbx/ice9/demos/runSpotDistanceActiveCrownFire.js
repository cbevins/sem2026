import { SpotDistanceActiveCrownFire } from '../Wfbx.js'

const spot = new SpotDistanceActiveCrownFire()
const canopyHt = 100    // ft
const ws20 = 20 * 88    // ft/min
const flameLength = 50  // ft
console.log('spot (new) =', spot)
spot.updateFromFlameLength(canopyHt, ws20, flameLength)
console.log('spot (updateFromFlameLength) =', spot)