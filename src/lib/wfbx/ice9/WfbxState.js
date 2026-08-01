import { CanopyFuels } from './CanopyFuels.js'
import { CanopyStructure } from './CanopyStructure.js'
import { FirePosition } from './FirePosition.js'
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
import { makeFireShape } from './makeFireShape.js'
import { makeFireSize } from './makeFireSize.js'
import { makeHeadVector, makeBackVector, makeRightFlankVector, makeLeftFlankVector,
    makeBetaVector, makeBeta6Vector, makePsiVector } from './makeFireVectors.js'
import { makeFuelBed } from './makeFuelBed.js'
import { makeFuelIgnition } from './makeFuelIgnition.js'
import { makeWeightedFireBehavior } from './makeWeightedFireBehavior.js'
import { getScorchHeight } from './utils.js'
import { SpotDistanceFromSurfaceFire } from './SpotDistance.js'

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
        this.tree = {
            species: 'ABBA',
            height: 60,
            dbh: 1,
        }
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
            propsLevel: 3,
        }
        // these are created during execution via calls to makeSomething()
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
        this.fireShape = {}
        this.fireSize = {}
        this.fireVectorHead = {}
        this.fireVectorBack = {}
        this.fireVectorRightFlank = {}
        this.fireVectorLeftFlank = {}
        this.fireVectorBeta = {}
        this.fireVectorBeta6 = {}
        this.fireVectorPsi = {}
        this.surfaceSpotting = {}
    }
    makeActiveCrownFire() {
        this.activeCrownFire = makeActiveCrownFire(
            this.fireBehaviorCrown,
            this.fireBehaviorSurface,
            this.canopyFuels,
            this.windSpeed.at20ft, this.options.propsLevel)
    }
    makeFireShapeFromObservedFire() {
        this.fireShape = makeFireShape(this.fireBehaviorObserved)
    }
    makeFireShapeFromSurfaceFire() {
        this.fireShape = makeFireShape(this.fireBehaviorSurface)
    }
    makeFireSize() {
        this.fireSize = makeFireSize(this.fireShape, this.firePosition, this.options.propsLevel)
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
        this.fuelBed1 = makeFuelBed(this.fuelModel1, this.fuelCuring, this.options.propsLevel)
    }
    makeFuelBed2() {
        this.fuelBed2 = makeFuelBed(this.fuelModel2, this.fuelCuring, this.options.propsLevel)
    }
    makeFuelBedCrown() {
        this.fuelBedCrown = makeFuelBed(this.fuelModelCrown, {curedHerb: 0}, this.options.propsLevel)
    }
    makeFuelIgnition1() {
        this.fuelIgnition1 = makeFuelIgnition(this.fuelBed1, this.fuelMoisture, this.options.propsLevel)
    }
    makeFuelIgnition2() {
        this.fuelIgnition2 = makeFuelIgnition(this.fuelBed2, this.fuelMoisture, this.options.propsLevel)
    }
    makeFuelIgnitionCrown() {
        this.fuelIgnitionCrown = makeFuelIgnition(this.fuelBedCrown, this.fuelMoisture, this.options.propsLevel)
    }
    makeSurfaceFireBehavior1() {
        this.fireBehavior1 = makeFireBehavior(
            this.fuelBed1,
            this.fuelIgnition1,
            this.midflame.windSpeed,
            this.windDirection.bearingDegrees,
            this.slopeSteepness.ratio,
            this.slopeDirection.aspectDegrees,
            this.options.limitWindSpeedFactor,
            this.options.limitSpreadRateToWindSpeed,
            this.options.propsLevel)
        // This IS the surface fire behavior, UNLESS overridden by the weighted fire behavior
        this.fireBehaviorSurface = this.fireBehavior1
    }
    makeSurfaceFireBehavior2() {
        this.fireBehavior2 = makeFireBehavior(
            this.fuelBed2,
            this.fuelIgnition2,
            this.midflame.windSpeed,
            this.windDirection.bearingDegrees,
            this.slopeSteepness.ratio,
            this.slopeDirection.aspectDegrees,
            this.options.limitWindSpeedFactor,
            this.options.limitSpreadRateToWindSpeed,
            this.options.propsLevel)
    }
    makeWeightedSurfaceFireBehavior() {
        this.fireBehaviorWeighted = makeWeightedFireBehavior(
            this.fireBehavior1,
            this.fireBehavior2,
            this.fuelKeys.fuelCover1,
            this.options.fuelModelWeighting)
        this.fireBehaviorSurface = this.fireBehaviorWeighted
    }
    makeSurfaceFireBehaviorCrown() {
        this.fireBehaviorCrown = makeFireBehavior(this.fuelBedCrown, this.fuelIgnitionCrown,
            this.windSpeed.at20ft, this.windDirection.bearingDegrees,
            0, 0, false, false, this.options.propsLevel)
    }
    makeFireVectorBack() {
        this.fireVectorBack = makeBackVector(this.fireSize, this.options.fireVectorFlameLengths)
    }
    makeFireVectorBeta() {
        this.fireVectorBeta = makeBetaVector(this.fireSize, this.firePosition.angleFromHead, this.options.fireVectorFlameLengths)
    }
    makeFireVectorBeta6() {
        this.fireVectorBeta6 = makeBeta6Vector(this.fireSize, this.firePosition.angleFromHead, this.options.fireVectorFlameLengths)
    }
    makeFireVectorHead() {
        this.fireVectorHead = makeHeadVector(this.fireSize, this.options.fireVectorFlameLengths)
    }
    makeFireVectorLeftFlank() {
        this.fireVectorLeftFlank = makeLeftFlankVector(this.fireSize, this.options.fireVectorFlameLengths)
    }
    makeFireVectorPsi() {
        this.fireVectorPsi = makePsiVector(this.fireSize, this.firePosition.angleFromHead, this.options.fireVectorFlameLengths)
    }
    makeFireVectorRightFlank() {
        this.fireVectorRightFlank = makeRightFlankVector(this.fireSize, this.options.fireVectorFlameLengths)
    }
    makeSurfaceSpottingLevel() {
        this.surfaceSpotting = new SpotDistanceFromSurfaceFire(
            this.spotting.downwindCoverHt, this.spotting.downwindOpenCanopy,
            this.windSpeed.at20ft, this.fireVectorHead.flameLength)
    }
    updateSurfaceSpottingTerrain() {
        this.surfaceSpotting.updateTerrainDistance(
            this.surfaceSpotting.levelDistance,
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
            if (vector.firelineIntensity)
                vector.scorchHeight = getScorchHeight(vector.firelineIntensity,
                    this.air.temperature, this.midflameWindSpeed)
        }
    }
    updateFixedFireVectorScorchHeights() {
        for(let vector of [this.fireVectorHead, this.fireVectorBack,
                this.fireVectorRightFlank, this.fireVectorLeftFlank]) {
            if (vector.firelineIntensity)
                vector.scorchHeight = getScorchHeight(vector.firelineIntensity,
                    this.air.temperature, this.midflameWindSpeed)
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
    // updateScorchHeight1() {
    //     this.fireBehavior1.scorchHeight = getScorchHeight(
    //         this.fireBehavior1.firelineIntensity,
    //         this.air.temperature, this.midflameWindSpeed)
    // }
    // updateScorchHeight2() {
    //     this.fireBehavior2.scorchHeight = getScorchHeight(
    //         this.fireBehavior2.firelineIntensity,
    //         this.air.temperature, this.midflameWindSpeed)
    // }
    // updateScorchHeightWeighted() {
    //     this.fireBehaviorWeighted.scorchHeight = getScorchHeight(
    //         this.fireBehaviorWeighted.firelineIntensity,
    //         this.air.temperature, this.midflameWindSpeed)
    // }
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