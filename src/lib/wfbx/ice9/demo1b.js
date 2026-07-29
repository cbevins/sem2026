import {WfbxState} from './WfbxState.js'
const state = new WfbxState()
const modules = {
    twoFuels: true,
    crownFireBehavior: true,
    scorchHeight: true,
}
const table = []
const widKey = 46
const widVal = 28

function refProp(key) {
    const chain = key.split('.')
    let ref = state
    const prop = chain.pop()
    for(let i=0; i<chain.length; i++) {
        ref = ref[chain[i]]
        if (ref === undefined)
            throw new Error(`Input key '${key}' storage variable state.${chain[i]} is undefined for property '${chain[i]}'.`)
    }
    return {ref, prop}
}

function trunc(str, maxLength) {
    return (str.length > maxLength) ? str.slice(0, maxLength) + '...' : str
}

function input(key, value) {
    const {ref, prop} = refProp(key)
    ref[prop] = value
    table.push({type: 'inp', key, value})
}

function output(key) {
    const {ref, prop} = refProp(key)
    let value = ref[prop]
    if (typeof value === "string") value=trunc(value, widVal)
    table.push({type: 'out', key, value})
}

function mod(key) {
    const n = Math.trunc((widKey - key.length)/2)
    const pad = ''.padStart(n, '-')
    key = pad+key+pad
    table.push({type: 'mod', key, value: ''.padStart(widVal, '-')})
}

