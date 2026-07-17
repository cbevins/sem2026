import { makeFuelCatalog } from "./makeFuelCatalog.js"
import { makeFuelModel } from './makeFuelModel.js'
import { FuelCuring } from './FuelCuring.js'
import { makeFuelBed } from './makeFuelBed.js'

export class WfbxRunner {
    constructor() {
        this.fuelCatalog = makeFuelCatalog()    // only need to make this once

        this.modules = {
            fuelModel1: true,
            fuelModel2: true,
            fuelCuring: true,
            fuelBed1: true,
            fuelBed2: true,
            activeCrownFire: true,
        }
        this.configs = {
            fuelCuringFrom: 'estimate',            // input, etimate
            deadMoistureFrom: 'particles',      // particles, category
            liveMoistureFrom: 'category',       // particles, category
            midflameWindSpeedFrom: 'input',     // input, estimate
            midflameWsrfFrom: 'input',          // input, estimate
            slopeDirectionFrom: 'upslope',      // aspect, upslope
            slopeSteepnessFrom: 'slopeMap',     // slopeDegrees, slopeMap, slopeRatio
            windDirectionFrom: 'sourceCompass', // bearingDegrees, sourceCompass, sourceDegrees
        }
        this.inputs = {
            fuelKey1: [10],
            fuelKey2: [124],
            curedHerb: [0.778],
            liveMoistureCurable: [0.5],
        }
        const fuelModel1 = makeFuelModel(this.fuelCatalog, this.inputs.fuelKey1[0])
        const fuelModel2 = makeFuelModel(this.fuelCatalog, this.inputs.fuelKey2[0])
        const fuelCuring = new FuelCuring(this.inputs.curedHerb[0])
        const fuelBed1 = makeFuelBed(fuelModel1, fuelCuring)
        const fuelBed2 = makeFuelBed(fuelModel2, fuelCuring)
        const crownFuelModel = makeFuelModel(this.fuelCatalog, 10)          // only need to make this once
        const crownFuelBed = makeFuelBed(crownFuelModel, {curedHerb: 0})    // only need to make this once

        this.state = {fuelModel1, fuelModel2, fuelCuring, fuelBed1, fuelBed2,
            crownFuelModel, crownFuelBed}

        this.messages = []
        this.inputStack = new Set()
    }
    log(msg) {
        const pad = ''.padStart(4*this.inputStack.size)
        this.messages.push(pad+msg)
    }
    begin(key, value) {
        this.log(`${key} => ${value}`)
        this.inputStack.add(key)
    }
    end(key) {
        this.inputStack.delete(key)
        this.log(`${key} end-of-input`)
    }
    run() {
        this.messages = []
        this.inputStack = new Set()
        // Active crown fire does not need a fuel key or curedHerb, so make it here just once
        if (this.modules.fuelModel1) {
            this.processFuelModel1()
        }
    }
    processFuelModel1() {
        const {modules, inputs, state} = this
        for(let fuelKey1 of inputs.fuelKey1) {
            this.begin('fuelKey1', fuelKey1)
            this.log('Updateing fuelModel1...')
            state.fuelModel1 = makeFuelModel(this.fuelCatalog, fuelKey1)
            if (modules.fuelModel2) {
                this.processFuelModel2()
                this.log('Updateing fuelModel2...')
            } else if (modules.fuelCuring) {
                this.processFuelCuring()
            } else { 
                this.log('End of Processing at the FuelModel1 Module')
            }
        }
        this.end('fuelKey1')
    }
    processFuelModel2() {
        const {modules, inputs, state} = this
        for(let fuelKey2 of inputs.fuelKey2) {
            this.begin('fuelKey2', fuelKey2)
            state.fuelModel2 = makeFuelModel(this.fuelCatalog, fuelKey2)
            if (modules.fuelCuring) {
                this.processFuelCuring()
            } else { 
                this.log('End of Processing at the FuelModel2 Module')
            }
        }
        this.end('fuelKey2')
    }
    processFuelCuring() {
        const {configs, modules, inputs, state} = this
        if (configs.fuelCuringFrom === 'input') {
            for(let curedHerb of inputs.curedHerb) {
                this.begin('curedHerb', curedHerb)
                state.fuelCuring.setCuredHerb(curedHerb)
                if(modules.fuelBed1) {
                    this.processFuelBeds()
                } else {
                    this.log('End of Processing at the FuelCuring Module')
                }
            }
            this.end('curedHerb')
        }
        else if (configs.fuelCuringFrom === 'estimate') {
            for(let liveMoistureCurable of inputs.liveMoistureCurable) {
                this.begin('liveMoistureCurable', liveMoistureCurable)
                state.fuelCuring.setLiveMoistureCurable(liveMoistureCurable)
                if(modules.fuelBed1) {
                    this.processFuelBeds()
                } else {
                    this.log('End of Processing at the FuelCuring Module')
                }
            }
            this.end('liveMoistureCurable')
        } else {
            throw new Error(`Configuration key 'fuelCuringFrom' has invalid value '${configs.fuelCuringFrom}'.`)
        }
    }
    processFuelBeds() {
        const {state, modules} = this
        this.log('Updating fuelBed1...')
        state.fuelBed1 = makeFuelBed(state.fuelModel1, state.fuelCuring)
        if (modules.fuelBed2) {
            state.fuelBed2 = makeFuelBed(state.fuelModel1, state.fuelCuring)
            this.log('Updating fuelBed2...')
        }
        if(modules.fuelIgnition1) {
            this.processLiveFuelMoistures()
        }
    }
}

const wfbx = new WfbxRunner()
wfbx.run()
console.log(wfbx.messages)
// console.log(wfbx.state.fuelBed1)
