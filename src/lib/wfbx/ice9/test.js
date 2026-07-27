import {WfbxState} from './WfbxState.js'
const state = new WfbxState()

function test() {
    
    //--------------------------------------------------------------------------
    // FuelMoisture and FuelCuring
    //--------------------------------------------------------------------------

    state.fuelMoisture.moistureDeadCategory = 0.1234
    state.updateFuelMoistureDeadFromCategory()
    state.fuelMoisture.moistureLiveCategory = 1.234
    state.updateFuelMoistureLiveFromCategory()
    // console.log('state.fuelMoisture =', state.fuelMoisture)

    state.fuelMoisture.moistureDead1h = 0.05
    state.fuelMoisture.moistureDead10h = 0.07
    state.fuelMoisture.moistureDead100h = 0.09
    state.updateFuelMoistureDeadFromParticles()

    state.fuelMoisture.moistureLiveHerb = 0.5
    state.fuelMoisture.moistureLiveStem = 1.5
    state.updateFuelMoistureLiveFromParticles()
    // console.log('state.fuelMoisture =', state.fuelMoisture)

    state.fuelMoisture.moistureLiveCurable = 0.5
    // console.log('state.fuelMoisture =', state.fuelMoisture)
    state.updateFuelCuringFromLiveMoisture()
    // console.log('state.fuelCuring =', state.fuelCuring)

    //--------------------------------------------------------------------------
    // FuelModel
    //--------------------------------------------------------------------------
    state.fuelKeys.fuelKey1 = 10
    state.makeFuelModel1()
    // console.log('state.fuelModel1 =', state.fuelModel1)

    state.fuelKeys.fuelKey2 = 124
    state.makeFuelModel2()
    // console.log('state.fuelModel2 =', state.fuelModel2)

    state.fuelKeys.fuelKeyCrown = 10
    state.makeFuelModelCrown()
    // console.log('state.fuelModelCrown =', state.fuelModelCrown)

    //--------------------------------------------------------------------------
    // FuelBed
    //--------------------------------------------------------------------------

    state.makeFuelBed1()
    // console.log('state.fuelBed1 =', state.fuelBed1)

    state.makeFuelBed2()
    // console.log('state.fuelBed2 =', state.fuelBed2)
    
    state.makeFuelBedCrown()
    // console.log('state.fuelBedCrown =', state.fuelBedCrown)

    //--------------------------------------------------------------------------
    // FuelIgnition
    //--------------------------------------------------------------------------

    state.makeFuelIgnition1()
    // console.log('state.fuelIgnition1 =', state.fuelIgnition1)
    
    state.makeFuelIgnition2()
    // console.log('state.fuelIgnition2 =', state.fuelIgnition2)
    
    state.makeFuelIgnitionCrown()
    // console.log('state.fuelIgnitionCrown =', state.fuelIgnitionCrown)

    //--------------------------------------------------------------------------
    // MidflameWindSpeed, MidflameWsrf, CanopyStructure, WindSpeed
    //--------------------------------------------------------------------------

    state.windSpeed.at20ft = 880
    state.updateWindSpeedFrom20ft()
    state.updateWindSpeedFrom10m()
    // console.log('state.windSpeed =', state.windSpeed)

    // console.log('state.midflame (initial) =', state.midflame)
    state.midflame.windSpeed = 1234
    // console.log('state.midflame (direct input) =', state.midflame)
    state.midflame.windSpeed = 880
    state.midflame.wsrf = 0.5
    state.updateMidflameWindSpeedFromWsrf20ft()
    // console.log('state.midflame (20ft and input wsrf) =', state.midflame)

    state.canopyStructure.height = 40
    state.canopyStructure.base = 6
    state.canopyStructure.cover = 0.5
    state.updateCanopyStructureFromHeightBase()
    // console.log('state.canopyStructure = ', state.canopyStructure)

    state.updateMidflameWsrfFromCanopyFuel()
    // console.log('state.midflame (20ft and estimated wsrf) =', state.midflame)

    //--------------------------------------------------------------------------
    // WindDirection
    //--------------------------------------------------------------------------

    // console.log('state.windDirection (initial) =', state.windDirection)

    state.windDirection.bearingCompass = 'ese'
    state.updateWindDirectionFromBearingCompass()
    // console.log('state.windDirection (input bearingCompass) =', state.windDirection)
    
    state.windDirection.sourceCompass = 'wsw'
    state.updateWindDirectionFromSourceCompass()
    // console.log('state.windDirection (input sourceCompass) =', state.windDirection)
    
    state.windDirection.sourceDegrees = 295
    state.updateWindDirectionFromSourceDegrees()
    // console.log('state.windDirection (input sourceDegrees) =', state.windDirection)
    
    state.windDirection.bearingDegrees = 157
    state.updateWindDirectionFromBearingDegrees()
    // console.log('state.windDirection (input bearingDegrees) =', state.windDirection)

    //--------------------------------------------------------------------------
    // SlopeSteepness, SlopeMap
    //--------------------------------------------------------------------------

    // console.log('state.slopeSteepness (initial) =', state.slopeSteepness)

    state.slopeSteepness.ratio = 0.25
    state.updateSlopeSteepnessFromRatio()
    // console.log('state.slopeSteepness (input ratio) =', state.slopeSteepness)

    state.slopeSteepness.degrees = 45
    state.updateSlopeSteepnessFromDegrees()
    // console.log('state.slopeSteepness (input degrees) =', state.slopeSteepness)

    // console.log('state.slopeMap (initial) =', state.slopeMap)

    state.slopeMap.scale = 12000            // 1-inch map = 1000-ft terrain
    state.slopeMap.contourInterval = 100
    state.slopeMap.contoursCrossed = 60     // 6,000-ft
    state.slopeMap.distance = 2             // 12,000-ft
    state.updateSlopeMap()
    // console.log('state.slopeMap (input contours, distance) =', state.slopeMap)
    state.updateSlopeSteepnessFromMap()
    // console.log('state.slopeSteepness (from slopeMap) =', state.slopeSteepness)

    //--------------------------------------------------------------------------
    // SlopeDirection
    //--------------------------------------------------------------------------

    // console.log('state.slopeDirection (initial) =', state.slopeDirection)

    state.slopeDirection.upslopeDegrees = 270
    state.updateSlopeDirectionFromUpslopeDegrees()
    // console.log('state.slopeDirection (input upslope) =', state.slopeDirection)
    
    state.slopeDirection.upslopeCompass = 'wsw'
    state.updateSlopeDirectionFromUpslopeCompass()
    // console.log('state.upslopeDirection (input upslopeCompass) =', state.slopeDirection)

    state.slopeDirection.aspectDegrees = 195
    state.updateSlopeDirectionFromAspectDegrees()
    // console.log('state.slopeDirection (input aspect) =', state.slopeDirection)
    
    state.slopeDirection.aspectCompass = 'wsw'
    state.updateSlopeDirectionFromAspectCompass()
    console.log('state.slopeDirection (input aspectCompass) =', state.slopeDirection)
}

test()