import {WfbxState} from '../WfbxState.js'
const state = new WfbxState()
const modules = {
    twoFuels: true,
    crownFireBehavior: true,
}
export function demo1a() {
    console.log('demo1a - All Modules, Standard Input Config (No Output)', new Date())
    
    // FuelModels for primary surface fire, secondarysurface fire, and active crown spread rate
    state.fuelKeys.fuelKey1 = 10
    state.makeFuelModel1()
    if (modules.twoFuels) {
        state.fuelKeys.fuelKey2 = 124
        state.makeFuelModel2()
    }
    if(modules.crownFireBehavior) {
        state.fuelKeys.fuelKeyCrown = 10
        state.makeFuelModelCrown()
    }

    // FuelCuring may be estimated from curable live fuel moisture
    state.fuelMoisture.moistureLiveCurable = 0.5
    state.updateFuelCuringFromLiveMoisture()

    // FuelBeds are derived from FuelModels and FuelCuring
    state.makeFuelBed1()
    if (modules.twoFuels) state.makeFuelBed2()
    if (modules.crownFireBehavior) state.makeFuelBedCrown()

    // Fuel moistures may be input as individual particle moisture contents
    state.fuelMoisture.moistureDead1h = 0.05
    state.fuelMoisture.moistureDead10h = 0.07
    state.fuelMoisture.moistureDead100h = 0.09
    state.updateFuelMoistureDeadFromParticles()

    state.fuelMoisture.moistureLiveHerb = 0.5
    state.fuelMoisture.moistureLiveStem = 1.5
    state.updateFuelMoistureLiveFromParticles()

    // FuelIgnitions are derived from FuelBeds and FuelMoistures
    state.makeFuelIgnition1()
    if (modules.twoFuels) state.makeFuelIgnition2()
    if (modules.crownFireBehavior) state.makeFuelIgnitionCrown()

    // 20-ft wind speed is required when the crown fire module is active,
    // and/or when the midflame wind speed is estimated
    state.windSpeed.at20ft = 880

    // Midflame wind speed may be estimated from 20-ft wind and a wind speed reduction factor (wsrf),
    // and the midflame wsrf may be estimated from the FuelBed and CanopyStructure
    state.canopyStructure.height = 40
    state.canopyStructure.base = 6
    state.canopyStructure.cover = 0.5
    state.updateCanopyStructureFromHeightBase()

    // Active crown fire additionally requires CanopyFuel
    state.canopyFuels.bulkDensity = 0.02
    state.canopyFuels.heatContent = 8000
    state.updateCanopyFuels()

    // Now we can esimate the midflame wind speed reduction factor ...
    state.updateMidflameWsrfFromCanopyFuel()
    // ... and the midflame wind speed
    state.updateMidflameWindSpeedFromWsrf20ft()

    // Wind and slope direction
    state.windDirection.bearingDegrees = 90
    state.updateWindDirectionFromBearingDegrees()

    state.slopeDirection.aspectDegrees = 180
    state.updateSlopeDirectionFromAspectDegrees()

    if (modules.scorchHeight) {
        state.air.temperature = 95
    }

    // SlopeSteepness can be input OR estimated from map measurements
    // state.slopeSteepness.ratio = 0.25
    state.slopeMap.scale = 12000            // 1-inch map = 1000-ft terrain
    state.slopeMap.contourInterval = 100
    state.slopeMap.contoursCrossed = 60     // 6,000-ft
    state.slopeMap.distance = 2             // 12,000-ft
    state.updateSlopeMap()
    state.updateSlopeSteepnessFromMap()

    // FireBehavior
    state.makeSurfaceFireBehavior1()
    if (modules.scorchHeight) state.updateScorchHeight1()
    if (modules.twoFuels) {
        state.makeSurfaceFireBehavior2()
        if (modules.scorchHeight) state.updateScorchHeight2()
        state.makeWeightedSurfaceFireBehavior()
        if (modules.scorchHeight) state.updateScorchWeighted()
    }
    if (modules.crownFireBehavior) {
        state.makeSurfaceFireBehaviorCrown()
        state.makeActiveCrownFire()
    }

    // FireShape
    state.makeFireShapeFromSurfaceFire()

    // FireSize
    state.firePosition.ignEast = 1000
    state.firePosition.ignNorth = 2000
    state.firePosition.elapsedTime = 60
    state.makeFireSize()
    state.makeFireVectorHead()
    state.makeFireVectorBack()
    state.makeFireVectorLeftFlank()
    state.makeFireVectorRightFlank()

    // FireVectors
    state.firePosition.angleFromHead = 45
    state.makeFireVectorBeta()
    state.makeFireVectorBeta6()
    state.makeFireVectorPsi()
}

demo1a()
