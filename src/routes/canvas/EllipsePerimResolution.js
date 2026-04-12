import { FireEllipseMod } from '$lib/fire/ellipse/FireEllipseMod.js'

export class EllipsePerimResolution {
    constructor(lwRatio, headRos, bearing, elapsed, ignEast, ignNorth) {
        const e = new FireEllipseMod('e', 'north').ready()
        for(let node of [e.beta.perim.east, e.beta.perim.north]) node.select()
        // Set required inputs
        e.head.bearing.set(bearing)
        e.head.ros.set(headRos)
        e.ignition.east.set(ignEast)
        e.ignition.north.set(ignNorth)
        e.lwr.set(lwRatio)
        // e.beta.angle.set(0)
        e.beta.bearing.set(0)
        e.time.set(elapsed)
        this.ellipse = e
    }

    threshholdTable(betaInc, startInc=1, threshhold=1) {
        const distArray = []
        let dist
        console.log(`threshholdTable betaInc=${betaInc}, startInc=${startInc},
            threshhold=${threshhold}`)
        for(let beta=0; beta<180; beta+=betaInc) {
            dist = this.threshholdAngle(beta, startInc, threshhold)
            distArray.push(dist)
        }
        return distArray
    }

    // Returns the *angle increment* from some beta
    // at which the perimeter distance is less than some threshhold distance
    threshholdAngle(beta, startIncrement, threshhold) {
        let n = 0
        const table = []
        let inc = startIncrement
        let dist = this.perimeterPointsDistance(beta, beta+inc)
        const startDist = dist
        let ratio = dist/threshhold
        table.push({beta, n, inc, dist, ratio})
        while(dist > threshhold) {
            // inc = inc/2
            inc = inc / ratio
            dist = this.perimeterPointsDistance(beta, beta+inc)
            ratio = dist/threshhold
            table.push({beta, n, inc, dist, ratio})
            if (n++ > 10) break
        }
        console.table(table)
        return dist
    }

    // Returns distance between 2 perimeter points at beta angles
    perimeterPointsDistance(angle1, angle2) {
        const a1 = this.perimeterPoint(angle1)
        const a2 = this.perimeterPoint(angle2)
        return Math.hypot((a1.x-a2.x), (a1.y-a2.y))
    }

    // Returns perimeter point at beta 'angle'
    perimeterPoint(angle) {
        const beta = this.ellipse.beta
        // beta.angle.set(angle)
        beta.bearing.set(angle)
        this.ellipse.updateAll()
        return {a:angle, x: beta.perim.east.get(), y: beta.perim.north.get()}
    }
}
