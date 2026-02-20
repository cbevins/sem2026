/**
 * Simply generates some starting fire peimeter points {x,y}
 * where x is an easting and y is a northing
*/
import {FireEllipseMod} from '$lib/fire/ellipse/FireEllipseMod.js'
import {activeInputNodesTable, selectedNodesTable} from '$lib/dag/DagTables.js'

export class FirePerimeterGenerator {
    constructor(lwRatio=1, headRos=1, bearing=0, elapsed=1, degStep=5,
            ignEast=0, ignNorth=0) {
        this.bearing = bearing
        this.degStep = degStep
        this.elapsed = elapsed
        this.headRos = headRos
        this.ignEast = ignEast
        this.ignNorth = ignNorth
        this.lwRatio = lwRatio
        let e = new FireEllipseMod('e').ready()

        // Select required nodes
        for(let node of [e.theta.perim.east, e.theta.perim.north, e.center.east, e.center.north])
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
            pts.push({deg,
                x: vector.perim.east.get(),
                y: vector.perim.north.get()})
        }
        return pts
    }
}
