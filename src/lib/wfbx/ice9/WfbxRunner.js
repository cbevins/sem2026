import { makeFuelCatalog } from "./makeFuelCatalog.js"
import { makeFuelModel } from './makeFuelModel.js'
import { FuelCuring } from './FuelCuring.js'
import { makeFuelBed } from './makeFuelBed.js'

export class WfbxRunner {
    constructor() {
        this.fuelCatalog = makeFuelCatalog()    // only need to make this once

        this.modules = {
            fuelCuring: true,
            fuelModel: true,
            fuelBed: true,
            fuelIgnition: true,
            twoFuels: true,
            crownFireBehavior: true,
            surfaceFireBehavior: true,
            fireShape: true,
            fireSize: true,
            firePosition: true,
            fireVector: true,
            scorchHeight: true,
            treeMortality: true,
        }
        this.configs = {
            fuelCuringFrom: 'liveMoisture',     // input, liveMoisture
            deadMoistureFrom: 'particles',      // particles, category
            liveMoistureFrom: 'particles',       // particles, category
            midflameWindSpeedFrom: 'wsrf20ft',     // input, wsrf20ft
            midflameWsrfFrom: 'canopyFuel',      // input, canopyFuel
            slopeDirectionFrom: 'aspect',      // aspect, upslope
            slopeSteepnessFrom: 'slopeMap',     // slopeDegrees, slopeMap, slopeRatio
            windDirectionFrom: 'sourceCompass', // bearingDegrees, sourceCompass, sourceDegrees
        }
        this.state = {
            fuelKeys: {fuelKey1: 0, fuelKey2: 0},
            fuelMoisture: {
                // the following keys match the FuelModel Particle moisture class keys
                moistureDead1h: 1,
                moistureDead10h: 1,
                moistureDead100h: 1,
                moistureDeadCategory: 1,
                moistureLiveCategory: 5,
                moistureLiveCurable: 5,
                moistureLiveHerb: 5,
                moistureLiveStem: 5,
            },
            midflame: {windSpeed: 880, wsrf: 1},
            slopeDirection: {slopeAspect: 180, slopeUpslope: 0},
            slopeMap: {scale: 24000, contourInterval:100, contoursCrossed: 0, distance: 0},
            slopeSteepness: {slopeDegrees: 12, slopeRatio: 0.25},
            windDirection: {bearingDegrees: 90, sourceDegrees: 270, sourceCompass: 'W', bearingCompass: 'E'},
            windSpeed: {windSpeed10m: 0, windSpeed20ft: 0},
            canopyStructure: {height: 0, base: 0, cover: 0, fill: 0, sheltersFuel: false, midflameWsrf: 1},
            observedFire: {headSpreadRate: 0, headBearing: 0, headFlameLength: 0, lengthWidthRatio: 1},
        }
        this.inputs = {
            fuelKey1: [10],
            fuelKey2: [124],
            curedHerb: [0.778],
            moistureDead1h: [0.05],
            moistureDead10h: [0.07],
            moistureDead100h: [0.09],
            moistureDeadCategory: [0.1],
            moistureLiveCategory: [1.5],
            moistureLiveCurable: [0.5],
            moistureLiveHerb: [0.5],
            moistureLiveStem: [1.5],
            slopeAspect: [180],
            slopeUpslope: [0],
            slopeDegrees: [12],
            slopeRatio: [0.25],
            mapScale: [24000],
            mapContourInterval: [100],
            mapContoursCrossed: [10],
            mapDistance: [10],
            windBearingCompass: ['E'],
            windBearinfDegrees: [90],
            windSourceCompass: ['W'],
            windSourceDgerees: [270],
            midflameWindSpeed: [880],
            midflameWsrf: [1],
            windSpeed20ft: [880],
            canopyHeight: [40],
            canopyBase: [6],
            canopyFill: [0.5],
            observedHeadSpreadRate: [10],
            observedHeadBearing: [90],
            observedHeadFlameLength: [5],
            observedLengthWidthRatio: [2],
        }

        this.messages = []
        this.script = []
        this.inputSet = new Set()
    }
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    call(methodKey) {
        this.script.push(['call', methodKey])
    }
    each(inputKey, stateObj, stateProp) {
        const key = {inputKey, stateObj, stateProp}
        if (! this.inputSet.has(key)) {
            this.inputSet.add(key)
            this.script.push(['each', inputKey])
        }
    }
    run() {
        this.messages = []
        this.inputStack = new Set()
        if (this.modules.fuelModel) {
            this.processFuelCuring()
        }
    }
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    processFuelCuring() {
        if (this.configs.fuelCuringFrom === 'input') {
            this.each('curedHerb', this.state.fuelCuring, 'curedHerb')
            this.call('updateFuelCuringFromInput')
            if(this.modules.fuelModel) {
                this.processFuelModel1()
            }
        }
        else if (this.configs.fuelCuringFrom === 'liveMoisture') {
            this.each('moistureLiveCurable', this.state.fuelMoisture, 'moistureLiveCurable')
            this.call('updateFuelCuringFromLiveMoisture')
            if(this.modules.fuelModel) {
                this.processFuelModel1()
            }
        } else {
            throw new Error(`Config 'fuelCuringFrom' has invalid option '${this.configs.fuelCuringFrom}'.`)
        }
    }
    processFuelModel1() {
        this.each('fuelKey1', this.state.fuelKeys, 'fuelKey1')
        this.call('makeFuelModel1')
        this.call('makeFuelBed1')
        if (this.modules.twoFuels) {
            this.processFuelModel2()
        }
        else if (this.modules.fuelIgnition) {
            this.processFuelMoistureLive()
        }
        return
    }
    processFuelModel2() {
        this.each('fuelKey2', this.state.fuelKeys, 'fuelKey2')
        this.call('makeFuelModel2')
        this.call('makeFuelBed2')
        if (this.modules.fuelIgnition) {
            this.processFuelMoistureLive()
        }
        return
    }
    processFuelMoistureLive() {
        if(this.configs.liveMoistureFrom === 'category') {
            this.each('moistureLiveCategory', this.state.fuelMoisture, 'moistureLiveCategory')
            this.call('updateFuelMoistureLiveFromCategory')
            this.processFuelMoistureDead()
        }
        else if(this.configs.liveMoistureFrom === 'particles') {
            this.each('moistureLiveStem', this.state.fuelMoisture, 'moistureLiveStem')
            this.each('moistureLiveHerb', this.state.fuelMoisture, 'moistureLiveHerb')
            this.call('updateFuelMoistureLiveFromParticles')
            this.processFuelMoistureDead()
        } else {
            throw new Error(`Config 'liveMoistureFrom' has invalid option '${this.configs.liveMoistureFrom}'.`)
        }
    }
    processFuelMoistureDead() {
        if(this.configs.deadMoistureFrom === 'category') {
            this.each('moistureDeadCategory', this.state.fuelMoisture, 'moistureDeadCategory')
            this.call('updateFuelMoistureDeadFromCategory')
            this.processFuelMoistureDead()
            if (this.modules.fuelIgnition) {
                this.processFuelIgnition()
            }
        }
        else if(this.configs.deadMoistureFrom === 'particles') {
            this.each('moistureDead100h', this.state.fuelMoisture, 'moistureDead100h')
            this.each('moistureDead10h', this.state.fuelMoisture, 'moistureDead10h')
            this.each('moistureDead1h', this.state.fuelMoisture, 'moistureDead1h')
            this.call('updateFuelMoistureDeadFromParticles')
            if (this.modules.fuelIgnition) {
                this.processFuelIgnition()
            }
        } else {
            throw new Error(`Config 'deadMoistureFrom' has invalid option '${this.configs.deadMoistureFrom}'.`)
        }
    }
    processFuelIgnition() {
        this.call('makeFuelIgnition1')
        if(this.modules.twoFuels) {
            this.call('makeFuelIgnition2')
        }
        if(this.modules.crownFireBehavior) {
            this.call('makeFuelIgnitionCrown')
        }
        if(this.modules.surfaceFireBehavior) {
            this.processSlopeDirection()
        }
    }
    processSlopeDirection() {
        if(this.configs.slopeDirectionFrom === 'aspect') {
            this.each('slopeAspect', this.state.slopeDirection, 'slopeAspect')
            this.call('updateSlopeDirectionFromAspect')
            this.processSlopeSteepness()
        }
        else if(this.configs.slopeDirectionFrom === 'upslope') {
            this.each('slopeUpslope', this.state.slopeDirection, 'slopeUpslope')
            this.call('updateSlopeDirectionFromUslope')
            this.processSlopeSteepness()
        } else {
            throw new Error(`Config 'slopeDirectionFrom' has invalid option '${this.configs.slopeDirectionFrom}'.`)
        }
    }
    processSlopeSteepness() {
        if(this.configs.slopeSteepnessFrom === 'slopeDegrees') {
            this.each('slopeDegrees', this.state.slopeSteepness, 'slopeDegrees')
            this.call('updateSlopeSteepnessFromDegrees')
            this.processWindDirection()
        }
        else if(this.configs.slopeSteepnessFrom === 'slopeRatio') {
            this.each('slopeRatio', this.state.slopeSteepness, 'slopeRatio')
            this.call('updateSlopeSteepnessFromRatio')
            this.processWindDirection()
        } else if(this.configs.slopeSteepnessFrom === 'slopeMap') {
            this.each('mapScale', this.state.slopeMap, 'scale')
            this.each('mapContourInterval', this.state.slopeMap, 'contourInterval')
            this.each('mapContoursCrossed', this.state.slopeMap, 'contoursCrossed')
            this.each('mapDistance', this.state.slopeMap, 'distance')
            this.call('makeSlopeMap')
            this.call('updateSlopeSteepnessFromMap')
            this.processWindDirection()
        } else {
            throw new Error(`Config 'slopeSteepnessFrom' has invalid option '${this.configs.slopeSteepnessFrom}'.`)
        }
    }
    processWindDirection() {
        if(this.configs.windDirectionFrom === 'bearingCompass') {
            this.each('windBearingCompass', this.state.windDirection, 'bearingCompass')
            this.call('updateWindDirectionFromBearingCompass')
            this.processMidflameWindSpeed()
        }
        else if(this.configs.windDirectionFrom === 'bearingDegrees') {
            this.each('windBearingDegrees', this.state.windDirection, 'bearingDegrees')
            this.call('updateWindDirectionFromBearingDegrees')
            this.processMidflameWindSpeed()
        }
        if(this.configs.windDirectionFrom === 'sourceCompass') {
            this.each('windSourceCompass', this.state.windDirection, 'sourceCompass')
            this.call('updateWindDirectionFromSourceCompass')
            this.processMidflameWindSpeed()
        }
        else if(this.configs.windDirectionFrom === 'sourceDegrees') {
            this.each('windSourceDegrees', this.state.windDirection, 'sourceDegrees')
            this.call('updateWindDirectionFromSourceDegrees')
            this.processMidflameWindSpeed()
        } else {
            throw new Error(`Config 'windDirectionFrom' has invalid option '${this.configs.windDirectionFrom}'.`)
        }
    }
    processMidflameWindSpeed() {
        if(this.configs.midflameWindSpeedFrom === 'input') {
            this.each('midflameWindSpeed', this.state.midflame, 'windSpeed')
            this.processSurfaceFireBehavior()
        }
        else if(this.configs.midflameWindSpeedFrom === 'wsrf20ft') {
            this.processMidflameWindSpeedFromWsrf20ft()
        } else {
            throw new Error(`Config 'midflameWindSpeedFrom' has invalid option '${this.configs.midflameWindSpeedFrom}'.`)
        }
    }
    processMidflameWindSpeedFromWsrf20ft() {
        if(this.configs.midflameWsrfFrom === 'input') {
            this.each('midflameWsrf', this.state.midflame, 'wsrf')
            this.each('windSpeed20ft', this.state.windSpeed, 'windSpeed20ft')
            this.call('updateMidflameWindSpeedFromWsrf20ft')
            this.processSurfaceFireBehavior()
        }
        else if(this.configs.midflameWsrfFrom === 'canopyFuel') {
            this.processMidflameWindSpeedFromCanopyFuel()
        } else {
            throw new Error(`Config 'midflameWsrfFrom' has invalid option '${this.configs.midflameWsrfFrom}'.`)
        }
    }
    processMidflameWindSpeedFromCanopyFuel() {
        this.each('canopyHeight', this.state.canopyStructure, 'height')
        this.each('canopyBase', this.state.canopyStructure, 'base')
        this.each('canopyCover', this.state.canopyStructure, 'cover')
        this.call('makeCanopyStructure')
        this.call('updateMidflameWsrfFromCanopyFuel')
        this.call('updateMidflameWindSpeedFromWsrf20ft')
        this.processSurfaceFireBehavior()
    }
    processSurfaceFireBehavior() {
        this.call('makeSurfaceFireBehavior1')
        if(this.modules.twoFuels) {
            this.call('makeSurfaceFireBehavior2')
            this.call('makeWeightedSurfaceFireBehavior')
        } else {
            this.call('makeSingleSurfaceFireBehavior')
        }
        if(this.modules.crownFireBehavior) {
            this.call('makeActiveCrownFireBehavior')
        }
        if (this.modules.fireShape) {
            this.processFireShape()
        }
    }
    processFireShape() {
        if(!this.configs.surfaceFireBehavior) {
            this.each('observedHeadSpreadRate', this.state.observedFire, 'headSpreadRate')
            this.each('observedHeadBearing', this.state.observedFire, 'headBearing')
            this.each('observedHeadFlameLength', this.state.observedFire, 'headFlameLength')
            this.each('observedLengthWidthRatio', this.state.observedFire, 'lengthWidthRatio')
        }
    }
}

const wfbx = new WfbxRunner()
wfbx.run()
console.log(wfbx.script)
// console.log(wfbx.state.fuelBed1)
