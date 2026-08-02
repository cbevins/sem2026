import { ActiveCrownFire } from './ActiveCrownFire.js'
import { CanopyFuels } from './CanopyFuels.js'
import { CanopyStructure } from './CanopyStructure.js'
import { FireBehavior } from './FireBehavior.js'
import { FirePosition } from './FirePosition.js'
import { FireShape } from './FireShape.js'
import { FireSize } from './FireSize.js'
import { FuelBed } from './FuelBed.js'
import { FuelCuring } from './FuelCuring.js'
import { FuelIgnition } from './FuelIgnition.js'
import { FuelModelCatalog } from './FuelModelCatalog.js'
import { FuelMoisture } from './FuelMoisture.js'
import { MidflameWindSpeed } from './MidflameWindSpeed.js'
import { ObservedFireBehavior } from './ObservedFireBehavior.js'
import { SlopeMap } from './SlopeMap.js'
import { SlopeDirection } from './SlopeDirection.js'
import { SlopeSteepness } from './SlopeSteepness.js'
import { WindDirection } from './WindDirection.js'
import { WindSpeed } from './WindSpeed.js'
import { FireVectorHead, FireVectorBack, FireVectorRightFlank, FireVectorLeftFlank,
    FireVectorBeta, FireVectorBeta6, FireVectorPsi } from './FireVectors.js'
