/**
 * Firelet is a rasterized template of a FireEllipse
 * used to simulate wildland fire growth via Huygen's Principle
 * with detection of unburnable and previously burned cells.
 */
import { BurnMap } from './BurnMap.js'
import { getFireletPerimeter } from './getFireletPerimeter.js'
import { getFireletPathArray } from './getFireletPathArray.js'
import { getFireletPathTree } from './getFireletPathTree.js'

export class Firelet {
    constructor(headRos=1, lwr=1, duration=1, bearing=0, spacing=1) {
        const eccent = Math.sqrt(lwr * lwr - 1) / lwr
        const backRos = headRos * (1 - eccent) / (1 + eccent)
        const majorRos = headRos + backRos  // expansion rate of major axis
        const minorRos = majorRos / lwr     // expansion rate of minor axis
        const fRos = 0.5 * majorRos         // expansion rate of 1 major semi-axis
        const gRos = fRos - backRos         // expansion rate between ignition and center points
        const hRos = 0.5 * minorRos         // expansion rate of 1 minor semi-axis

        const rx = fRos * duration           // major semi-axis length
        const ry = hRos * duration           // minor semi-axis length
        const gDist = gRos * duration       // distance between ignition and center points

        const deg = (450-bearing ) % 360    // rotation degrees counter-clockwise of Cartesian x-axis
        const rad = deg * Math.PI / 180     // rotation as radians
        const cx = gDist * Math.cos(rad)
        const cy = gDist * Math.sin(rad)

        const perim = getFireletPerimeter(cx, cy, rx, ry, rad, spacing)
        const paths = getFireletPathArray(perim)
        this.tree = getFireletPathTree(paths)
        this.pathways = paths
        this.perim = perim
        this.visits = 0
    }

    // Ignites cells within the Firelet by walking *ALL* the ignition-to-perimeter cell pathways.
    // This is an alternative to ignitePathTree(), and is included for comparisons purposes only.
    ignitePathways(burnMap, ignX, ignY) {
        this.visits = 0
        for(let path of this.pathways) {
            for(let cell of path) {
                this.visits++
                const [x, y] = cell
                const status = burnMap.get(ignX + x, ignY + y)
                if (status === BurnMap.unburned || status === BurnMap.ignited) {
                    burnMap.set(ignX + x, ignY + y, BurnMap.ignited)
                } else {
                    break
                }
            }
        }
        return this
    }

    // Places *this* Firelet's instance at the burnMap's raster [ignX, ignY]
    // and traverses all its cellular pathways to update the burnMap's status at each.
    ignitePathTree(burnMap, ignX, ignY) {
        this.visits = 0
        this.burnMap = burnMap      // store so we don't have to pass it with each recursion
        this._igniteTreeNode(this.tree, ignX, ignY)
        return this
    }
    
    _igniteTreeNode(node, ignX, ignY) {
        this.visits++
        const status = this.burnMap.get(ignX + node.x, ignY + node.y)
        if (status === BurnMap.unburned || status === BurnMap.ignited) {
            this.burnMap.set(ignX + node.x, ignY + node.y, BurnMap.ignited)
            for(let path of node.paths) {
                this._igniteTreeNode(path, ignX, ignY)
            }
        }
    }
}