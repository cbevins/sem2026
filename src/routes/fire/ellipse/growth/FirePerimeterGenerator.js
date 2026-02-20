import {FireEllipseMod} from '$lib/fire/ellipse/FireEllipseMod.js'

/**
 * This should only generate points, not angles or
 */
export class FirePerimeterGenerator {
    constructor(lwRatio=1, headRos=1, bearing=0, elapsed=1, src='angle') {
        this.bearing = bearing
        this.elapsed = elapsed
        this.headRos = headRos
        this.lwRatio = lwRatio
        this.src = 'angle'  // 'angle' or 'bearing'
        let e = new FireEllipseMod('e', src).ready()

        // Select required nodes
        for(let mod of [e.beta, e.psi, e.theta, e.center, e.ignition, e.length, e.f, e.g, e.h])
            mod.select()

        // Set required inputs
        e.head.bearing.set(bearing)
        e.head.ros.set(headRos)
        e.lwr.set(lwRatio)
        e.time.set(elapsed)
        e.updateAll()
        this.ellipse = e
    }

    betaPerimeterPoints(degStep=5) {
        const points =  this.perimeterPoints(this.ellipse.beta, degStep)
        return this.addVhr(points)
    }

    psiPerimeterPoints(degStep=5) {
        const points = this.perimeterPoints(this.ellipse.psi, degStep)
        return this.addVhr(points)
    }

    thetaPerimeterPoints(degStep=5) {
        const points = this.perimeterPoints(this.ellipse.theta, degStep)
        return this.addVhr(points)
    }

    addVhr(points) {
        // Add beta and psi vhr at this angle
        const {beta, psi, theta} = this.ellipse
        for(let i=0; i<points.length; i++) {
            beta.angle.set(points[i].beta)
            points[i].betaVhr = beta.vhr.get()
            points[i].betaRos = beta.ros.get()
            points[i].betaDist = beta.dist.get()
        }
        for(let i=0; i<points.length; i++) {
            psi.angle.set(points[i].psi)
            points[i].psiVhr = psi.vhr.get()
            points[i].psiRos = psi.ros.get()
            points[i].psiDist = psi.dist.get()
        }
        for(let i=0; i<points.length; i++) {
            theta.angle.set(points[i].theta)
            points[i].thetaVhr = theta.vhr.get()
            points[i].thetaRos = theta.ros.get()
            points[i].thetaDist = theta.dist.get()
        }
        return points
    }

    perimeterPoints(vector, deg) {
        const pts = []
        let len = 0
        let arclen = 0
        let lastX = 0
        let lastY = 0
        for(let i=0; i<=360; i+=deg) {
            vector[this.src].set(i)
            this.ellipse.updateAll()
            // Determine segment length and cumulative perimeter length
            if (i) {
                const dx = vector.perim.x.get() - lastX
                const dy = vector.perim.y.get() - lastY
                len = Math.sqrt(dx*dx + dy*dy)
                arclen += len
            }
            pts.push({deg: i,
                x: vector.perim.x.get(), y: vector.perim.y.get(),
                east: vector.perim.east.get(), north: vector.perim.north.get(),
                beta: vector.beta.get(), psi: vector.psi.get(), theta: vector.theta.get(),
                vhr: vector.vhr.get(), segleng: len, arcleng: arclen})
            lastX = vector.perim.x.value
            lastY = vector.perim.y.value
        }
        return pts
    }
}