import { WeightedFireBehavior } from './WeightedFireBehavior.js'
import { SpotDistanceFromSurfaceFire } from './SpotDistance.js'
import { SpotDistanceActiveCrownFire } from './SpotDistanceActiveCrownFire.js'

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
        this.fireBehaviorObserved = new ObservedFireBehavior()
        this.firePosition = new FirePosition()
        this.air = {temperature: 77}
        // Spotting distance inputs
        this.spotting = {
            // required by all 3 types
            downwindCoverHt: 0,
            downwindOpenCanopy: true,
            windSpeedAt20ft: 0,
            flameLength: 0,         // Surface fire flame length
            flameHt: 0,             // Burning pile flame height
            torchingTrees: 0,       // Number of torching trees
            treeSpecies: 'PSME',    // Species code
            treeHt: 100,            // tree height (ft)
            treeDbh: 24,            // tree dbh (in)
            // required for mountaineous terrain spotting distance
            source: 'valleyBottom', // 'midslopeWindward', 'valleyBottom', 'midslopeLeeward', or 'ridgeTop'
            ridgeToValleyDist: 0,   // Horizontal distance from ridge top to valley bottom (ft)
            ridgeToValleyElev: 0,   // Vertical distance from ridge top to valley bottom (ft)
        }

        // run time options
        this.options = {
            fireVectorFlameLengths: true,
            limitWindSpeedFactor: true,
            limitSpreadRateToWindSpeed: true,
            fuelModelWeighting: 'harmonic',      // arithmetic, harmonic
        }
        // these are created during execution via calls to makeSomething()
        this.fuelModel1 = {}
        this.fuelModel2 = {}
        this.fuelModelCrown = {}
        this.fuelBed1 = new FuelBed()
        this.fuelBed2 = new FuelBed()
        this.fuelBedCrown = new FuelBed()
        this.fuelIgnition1 = new FuelIgnition()
        this.fuelIgnition2 = new FuelIgnition()
        this.fuelIgnitionCrown = new FuelIgnition()
        this.fireBehavior1 = new FireBehavior()
        this.fireBehavior2 = new FireBehavior()
        this.fireBehaviorWeighted = new WeightedFireBehavior()
        this.fireBehaviorSurface = {} // will refer to EITHER fireBehavior1 OR fireBehaviorWeighted
        this.fireBehaviorCrown = new FireBehavior()
        this.activeCrownFire = new ActiveCrownFire()
        this.fireShape = new FireShape()
        this.fireSize = new FireSize()
        this.fireVectorHead = new FireVectorHead()
        this.fireVectorBack = new FireVectorBack()
        this.fireVectorRightFlank = new FireVectorRightFlank()
        this.fireVectorLeftFlank = new FireVectorLeftFlank()
        this.fireVectorBeta = new FireVectorBeta()
        this.fireVectorBeta6 = new FireVectorBeta6()
        this.fireVectorPsi = new FireVectorPsi()
        this.surfaceSpotting = new SpotDistanceFromSurfaceFire()
        this.crownSpotting = new SpotDistanceActiveCrownFire()
    }
    makeActiveCrownFire() {
        this.activeCrownFire.update(
            this.fireBehaviorCrown.headingSpreadRate,
            this.fireBehaviorSurface.heatPerUnitArea,
            this.canopyFuels.heatPerUnitArea,
            this.windSpeed.at20ft)
    }
    makeCrownSpottingLevel() {
        this.crownSpotting.updateFromFirelineIntensity(
            this.spotting.downwindCoverHt, // OR this.canopyStructure.height,
            this.windSpeed.at20ft,
            this.activeCrownFire.activeFirelineIntensity
        )
    }
    updateCrownSpottingTerrain() {
        this.crownSpotting.updateTerrainDistance(
            this.spotting.source,
            this.spotting.ridgeToValleyDist,
            this.spotting.ridgeToValleyElev)
    }

    makeFireShapeFromObservedFire() {
        this.fireShape.update(this.fireBehaviorObserved)
    }
    makeFireShapeFromSurfaceFire() {
        this.fireShape.update(this.fireBehaviorSurface)
    }
    makeFireSize() {
        this.fireSize.update(this.fireShape, this.firePosition)
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
        this.fuelBed1.update(this.fuelModel1, this.fuelCuring)
    }
    makeFuelBed2() {
        this.fuelBed2.update(this.fuelModel2, this.fuelCuring)
    }
    makeFuelBedCrown() {
        this.fuelBedCrown.update(this.fuelModelCrown, {curedHerb: 0})
    }
    makeFuelIgnition1() {
        this.fuelIgnition1.update(this.fuelBed1, this.fuelMoisture)
    }
    makeFuelIgnition2() {
        this.fuelIgnition2.update(this.fuelBed2, this.fuelMoisture)
    }
    makeFuelIgnitionCrown() {
        this.fuelIgnitionCrown.update(this.fuelBedCrown, this.fuelMoisture)
    }
    makeSurfaceFireBehavior1() {
        this.fireBehavior1.update(
            this.fuelBed1,
            this.fuelIgnition1,
            this.midflame.windSpeed,
            this.windDirection.bearingDegrees,
            this.slopeSteepness.ratio,
            this.slopeDirection.aspectDegrees,
            this.options.limitWindSpeedFactor,
            this.options.limitSpreadRateToWindSpeed)
        // This IS the surface fire behavior, UNLESS overridden by the weighted fire behavior
        this.fireBehaviorSurface = this.fireBehavior1
    }
    makeSurfaceFireBehavior2() {
        this.fireBehavior2.update(
            this.fuelBed2,
            this.fuelIgnition2,
            this.midflame.windSpeed,
            this.windDirection.bearingDegrees,
            this.slopeSteepness.ratio,
            this.slopeDirection.aspectDegrees,
            this.options.limitWindSpeedFactor,
            this.options.limitSpreadRateToWindSpeed)
    }
    makeWeightedSurfaceFireBehavior() {
        this.fireBehaviorWeighted.update(
            this.fireBehavior1,
            this.fireBehavior2,
            this.fuelKeys.fuelCover1,
            this.options.fuelModelWeighting)
        this.fireBehaviorSurface = this.fireBehaviorWeighted
    }
    makeSurfaceFireBehaviorCrown() {
        this.fireBehaviorCrown.update(this.fuelBedCrown, this.fuelIgnitionCrown,
            this.windSpeed.at20ft, this.windDirection.bearingDegrees,
            // no slope ratio, no aspect, no wind limit, no spread rate limit
            0, 0, false, false)
    }
    makeFireVectorBack() {
        this.fireVectorBack.update(this.fireSize, this.options.fireVectorFlameLengths)
    }
    makeFireVectorBeta() {
        this.fireVectorBeta.update(this.fireSize, this.firePosition.angleFromHead, this.options.fireVectorFlameLengths)
    }
    makeFireVectorBeta6() {
        this.fireVectorBeta6.update(this.fireSize, this.firePosition.angleFromHead, this.options.fireVectorFlameLengths)
    }
    makeFireVectorHead() {
        this.fireVectorHead.update(this.fireSize, this.options.fireVectorFlameLengths)
    }
    makeFireVectorLeftFlank() {
        this.fireVectorLeftFlank.update(this.fireSize, this.options.fireVectorFlameLengths)
    }
    makeFireVectorPsi() {
        this.fireVectorPsi.update(this.fireSize, this.firePosition.angleFromHead, this.options.fireVectorFlameLengths)
    }
    makeFireVectorRightFlank() {
        this.fireVectorRightFlank.update(this.fireSize, this.options.fireVectorFlameLengths)
    }
    makeSurfaceSpottingLevel() {
        this.surfaceSpotting.update(
            this.spotting.downwindCoverHt, this.spotting.downwindOpenCanopy,
            this.windSpeed.at20ft, this.fireVectorHead.flameLength)
    }
    updateSurfaceSpottingTerrain() {
        this.surfaceSpotting.updateTerrainDistance(
            this.spotting.source,
            this.spotting.ridgeToValleyDist,
            this.spotting.ridgeToValleyElev)
    }
    updateCanopyFuels() {
        this.canopyFuels.updateCanopyFuels(this.canopyStructure.length)
    }
    updateCanopyStructureFromHeightBase() {
        this.canopyStructure.updateFromHeightBase()
    }
    updateAngleFireVectorScorchHeights() {
        for(let vector of [this.fireVectorBeta, this.fireVectorBeta6, this.fireVectorPsi]) {
            vector.updateScorchHeight(this.air.temperature, this.midflame.windSpeed)
        }
    }
    updateFixedFireVectorScorchHeights() {
        for(let vector of [this.fireVectorHead, this.fireVectorBack,
                this.fireVectorRightFlank, this.fireVectorLeftFlank]) {
            vector.updateScorchHeight(this.air.temperature, this.midflame.windSpeed)
        }
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