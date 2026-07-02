// Expands case2 by isolating parametrer inject points as functions
import * as Wfs from '../src/Wfs.js'

const start = performance.now()

const propsLevel = 2
processSurfaceFire(propsLevel)

const stop = performance.now()
console.log(`case3.js ${(stop-start).toFixed(2)} msec`)

function processSurfaceFire(propsLevel) {
    const state = {propsLevel, run: 0, fuelCatalog: Wfs.makeFuelCatalog()}
    processFuelModels(state)
}

// Parameter Level 1 - the fuel model
function processFuelModels(state) {
    for (let fuelKey of [10]) {
        state.fuelKey = fuelKey
        state.fuelModelPod = Wfs.makeFuelModel(state.fuelCatalog, fuelKey, state.propsLevel)
        processCuredFuels(state)
    }
}

// Parameter level 2 - the fuel curing condition determines how much of the 'curable'
function processCuredFuels(state) {
    for(let curedHerb of [0.778]) {
        state.fuelCuringPod = {curedHerb}
        state.fuelBedPod = Wfs.makeFuelBed(state.fuelModelPod, state.fuelCuringPod, state.propsLevel)
        processLiveFuelMoistures(state)
    }
}

// Parameter Level 3a - live fuel moisture contents
function processLiveFuelMoistures(state) {
    for(let moistureLiveStem of [1.5]) {
        for(let moistureLiveHerb of [0.5]) {
            state.fuelMoisturePod = { moistureLiveStem, moistureLiveHerb }
            processDeadFuelMoistures(state)
        }
    }
}
// Parameter Level 3b - dead fuel moisture contents
function processDeadFuelMoistures(state) {
    for(let moistureDead100h of [0.09]) {
        for(let moistureDead10h of [0.07]) {
            for(let moistureDead1h of [0.05]) {
                state.fuelMoisturePod = {...state.fuelMoisturePod,
                    moistureDead100h, moistureDead10h, moistureDead1h}
                state.fuelIgnitionPod = Wfs.makeFuelIgnition(
                    state.fuelBedPod, state.fuelMoisturePod, state.propsLevel)
                processWindSlope(state)
            }
        }
    }
}

// Parameter Level 4 - wind and slope
function processWindSlope(state) {
    for(let aspect of [180]) {
        for(let slopeRatio of [0.25]) {
            for(let windBearing of [90]) {
                for(let midflameWindSpeed of [880]) {
                    state.windSlopePod = {aspect, slopeRatio, windBearing, midflameWindSpeed}
                    state.fireBehaviorPod = Wfs.makeFireBehavior(
                        state.fuelBedPod, state.fuelIgnitionPod, state.windSlopePod, state.propsLevel)
                    state.fireEllipsePod = Wfs.makeFireEllipse(state.fireBehaviorPod, state.propsLevel)
                    processFirePositions(state)
                }
            }
        }
    }
}

// Parameter Level 5 - location and elapsed time
function processFirePositions(state) {
    for(let elapsedTime of [60]) {
        state.firePositionPod = {ignEast: 1000, ignNorth: 2000, elapsedTime}
        state.fireSizePod = Wfs.makeFireSize(state.fireEllipsePod, state.firePositionPod, state.propsLevel)
        state.headVector = Wfs.makeBetaVector(state.fireSizePod)
        state.backVector = Wfs.makeBetaVector(state.fireSizePod)
        state.leftVector = Wfs.makeLeftFlankVector(state.fireSizePod)
        state.rightVector = Wfs.makeLeftFlankVector(state.fireSizePod)

        // Parameter Level 5a - airTemp
        for(let airTemp of [95]) {
            for(let vector of [state.headVector, state.backVector, state.leftVector, state.rightVector]) {
                vector.scorchHeight = Wfs.getScorchHeight(vector.firelineIntensity,
                    airTemp, state.windSlopePod.midflameWindSpeed)
            }
        }
        
        // Parameter Level 5b - angle from fire head
        for(let angleFromHead of [45]) {
            state.betaVector = Wfs.makeBetaVector(state.fireSizePod, angleFromHead)
            state.beta6Vector = Wfs.makeBeta6Vector(state.fireSizePod, angleFromHead)
            state.psiVector = Wfs.makePsiVector(state.fireSizePod, angleFromHead)
            // Parameter Level 5c - air temperature
            for(let airTemp of [95]) {
                for(let vector of [state.betaVector, state.beta6Vector, state.psiVector]) {
                    vector.scorchHeight = Wfs.getScorchHeight(vector.firelineIntensity,
                        airTemp, state.windSlopePod.midflameWindSpeed)
                }
            }
        }
        processState(state)
    }
}

function processState(state) {
    state.run++
}