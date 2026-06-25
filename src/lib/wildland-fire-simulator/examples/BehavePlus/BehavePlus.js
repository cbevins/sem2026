import { makeFuelCatalog, makeLogger } from '../../Wfs.js'
import { BehavePlusProps } from './BehavePlusProps.js'
import { BehavePlusProcessor } from './BehavePlusProcessor.js'
import { WfsConfigs } from '../../src/WfsInputs.js'

export class BehavePlus {
    constructor(configs=null) {
        // Make a clone of the BehavePlusProps (which is 2 object levels deeps)
        this.props = {}
        for(let [key, value] of Object.entries(BehavePlusProps)) {
            this.props[key] = {...value}
        }

        // Create the required WFS input and processor data structures
        const owners = new Set()
        for(let prop of Object.values(this.props))
            owners.add(prop.owner)
        for(let owner of [...owners])
            this[owner] = {}
        for(let prop of Object.values(this.props))
            this[prop.owner][prop.key] = prop 

        // Create initial configuration
        this.configs = (configs===null) ? {...WfsConfigs} : configs
        this.configs.logger = makeLogger()
        this.fuelCatalog = makeFuelCatalog()
        this.configure(this.configs)

        // Create a processor
        this.processor = new BehavePlusProcessor(this)

        this.inputKeysSet = new Set()   // All possible inputs under current configuration
        this.outputKeysSet = new Set()  // Current user selected outputs
        this.results = []
    }

    // Blends the provided configs prop with the current configs
    // and update possible inputs
    configure(configs={}) {
        this.configs = {...this.configs, ...configs}
        this.inputKeysSet = this.createInputKeysSet()
    }

    // Returns a *Set()* of BehavePlusProps *keys* that are possible inputs for the current configuration 
    createInputKeysSet() {
        const inputs = new Set()
        let cfg

        // TO DO - restrict by active module!!
        cfg = this.configs.fuelModelInput
        if (cfg === 'one') {
            inputs.add('fuelKey1')
        } else if (cfg === 'two') {
            inputs.add('fuelKey1')
            inputs.add('fuelKey2')
            inputs.add('fuelCover1')
        } else throw new Error(`Unknown 'fuelModels' config '${cfg}'`)

        cfg = this.configs.fuelCuringInput
        if ( cfg === 'input') {
            inputs.add('curedHerb')
        } else if (cfg === 'estimated') {
            inputs.add('moistureLiveCurable')
        } else throw new Error(`Unknown 'fuelCuringInput' config '${cfg}'`)

        cfg = this.configs.liveFuelMoistureInput
        if (cfg === 'particle') {
            inputs.add('moistureLiveHerb')
            inputs.add('moistureLiveStem')
        } else if (cfg === 'life') {
            inputs.add('moistureLiveFuels')
        } else throw new Error(`Unknown 'liveFuelMoistureInput' config '${cfg}'`)

        cfg = this.configs.deadFuelMoistureInput
        if (cfg === 'particle') {
            inputs.add('moistureDead1h')
            inputs.add('moistureDead10h')
            inputs.add('moistureDead100h')
        } else if (cfg === 'life') {
            inputs.add('moistureDeadFuels')
        } else throw new Error(`Unknown 'deadFuelMoistureInput' config '${cfg}'`)

        cfg = this.configs.slopeSteepnessInput
        if (cfg === 'ratio') {
            inputs.add('slopeRatio')
        } else if (cfg === 'degrees') {
            inputs.add('slopeDegrees')
        } else if (cfg === 'map') {
            inputs.add('mapScale')
            inputs.add('mapContourInterval')
            inputs.add('mapContours')
            inputs.add('mapDistance')
        } else throw new Error(`Unknown 'slopeSteepnessInput' config '${cfg}'`)

        cfg = this.configs.slopeDirectionInput
        if (cfg === 'aspect') {
            inputs.add('aspect')
        } else if (cfg === 'upslope') {
            inputs.add('upslope')
        } else throw new Error(`Unknown 'slopeDirectionInput' config '${cfg}'`)

        cfg = this.configs.windDirectionInput
        if (cfg === 'bearing') {
            inputs.add('windBearing')
        } else if (cfg === 'source') {
            inputs.add('windSource')
        } else throw new Error(`Unknown 'windDirectionInput' config '${cfg}'`)

        cfg = this.configs.windSpeedInput
        if (cfg === '20ft') {
            inputs.add('windSpeed20ft')
        } else if (cfg === '10m') {
            inputs.add('windSpeed10m')
        } else throw new Error(`Unknown 'windSpeedInput' config '${cfg}'`)

        cfg = this.configs.midflameWindSpeedInput
        if (cfg === 'input') {
            inputs.add('midflameWindSpeed')
        } else if (cfg === 'estimated') {
            inputs.add('windSpeed20ft')
            const wsrf = this.configs.midflameReductionInput
            if (wsrf === 'input') {
                inputs.add('windSpeedReductionFactor')
            } else if (wsrf === 'estimated') {
                inputs.add('canopyBaseHeight')
                inputs.add('canopyHeight')
                inputs.add('canopyCover')
                inputs.add('fuelKey1')
            } else throw new Error(`Unknown 'midflameWindReductionInput' config '${wsrf}'`)
        } else throw new Error(`Unknown 'midflameWindSpeedInput' config '${cfg}'`)

        return inputs
    }

    run(configs=null) {
        if (configs !== null)
            this.configure(configs)
        this.processor.run()
    }
}