export function demo1b() {
    console.log('demo1a - All Modules, Standard Input Config', new Date())
    
    // FuelModels for primary surface fire, secondarysurface fire, and active crown spread rate
    mod('Fuel Models')
    input('fuelKeys.fuelKey1', 10)
    state.makeFuelModel1()
    output('fuelModel1.code')
    output('fuelModel1.label')
    output('fuelModel1.depth')
    if (modules.twoFuels) {
        input('fuelKeys.fuelKey2', 124)
        state.makeFuelModel2()
        output('fuelModel2.code')
        output('fuelModel2.label')
        output('fuelModel2.depth')
    }
    if(modules.crownFireBehavior) {
        input('fuelKeys.fuelKeyCrown', 10)
        state.makeFuelModelCrown()
    }

    // FuelCuring may be estimated from curable live fuel moisture
    mod('Fuel Curing')
    input('fuelMoisture.moistureLiveCurable', 0.5)
    state.updateFuelCuringFromLiveMoisture()
    output('fuelCuring.curedHerb')

    // FuelBeds are derived from FuelModels and FuelCuring
    mod('Fuel Beds')
    state.makeFuelBed1()
    output('fuelBed1.savr')
    output('fuelBed1.bulkDensity')
    output('fuelBed1.packingRatio')
    output('fuelBed1.packingRatioOpt')
    output('fuelBed1.residenceTime')
    output('fuelBed1.midflameWsrf')
    if (modules.twoFuels) state.makeFuelBed2()
    if (modules.crownFireBehavior) state.makeFuelBedCrown()

    // Fuel moistures may be input as individual particle moisture contents
    mod('Fuel Moistures')
    input('fuelMoisture.moistureDead1h', 0.05)
    input('fuelMoisture.moistureDead10h', 0.07)
    input('fuelMoisture.moistureDead100h', 0.09)
    state.updateFuelMoistureDeadFromParticles()

    input('fuelMoisture.moistureLiveHerb', 0.5)
    input('fuelMoisture.moistureLiveStem', 1.5)
    state.updateFuelMoistureLiveFromParticles()

    // FuelIgnitions are derived from FuelBeds and FuelMoistures
    mod('Fuel Ignition')
    state.makeFuelIgnition1()
    output('fuelIgnition1.dead.mext')
    output('fuelIgnition1.dead.moistureDamping')
    output('fuelIgnition1.live.mext')
    output('fuelIgnition1.live.moistureDamping')
    output('fuelIgnition1.dead.reactionIntensity')
    output('fuelIgnition1.live.reactionIntensity')
    output('fuelIgnition1.reactionIntensity')
    output('fuelIgnition1.heatSource')
    output('fuelIgnition1.heatSink')
    output('fuelIgnition1.noWindSpreadRate')
    if (modules.twoFuels) state.makeFuelIgnition2()
    if (modules.crownFireBehavior) state.makeFuelIgnitionCrown()

    // 20-ft wind speed is required when the crown fire module is active,
    // and/or when the midflame wind speed is estimated
    mod('Wind Speed')
    input('windSpeed.at20ft', 880)

    // Midflame wind speed may be estimated from 20-ft wind and a wind speed reduction factor (wsrf),
    // and the midflame wsrf may be estimated from the FuelBed and CanopyStructure
    mod('CanopyStructure')
    input('canopyStructure.height', 40)
    input('canopyStructure.base', 6)
    input('canopyStructure.cover', 0.5)
    state.updateCanopyStructureFromHeightBase()
    output('canopyStructure.length')
    output('canopyStructure.ratio')
    output('canopyStructure.fill')
    output('canopyStructure.sheltersFuel')
    output('canopyStructure.midflameWsrf')

    // Active crown fire additionally requires CanopyFuel
    mod('CanopyFuels')
    input('canopyFuels.bulkDensity', 0.02)
    input('canopyFuels.heatContent', 8000)
    state.updateCanopyFuels()
    output('canopyFuels.fuelLoad')
    output('canopyFuels.heatPerUnitArea')

    mod('MidflameWindSpeed')
    // Now we can esimate the midflame wind speed reduction factor ...
    state.updateMidflameWsrfFromCanopyFuel()
    // ... and the midflame wind speed
    state.updateMidflameWindSpeedFromWsrf20ft()
    output('midflame.windSpeed')
    output('midflame.wsrf')

    // Wind and slope direction
    mod('WindDirection')
    input('windDirection.bearingDegrees', 90)
    state.updateWindDirectionFromBearingDegrees()
    output('windDirection.bearingCompass')
    output('windDirection.sourceDegrees')
    output('windDirection.sourceCompass')

    mod('SlopeDirection')
    input('slopeDirection.aspectDegrees', 180)
    state.updateSlopeDirectionFromAspectDegrees()
    output('slopeDirection.aspectCompass')
    output('slopeDirection.upslopeDegrees')
    output('slopeDirection.upslopeCompass')

    if (modules.scorchHeight) {
        mod('Air')
        input('air.temperature', 95)
    }

    // SlopeSteepness can be input OR estimated from map measurements
    mod('SlopeMap')
    // state.slopeSteepness.ratio = 0.25
    input('slopeMap.scale', 12000)            // 1-inch map = 1000-ft terrain
    input('slopeMap.contourInterval', 100)
    input('slopeMap.contoursCrossed', 60)     // 6,000-ft
    input('slopeMap.distance', 2)             // 12,000-ft
    state.updateSlopeMap()
    output('slopeMap.slopeRatio')
    output('slopeMap.slopeDegrees')
    mod('SlopeSteepness')
    state.updateSlopeSteepnessFromMap()
    output('slopeSteepness.ratio')
    output('slopeSteepness.degrees')

    // FireBehavior -  One Fuel
    mod('FireBehavior: Primary')
    state.makeSurfaceFireBehavior1()
    output('fireBehavior1.headingSpreadRate')
    output('fireBehavior1.bearing')
    output('fireBehavior1.headingFromUpslope')
    output('fireBehavior1.firelineIntensity')
    output('fireBehavior1.flameLength')
    output('fireBehavior1.effWindSpeed')
    output('fireBehavior1.lengthWidthRatio')
    output('fireBehavior1.reactionIntensity')
    output('fireBehavior1.heatPerUnitArea')
    output('fireBehavior1.residenceTime')
    output('fireBehavior1.midflameWindSpeed')

    output('fireBehavior1.effWindSpeedLimit')
    output('fireBehavior1.spreadRateLimit')
    output('fireBehavior1.effWindLimitExceeded')
    output('fireBehavior1.slopeFactor')
    output('fireBehavior1.windFactor')
    output('fireBehavior1.effWindFactor')
    output('fireBehavior1.upslopeFromNorth')
    output('fireBehavior1.windHeadingFromUpslope')
    if (modules.scorchHeight) {
        state.updateScorchHeight1()
        output('fireBehavior1.scorchHeight')
    }

    // FireBehavior - Two Fuels
    if (modules.twoFuels) {
        mod('FireBehavior: Secondary')
        state.makeSurfaceFireBehavior2()
        if (modules.scorchHeight) state.updateScorchHeight2()
        mod('FireBehavior: Secondary')
        output('fireBehavior2.headingSpreadRate')
        output('fireBehavior2.bearing')
        output('fireBehavior2.effWindFactor')
        output('fireBehavior2.effWindSpeed')
        output('fireBehavior2.headingFromUpslope')
        output('fireBehavior2.lengthWidthRatio')
        output('fireBehavior2.midflameWindSpeed')
        output('fireBehavior2.reactionIntensity')
        output('fireBehavior2.heatPerUnitArea')
        output('fireBehavior2.firelineIntensity')
        output('fireBehavior2.flameLength')
        output('fireBehavior2.effWindLimitExceeded')
        output('fireBehavior2.effWindSpeedLimit')
        output('fireBehavior2.spreadRateLimit')
        output('fireBehavior2.residenceTime')
        output('fireBehavior2.slopeFactor')
        output('fireBehavior2.windFactor')
        if (modules.scorchHeight) {
            state.updateScorchHeight2()
            output('fireBehavior2.scorchHeight')
        }

        mod('FireBehavior: Weighted')
        state.makeWeightedSurfaceFireBehavior()
        output('fireBehaviorWeighted.bearing')
        output('fireBehaviorWeighted.effWindFactor')
        output('fireBehaviorWeighted.effWindSpeed')
        output('fireBehaviorWeighted.headingFromUpslope')
        output('fireBehaviorWeighted.lengthWidthRatio')
        output('fireBehaviorWeighted.midflameWindSpeed')
        output('fireBehaviorWeighted.reactionIntensity')
        output('fireBehaviorWeighted.heatPerUnitArea')
        output('fireBehaviorWeighted.firelineIntensity')
        output('fireBehaviorWeighted.flameLength')
        output('fireBehaviorWeighted.effWindLimitExceeded')
        output('fireBehaviorWeighted.effWindSpeedLimit')
        output('fireBehaviorWeighted.arithmeticMeanSpreadRate')
        output('fireBehaviorWeighted.harmonicMeanSpreadRate')
        if (modules.scorchHeight) {
            state.updateScorchHeightWeighted()
            output('fireBehaviorWeighted.scorchHeight')
        }
    }
    if (modules.crownFireBehavior) {
        mod('Active Crown Fire')
        state.makeSurfaceFireBehaviorCrown()
        state.makeActiveCrownFire()
        output('activeCrownFire.activeSpreadRate')
        output('activeCrownFire.activeFirelineIntensity')
        output('activeCrownFire.activeFlameLength')
        output('activeCrownFire.activeHeatPerUnitArea')
        output('activeCrownFire.powerOfTheFire')
        output('activeCrownFire.powerOfTheWind')
        output('activeCrownFire.fireWindPowerRatio')
        output('activeCrownFire.isPlumeDominated')
        output('activeCrownFire.isWindDriven')
    }

    // FireShape
    mod('FireShape: Linked')
    state.makeFireShapeFromSurfaceFire()
    output('fireShape.headingSpreadRate')
    output('fireShape.lengthWidthRatio')
    output('fireShape.flameLength')
    output('fireShape.bearing')
    output('fireShape.eccentricity')
    output('fireShape.backingSpreadRate')
    output('fireShape.majorExpansionRate')
    output('fireShape.minorExpansionRate')
    output('fireShape.fSpreadRate')
    output('fireShape.hSpreadRate')
    output('fireShape.gSpreadRate')
    output('fireShape.latusRectumSpreadRate')
    output('fireShape.effectiveWindSpeed')
    output('fireShape.firelineIntensity')
    output('fireShape.heatPerUnitArea')
    output('fireShape.rotationDeg')
    output('fireShape.rotationRad')
    output('fireShape.rotationCos')
    output('fireShape.rotationSin')
    output('fireShape.rotationCosInv')
    output('fireShape.rotationSinInv')

    // FireSize
    mod('FireSize')
    input('firePosition.ignEast', 1000)
    input('firePosition.ignNorth', 2000)
    input('firePosition.elapsedTime', 60)
    state.makeFireSize()
    output('fireSize.headingDistance')
    output('fireSize.backingDistance')
    output('fireSize.elapsedTime')
    output('fireSize.fDistance')
    output('fireSize.gDistance')
    output('fireSize.hDistance')
    output('fireSize.latusRectumDistance')
    output('fireSize.length')
    output('fireSize.width')
    output('fireSize.area')
    output('fireSize.acres')
    output('fireSize.perimeter')
    output('fireSize.ignEast')
    output('fireSize.ignNorth')
    output('fireSize.ignX')
    output('fireSize.ignY')
    output('fireSize.centerX')
    output('fireSize.centerY')
    output('fireSize.centerE')
    output('fireSize.centerN')

    mod('FireVectorHead')
    state.makeFireVectorHead()
    output('vectorHead.angleFromHead')
    output('vectorHead.bearing')
    output('vectorHead.spreadRate')
    output('vectorHead.distance')
    output('vectorHead.ratio')
    output('vectorHead.firelineIntensity')
    output('vectorHead.x')
    output('vectorHead.y')
    output('vectorHead.east')
    output('vectorHead.north')
    output('vectorHead.flameLength')

    mod('FireVectorBack')
    state.makeFireVectorBack()
    output('vectorBack.angleFromHead')
    output('vectorBack.bearing')
    output('vectorBack.spreadRate')
    output('vectorBack.distance')
    output('vectorBack.ratio')
    output('vectorBack.firelineIntensity')
    output('vectorBack.x')
    output('vectorBack.y')
    output('vectorBack.east')
    output('vectorBack.north')
    output('vectorBack.flameLength')

    mod('FireVectorLeftFlank')
    state.makeFireVectorLeftFlank()
    output('vectorLeftFlank.angleFromHead')
    output('vectorLeftFlank.bearing')
    output('vectorLeftFlank.spreadRate')
    output('vectorLeftFlank.distance')
    output('vectorLeftFlank.ratio')
    output('vectorLeftFlank.firelineIntensity')
    output('vectorLeftFlank.x')
    output('vectorLeftFlank.y')
    output('vectorLeftFlank.east')
    output('vectorLeftFlank.north')
    output('vectorLeftFlank.flameLength')

    mod('FireVectorRightFlank')
    state.makeFireVectorRightFlank()
    output('vectorRightFlank.angleFromHead')
    output('vectorRightFlank.bearing')
    output('vectorRightFlank.spreadRate')
    output('vectorRightFlank.distance')
    output('vectorRightFlank.ratio')
    output('vectorRightFlank.firelineIntensity')
    output('vectorRightFlank.x')
    output('vectorRightFlank.y')
    output('vectorRightFlank.east')
    output('vectorRightFlank.north')
    output('vectorRightFlank.flameLength')

    mod('VectorAngle')
    input('firePosition.angleFromHead', 45)

    mod('FireVectorBeta')
    state.makeFireVectorBeta()
    output('vectorBeta.angleFromHead')
    output('vectorBeta.bearing')
    output('vectorBeta.spreadRate')
    output('vectorBeta.distance')
    output('vectorBeta.ratio')
    output('vectorBeta.firelineIntensity')
    output('vectorBeta.x')
    output('vectorBeta.y')
    output('vectorBeta.east')
    output('vectorBeta.north')
    output('vectorBeta.flameLength')

    mod('FireVectorBeta6')
    state.makeFireVectorBeta6()
    output('vectorBeta6.angleFromHead')
    output('vectorBeta6.theta')
    output('vectorBeta6.psi')
    output('vectorBeta6.psiRos')
    output('vectorBeta6.bearing')
    output('vectorBeta6.spreadRate')
    output('vectorBeta6.distance')
    output('vectorBeta6.ratio')
    output('vectorBeta6.firelineIntensity')
    output('vectorBeta6.x')
    output('vectorBeta6.y')
    output('vectorBeta6.east')
    output('vectorBeta6.north')
    output('vectorBeta6.flameLength')

    mod('FireVectorPsi')
    state.makeFireVectorPsi()
    output('vectorPsi.angleFromHead')
    output('vectorPsi.bearing')
    output('vectorPsi.spreadRate')
    output('vectorPsi.distance')
    output('vectorPsi.ratio')
    output('vectorPsi.firelineIntensity')
    output('vectorPsi.x')
    output('vectorPsi.y')
    output('vectorPsi.east')
    output('vectorPsi.north')
    output('vectorPsi.flameLength')
}
const start = performance.now()
demo1b()
const stop = performance.now()
console.table(table)
console.log(`Execution time was ${(stop-start).toFixed(2)} milliseconds.`)
