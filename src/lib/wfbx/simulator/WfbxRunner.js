// import * as Wfbx from './Wfbs.js'
export class WfbxRunner {

    constructor() {
        // this.fuelCatalog = new Wfbx.FuelCatalog()
    }
    
    run(config, state, input) {
        this.config = config
        this.input = input
        this.state = state
        this.stack = new Set()
        this.messages = []
        if (this.config.surfaceFuelModelActive || this.config.crownFireActive) {
            this.processFuelModelInputs()
        }
        else if (this.config.fireShapeActive) {
            this.processFireShapeInputs()
        }
        console.log(this.messages)
    }

    //--------------------------------------------------------------------------
    // utility methods used just be WfbxRunner
    //--------------------------------------------------------------------------

    log(msg) {
        const pad = ''.padStart(4*this.stack.size)
        this.messages.push(pad+msg)
    }

    begin(key, value) {
        this.log(`${key} => ${value}`)
        this.stack.add(key)
    }

    end(key) {
        this.stack.delete(key)
        this.log(`${key} end-of-input`)
    }

    //--------------------------------------------------------------------------
    // "process*Inputs() methods descend down the input processing chain
    // based on current configuration
    //--------------------------------------------------------------------------

    processFuelModelInputs() {
        for(let fuelKeyOne of this.input.fuelKeyOne) {
            this.begin('fuelKeyOne', fuelKeyOne)
            this.state.surface1.fuelKey = fuelKeyOne
            this.updateSurface1FuelModel()
            if(this.config.surfaceFuelModels === 2) {
                for(let fuelKeyTwo of this.input.fuelKeyTwo) {
                    this.begin('fuelKeyTwo', fuelKeyTwo)
                    this.state.surface2.fuelKey = fuelKeyTwo
                    this.updateSurface2FuelModel()
                    if(this.config.surfaceFuelCuringActive)
                        this.processFuelCuringInputs()
                }
                this.end('fuelKeyTwo')
            } else {
                if(this.config.surfaceFuelCuringActive)
                    this.processFuelCuringInputs()
            }
        }
        this.end('fuelKeyOne')
    }
    processFuelCuringInputs() {
        const state = this.state
        if (this.config.fuelCuringFrom === 'input') {
            for(let curedHerb of this.input.curedHerb) {
                this.begin('curedHerb', curedHerb)
                state.surface1.curedHerb = curedHerb
                state.surface2.curedHerb = curedHerb
                this.updateSurface1FuelBed()
                if(this.config.surfaceFuelModels === 2)
                    this.updateSurface2FuelBed()
                this.processLiveFuelMoistureInputs()
            }
            this.end('curedHerb')
        }
        else if (this.config.fuelCuringFrom === 'estimate') {
            for(let liveCurableMoisture of this.input.liveCurableMoisture) {
                this.begin('liveCurableMoisture', liveCurableMoisture)
                state.liveMoisture.curable = liveCurableMoisture
                state.surface1.curedHerb = this.fraction(1.333 - 1.11 * liveCurableMoisture)
                state.surface2.curedHerb = state.surface1.curedHerb
                this.updateSurface1FuelBed()
                if(this.config.surfaceFuelModels === 2)
                    this.updateSurface2FuelBed()
                this.processLiveFuelMoistureInputs()
            }
            this.end('liveCurableMoisture')
        }
    }
    processLiveFuelMoistureInputs() {
        const state = this.state
        if (this.config.liveMoistureFrom === 'category') {
            for(let category of this.input.liveMoistureCategory) {
                this.begin('liveMoistureCategory', category)
                state.liveMoisture.category = category
                state.liveMoisture.herb = category
                state.liveMoisture.stem = category
                this.processDeadFuelMoistureInputs()
            }
            this.end('liveMoistureCategory')
        }
        else if (this.config.liveMoistureFrom === 'particles') {
            for(let stem of this.input.liveMoistureStem) {
                this.begin('liveMoistureStem', stem)
                state.liveMoisture.stem = stem
                for(let herb of this.input.liveMoistureHerb) {
                    this.begin('liveMoistureHerb', herb)
                    state.liveMoisture.herb = herb
                    this.processDeadFuelMoistureInputs()
                }
                this.end('liveMoistureHerb')
            }
            this.end('liveMoistureStem')
        }
        else throw new Error(`Invalid config.liveMoistureFrom of '${this.config.liveMoistureFrom}'`)
    }
    processDeadFuelMoistureInputs() {
        const state = this.state
        if (this.config.deadMoistureFrom === 'category') {
            for(let category of this.input.deadMoistureCategory) {
                this.begin('deadMoistureCategory', category)
                state.deadMoisture.category = category
                state.deadMoisture.dead1h = category
                state.deadMoisture.dead10h = category
                state.deadMoisture.dead100h = category
                if(this.config.updateSurfaceFuelIgnitionActive) {
                    this.updateSurface1FuelIgnition()
                    if(this.config.surfaceFuelModels === 2)
                        this.updateSurface2FuelIgnition()
                }
                this.processSlopeDirectionInputs()
            }
            this.end('deadMoistureCategory')
        }
        else if (this.config.deadMoistureFrom === 'particles') {
            for(let dead100h of this.input.deadMoisture100h) {
                this.begin('deadMoisture100h', dead100h)
                state.deadMoisture.dead100h = dead100h
                for(let dead10h of this.input.deadMoisture10h) {
                    this.begin('deadMoisture10h', dead10h)
                    state.deadMoisture.dead10h = dead10h
                    for(let dead1h of this.input.deadMoisture1h) {
                        this.begin('deadMoisture1h', dead1h)
                        state.deadMoisture.dead1h = dead1h
                        this.updateSurface1FuelIgnition()
                        this.updateSurface2FuelIgnition()
                        this.processSlopeDirectionInputs()
                    }
                    this.end('deadMoisture1h')
                }
                this.end('deadMoisture10h')
            }
            this.end('deadMoisture100h')
        }
        else throw new Error(`Invalid config.deadMoistureFrom of '${this.config.deadMoistureFrom}'`)
    }
    processSlopeDirectionInputs() {
        const state = this.state
        if(this.config.slopeDirectionFrom === 'aspect') {
            for(let aspect of this.input.slopeAspect) {
                this.begin('slopeAspect', aspect)
                state.slope.direction.aspect = aspect
                state.slope.direction.upslope = (180 + aspect) % 360
                this.processWindDirectionInputs()
            }
            this.end('slopeAspect')
        }
        else if(this.config.slopeDirectionFrom === 'upslope') {
            for(let upslope of this.input.slopeUpslope) {
                this.begin('slopeUpslope', upslope)
                state.slope.direction.upslope = upslope
                state.slope.direction.aspect = (180 + upslope) % 360
                this.processWindDirectionInputs()
            }
            this.end('slopeUpslope')
        }
    }
    processWindDirectionInputs() {
        const state = this.state
        if(this.config.windDirectionFrom === 'bearingDegrees') {
            for(let bearingDegrees of this.input.windBearingDegrees) {
                this.begin('windBearingDegrees', bearingDegrees)
                state.wind.direction.bearingDegrees = bearingDegrees
                state.wind.direction.sourceDegrees = (180 + bearingDegrees) % 360
                this.processSlopeSteepnessInputs()
            }
            this.end('windBearingDegrees')
        }
        else if (this.config.windDirectionFrom === 'sourceDegrees') {
            for(let sourceDegrees of this.input.windSourceDegrees) {
                this.begin('windSourceDegrees', sourceDegrees)
                state.wind.direction.sourceDegrees = sourceDegrees
                state.wind.direction.bearingDegrees = (180 + sourceDegrees) % 360
                this.processSlopeSteepnessInputs()
            }
            this.end('windSourceDegrees')
        }
        else if (this.config.windDirectionFrom === 'sourceCompass') {
            const pts = {N:0, NE:45, E:90, SE:135, S:180, SW:215, W:270, NW:315}
            for(let sourceCompass of this.input.windSourceCompass) {
                this.begin('windSourceCompass', sourceCompass)
                state.wind.direction.sourceCompass = sourceCompass
                const sourceDegrees = pts[sourceCompass]
                state.wind.direction.sourceDegrees = sourceDegrees
                state.wind.direction.bearingDegrees = (180 + sourceDegrees) % 360
                this.processSlopeSteepnessInputs()
            }
            this.end('windSourceCompass')
        }
    }
    processSlopeSteepnessInputs() {
        const state = this.state
        if(this.config.slopeSteepnessFrom === 'slopeDegrees') {
            for(let degrees of this.input.slopeDegrees) {
                this.begin('slopeDegrees', degrees)
                state.slope.steepness.degrees = degrees
                state.slope.steepness.ratio = Math.tan(this.toRadians(degrees))
                this.processMidflameWindSpeedInputs()
            }
            this.end('slopeDegrees')
        }
        else if(this.config.slopeSteepnessFrom === 'slopeMap') {
            this.processSlopeMapInputs()
        }
        else if(this.config.slopeSteepnessFrom === 'slopeRatio') {
            for(let ratio of this.input.slopeRatio) {
                this.begin('slopeRatio', ratio)
                state.slope.steepness.ratio = ratio
                state.slope.steepness.degrees = this.toDegrees(Math.atan(ratio))
                this.processMidflameWindSpeedInputs()
            }
            this.end('slopeRatio')
        }
    }
    processSlopeMapInputs() {
        const state = this.state
        for(let scale of this.input.mapScale) {
            this.begin('mapScale', scale)
            state.slope.map.scale = scale
            for(let interval of this.input.mapContourInterval) {
                this.begin('mapContourInterval', interval)
                state.slope.map.contourInterval = interval
                for(let contours of this.input.mapContoursCrossed) {
                    this.begin('mapContoursCrossed', contours)
                    state.slope.map.contoursCrossed = contours
                    for(let distance of this.input.mapDistance) {
                        this.begin('mapDistance', distance)
                        state.slope.map.distance = distance
                        const reach = Math.max(0, scale * distance)
                        const rise = Math.max(0, contours * interval)
                        state.slope.steepness.ratio = (reach > 0) ? (rise / reach) : 0
                        state.slope.steepness.degrees =
                            this.toDegrees(Math.atan(state.slope.map.ratio))
                        this.processMidflameWindSpeedInputs()
                    }
                    this.end('mapDistance')
                }
                this.end('mapContoursCrossed')
            }
            this.end('mapContourInterval')
        }
        this.end('mapScale')
    }
    processMidflameWindSpeedInputs() {
        if(this.config.midflameWindSpeedFrom === 'input') {
            for(let speed of this.input.midflameWindSpeed) {
                this.begin('midflameWindSpeed', speed)
                this.state.midflame.windSpeed = speed
                this.updateSurface1FireBehavior()
                this.updateSurface2FireBehavior()
                this.updateActiveCrownFireBehavior()
                this.processPostFireBehaviorInputs()
            }
            this.end('midflameWindSpeed')
        }
        else if(this.config.midflameWindSpeedFrom === 'estimate') {
            this.processMidflameWsrfInputs()
        }
    }
    processMidflameWsrfInputs() {
        if(this.config.midflameWsrfFrom === 'input') {
            for(let wsrf of this.input.midflameWsrf) {
                this.begin('midflameWsrf', wsrf)
                this.state.midflame.wsrf = wsrf
                this.updateSurface1FireBehavior()
                this.updateSurface2FireBehavior()
                this.updateActiveCrownFireBehavior()
                this.processPostFireBehaviorInputs()
            }
            this.end('midflameWsrf')
        }
        else if(this.config.midflameWsrf === 'estimate') {
            this.processCanopyOverstoryInputs()
            this.midflame.wsrf = Math.min(this.canopy.midflameWsrf, this.surface1.fuelBed.midflameWsrf)
                this.proccessPostFireBehaviorInputs()
        }
    }
    processPostFireBehaviorInputs() {
        if (this.config.surfaceFireShapeActive) {
            this.log('Surface Module is Linking to Fire Shape/Size Module...')
            this.state.fireShape.source = this.state.surfaceFire
            this.updateSurfaceFireShape()
            if(this.state.surfaceCrownFireActive)
                this.updateActiveCrownShape()
            if(this.config.surfaceFireSizeActive)
                this.processFireSizeInputs()
        } else  {
            this.log('End of Surface Fire Module.')
        }
    }
    // Entry point for stand-alone fire shape/size/position/vectors
    processFireShapeInputs() {
        const state = this.state
        for(let spreadRate of this.input.observedHeadSpreadRate) {
            this.begin('observedHeadSpreadRate', spreadRate)
            state.observedFireBehavior.head.spreadRate = spreadRate
            for(let bearing of this.input.observedHeadBearing) {
                this.begin('observedHeadBearing', bearing)
                state.observedFireBehavior.head.bearing = bearing
                for(let flame of this.input.observedHeadFlameLength) {
                    this.begin('observedHeadFlameLength', flame)
                    state.observedFireBehavior.head.flameLength = flame
                    for(let lwr of this.input.observedLengthWidthRatio) {
                        this.begin('observedLengthWidthRatio', lwr)
                        state.observedFireBehavior.lengthWidthRatio = lwr
                        state.fireShape.source = state.observed
                        this.updateSurfaceFireShape()
                        if(this.config.surfaceFireSizeActive)
                            this.processFireSizeInputs()
                    }
                    this.end('observedLengthWidthRatio')
                }
                this.end('observedHeadFlameLength')
            }
            this.end('observedHeadBearing')
        }
        this.end('observedHeadSpreadRate')
    }

