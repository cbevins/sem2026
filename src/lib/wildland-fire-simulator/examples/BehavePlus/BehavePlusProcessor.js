import { makeBetaVector, makeBeta6Vector, makePsiVector} from '../../Wfs.js'
import { makeFireBehavior } from '../../Wfs.js'
import { makeFireEllipse } from '../../Wfs.js'
import { makeFireSize } from '../../Wfs.js'
import { makeFireTerrain } from '../../Wfs.js'
import { makeFuelBed } from '../../Wfs.js'
import { makeFuelIgnition } from '../../Wfs.js'
import { makeFuelModel } from '../../Wfs.js'
import { makeWeightedFireBehavior } from '../../Wfs.js'

import { makeFireWeather } from '../../Wfs.js'
import { makeFuelCanopy } from '../../Wfs.js'
import { makeFuelCuring } from '../../Wfs.js'
import { makeFuelMoisture } from '../../Wfs.js'

export class BehavePlusProcessor {
    constructor(bp) {
        this.bp =  bp
    }
    
    processSurfaceModuleInputs() {
        this.processFuelKeyInputs()
    }

    #setValue(propKey, value) {
        const {owner, key} = this.bp.props[propKey]
        this.bp[owner][key] = value
        this.bp.props[propKey].value = value
    }

    // processFuelKey() before processFuelCuring if we want to get a list
    // of all currently required curingClasses and/or moistureClasses
    processFuelKeyInputs() {
        const bp = this.bp
        if (bp.configs.fuelModelInput === 'one') {
            for(let value of bp.props.fuelKey1.values) {
                this.#setValue('fuelKey1', value)
                bp.fuelModel = makeFuelModel({fuelCatalog: bp.fuelCatalog,
                    fuelKey: bp.fuelKeys.fuelKey1}, bp.configs)
                this.processFuelCuringInputs()
            }
        }
        // If 'two', then process 'one' and 'two' chains separately
        // and combine with makeWeightedFireBehavior
    }

    processFuelCuringInputs() {
        const bp = this.bp
        if (bp.configs.fuelCuringInput === 'input') {
            for(let value of bp.props.curedHerb.values) {
                this.#setValue('curedHerb', value)
                bp.fuelCuring = makeFuelCuring({fuelCuring: bp.fuelCuring})
                bp.fuelBed = makeFuelBed({fuelModel: bp.fuelModel, fuelCuring: bp.fuelCuring}, bp.configs)
                this.processLiveFuelMoistureInputs()
            }
        } else { // (bp.configs.fuelCuringInput === 'estimated') {
            for(let value of bp.props.moistureLiveCurable.values) {
                this.#setValue('moistureLiveCurable', value)
                bp.fuelMoisture = makeFuelMoisture({fuelMoisture: bp.fuelMoisture}, bp.configs)
                bp.fuelCuring = makeFuelCuring({fuelCuring: bp.fuelCuring, fuelMoisture: bp.fuelMoisture}, bp.configs)
                bp.fuelBed = makeFuelBed({fuelModel: bp.fuelModel, fuelCuring: bp.fuelCuring}, bp.configs)
                this.processLiveFuelMoistureInputs()
            }
        }
    }

    processLiveFuelMoistureInputs() {
        const bp = this.bp
        if (bp.configs.liveFuelMoistureInput === 'life') {
            for(let value of bp.props.moistureLiveFuels.values) {
                this.#setValue('moistureLiveFuels', value)
                this.processDeadFuelMoistureInputs()
            }
        } else { // (bp.configs.liveFuelMoistureInput === 'particle') {
            for(let herbValue of bp.props.moistureLiveHerb.values) {
                this.#setValue('moistureLiveHerb', herbValue)
                for(let stemValue of bp.props.moistureLiveStem.values) {
                    this.#setValue('moistureLiveStem', stemValue)
                    this.processDeadFuelMoistureInputs()
                }
            }
        }
    }
    
    processDeadFuelMoistureInputs() {
        const bp = this.bp
        if (bp.configs.deadFuelMoistureInput === 'life') {
            for(let value of bp.props.moistureDeadFuels.values) {
                this.#setValue('moistureDeadFuels', value)
                bp.fuelMoisture = makeFuelMoisture({fuelMoisture: bp.fuelMoisture}, bp.configs)
                bp.fuelIgnition = makeFuelIgnition({fuelBed: bp.fuelBed, fuelMoisture: bp.fuelMoisture}, bp.configs)
                this.processSlopeSteepnessInputs()
            }
        } else { // (bp.configs.liveFuelMoistureInput === 'particle') {
            for(let value1h of bp.props.moistureDead1h.values) {
                this.#setValue('moistureDead1h', value1h)
                for(let value10h of bp.props.moistureDead10h.values) {
                    this.#setValue('moistureDead10h', value10h)
                    for(let value100h of bp.props.moistureDead100h.values) {
                        this.#setValue('moistureDead100h', value100h)
                        bp.fuelMoisture = makeFuelMoisture({fuelMoisture: bp.fuelMoisture}, bp.configs)
                        bp.fuelIgnition = makeFuelIgnition({fuelBed: bp.fuelBed, fuelMoisture: bp.fuelMoisture}, bp.configs)
                        this.processSlopeSteepnessInputs()
                    }
                }
            }
        }
    }

    processSlopeSteepnessInputs() {
        const bp = this.bp
        if (bp.configs.slopeSteepnessInput === 'ratio') {
            for(let value of bp.props.slopeRatio.values) {
                this.#setValue('slopeRatio', value)
                bp.fireTerrain = makeFireTerrain({fireTerrain: bp.fireTerrain}, bp.configs)
                this.processSlopeDirectionInputs()
            }
        } else if (bp.configs.slopeSteepnessInput === 'degrees') {
            for(let value of bp.props.slopeDegrees.values) {
                this.#setValue('slopeDegrees', value)
                bp.fireTerrain = makeFireTerrain({fireTerrain: bp.fireTerrain}, bp.configs)
                this.processSlopeDirectionInputs()
            }
        } // else { // (bp.configs.slopeSteepnessInput === 'map') {
    }

    // processSlopeDirectionInputs
    // processSlopeSteepnessInputs
    // processWindDirectionInputs
    // if midflameWindSpeedInputs estimated:
    //      if midflameWindReductionInputs estimated:
    //          processFuelCanopyInputs
    //      processMidflameReductionInputs
    // processWindSpeedInputs
    processWindInputs() {
        this.saveResults()
    }

    run() {
        this.results = []
        const bp = this.bp
        if (bp.configs.surfaceModuleActive) {
            this.processSurfaceModuleInputs()
        }
    }

    saveResults() {
        const bp = this.bp
        bp.results = []
        const result = {}
        for(let key of bp.inputKeysSet) {
            const prop = bp.props[key]
            result[key] = bp[prop.owner][prop.key]
        }
        for(let key of bp.outputKeysSet) {
            const prop = bp.props[key]
            result[key] = bp[prop.owner][prop.key]
        }
        bp.results.push(result)
    }
}
