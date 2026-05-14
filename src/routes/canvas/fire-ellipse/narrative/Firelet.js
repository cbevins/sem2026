import { FireEllipse } from './FireEllipse.js'
import { getFireletPerimeterCells } from './getFireletPerimeterCells.js'
import { getFireletScanLines } from './getFireletScanLines.js'
import { getFireletTree } from './getFireletTree.js'
import { getFireletVectors } from './getFireletVectors.js'

export class Firelet {
    constructor(headRos=1, lwr=1, duration=1, bearing=0, spacing=1) {
        const ellipse = new FireEllipse(headRos, lwr, duration, 0, 0, bearing)
        const {centerEast: cx, centerNorth: cy, majorDist: rx, minorDist: ry, degRot} = ellipse
        const perimCells = getFireletPerimeterCells(cx, cy, rx, ry, degRot, spacing)
        const scanLines = getFireletScanLines(perimCells)
        this.vectors = getFireletVectors(scanLines)
        this.start = getFireletTree(this.vectors)
    }
}