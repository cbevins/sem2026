import {WfbxState} from '../WfbxState.js'
import {magenta, reset} from './terminal.js'

// Specify the modules to run
const modules = {
    twoFuels: true,
    crownFireBehavior: true,
    scorchHeight: true,
    fireVectorHead: true,
    fireVectorBack: true,
    fireVectorLeftFlank: true,
    fireVectorRightFlank: true,
    fireVectorBeta: true,
    fireVectorBeta6: true,
    fireVectorPsi: true,
    surfaceSpotting: true,
}

// Set higher level modules
modules.angleFireVectors = modules.fireVectorBeta || modules.fireVectorBeta6 || modules.fireVectorPsi
modules.fixedFireVectors = modules.fireVectorHead || modules.fireVectorBack || modules.fireVectorLeftFlank || modules.fireVectorRightFlank
modules.fireVectors = modules.angleFireVectors || modules.fixedFireVectors

// Output stuff
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
    if (modules.twoFuels)
        state.makeFuelBed2()
    if (modules.crownFireBehavior)
        state.makeFuelBedCrown()

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
    if (modules.twoFuels)
        state.makeFuelIgnition2()
    if (modules.crownFireBehavior)
        state.makeFuelIgnitionCrown()

    // 20-ft wind speed is required when the crown fire module is active,
    // and/or when the midflame wind speed is estimated
    // and/or when the spotting module is active
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

    // FireBehavior: Primary
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

    // FireBehavior: Secondary
    if (modules.twoFuels) {
        mod('FireBehavior: Secondary')
        state.makeSurfaceFireBehavior2()
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

    if(modules.fireVectorHead) {
        mod('FireVectorHead')
        state.makeFireVectorHead()
        output('fireVectorHead.angleFromHead')
        output('fireVectorHead.bearing')
        output('fireVectorHead.spreadRate')
        output('fireVectorHead.distance')
        output('fireVectorHead.ratio')
        output('fireVectorHead.firelineIntensity')
        output('fireVectorHead.x')
        output('fireVectorHead.y')
        output('fireVectorHead.east')
        output('fireVectorHead.north')
        output('fireVectorHead.flameLength')
    }

    if(modules.fireVectorBack) {
        mod('FireVectorBack')
        state.makeFireVectorBack()
        output('fireVectorBack.angleFromHead')
        output('fireVectorBack.bearing')
        output('fireVectorBack.spreadRate')
        output('fireVectorBack.distance')
        output('fireVectorBack.ratio')
        output('fireVectorBack.firelineIntensity')
        output('fireVectorBack.x')
        output('fireVectorBack.y')
        output('fireVectorBack.east')
        output('fireVectorBack.north')
        output('fireVectorBack.flameLength')
    }

    if(modules.fireVectorLeftFlank) {
        mod('FireVectorLeftFlank')
        state.makeFireVectorLeftFlank()
        output('fireVectorLeftFlank.angleFromHead')
        output('fireVectorLeftFlank.bearing')
        output('fireVectorLeftFlank.spreadRate')
        output('fireVectorLeftFlank.distance')
        output('fireVectorLeftFlank.ratio')
        output('fireVectorLeftFlank.firelineIntensity')
        output('fireVectorLeftFlank.x')
        output('fireVectorLeftFlank.y')
        output('fireVectorLeftFlank.east')
        output('fireVectorLeftFlank.north')
        output('fireVectorLeftFlank.flameLength')
    }

    if(modules.fireVectorRightFlank) {
        mod('FireVectorRightFlank')
        state.makeFireVectorRightFlank()
        output('fireVectorRightFlank.angleFromHead')
        output('fireVectorRightFlank.bearing')
        output('fireVectorRightFlank.spreadRate')
        output('fireVectorRightFlank.distance')
        output('fireVectorRightFlank.ratio')
        output('fireVectorRightFlank.firelineIntensity')
        output('fireVectorRightFlank.x')
        output('fireVectorRightFlank.y')
        output('fireVectorRightFlank.east')
        output('fireVectorRightFlank.north')
        output('fireVectorRightFlank.flameLength')
    }

    if (modules.scorchHeight && modules.fireVectors) {
        mod('Air')
        input('air.temperature', 95)
    }

    if (modules.scorchHeight && modules.fixedFireVectors) {
        mod('Fixed FireVector ScorchHeight')
        state.updateFixedFireVectorScorchHeights()
        if (modules.fireVectorHead) output('fireVectorHead.scorchHeight')
        if (modules.fireVectorBack) output('fireVectorBack.scorchHeight')
        if (modules.fireVectorRightFlank) output('fireVectorRightFlank.scorchHeight')
        if (modules.fireVectorLeftFlank) output('fireVectorLeftFlank.scorchHeight')
    }
    
    if (modules.angleFireVectors) {
        mod('VectorAngle')
        input('firePosition.angleFromHead', 45)
    }

    if(modules.fireVectorBeta) {
        mod('FireVectorBeta')
        state.makeFireVectorBeta()
        output('fireVectorBeta.angleFromHead')
        output('fireVectorBeta.bearing')
        output('fireVectorBeta.spreadRate')
        output('fireVectorBeta.distance')
        output('fireVectorBeta.ratio')
        output('fireVectorBeta.firelineIntensity')
        output('fireVectorBeta.x')
        output('fireVectorBeta.y')
        output('fireVectorBeta.east')
        output('fireVectorBeta.north')
        output('fireVectorBeta.flameLength')
    }

    if(modules.fireVectorBeta6) {
        mod('FireVectorBeta6')
        state.makeFireVectorBeta6()
        output('fireVectorBeta6.angleFromHead')
        output('fireVectorBeta6.theta')
        output('fireVectorBeta6.psi')
        output('fireVectorBeta6.psiRos')
        output('fireVectorBeta6.bearing')
        output('fireVectorBeta6.spreadRate')
        output('fireVectorBeta6.distance')
        output('fireVectorBeta6.ratio')
        output('fireVectorBeta6.firelineIntensity')
        output('fireVectorBeta6.x')
        output('fireVectorBeta6.y')
        output('fireVectorBeta6.east')
        output('fireVectorBeta6.north')
        output('fireVectorBeta6.flameLength')
    }

    if(modules.fireVectorPsi) {
        mod('FireVectorPsi')
        state.makeFireVectorPsi()
        output('fireVectorPsi.angleFromHead')
        output('fireVectorPsi.bearing')
        output('fireVectorPsi.spreadRate')
        output('fireVectorPsi.distance')
        output('fireVectorPsi.ratio')
        output('fireVectorPsi.firelineIntensity')
        output('fireVectorPsi.x')
        output('fireVectorPsi.y')
        output('fireVectorPsi.east')
        output('fireVectorPsi.north')
        output('fireVectorPsi.flameLength')
    }

    if (modules.scorchHeight && modules.angleFireVectors) {
        mod('Angle FireVector ScorchHeight')
        state.updateAngleFireVectorScorchHeights()
        if (modules.fireVectorBeta) output('fireVectorBeta.scorchHeight')
        if (modules.fireVectorBeta6) output('fireVectorBeta6.scorchHeight')
        if (modules.fireVectorPsi) output('fireVectorPsi.scorchHeight')
    }

    if (modules.surfaceSpotting) {
        mod('Surface Fire Spotting Distance')
        input('spotting.downwindCoverHt', 100)
        input('spotting.downwindOpenCanopy', true)
        // The following were previously input above,
        // but would need to be input here if running stand-alone
        // input('spotting.windSpeedAt20ft', state.windSpeed.at20ft)
        // input('spotting.flameLength', state.fireVectorHead.flameLength)
        state.makeSurfaceSpottingLevel()
        output('surfaceSpotting.coverHt')
        output('surfaceSpotting.firebrandHt')
        output('surfaceSpotting.driftDistance')
        output('surfaceSpotting.flatDistance')
        output('surfaceSpotting.levelDistance')

        input('spotting.source', 'ridgeTop')
        input('spotting.ridgeToValleyDist', 2*5280)
        input('spotting.ridgeToValleyElev', 1000)
        state.updateSurfaceSpottingTerrain()
        output('surfaceSpotting.terrainDistance')
    }
}

// front matter
console.log(new Date())
const start = performance.now()

// meat
const state = new WfbxState()
demo1b()

// back matter
const msec = (performance.now() - start).toFixed(2)
console.table(table)
console.log(magenta+'\nExecution time = '+msec+' msec'+reset)
