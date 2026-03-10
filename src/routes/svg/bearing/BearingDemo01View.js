import { PcsMapper } from "../pcsmapper/PcsMapper.js"
import { gxmlStr } from "$lib/gxml/gxmlStr.js"

export class BearingDemo01View extends PcsMapper {
    constructor(pcs) {
        super(pcs.width, pcs.height,    // SVG image width and height
            pcs.west, pcs.east, pcs.south, pcs.north,   // PCS bounds
            pcs.upp, pcs.units, pcs.focusEast, pcs.focusNorth)
        this.pcs = pcs
    }

    addAxis() {
        const {west, east, north, south} = this.bounds
        return gxmlStr([
            this.line(0, south, 0, north, {stroke: 'green', 'stroke-width': 2}),
            this.line(west, 0, east, 0, {stroke: 'green', 'stroke-width': 2})
        ])
    }
    
    // 'vectors' is an array of objects with {east, north, bearing, distance}
    addVectors(vectors) {
        const els = []
        for (let vector of vectors) {
            const {east, north, bearing, distance} = vector
            const {east:endEast, north:endNorth} = this.bearingEndpoint(
                east, north, bearing, distance)
            els.push(this.line(east, north, endEast, endNorth, {stroke:'black', 'stroke-width':2}))
            els.push(this.circle(east, north, 6, {fill: 'green'}))
            els.push(this.circle(endEast, endNorth, 6, {fill:'red'}))
            els.push(this.textMid(endEast, endNorth, bearing.toFixed(0)))
        }
        return gxmlStr(els)
    }

    bearingEndpoint(easting, northing, bearing, distance) {
        const radians = bearing * Math.PI / 180
        return {
            east: easting + distance * Math.sin(radians),
            north: northing + distance * Math.cos(radians)
        }
    }

    content() {
        const distance = 150
        const e = 300
        const n = 300
        const vectors = [
            {east: e, north: n, bearing: 0, distance},
            {east: e, north: n, bearing: 45, distance},
            {east: e, north: n, bearing: 90, distance},
            {east: e, north: n, bearing: 135, distance},
            {east: e, north: n, bearing: 180, distance},
            {east: e, north: n, bearing: 225, distance},
            {east: e, north: n, bearing: 270, distance},
            {east: e, north: n, bearing: 315, distance},
            {east: -e, north: n, bearing: 0, distance},
            {east: -e, north: n, bearing: 45, distance},
            {east: -e, north: n, bearing: 90, distance},
            {east: -e, north: n, bearing: 135, distance},
            {east: -e, north: n, bearing: 180, distance},
            {east: -e, north: n, bearing: 225, distance},
            {east: -e, north: n, bearing: 270, distance},
            {east: -e, north: n, bearing: 315, distance},
            {east: e, north: -n, bearing: 0, distance},
            {east: e, north: -n, bearing: 45, distance},
            {east: e, north: -n, bearing: 90, distance},
            {east: e, north: -n, bearing: 135, distance},
            {east: e, north: -n, bearing: 180, distance},
            {east: e, north: -n, bearing: 225, distance},
            {east: e, north: -n, bearing: 270, distance},
            {east: e, north: -n, bearing: 315, distance},
            {east: -e, north: -n, bearing: 0, distance},
            {east: -e, north: -n, bearing: 45, distance},
            {east: -e, north: -n, bearing: 90, distance},
            {east: -e, north: -n, bearing: 135, distance},
            {east: -e, north: -n, bearing: 180, distance},
            {east: -e, north: -n, bearing: 225, distance},
            {east: -e, north: -n, bearing: 270, distance},
            {east: -e, north: -n, bearing: 315, distance},
            {east: 0, north: 0, bearing: 0, distance},
            {east: 0, north: 0, bearing: 45, distance},
            {east: 0, north: 0, bearing: 90, distance},
            {east: 0, north: 0, bearing: 135, distance},
            {east: 0, north: 0, bearing: 180, distance},
            {east: 0, north: 0, bearing: 225, distance},
            {east: 0, north: 0, bearing: 270, distance},
            {east: 0, north: 0, bearing: 315, distance},
        ]
        let str = this.addBoundsRect({fill:'gray'})
            + this.addVectors(vectors)
            + this.addGridLines(100, 100, 0)
            + this.addAxis()
        this.svgContent = str
        return str
    }
}