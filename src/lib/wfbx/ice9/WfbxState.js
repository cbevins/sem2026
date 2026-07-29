import { CanopyFuels } from './CanopyFuels.js'
import { CanopyStructure } from './CanopyStructure.js'
import { FuelCuring } from './FuelCuring.js'
import { FuelModelCatalog } from './FuelModelCatalog.js'
import { FuelMoisture } from './FuelMoisture.js'
import { MidflameWindSpeed } from './MidflameWindSpeed.js'
import { ObservedFireBehavior } from './ObservedFireBehavior.js'
import { SlopeMap } from './SlopeMap.js'
import { SlopeDirection } from './SlopeDirection.js'
import { SlopeSteepness } from './SlopeSteepness.js'
import { WindDirection } from './WindDirection.js'
import { WindSpeed } from './WindSpeed.js'
import { makeActiveCrownFire } from './makeActiveCrownFire.js'
import { makeFireBehavior } from './makeFireBehavior.js'
import { makeFuelBed } from './makeFuelBed.js'
import { makeFuelIgnition } from './makeFuelIgnition.js'
import { makeWeightedFireBehavior } from './makeWeightedFireBehavior.js'

export class WfbxState {
    constructor() {
        this.fuelCatalog = new FuelModelCatalog()
        this.fuelCuring = new FuelCuring()
        this.fuelKeys = {fuelKey1: 0, fuelKey2: 0, fuelCover1: 1}
        this.fuelMoisture = new FuelMoisture()
        this.midflame = new MidflameWindSpeed()
        this.slopeDirection = new SlopeDirection()
        this.slopeMap = new SlopeMap()
        this.slopeSteepness = new SlopeSteepness()
        this.windDirection = new WindDirection()
        this.windSpeed = new WindSpeed()
        this.canopyStructure = new CanopyStructure()
        this.canopyFuels = new CanopyFuels()
        this.observedFire = new ObservedFireBehavior()
        // these simple scalar parameters don't have modules (yet?)
        this.airTemperature = 77
        this.limitWindSpeedFactor = true
        this.limitSpreadRateToWindSpeed = true
        this.fuelModelWeighting = 'arithmetic'      // arithmetic, harmonic
        this.elapsedTime = 0
        this.ignEast = 0
        this.ignNorth = 0
        this.angleFromHead = 0
        // these get made inline via calls to makeSomething()
        this.fuelModel1 = {}
        this.fuelModel2 = {}
        this.fuelModelCrown = {}
        this.fuelBed1 = {}
        this.fuelBed2 = {}
        this.fuelBedCrown = {}
        this.fuelIgnition1 = {}
        this.fuelIgnition2 = {}
        this.fuelIgnitionCrown = {}
        this.fireBehavior1 = {}
        this.fireBehavior2 = {}
        this.fireBehaviorWeighted = {}
        this.fireBehaviorSurface = {}   // will refer to fireBehavior1 OR fireBehaviorWeighted
        this.fireBehaviorCrown = {}
        this.activeCrownFire = {}
        this.propsLevel = 3
    }
    makeActiveCrownFire() {
        this.activeCrownFire = makeActiveCrownFire(
            this.fireBehaviorCrown,
            this.fireBehaviorSurface,
            this.canopyFuels,
            this.windSpeed.at20ft, this.propsLevel)
    }
    makeFuelModel1() {
        this.fuelModel1 = this.fuelCatalog.get(this.fuelKeys.fuelKey1)
    }
    makeFuelModel2() {
        this.fuelModel2 = this.fuelCatalog.get(this.fuelKeys.fuelKey2)
    }
    makeFuelModelCrown() {
        this.fuelModelCrown = this.fuelCatalog.get(10)
    }
    makeFuelBed1() {
        this.fuelBed1 = makeFuelBed(this.fuelModel1, this.fuelCuring, this.propsLevel)
    }
    makeFuelBed2() {
        this.fuelBed2 = makeFuelBed(this.fuelModel2, this.fuelCuring, this.propsLevel)
    }
    makeFuelBedCrown() {
        this.fuelBedCrown = makeFuelBed(this.fuelModelCrown, {curedHerb: 0}, this.propsLevel)
    }
    makeFuelIgnition1() {
        this.fuelIgnition1 = makeFuelIgnition(this.fuelBed1, this.fuelMoisture, this.propsLevel)
    }
    makeFuelIgnition2() {
        this.fuelIgnition2 = makeFuelIgnition(this.fuelBed2, this.fuelMoisture, this.propsLevel)
    }
    makeFuelIgnitionCrown() {
        this.fuelIgnitionCrown = makeFuelIgnition(this.fuelBedCrown, this.fuelMoisture, this.propsLevel)
    }
    makeSurfaceFireBehavior1() {
        this.fireBehavior1 = makeFireBehavior(this.fuelBed1, this.fuelIgnition1,
            this.midflame.windSpeed,
            this.windDirection.bearingDegrees,
            this.slopeSteepness.ratio,
            this.slopeDirection.aspectDegrees,
            this.limitWindSpeedCoefficitent,
            this.limitSpreadRateToWindSpeed,
            this.propsLevel)
        // This IS the surface fire behavior, UNLESS overridden by the weighted fire behavior
        this.fireBehaviorSurface = this.fireBehavior1
    }
    makeSurfaceFireBehavior2() {
        this.fireBehavior2 = makeFireBehavior(this.fuelBed2, this.fuelIgnition2,
            this.midflame.windSpeed,
            this.windDirection.bearingDegrees,
            this.slopeSteepness.ratio,
            this.slopeDirection.aspectDegrees,
            this.limitWindSpeedCoefficitent,
            this.limitSpreadRateToWindSpeed,
            this.propsLevel)
    }
    makeWeightedSurfaceFireBehavior() {
        this.fireBehaviorWeighted = makeWeightedFireBehavior(
            this.fireBehavior1, this.fireBehavior2,
            this.fuelKeys.fuelCover1, this.fuelModelWeighting)
        this.fireBehaviorSurface = this.fireBehaviorWeighted
    }
    makeSurfaceFireBehaviorCrown() {
        this.fireBehaviorCrown = makeFireBehavior(this.fuelBedCrown, this.fuelIgnitionCrown,
            this.windSpeed.at20ft, this.windDirection.bearingDegrees,
            0, 0, false, false, this.propsLevel)
    }
    updateCanopyFuels() {
        this.canopyFuels.updateCanopyFuels(this.canopyStructure.length)
    }
    updateCanopyStructureFromHeightBase() {
        this.canopyStructure.updateFromHeightBase()
    }
    updateFuelCuringFromLiveMoisture() {
        this.fuelCuring.updateFuelCuringFromLiveMoisture(this.fuelMoisture)
    }
    updateFuelMoistureDeadFromCategory() {
        this.fuelMoisture.updateFuelMoistureDeadFromCategory()
    }
    updateFuelMoistureDeadFromParticles() {
        this.fuelMoisture.updateFuelMoistureDeadFromParticles()
    }
    updateFuelMoistureLiveFromCategory() {
        this.fuelMoisture.updateFuelMoistureLiveFromCategory()
    }
    updateFuelMoistureLiveFromParticles() {
        this.fuelMoisture.updateFuelMoistureLiveFromParticles()
    }
    updateMidflameWindSpeedFromWsrf20ft() {
        this.midflame.updateMidflameWindSpeedFromWsrf20ft(this.windSpeed.at20ft)
    }
    updateMidflameWsrfFromCanopyFuel() {
        this.midflame.updateMidflameWsrfFromCanopyFuel(
            this.fuelBed1.midflameWsrf,
            this.canopyStructure.midflameWsrf)
        this.midflame.updateMidflameWindSpeedFromWsrf20ft(this.windSpeed.at20ft)
    }
    updateSlopeDirectionFromAspectCompass() {
        this.slopeDirection.updateSlopeDirectionFromAspectCompass()
    }
    updateSlopeDirectionFromAspectDegrees() {
        this.slopeDirection.updateSlopeDirectionFromAspectDegrees()
    }
    updateSlopeDirectionFromUpslopeCompass() {
        this.slopeDirection.updateSlopeDirectionFromUpslopeCompass()
    }
    updateSlopeDirectionFromUpslopeDegrees() {
        this.slopeDirection.updateSlopeDirectionFromUpslopeDegrees()
    }
    updateSlopeMap() {
        this.slopeMap.updateSlopeMap()
    }
    updateSlopeSteepnessFromDegrees() {
        this.slopeSteepness.updateSlopeSteepnessFromDegrees()
    }
    updateSlopeSteepnessFromMap() {
        this.slopeSteepness.updateSlopeSteepnessFromMap(this.slopeMap)
    }
    updateSlopeSteepnessFromRatio() {
        this.slopeSteepness.updateSlopeSteepnessFromRatio()
    }
    updateWindDirectionFromBearingCompass() {
        this.windDirection.updateWindDirectionFromBearingCompass()
    }
    updateWindDirectionFromBearingDegrees() {
        this.windDirection.updateWindDirectionFromBearingDegrees()
    }
    updateWindDirectionFromSourceCompass() {
        this.windDirection.updateWindDirectionFromSourceCompass()
    }
    updateWindDirectionFromSourceDegrees() {
        this.windDirection.updateWindDirectionFromSourceDegrees()
    }
    updateWindSpeedFrom10m() {
        this.windSpeed.updateWindSpeedFrom10m()
    }
    updateWindSpeedFrom20ft() {
        this.windSpeed.updateWindSpeedFrom20ft()
    }
}