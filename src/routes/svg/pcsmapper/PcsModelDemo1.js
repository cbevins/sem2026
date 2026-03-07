export class PcsModelDemo1 {
    constructor(svgWidth, svgHeight, unitsPerPixel) {
        this.width = svgWidth
        this.height = svgHeight
        this.west = 0
        this.east = 1600
        this.south = 2000
        this.north = 2800
        this.upp = unitsPerPixel
        this.units = 'ft'
        this.focusEast = null
        this.focusNorth = null
    }
}
