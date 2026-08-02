import { FireEllipse } from './FireEllipse.js'
import { FireFrontVector } from './FireFrontVector.js'
import { IgnitionPointVector } from './IgnitionPointVector.js'
import { IgnitionPointVector6 } from './IgnitionPointVector6.js'

const fireEllipse = new FireEllipse(100, 2, 90, 10)
console.log('fireEllipse = {', fireEllipse)

const beta = new IgnitionPointVector(fireEllipse, 45, 60, 1000, 2000)
console.log('beta =', beta)

const beta6 = new IgnitionPointVector6(fireEllipse, 45, 60, 1000, 2000)
console.log('beta6 =', beta6)

const psi = new FireFrontVector(fireEllipse, 45, 60, 1000, 2000)
console.log('psi =', psi)