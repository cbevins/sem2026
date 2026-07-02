// Expands case 3 by passing a complete set of inpts to each parameter injection function
import * as Wfs from '../src/Wfs.js'

const start = performance.now()

const propsLevel = 2
const inputs = {
    fuelKey: [10],
    curedHerb: [0.778],
    moistureLiveStem: [1.5],
    moistureLiveHerb: [0.5],
    moistureDead100h: [0.09],
    moistureDead10h: [0.07],
    moistureDead1h: [0.05],
    aspect: [180],
    slopeRatio: [0.25],
    windBearing: [90],
    midflameWindSpeed: [880],
    igneast: [1000],
    ignNorth: [2000],
    elapsedTime: [60],
    airTemp: [95],
    angleFromHead: [45],
}
processSurfaceFire(inputs, propsLevel)

const stop = performance.now()
console.log(`case4.js ${(stop-start).toFixed(2)} msec`)

function processSurfaceFire(inputs, propsLevel) {
    const state = {inputs, run: 0, propsLevel, fuelCatalog: Wfs.makeFuelCatalog()}
    processFuelModels(state)
}

// Parameter Level 1 - the fuel model
function processFuelModels(state) {
    for (let fuelKey of state.inputs.fuelKey) {
        state.fuelKey = fuelKey
        state.fuelModelPod = Wfs.makeFuelModel(state.fuelCatalog, fuelKey, state.propsLevel)
        processCuredFuels(state)
    }
}

// Parameter level 2 - the fuel curing condition determines how much of the 'curable'
function processCuredFuels(state) {
    for(let curedHerb of state.inputs.curedHerb) {
        state.fuelCuringPod = {curedHerb}
        state.fuelBedPod = Wfs.makeFuelBed(state.fuelModelPod, state.fuelCuringPod, state.propsLevel)
        processLiveFuelMoistures(state)
    }
}

// Parameter Level 3a - live fuel moisture contents
function processLiveFuelMoistures(state) {
    for(let moistureLiveStem of state.inputs.moistureLiveStem) {
        for(let moistureLiveHerb of state.inputs.moistureLiveHerb) {
            state.fuelMoisturePod = { moistureLiveStem, moistureLiveHerb }
            processDeadFuelMoistures(state)
        }
    }
}
// Parameter Level 3b - dead fuel moisture contents
function processDeadFuelMoistures(state) {
    for(let moistureDead100h of state.inputs.moistureDead1h) {
        for(let moistureDead10h of state.inputs.moistureDead10h) {
            for(let moistureDead1h of state.inputs.moistureDead100h) {
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
    for(let aspect of state.inputs.aspect) {
        for(let slopeRatio of state.inputs.slopeRatio) {
            for(let windBearing of state.inputs.windBearing) {
                for(let midflameWindSpeed of state.inputs.midflameWindSpeed) {
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
    for(let elapsedTime of state.inputs.elapedTime) {
        state.firePositionPod = {ignEast: state.inputs.ignEast, ignNorth: state.inputs.ignNorth,
            elapsedTime}
        state.fireSizePod = Wfs.makeFireSize(state.fireEllipsePod, state.firePositionPod, state.propsLevel)
        state.headVector = Wfs.makeBetaVector(state.fireSizePod)
        state.backVector = Wfs.makeBetaVector(state.fireSizePod)
        state.leftVector = Wfs.makeLeftFlankVector(state.fireSizePod)
        state.rightVector = Wfs.makeLeftFlankVector(state.fireSizePod)

        // Parameter Level 5a - airTemp
        for(let airTemp of state.inputs.airTemp) {
            for(let vector of [state.headVector, state.backVector, state.leftVector, state.rightVector]) {
                vector.scorchHeight = Wfs.getScorchHeight(vector.firelineIntensity,
                    airTemp, state.windSlopePod.midflameWindSpeed)
            }
        }
        
        // Parameter Level 5b - angle from fire head
        for(let angleFromHead of state.inputs.angleFromHead) {
            state.betaVector = Wfs.makeBetaVector(state.fireSizePod, angleFromHead)
            state.beta6Vector = Wfs.makeBeta6Vector(state.fireSizePod, angleFromHead)
            state.psiVector = Wfs.makePsiVector(state.fireSizePod, angleFromHead)
            // Parameter Level 5c - air temperature
            for(let airTemp of state.inputs.airTemp) {
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