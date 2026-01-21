import {FireEllipseMod} from './FireEllipseMod.js'
import * as Compass from '../lib/CompassLib.js'
import * as FE from '../lib/FireEllipseLib.js'
import * as Util from './utils.js'
console.log('demo.js', new Date)


const e = new FireEllipseMod('e')
// console.log(e.head)
// e.lwr.set(2)
// console.log(Util.nodeTable(e))
console.log(FE.betaVhr(180, FE.eccentricity(2)))