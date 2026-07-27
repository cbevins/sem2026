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
import { makeFuelBed } from './makeFuelBed.js'
import { makeFuelIgnition } from './makeFuelIgnition.js'

export class WfbxState {
    constructor() {
        this.fuelCatalog = new FuelModelCatalog()
        this.fuelCuring = new FuelCuring()
        this.fuelKeys = {fuelKey1: 0, fuelKey2: 0}
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
        this.elapsedTime = 0
        this.ignEast = 0
        this.ignNorth = 0
        this.angleFromHead = 0
        // these get made inline via calls to makeSomething()
        this.fuelModel1 = {}
        this.fuelModel2 = {}
        this.fuelBed1 = {}
        this.fuelBed2 = {}
        this.fuelIgnition1 = {}
        this.fuelIgnition2 = {}
        this.propsLevel = 3
    }
    makeFuelModel1() {
        this.fuelModel1 = this.fuelCatalog.get(this.fuelKeys.fuelKey1)
    }
    makeFuelModel2() {
        this.fuelModel2 = this.fuelCatalog.get(this.fuelKeys.fuelKey2)
    }
    makeFuelBed1() {
        this.fuelBed1 = makeFuelBed(this.fuelModel1, this.fuelCuring, this.propsLevel)
    }
    makeFuelBed2() {
        this.fuelBed2 = makeFuelBed(this.fuelModel2, this.fuelCuring, this.propsLevel)
    }
    makeFuelIgnition1() {
        this.fuelIgnition1 = makeFuelIgnition(this.fuelBed1, this.fuelMoisture, this.propsLevel)
    }
    makeFuelIgnition2() {
        this.fuelIgnition2 = makeFuelIgnition(this.fuelBed2, this.fuelMoisture, this.propsLevel)
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
        this.midflame.updateMidflameWsrfFromCanopyFuel(this.fuelBed1.midflameWsrf,
            this.canopyStructure.midflameWsrf)
    }
    updateSlopeDirectionFromAspect() {
        this.slopeDirection.updateSlopeDirectionFromAspect()
    }
    updateSlopeDirectionFromUslope() {
        this.slopeDirection.updateSlopeDirectionFromUslope()
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
        this.winfDirection.updateWindDirectionFromBearingDegrees()
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