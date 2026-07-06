export class CanopyStructure {
    constructor() {
        this.canopyHeight = 0
        this.canopyLength = 0
        this.canopyBase = 0
        this.canopyRatio = 1
        this.canopyCover = 0
        this.canopyFill = 0
    }
    updateFromHeightBase() {
        this.canopyLength = Math.max(0, this.canopyHeight - this.canopyBase)
        this.canopyRatio = (this.canopyHeight > 0) ? (this.canopyLength / this.canopyHeight) : 0
        this.update()        
    }
    updateFromHeightLength() {
        this.canopyBase = Math.max(0, this.canopyHeight - this.canopyLength)
        this.canopyRatio = (this.canopyHeight > 0) ? (this.canopyLength / this.canopyHeight) : 0
        this.update()        
    }
    updateFromHeightRatio() {
        this.canopyLength = this.canopyHeight * this.canopyRatio
        this.canopyBase = Math.max(0, this.canopyHeight - this.canopyLength)
        this.update()        
    }
    updateFromLengthBase() {
        this.canopyHeight = this.canopyLength + this.canopyBase
        this.canopyRatio = (this.canopyHeight > 0) ? (this.canopyLength / this.canopyHeight) : 0
        this.update()        
    }
    update() {
        this.canopyFill = this.canopyCover * this.canopyRatio / 3
        this.canopySheltersFuel = this.canopyCover >= 0.01
            && this.canopyFill >= 0.05 && this.canopyHeight >= 6
        const ht = this.canopyHeight
        this.canopyMidflameWsrf = (! this.canopySheltersFuel) ? 1
            : 0.555 / (Math.sqrt(this.canopyFill * ht) * Math.log((20 + 0.36 * ht) / (0.13 * ht)))
    }
}