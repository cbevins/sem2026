// Creates an execution script for BehavePlus-ish applications based upon
// the selected active modules and input & processing configurations,
// and validates them against the expected state and input structures.
export class WfbxScripter {
    constructor(modules, configs, state, inputs) {
        this.modules = modules
        this.configs = configs
        this.state = state
        this.inputs = inputs
        this.messages = []
        this.script = []
        this.inputSet = new Set()
        this.inputIdx = {}
    }

    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------

    call(methodKey) {
        // Ensure the state has a method with thi name
        if (this.state[methodKey] === undefined) {
            this.error(`this.state has no method named '${methodKey}'.`)
        }
        this.script.push(['call', methodKey, ''])
    }

    // Close the most recent 'each' block
    close() {
        const stack = [...this.inputSet]
        const item = stack.pop()
        const [inputKey,] = item.split('=')
        this.script.push(['next', inputKey, this.inputIdx[inputKey]])
        this.inputSet.delete(item)
        delete this.inputIdx[inputKey]
    }

    // Close all open 'each' blocks
    closeOpenInputs() {
        const stack = [...this.inputSet]
        while(stack.length) {
            const item = stack.pop()
            const [inputKey,] = item.split('=')
            this.script.push(['next', inputKey, this.inputIdx[inputKey]])
        }
    }

    each(inputKey, stateProp) {
        // Ensure the inputKey exists in this.inputs
        if (!Object.hasOwn(this.inputs, inputKey)) {
            this.error(`this.inputs has no property with key '${inputKey}'.`)
        }
        // Ensure the state property key chain is valid
        const chain = stateProp.split('.')
        let ref = this.state
        for(let i=0; i<chain.length; i++) {
            ref = ref[chain[i]]
            if (ref === undefined)
                this.error(`Input key '${inputKey}' storage variable state.${stateProp} is undefined for property '${chain[i]}'.`)
        }
        // Add to the execution stack, to the input set, and to the input index
        const key = inputKey + '=' + stateProp
        if (! this.inputSet.has(key)) {
            this.inputSet.add(key)
            this.script.push(['each', inputKey, this.script.length])
            this.inputIdx[inputKey] = this.script.length-1
        }
    }

    error(msg) { throw new Error(`\x1b[33m${msg}\x1b[0m\n`) }

    logScript() {
        let depth = 0
        let str = ''
        for(let i=0; i<this.script.length; i++) {
            const [cmd, key, idx] = this.script[i]
            if (cmd === 'next') depth--
            str += (i+'').padStart(3) + ' '.padStart(4*depth)
            str += cmd + ' ' + key + ' ' + idx + '\n'
            if (cmd === 'each') depth++
        }
        return str
    }

    logCallSequence() {
        let str = '\nExecution Stack Call Sequence:\n'
        for(let i=0; i<this.script.length; i++) {
            const [cmd, key] = this.script[i]
            if (cmd === 'call')
                str += (i+'').padStart(3) + ' ' + key + '\n'
        }
        return str
    }

    run() {
        this.messages = []
        this.inputSet = new Set()
        this.inputIdx = {}
        if (this.modules.fuelCuring || this.modules.surfaceFireBehavior) {
            this.processFuelCuring()
        } else if (this.modules.fuelModel) {
            this.processFuelModel1()
        } else if (this.modules.fuelBed) {
            this.processFuelCuring()
        } else if (this.modules.fuelIgnition) {
            this.processFuelCuring()
        }
        this.closeOpenInputs()
    }

