import { makeFuelBed } from './makeFuelBed.js'
import { makeFuelModel } from './makeFuelModel.js'
import { fraction } from '../functions/utils.js'

export class FuelCuring {
    constructor(fuelMoistureClass, curingClasses=['curedHerb'], value=0) {
        this.fuelMoistureClass = fuelMoistureClass
        this.curingClasses = curingClasses
        for(let type of curingClasses)
            this[type] = value
    }
    addCuringClass(key) {
        this.curingClasses.push(key)
        this[key] = 0
    }
    updateFromLiveFuelCuring() {
        const liveHerb = this.fuelMoistureClass.liveHerb
        this.curedHerb = fraction(1.333 - 1.11 * liveHerb)
    }
}

export class DeadFuelMoistures {
    constructor(moistureClasses=['dead1h','dead10h','dead100h'], value=0.1) {
        this.moistureClasses = moistureClasses
        this.deadCategory = value
        for (let moisture of moistureClasses)
            this[moisture] = value
    }
    addMoistureClass(key, value=0.1) {
        this.moistureClasses.push(key)
        this[key] = value
    }
    updateFromCategory() {
        for (let moisture of this.moistureClasses)
            this[moisture] = this.deadCategory
    }
}
export class FuelKeys {
    constructor(one=0, two=0, cover=1) {
        this.one = one
        this.two = two
        this.cover = cover
    }
}
export class LiveFuelMoistures {
    constructor(moistureClasses=['liveHerb','liveStem'], value=3) {
        this.moistureClasses = moistureClasses
        this.liveCategory = value
        for (let type of moistureClasses)
            this[type] = value
    }
    addMoistureClass(key, value=0.1) {
        this.moistureClasses.push(key)
        this[key] = value
    }
    updateFromCategory() {
        for (let moisture of this.moistureClasses)
            this[moisture] = this.deadCategory
    }
}

export class State {
    constructor() {
        this.fuelCatalog = new this.fuelCatalog()
        this.liveFuelMoistures = new LiveFuelMoistures()
        this.fuelCuring = new FuelCuring(this.liveFuelMoistures)
        this.fuelKeys = new FuelKeys()
        this.fuelModelOne = makeFuelModel(this.fuelCatalog, this.fuelKeys.fuelKeysOne)
        this.fuelModelTwo = makeFuelModel(this.fuelCatalog, this.fuelKeys.fuelKeysTwo)
        this.fuelBedOne = makeFuelBed(this.fuelModelOne, this.fuelCuring)
        this.fuelBedTwo = makeFuelBed(this.fuelModelTwo, this.fuelCuring)
        this.deadFuelMoistures = new LiveFuelMoistures()
    }
    activeCrownFire_updateFuelBed(){}
    activeCrownFire_updateFuelIgnition(){}
    activeCrownFire_updateFuelModel(){}
    canopy_updateFromHeightBase(){}
    fireBehaviors_updateFireBehavior(){}
    fireEllipse_updateFromSurfaceFire(){}
    fireSize_updateFromElapsedTime(){}
    fireVectors_updateBackVector(){}
    fireVectors_updateBeta6Vector(){}
    fireVectors_updateBetaVector(){}
    fireVectors_updateHeadVector(){}
    fireVectors_updateLeftVector(){}
    fireVectors_updatePsiVector(){}
    fireVectors_updateRightVector(){}
    fireVectors_updateThetaVector(){}
    fuelBeds_updateFromFuelModelsAndCuring(){}
    fuelCatalog_make(){}
    fuelCuring_updateFromLiveHerbMoisture(){}
    fuelIgnitions_updateFromFuelMoistures(){}
    fuelModels_updateFromFuelKeys(){
        this.fuelModelOne = makeFuelModel(this.fuelCatalog, this.fuelKeys.fuelKeysOne)
        this.fuelModelTwo = makeFuelModel(this.fuelCatalog, this.fuelKeys.fuelKeysTwo)
    }
    midflameWindSpeed_updateFromWsrfAnd20ftWind(){}
    midflameWsrf_updateFromCanopyAndFuelBed(){}
    slope_updateDirectionFromUpslope() {
        this.slopeDirection.updateDirectionFromUpslope()
    }
    slope_updateSteepnessFromMap() {
        this.slopeSteepness.updateSteepnessFromMap()
    }
    slopeMap_updateSlopeSteepness() {
        this.slopeMap.updateSlopeSteepness()
    }
    wind_updateDirectionFromCompass() {
        this.windDirection.updateFromCompass()
    }
    wind_updateFrom10m(){
        this.windDirection.updateFrom10m()
    }
}

export class FuelModels {
    updateFrom
}