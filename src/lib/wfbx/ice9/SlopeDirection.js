/**
 * SlopeDirection is a class for storing and updating slope directions
 * for the Wildland Fire Behavior eXplorer.
 */
export class SlopeDirection {
    constructor() {
        this.aspect = 180
        this.upslope = 0
    }
    // WfbxRunner already set this.aspect; so just update this.upslope
    updateSlopeDirectionFromAspect() {
        this.upslope = (this.aspect + 180) % 360
    }
    // WfbxRunner already set this.upslope; so just update this.aspect
    updateSlopeDirectionFromUpslope() {
        this.aspect = (this.upslope + 180) % 360
    }
}
