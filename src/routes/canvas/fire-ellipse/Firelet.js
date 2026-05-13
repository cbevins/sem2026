/**
 * A Firelet is a data structure defining the direct pathway from the ignition point
 * to each raster cell within a FireEllipse perimeter.  Firelets are used as templates to
 * expand a fire boundary at every point along the fire front using Huygen's Principle,
 * where each Firelet represents a small fire over a short time period.
 * A Firelet is applied by walking each of its pathways from its ignition point towards
 * its destination cell, stopping if it encounters a previously burned, an unburnable cell,
 * or the Firelet perimeter.
 * 
 * The Firelet.data property is a hierarchical tree of raster cell *offsets* from its
 * ignition point. It has both positive and negative [col, row] coordinate offsets,
 * so while it is NOT as ratser, the offsets are expressed in the Raster Coordinate System
 * (where row indices increase from top to bottom).
 */

import { BurnMap } from './BurnMap.js'
import { FireEllipse } from './FireEllipse.js'
import { getFireletPerimeter } from './getFireletPerimeter.js'
import { getFireletPathArrayFromPerimeter, getFireletPathArrayFromScanLines } from './getFireletPathArray.js'
import { getFireletPathTree } from './getFireletPathTree.js'
import { getFireletScanLines } from './getFireletScanLines.js'

export class Firelet {
    constructor(headRos=1, lwr=1, duration=1, bearing=0, spacing=1) {
        // Create a FireEllipse at ignition [0,0]
        const ellipse = new FireEllipse(headRos, lwr, duration, 0, 0, bearing)
        const {centerEast: cx, centerNorth: cy, majorDist: rx, minorDist: ry, degRot} = ellipse
        const perim = getFireletPerimeter(cx, cy, rx, ry, degRot, spacing)
        
        const usePerimeter = true
        let paths, scanLines, nodes
        if (usePerimeter) {
            paths = getFireletPathArrayFromPerimeter(perim)
            this.tree = getFireletPathTree(paths)
            nodes = this.getNodeCount()
            console.log(`Firelet using perimeter only: ${paths.length} paths, ${nodes} tree nodes`)
        } else {
            scanLines = getFireletScanLines(perim)
            paths = getFireletPathArrayFromScanLines(scanLines)
            this.tree = getFireletPathTree(paths)
            nodes = this.getNodeCount()
            console.log(`Firlet using all cells: ${scanLines.length} scan lines, ${paths.length} paths, ${nodes} tree nodes`)
        }
        // remove the following 3 members when done with comparison testing
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

    getNodeCount() {
        return this._getNodeCount(this.tree)
    }
    _getNodeCount(node) {
        let n = 1
        for(let path of node.paths) {
            n += this._getNodeCount(path)
        }
        return n
    }
}
