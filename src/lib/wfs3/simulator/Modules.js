export class canopyBase {
    constructor(){}
    input(){}
}
export class canopyCover {
    constructor(){}
    input(){}
}
export class canopyHeight {
    constructor(){}
    input(){}
}
export class canopyLength {
    constructor(){}
    input(){}
}
export class canopyRatio {
    constructor(){}
    input(){}
}
export class canopyStructure {
    constructor(){}
    updateFromHeightBase() {}
}
export class curedCheatgrass {
    constructor(){}
    input(){}
    updateFromHerbMoisture(){}
}
export class curedHerb {
    constructor(){}
    input(){}
    updateFromHerbMoisture(){}
}
export class fireBehavior {
    constructor(){}
    updateFromOneFuelModel(){}
    updateFromRwoFuelModels(){}
}
export class fireBehaviorOne {
    constructor(){}
    updateFireBehavior(){}
}
export class fireBehaviorTwo {
    constructor(){}
    updateFireBehavior(){}
}
export class fuelBedOne {
    constructor(){}
    updateFromFuelModelAndCuring(){}
}
export class fuelBedTwo {
    constructor(){}
    updateFromFuelModelAndCuring(){}
}
export class fuelBeds {
    constructor(){}
}
export class fuelCatalog {
    constructor(){}
}
export class fuelCoverOne {
    constructor(){}
    input(){}
}
export class fuelCuring {
    constructor(){}
    use(){}
}
export class fuelIgnitionOne {
    constructor(){}
    updateFromFuelBedAndMoisture(){}
}
export class fuelIgnitionTwo {
    constructor(){}
    updateFromFuelBedAndMoisture(){}
}
export class fuelIgnitions {
    constructor(){}
}
export class fuelKeyOne {
    constructor(){}
    updateFromFuelModelAndCuring() {

    }
}
export class fuelKeyTwo {
    constructor(){}
    input(){}
}
export class fuelModels {
    constructor() {
        this.fuelModelOne = null
        this.fuelModelTwo = null
    }
    updateFromFuelKey(){}
}
export class fuelModelTwo {
    constructor() {}
    updateFromFuelKey(){}
}
export class mapContourInterval {
    constructor(){}
    input(){}
}
export class mapContoursCrossed {
    constructor(){}
    input(){}
}
export class mapDistance {
    constructor(){}
    input(){}
}
export class mapScale {
    constructor(){}
    input(){}
}
export class midflameWindSpeed {
    constructor(){}
    input(){}
    updateFrom20ftWsrf(){}
}
export class midflameWsrf {
    constructor(){}
    input(){}
    updateFromCanopyFuelBed(){}
}
export class moistureDead100h {
    constructor(){}
    updateFromMoistureDeadCategory(){}
}
export class moistureDead10h {
    constructor(){}
    updateFromMoistureDeadCategory(){}
}
export class moistureDead1h {
    constructor(){}
    updateFromMoistureDeadCategory(){}
}
export class moistureLiveHerb {
    constructor(){}
    updateFromMoistureLiveCategory(){}
}
export class moistureLiveStem {
    constructor(){}
    updateFromMoistureLiveCategory(){}
}
export class slopeAspect {
    constructor(){}
    updateFromSlopeUpslope(){}
}
export class slopeDegrees {
    constructor(){}
    updateFromSlopeMap(){}
    updateFromSlopeRatio(){}
}
export class slopeMap {
    constructor(){}
    updateSlopeSteepnessFromMap(){}
}
export class slopeRatio {
    constructor(){}
    updateFromSlopeDegrees(){}
    updateFromSlopeMap(){}
}
export class slopeUpslope {
    constructor(){}
    updateFromSlopeAspect(){}
}
export class surfaceFireBehavior {
    constructor(){}
    updateFromOneFuelModel(){}
    updateFromTwoFuelModels(){}
}
export class windBearingDegrees {
    constructor(){}
    updateFromWindSourceCompass(){}
}
export class windSourceCompass {
    constructor(){}
}
export class windSourceDegrees {
    constructor(){}
    updateFromWindSourceCompass(){}
}
export class windSpeed10m {
    constructor(){}
    updateFromWindSpeed20ft(){}
}
export class windSpeed20ft {
    constructor(){}
    updateFromWindSpeed10m(){}
}