    processFireSizeInputs() {
        const state = this.state
        for(let elapsedTime of this.input.elapsedTime) {
            this.begin('elapsedTime', elapsedTime)
            state.fireSize.elapsedTime = elapsedTime
            this.updateFireSize()
            if(this.config.surfaceFireActive && this.config.surfaceCrownFireActive)
                this.updateActiveCrownSize()
        }
    }

    //--------------------------------------------------------------------------
    // Utility functions for updating state values
    //--------------------------------------------------------------------------

    fraction(value) { return Math.max(0, Math.min(1, value)) }
    toDegrees(radians) { return radians * 180 / Math.PI }
    toRadians(degrees) { return degrees * Math.PI / 180 }

    //--------------------------------------------------------------------------
    // update<Somnething>() methods call external library functions to update
    // current state values
    //--------------------------------------------------------------------------

    updateSurface1FuelModel() {
        this.log('updateSurface1FuelModel()...')
    }
    updateSurface2FuelModel() {
        this.log('updateSurface2FuelModel()...')
    }
    updateSurface1FuelBed() {
        this.log('updateSurface1FuelBed()...')
    }
    updateSurface2FuelBed() {
        this.log('updateSurface2FuelBed()...')
    }
    updateSurface1FuelIgnition() {
        this.log('updateSurface1FuelIgnition()...')
    }
    updateSurface2FuelIgnition() {
        this.log('updateSurface2FuelIgnition()...')
    }
    updateSurface1FireBehavior() {
        this.log('updateSurface1FireBehavior()...')
    }
    updateSurface2FireBehavior() {
        this.log('updateSurface2FireBehavior()...')
    }
    updateActiveCrownFireBehavior() {
        this.log('updateActiveCrownFireBehavior()...')
    }
    updateSurfaceFireShape() {
        this.log('updateSurfaceFireShape()...')
    }
    updateFireSize() {
        this.log('updateFireSize()...')
    }
}

//--------------------------------------------------------------------------
// Run it!
//--------------------------------------------------------------------------

import { WfbxConfig } from './WfbxConfig.js'
import { WfbxInput } from './WfbxInput.js'
import { WfbxState } from './WfbxState.js'
const wfbx = new WfbxRunner()
wfbx.run(WfbxConfig, WfbxState, WfbxInput)