export class FireGrowth02Pcs {
    constructor(svgWidth, svgHeight, unitsPerPixel=1) {
        this.width = svgWidth
        this.height = svgHeight
        this.west = -500
        this.east = 500
        this.south = -500
        this.north = 500
        this.upp = unitsPerPixel
        this.units = 'ft'
        this.focusEast = null
        this.focusNorth = null
    }
}
