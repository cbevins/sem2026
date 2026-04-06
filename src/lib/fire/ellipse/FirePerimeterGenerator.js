/**
 * Generates perimeter points at regular theta angles ('degStep')
 * given a fire ellipse length-to-width ratio, bearing from north, head spread rate,
 * elpased time since ignition, and its ignition point easting and northing.
 * 
 * The 'points' member is an aray of [easting, northing, bearing] arrays
*/
import {FireEllipseMod} from './FireEllipseMod.js'
// import {activeInputNodesTable, selectedNodesTable} from '$lib/dag/DagTables.js'

export class FirePerimeterGenerator {
    constructor(lwRatio=1, headRos=1, bearing=0, elapsed=1, degStep=5, ignEast=0, ignNorth=0) {
        this.bearing = bearing
        this.degStep = degStep
        this.elapsed = elapsed
        this.headRos = headRos
        this.ignEast = ignEast
        this.ignNorth = ignNorth
        this.lwRatio = lwRatio
        let e = new FireEllipseMod('e', 'north').ready()

        // Select required nodes
        for(let node of [e.theta.perim.east, e.theta.perim.north, e.theta.beta, e.theta.psi,
                e.center.east, e.center.north, e.beta, e.psi])
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
        this.ellipse = e
        this.points = this.perimeterPoints()
    }

    perimeterPoints() {
        const vector = this.ellipse.theta
        const pts = []
        for(let deg=0; deg<=360; deg+=this.degStep) {
            vector.bearing.set(deg)
            this.ellipse.updateAll()
            pts.push([vector.perim.east.get(), vector.perim.north.get(), deg])
        }
        return pts
    }
    
    // Returns maximum distance between neighboring perimeter point pairs
    // as a {distance, angle, index} object
    maxGap() {
        let maxdsq = 0
        let index = 0
        let prev = this.points[0]
        for(let i=1; i<this.points.length; i++) {
            const dx = this.points[i][0] - prev[0]
            const dy = this.points[i][1] - prev[1]
            const dsq = dx*dx+dy*dy
            if (dsq > maxdsq) {
                maxdsq = dsq
                index = i
            }
            prev = this.points[i]
        }
        const distance = Math.sqrt(maxdsq)
        const angle = 360 * (index / (this.points.length-1)) - 1
        return {distance, angle, index}
    }
}
