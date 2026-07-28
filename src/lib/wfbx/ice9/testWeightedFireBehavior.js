/**
 * Applies the BehavePlus6 test values to the Wfbx surface fire behavior modules.
 * using the BehavePlus6 test fuels, moistures, winds, slopes, etc.
 */
import {WfbxState} from './WfbxState.js'
const state = new WfbxState()

export function testWeightedFireBehavior() {
    state.fuelKeys.fuelKey1 = 10
    state.fuelKeys.fuelKey2 = 124
    state.fuelKeys.fuelCover1 = 0.6
    state.fuelMoisture.moistureLiveCurable = 0.5
    state.fuelMoisture.moistureDead1h = 0.05
    state.fuelMoisture.moistureDead10h = 0.07
    state.fuelMoisture.moistureDead100h = 0.09
    state.fuelMoisture.moistureLiveHerb = 0.5
    state.fuelMoisture.moistureLiveStem = 1.5
    state.fuelMoisture.moistureLiveCurable = 0.5
    state.updateFuelCuringFromLiveMoisture()
    state.midflame.windSpeed = 880
    state.windDirection.bearingDegrees = 90
    state.slopeDirection.aspectDegrees = 180
    state.slopeSteepness.ratio = 0.25

    state.makeFuelModel1()
    state.makeFuelModel2()
    state.makeFuelBed1()
    state.makeFuelBed2()
    state.makeFuelIgnition1()
    state.makeFuelIgnition2()
    state.makeSurfaceFireBehavior1()
    state.makeSurfaceFireBehavior2()
    state.makeWeightedSurfaceFireBehavior()

    console.log('state.fireBehavior1 =', state.fireBehavior1)
    console.log('state.fireBehavior2 =', state.fireBehavior2)
    console.log('state.weightedFireBehavior =', state.weightedFireBehavior)

    // Expected weighted surface results
    const xros1 = 18.551680325448835
    const xros2 = 48.47042599399056
    const xcover1 = 0.6
    const xrosH = 1 / (xcover1 / xros1 + (1 - xcover1) / xros2)
    const xrosA = xcover1 * xros1 + (1-xcover1) * xros2
    const xhpua2 = 12976.692888496578 * 0.23541979977677915

    const fire1 = state.fireBehavior1
    const fire2 = state.fireBehavior2
    const wtd = state.weightedFireBehavior
    const results = []
    const testProperty = [
        // Part 1 - weighted fire spread rates
        ['fire1.headingSpreadRate', fire1.headingSpreadRate, xros1],
        ['fire2.headingSpreadRate', fire2.headingSpreadRate, xros2],
        ['wtd.headingSpreadRate', wtd.headingSpreadRate, xrosA],
        ['wtd.arithmeticMeanSpreadRate', wtd.arithmeticMeanSpreadRate, xrosA],
        ['wtd.harmonicMeanSpreadRate', wtd.harmonicMeanSpreadRate, xrosH],

        // Part 2 - the following 6 properties are always bound to the primary fuel
        ['fire1.headingFromUpslope', fire1.headingFromUpslope, 87.573367385837855],
        ['fire2.headingFromUpslope', fire2.headingFromUpslope, 87.613728665173383],
        ['wtd.headingFromUpslope', wtd.headingFromUpslope, fire1.headingFromUpslope],
        ['fire1.bearing', fire1.bearing, 87.573367385837855],
        ['fire2.bearing', fire2.bearing, 87.613728665173383],
        ['wtd.bearing', wtd.bearing, fire1.bearing],
        ['fire1.lengthWidthRatio', fire1.lengthWidthRatio, 3.5015680219321221],
        ['fire2.lengthWidthRatio', fire2.lengthWidthRatio, 3.501581941],
        ['wtd.lengthWidthRatio', wtd.lengthWidthRatio, fire1.lengthWidthRatio],
        ['fire1.midflameWindSpeed', fire1.midflameWindSpeed, 880],
        ['fire2.midflameWindSpeed', fire2.midflameWindSpeed, 880],
        ['wtd.midflameWindSpeed', wtd.midflameWindSpeed, 880],
        ['fire1.effWindSpeed', fire1.effWindSpeed, 880.55194372010692],
        ['fire2.effWindSpeed', fire2.effWindSpeed, 880.5568433322004],
        ['wtd.effWindSpeed', wtd.effWindSpeed, fire1.effWindSpeed],

        // Part 3 - the effective wind speed limit is the minimum of the 2 fuels
        ['fire1.effWindSpeedLimit', fire1.effWindSpeedLimit, 5215.2258602062057],
        ['fire2.effWindSpeedLimit', fire2.effWindSpeedLimit, 11679.02359964692],
        
        // and the effective wind speed limit is exceeded if EITHER are exceeded
        ['fire1.effWindLimitExceeded', fire1.effWindLimitExceeded, false],
        ['fire2.effWindLimitExceeded', fire2.effWindLimitExceeded, false],
        ['wtd.effWindLimitExceeded', wtd.effWindLimitExceeded, false],

        // Part 4 - the following 5 properties are always bound to the maximum of the 2 fuels
        ['fire1.reactionIntensity', fire1.reactionIntensity, 5794.6954002291168],
        ['fire2.reactionIntensity', fire2.reactionIntensity, 12976.692888496578],
        ['wtd.reactionIntensity', wtd.reactionIntensity, fire2.reactionIntensity],

        ['fire1.heatPerUnitArea', fire1.heatPerUnitArea, 1261.1929372603729],
        ['fire2.heatPerUnitArea', fire2.heatPerUnitArea, xhpua2],
        ['wtd.heatPerUnitArea', wtd.heatPerUnitArea, xhpua2],
        
        ['fire1.firelineIntensity', fire1.firelineIntensity, 389.95413667947145],
        ['fire2.firelineIntensity', fire2.firelineIntensity, 2467.928645],
        ['wtd.firelineIntensity', wtd.firelineIntensity, fire2.firelineIntensity],

        ['fire1.flameLength', fire1.flameLength, 6.9996889013229229],
        ['fire2.flameLength', fire2.flameLength, 16.35631663],
        ['wtd.flameLength', wtd.flameLength, fire2.flameLength],
        // Not yet implemented
        // [fire1.scorch, 39.58018178], [fire2.scorch, 215.6827713], [wtd.scorch, fire2.scorch.value],
    ]

    // Display the test results
    console.log('\nPrimary, Secondary, and Weighted Surface Fire Behavior')
    for(let [label, actual, expected] of testProperty) {
        const difference = Math.abs(actual-expected).toFixed(6)
        results.push({label, actual, expected, difference})
    }
    console.table(results)
}
testWeightedFireBehavior()