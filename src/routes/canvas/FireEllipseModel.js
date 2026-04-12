/**
 * Uses a FireEllipseMod DAG to determine fire ellipse perimeter points and gaps.
*/
import { FireEllipseMod } from '$lib/fire/ellipse/FireEllipseMod.js'
// import {activeInputNodesTable, selectedNodesTable} from '$lib/dag/DagTables.js'

export class FireEllipseModel {
    constructor(lwRatio=1, headRos=1, bearing=0, elapsed=1, ignEast=0, ignNorth=0,
            label='Unknown') {
        this.bearing = bearing
        this.elapsed = elapsed
        this.headRos = headRos
        this.ignEast = ignEast
        this.ignNorth = ignNorth
        this.lwRatio = lwRatio
        this.label = label
        this.effWind = 4 * (lwRatio - 1)

        const e = new FireEllipseMod('e', 'north').ready()
        // Select required nodes to determine perimeter points at regular theta intervals
        // as well as length, width, center point, size, and perimeter
        for(let node of [
            // e.theta.beta, e.theta.psi,
            e.theta.perim.east, e.theta.perim.north,
            e.beta.perim.east, e.beta.perim.north,
            e.beta.perim.x, e.beta.perim.y,
            e.center.y, e.center.x,
            e.center.east, e.center.north,
            e.length.dist, e.width.dist,
            e.size, e.perimeter])
        node.select()
        // selectedNodesTable(e)
        // activeInputNodesTable(e)

        // Set required inputs
        e.head.bearing.set(bearing)
        e.head.ros.set(headRos)
        e.ignition.east.set(ignEast)
        e.ignition.north.set(ignNorth)
        e.lwr.set(lwRatio)
        e.theta.bearing.set(0)
        e.time.set(elapsed)
        e.updateAll()
        this.dag = e
    }

    centerEasting() { return this.dag.center.east.get() }
    centerNorthing() { return this.dag.center.north.get() }
    length() { return this.dag.length.dist.get() }
    perimeter() { return this.dag.perimeter.get() }
    size() { return this.dag.size.get() }
    width() { return this.dag.width.dist.get() }

    perimeterPoints(degreesIncrement) {
        const pts = []
        for(let degrees=0; degrees<=360; degrees+=degreesIncrement) {
            pts.push(this.perimeterCoordAtBetaBearing(degrees))
        }
        return pts
    }

    perimeterCoordAtBetaBearing(beta) {
        const vector = this.dag.beta
        vector.bearing.set(beta)
        return [vector.perim.east.get(), vector.perim.north.get(), beta,
            vector.perim.x.get(), vector.perim.y.get()]
    }
    
    // Returns maximum distance between neighboring perimeter point pairs
    // as a {distance, angle, index} object
    maxGap(points=null) {
        let maxdsq = 0
        let index = 0
        let prev = points[0]
        for(let i=1; i<points.length; i++) {
            const dx = points[i][0] - prev[0]
            const dy = points[i][1] - prev[1]
            const dsq = dx*dx + dy*dy
            if (dsq > maxdsq) {
                maxdsq = dsq
                index = i
            }
            prev = points[i]
        }
        const distance = Math.sqrt(maxdsq)
        const angle = 360 * (index / (points.length-1)) - 1
        return {distance, angle, index}
    }
}
