/**
 * WfbxModules defines which modules are active.
 * Once modified by the client, it is used primarily by WfbxScripter
 * (along with a WfbxConfig) to generate an appropriate execution script,
 * including the input parameters and their sequence, and the methods to be invoked.
 */
export class WfbxModules {
    constructor() {
        this.fuelCuring = true
        this.fuelModel = true
        this.fuelBed = true
        this.fuelIgnition = true
        this.twoFuels = true
        this.crownFireBehavior = true
        this.surfaceFireBehavior = true
        this.fireShape = true
        this.fireSize = true
        this.firePosition = true
        this.fireVectors = true
        this.fireVectorBeta = true
        this.fireVectorBeta6 = true
        this.fireVectorPsi = true
        this.fireVectorTheta = true
        this.scorchHeight = true
        this.treeMortality = true
    }
}
