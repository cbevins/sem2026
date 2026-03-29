/**
 * The purpose of the GeoSvg class is to translate GeoJSON or PCS coordinates
 * into SVG pixel locations, and vice versa.  It allows a large GeoJSON data set
 * (FeatureCollection) to be displayed at selected focal points and scales
 * without defining bounds.
 */
export class GeoSvg {
    constructor(svgWidth, svgHeight, focusEast, focusNorth, unitsPerPixel) {
        this.svg = {width: svgWidth, height: svgHeight}
        this.focus = {east: focusEast, north: focusNorth}
        this.upp = unitsPerPixel
    }

    // These return the PCS coordinate at the SVG edge
    east() { return this.focus.east + (this.upp * this.svg.width/2) }
    north() { return this.focus.north - (this.upp * this.svg.height/2) }
    south() { return this.focus.north + (this.upp * this.svg.height/2) }
    west() { return this.focus.east - (this.upp * this.svg.width/2) }

    // These return pixel offset from SVG top-left given PCS easting/northing/distance
    svgD(distance) { return distance / this.upp }
    svgX(easting) { return (this.svg.width/2) + ((easting - this.focus.east) / this.upp) }
    svgY(northing) { return (this.svg.height/2) - ((northing - this.focus.north) / this.upp) }

    // These return PCS easting/northing/distance given SVG pixel offset
    distance(svgDistance) { return svgDistance * this.upp }
    easting(svgX) { return this.west() + (this.upp *svgX) }
    northing(svgY) { return this.north() - (this.upp * svgY) }
    point(svgX, svgY) { return [
        this.west() + (this.upp *svgX),
        this.north() - (this.upp * svgY)]}

    /**
     * Returns bearing from north between 2 PCS coordinate pairs
     * @param {[]} p1 simple array of [easting, northing]
     * @param {[]} p2 simple array of [easting, northing]
     */
    bearing(p1, p2) {
        let dy = p2[1] - p1[1]
        let dx = p2[0] - p1[0]
        let angle = Math.atan2(dy, dx) * 180 / Math.PI
        let bearing = (450 - angle) % 360
        return bearing
    }
    /**
     * Returns [easting, northing] end-point coordinates of from a point
     * at some bearing and distance.
     * @param {[]} point Simple array of [easting, north]
     * @param {float} bearing Vector bearing in degrees clockwise from north
     * @param {float} distance Vector length in PCS units
     */
    vectorEndpoint(point, bearing, distance) {
        const radians = bearing * Math.PI / 180
        return [
            point[0] + distance * Math.sin(radians),
            point[1] + distance * Math.cos(radians)]
    }

    circleInView(center, radius) {
        const r = this.svgD(radius)
        const x = this.svgX(center[0])
        const y = this.svgX(center[1])
        return (x+r > 0 && x-r<this.svg.width
            && y+r > 0 && y-r < this.svg.height)
    }
}