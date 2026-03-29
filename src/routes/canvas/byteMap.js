export class FireGrowthByteMap {
    constructor(width=1024, height=1024) {
        this.width = width
        this.height = height
        this.data = new Uint8ClampedArray(width*height)
    }
    index(col, row) { return col + row * this.width }
}