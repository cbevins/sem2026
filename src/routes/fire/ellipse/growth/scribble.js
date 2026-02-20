import {bearingEndpoint, expansionBearing, midPoint} from './Geometry.js'

function coords(p, dec=2) {
    return `[${p.x.toFixed(dec)}, ${p.y.toFixed(dec)}]`
}
const a = {x:100, y: 300}
const b = {x:300, y:300}
const c = {x:300, y:100}

const m = midPoint(a,c)
const bearing = expansionBearing(a, b, c)
const distance = 20
const e = bearingEndpoint(b, bearing, distance)

console.log('Pt A', coords(a))
console.log('Pt B', coords(b))
console.log('Pt C', coords(c))
console.log('AC midpoint M', coords(m))
console.log('M->B Bearing', bearing)
console.log('Pt B expansion Pt E', coords(e))