    // -------------------------------------------------------------------------
    // The following methods are arranged roughly in the execution stack order
    // -------------------------------------------------------------------------
    processFuelCuring() {
        if (this.configs.fuelCuringFrom === 'input') {
            this.each('curedHerb', 'fuelCuring.curedHerb')
            this.call('updateFuelCuringFromInput')
            this.postProcessFuelCuring()
        }
        else if (this.configs.fuelCuringFrom === 'liveMoisture') {
            this.each('moistureLiveCurable', 'fuelMoisture.moistureLiveCurable')
            this.call('updateFuelCuringFromLiveMoisture')
            this.postProcessFuelCuring()
        } else {
            this.error(`Config 'fuelCuringFrom' has invalid option '${this.configs.fuelCuringFrom}'.`)
        }
    }
    // Invoked only by processFuelCuring() to continue descending the execution stack
    postProcessFuelCuring() {
        if(this.modules.fuelModel) {
            this.processFuelModel1()
        }
    }
    // -------------------------------------------------------------------------
    processFuelModel1() {
        this.each('fuelKey1', 'fuelKeys.fuelKey1')
        this.call('makeFuelModel1')
        this.call('makeFuelBed1')
        if (this.modules.twoFuels) {
            this.processFuelModel2()
        } else {
            this.postProcessFuelModels()
        }
    }
    processFuelModel2() {
        this.each('fuelKey2', 'fuelKeys.fuelKey2')
        this.each('fuelCover1', 'fuelKeys.fuelCover1')
        this.call('makeFuelModel2')
        this.call('makeFuelBed2')
        this.postProcessFuelModels()
    }
    // Invoked only by processFuelmodel1() or processFuelModel2() to continue descending the execution stack
    postProcessFuelModels() {
        if (this.modules.fuelIgnition) {
            this.processFuelMoistureLive()
        }
    }
    // -------------------------------------------------------------------------
    processFuelMoistureLive() {
        if(this.configs.liveMoistureFrom === 'category') {
            this.each('moistureLiveCategory', 'fuelMoisture.moistureLiveCategory')
            this.call('updateFuelMoistureLiveFromCategory')
            this.postProcessFuelMoistureLive()
        }
        else if(this.configs.liveMoistureFrom === 'particles') {
            this.each('moistureLiveStem', 'fuelMoisture.moistureLiveStem')
            this.each('moistureLiveHerb', 'fuelMoisture.moistureLiveHerb')
            this.call('updateFuelMoistureLiveFromParticles')
            this.postProcessFuelMoistureLive()
        } else {
            this.error(`Config 'liveMoistureFrom' has invalid option '${this.configs.liveMoistureFrom}'.`)
        }
    }
    // Invoked only by processFuelMoistureLive() to continue descending the execution stack
    postProcessFuelMoistureLive() {
        this.processFuelMoistureDead()
    }
    // -------------------------------------------------------------------------
    processFuelMoistureDead() {
        if(this.configs.deadMoistureFrom === 'category') {
            this.each('moistureDeadCategory', this.state.fuelMoisture, 'moistureDeadCategory')
            this.call('updateFuelMoistureDeadFromCategory')
            this.postProcessFuelMoistureDead()
        }
        else if(this.configs.deadMoistureFrom === 'particles') {
            this.each('moistureDead100h', 'fuelMoisture.moistureDead100h')
            this.each('moistureDead10h', 'fuelMoisture.moistureDead10h')
            this.each('moistureDead1h', 'fuelMoisture.moistureDead1h')
            this.call('updateFuelMoistureDeadFromParticles')
            this.postProcessFuelMoistureDead()
        } else {
            this.error(`Config 'deadMoistureFrom' has invalid option '${this.configs.deadMoistureFrom}'.`)
        }
    }
    // Invoked only by processFuelMoistureDead() to continue descending the execution stack
    postProcessFuelMoistureDead() {
        if (this.modules.fuelIgnition) {
            this.processFuelIgnition()
        }
    }
    // -------------------------------------------------------------------------
    // NOTE: no need for a postProcess() as there are no config input options to converge
    processFuelIgnition() {
        this.call('makeFuelIgnition1')
        if(this.modules.twoFuels) {
            this.call('makeFuelIgnition2')
        }
        if(this.modules.crownFireBehavior) {
            this.call('makeFuelIgnitionCrown')
        }
        if(this.modules.surfaceFireBehavior) {
            this.processWindSpeed()
        }
    }
    // -------------------------------------------------------------------------
    processWindSpeed() {
        // Do we need windSpeedAt20ft, or just the modflame wind speed?
        if (this.modules.crownFireBehavior || this.configs.midflameWindSpeedFrom === 'wsrf20ft') {
            if(this.configs.windSpeedFrom === 'windSpeed20ft') {
                this.each('windSpeed20ft', 'windSpeed.at20ft')
                this.call('updateWindSpeedFrom20ft')
                this.postProcessWindSpeed()
            } else if(this.configs.windSpeedFrom === 'windSpeed10m') {
                this.each('windSpeed10m', 'windSpeed.at10m')
                this.call('updateWindSpeedFrom10m')
                this.postProcessWindSpeed()
            }
        } else {
            this.postProcessWindSpeed()
        }
    }
    // Invoked only by processWindSpeed() to continue descending the execution stack
    postProcessWindSpeed() {
        if(this.modules.surfaceFireBehavior || this.modules.scorchHeight)
            this.processMidflameWindSpeed()
    }
    // -------------------------------------------------------------------------
    processMidflameWindSpeed() {
        if(this.configs.midflameWindSpeedFrom === 'input') {
            this.each('midflameWindSpeed', 'midflame.windSpeed')
            this.postProcessMidflameWindSpeed()
        }
        else if(this.configs.midflameWindSpeedFrom === 'wsrf20ft') {
            this.processMidflameWindSpeedFromWsrf20ft()
        } else {
            this.error(`Config 'midflameWindSpeedFrom' has invalid option '${this.configs.midflameWindSpeedFrom}'.`)
        }
    }
    processMidflameWindSpeedFromWsrf20ft() {
        if(this.configs.midflameWsrfFrom === 'input') {
            this.each('midflameWsrf', 'midflame.wsrf')
            this.call('updateMidflameWindSpeedFromWsrf20ft')
            this.postProcessMidflameWindSpeed()
        }
        else if(this.configs.midflameWsrfFrom === 'canopyFuel') {
            this.processMidflameWindSpeedFromCanopyFuel()
        } else {
            this.error(`Config 'midflameWsrfFrom' has invalid option '${this.configs.midflameWsrfFrom}'.`)
        }
    }
    processMidflameWindSpeedFromCanopyFuel() {
        // NOTE that canopyStructure has input options in addition to height-base
        // that are not yet implemented here
        this.each('canopyHeight', 'canopyStructure.height')
        this.each('canopyBase', 'canopyStructure.base')
        this.each('canopyCover', 'canopyStructure.cover')
        this.call('updateCanopyStructureFromHeightBase')
        this.call('updateMidflameWsrfFromCanopyFuel')
        this.postProcessMidflameWindSpeed()
    }
    // Invoked only by processMidflameWindSpeed(), processMidflameWindSpeedFromWsrf20ft(), or
    // processMidflameWindSpeedFromCanopyFuel() to continue descending the execution stack
    postProcessMidflameWindSpeed() {
        if (this.modules.surfaceFireBehavior)
            this.processWindDirection()
    }
    // -------------------------------------------------------------------------
    processWindDirection() {
        if(this.configs.windDirectionFrom === 'bearingCompass') {
            this.each('windBearingCompass', 'windDirection.bearingCompass')
            this.call('updateWindDirectionFromBearingCompass')
            this.postProcessWindDirection()
        }
        else if(this.configs.windDirectionFrom === 'bearingDegrees') {
            this.each('windBearingDegrees', 'windDirection.bearingDegrees')
            this.call('updateWindDirectionFromBearingDegrees')
            this.postProcessWindDirection()
        }
        if(this.configs.windDirectionFrom === 'sourceCompass') {
            this.each('windSourceCompass', 'windDirection.sourceCompass')
            this.call('updateWindDirectionFromSourceCompass')
            this.postProcessWindDirection()
        }
        else if(this.configs.windDirectionFrom === 'sourceDegrees') {
            this.each('windSourceDegrees', 'windDirection.sourceDegrees')
            this.call('updateWindDirectionFromSourceDegrees')
            this.postProcessWindDirection()
        } else {
            this.error(`Config 'windDirectionFrom' has invalid option '${this.configs.windDirectionFrom}'.`)
        }
    }
    // Invoked only by processWindDirection() to continue descending the execution stack
    postProcessWindDirection() {
        if (this.modules.surfaceFireBehavior)
            this.processSlopeSteepness()
    }
    // -------------------------------------------------------------------------
    processSlopeSteepness() {
        if(this.configs.slopeSteepnessFrom === 'slopeDegrees') {
            this.each('slopeDegrees', 'slopeSteepness.degrees')
            this.call('updateSlopeSteepnessFromDegrees')
            this.postProcessSlopeSteepness()
        }
        else if(this.configs.slopeSteepnessFrom === 'slopeRatio') {
            this.each('slopeRatio', 'slopeSteepness.ratio')
            this.call('updateSlopeSteepnessFromRatio')
            this.postProcessSlopeSteepness()
        } else if(this.configs.slopeSteepnessFrom === 'slopeMap') {
            this.each('mapScale', 'slopeMap.scale')
            this.each('mapContourInterval', 'slopeMap.contourInterval')
            this.each('mapContoursCrossed', 'slopeMap.contoursCrossed')
            this.each('mapDistance', 'slopeMap.distance')
            this.call('updateSlopeMap')
            this.call('updateSlopeSteepnessFromMap')
            this.postProcessSlopeSteepness()
        } else {
            this.error(`Config 'slopeSteepnessFrom' has invalid option '${this.configs.slopeSteepnessFrom}'.`)
        }
    }
    postProcessSlopeSteepness() {
        if (this.modules.surfaceFireBehavior)
            this.processSlopeDirection()
    }
    // -------------------------------------------------------------------------
    processSlopeDirection() {
        if(this.configs.slopeDirectionFrom === 'aspectDegrees') {
            this.each('slopeAspect', 'slopeDirection.aspectDegrees')
            this.call('updateSlopeDirectionFromAspectDegrees')
            this.postProcessSlopeDirection()
        }
        else if(this.configs.slopeDirectionFrom === 'upslopeDegrees') {
            this.each('slopeUpslope', 'slopeDirection.upslopeDegrees')
            this.call('updateSlopeDirectionFromUpslopeDegrees')
            this.postProcessSlopeDirection()
        } else {
            this.error(`Config 'slopeDirectionFrom' has invalid option '${this.configs.slopeDirectionFrom}'.`)
        }
    }
    postProcessSlopeDirection() {
        if (this.modules.scorchHeight) {
            this.each('airTemperature', 'airTemperature')
        }
        if (this.modules.surfaceFireBehavior)
            this.processSurfaceFireBehavior()
    }
    // -------------------------------------------------------------------------
    // NOTE: no need for a postProcess() as there are no config input options to converge
    processSurfaceFireBehavior() {
        if(this.modules.twoFuels) {
            this.call('makeSurfaceFireBehavior1')
            this.call('makeSurfaceFireBehavior2')
            this.call('makeWeightedSurfaceFireBehavior')
        } else {
            this.call('makeSurfaceFireBehavior1')
            this.call('makeSingleSurfaceFireBehavior')
        }
        if(this.modules.crownFireBehavior) {
            this.processCrownFire()
        }
        if (this.modules.fireShape) {
            this.processFireShape()
        }
    }
    // -------------------------------------------------------------------------
    processCrownFire() {
        this.call('makeActiveCrownFireSpreadRate')
        this.each('canopyHeight', 'canopyStructure.height')
        this.each('canopyBase', 'canopyStructure.base')
        this.call('updateCanopyStructureFromHeightBase')
        this.each('canopyBulkDensity', 'canopyFuels.bulkDensity')
        this.each('canopyHeatContent', 'canopyFuels.heatContent')
        this.call('updateCanopyFuels')
        this.call('makeActiveCrownFireIntensity')
        this.close('canopyHeatContent')
        this.close('canopyBulkDensity')
        this.close('canopyBase')
        this.close('canopyHeight')
    }
    // -------------------------------------------------------------------------
    processFireShape() {
        if(this.modules.surfaceFireBehavior) {  // if linked to surface fire, use its properties for input
            this.call('makeFireShapeFromSurfaceFire')
            this.postProcessFireShape()
        } else {
            this.each('observedHeadSpreadRate', 'observedFire.headSpreadRate')
            this.each('observedHeadBearing', 'observedFire.headBearing')
            this.each('observedHeadFlameLength', 'observedFire.headFlameLength')
            this.each('observedLengthWidthRatio', 'observedFire.lengthWidthRatio')
            this.call('makeFireShapeFromObservedFire')
            this.postProcessFireShape()
        }
    }
    postProcessFireShape() {
        if(this.modules.fireSize) {
            this.processFireSize()
        }
    }
    // -------------------------------------------------------------------------
    processFireSize() {
        this.each('elapsedTime', 'elapsedTime')
        this.call('makeFireSize')
        if(this.modules.firePosition) {
            this.processFirePosition()
        }
    }
    // -------------------------------------------------------------------------
    processFirePosition() {
        this.each('ignEast', 'ignEast')
        this.each('ignNorth', 'ignNorth')
        this.call('makeFirePosition')
        if(this.modules.fireVectors) {
            this.processFireVectors()
        }
    }
    // -------------------------------------------------------------------------
    processFireVectors() {
        this.each('angleFromHead', 'angleFromHead')
        if(this.modules.fireVectorBeta)
            this.call('makeFireVectorBeta')
        if(this.modules.fireVectorBeta6)
            this.call('makeFireVectorBeta6')
        if(this.modules.fireVectorPsi)
            this.call('makeFireVectorPsi')
        if(this.modules.fireVectorTheta)
            this.call('makeFireVectorTheta')
    }
}
