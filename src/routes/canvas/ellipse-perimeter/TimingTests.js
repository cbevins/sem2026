import { FireEllipseMod } from '../../../lib/fire/ellipse/FireEllipseMod.js'
import { EllipseScanner } from './EllipseScanner.js'
import { getEllipseRasterGrid } from './getEllipseRasterGrid.js'
import { getEllipsePerimeterAtThetas } from './getEllipsePerimeterAtThetas.js'
import { getPerimeterPointsCodePen } from './getPointOnEllipseCodePen.js'

export class TimingTests {
    constructor() {
        const e = new FireEllipseMod('e', 'north').ready()
        // Select required nodes
        for(let node of [
                e.theta.perim.east, e.theta.perim.north,
                e.center.east, e.center.north, e.center.x, e.center.y,
                e.length.dist, e.width.dist,
                e.theta.beta, e.theta.psi, e.beta, e.psi,])
            node.select()
        this.ellipse = e
        this.scanner = new EllipseScanner()
    }

    updateEllipse(lwr, headRos, bearing, elapsed, ignEast, ignNorth) {
        const e = this.ellipse
        e.head.bearing.set(bearing)
        e.head.ros.set(headRos)
        e.ignition.east.set(ignEast)
        e.ignition.north.set(ignNorth)
        e.lwr.set(lwr)
        e.theta.bearing.set(0)
        e.time.set(elapsed)
        e.updateAll()

        this.bearing = bearing
        this.lwr = lwr
        this.headRos = headRos
        this.elapsed = elapsed
        this.ignEast = ignEast
        this.ignNorth = ignNorth

        this.angle = (450-bearing) % 360
        this.length = e.length.dist.get()
        this.width = e.width.dist.get()
        this.centerEast = e.center.east.get()
        this.centerNorth = e.center.north.get()
        this.centerX = e.center.x.get()
        this.centerY = e.center.y.get()
        this.ignIdx = 0 // scanlines center row index
    }

    // Uses the CodePen example
    timeEllipsePerimeterCodePen(degStep) {
        const ellipseRotation = this.angle
        const rx = this.length / 2
        const ry = this.width / 2
        const pts = getPerimeterPointsCodePen(this.centerEast, this.centerNorth,
            rx, ry, ellipseRotation, degStep)
        return pts
    }

    timeEllipseScanner(scanWidth) {
        this.scanner.setEllipse(this.length, this.width, this.bearing,
            this.ignEast, this.ignNorth, this.centerEast, this.centerNorth)
        const hlines = this.scanner.getHorizontalScanLines(scanWidth)
        // const vlines = this.scanner.getVerticalScanLines(scanWidth)
        return hlines
    }

    timeEllipseRasterGrid() {
        return getEllipseRasterGrid(this.length, this.width, this.bearing, this.centerEast, this.centerNorth)
    }

    timeEllipsePerimeterAtThetas(degStep) {
        return getEllipsePerimeterAtThetas(this.ellipse, degStep)
    }
}

const timer = new TimingTests()

let headRos = 100
let bearing = 90
let elapsed = 1
let ignEast = 0
let ignNorth = 0

const table = []
let start, msec
for(let lwr of [1, 2, 10]) {
    timer.updateEllipse(lwr, headRos, bearing, elapsed, ignEast, ignNorth)
    const length = timer.length.toFixed(2)
    const width = timer.width.toFixed(2)

    for(let degStep of [1, 0.5, 0.2]) {
        start = performance.now()
        const points = timer.timeEllipsePerimeterAtThetas(degStep)
        msec = performance.now() - start
        table.push({lwr, length, width, test: 'Perim at Theta Points()', parm: `degStep ${degStep}`, result: `${points.length} points`, msec: msec.toFixed(2)})
    }

    for(let degStep of [1, 0.5, 0.2]) {
        start = performance.now()
        const points = timer.timeEllipsePerimeterCodePen(degStep)
        msec = performance.now() - start
        table.push({lwr, length, width, test: 'Perim Points CodePen', parm: `degStep ${degStep}`, result: `${points.length} points`, msec: msec.toFixed(2)})
    }

    for (let scanWidth of [1, 0.5, 0.2]) {
        start = performance.now()
        const scanLines = timer.timeEllipseScanner(scanWidth)
        msec = performance.now() - start
        table.push({lwr, length, width, test: 'EllipseScanner', parm: `scanWidth ${scanWidth}`, result: `${scanLines.length} lines`, msec: msec.toFixed(2)})
    }

    start = performance.now()
    const raster = timer.timeEllipseRasterGrid()
    msec = performance.now() - start
    table.push({lwr, length, width, test: 'EllipseRasterGrid', parm: `none`, result: `${raster.length} rows`, msec: msec.toFixed(2)})
}
console.table(table)
