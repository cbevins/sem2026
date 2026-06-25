import { BehavePlus } from './BehavePlus.js'

// 1 - Create the processor
const bp = new BehavePlus()

// 2 - Present configuration options to UI for editing
// Mock implementation of UI editable configuration form
const configs = {
    detailLevel: 2,
    logger: null,
    validateInputs: true,               // not yet implemented

    // input options:
    canopyHeightInputs: 'height-base',  // 'height-base', 'height-ratio', height-length', 'length-base', 'length-ratio', 'base-ratio'
    fuelCuringInput: 'estimated',       // 'estimated' or 'input'
    fuelModelInput: 'one',                  // 'one', 'two', 'chaparral', 'aspen', 'pg',
    fuelModelWeighting: 'arithmetic',   // 'arithmetic', 'harmonic', or 'primary'
    deadFuelMoistureInput: 'particle',  // input by 'particle' or by 'life' category
    liveFuelMoistureInput: 'particle',  // input by 'particle' or by 'life' category
    midflameReductionInput: 'estimated',// 'input' or 'estimated' from fuel and canopy wind reduction
    midflameWindSpeedInput: 'input',    // 'input' or 'estimated' from upper wind speed and reduction factor
    slopeDirectionInput: 'aspect',      // 'aspect' or 'upslope'
    slopeSteepnessInput: 'ratio',       // 'degrees', 'ratio', 'map'
    windDirectionInput: 'bearing',      // 'bearing' or 'source'
    windSpeedInput: 'midflame',         // '20ft', '10m'

    // simulation computation option
    limitWindFactor: true,      // limit wind coefficient to 0.9 wind speed / reaction intensity
    limitSpreadRate: true,      // limit max spread rate to effective wind speed
    includeFlameLength: true,   // include flame length computation in fire vectors
    includeScorchHeight: true,  // include scorch height computation in fire vectors

    // modules
    surfaceModuleActive: true,
    fireSizeModuleActive: true,

    // module linkages
    linkBehaviorEllipse: true,
    linkBehaviorSpotting: true,
    linkBehaviorCrowning: true,
    linkBehaviorMortality: true,
}
const configsTable = []
for(let [key, value] of Object.entries(configs))
    configsTable.push({key, value})
console.log('Configuration Settings')
console.table(configsTable)

// 3 - Fetch user's configuration options from UI and set into BehavePlus
bp.configure(configs)

// 4 - Fetch user's output selections from UI into BehavePlus
bp.outputKeysSet = new Set()
bp.outputKeysSet
    .add('curedHerb')
    .add('noWindSpreadRate')

// 5 - Present possible inputs for this configuration to UI input form
// Mock implementation of UI inputs form
const inputTable = []
for(let key of bp.inputKeysSet) {
    const prop = bp.props[key]
    inputTable.push({owner: prop.owner, key: prop.key, type: prop.type})
}
console.log('Configuration Inputs:')
console.table(inputTable)

// Mock implementation of UI input form user values
const uiForm = [
    {key: 'fuelKey1', values: [10, 124]},
    {key: 'moistureLiveCurable', values: [0.5]},
    {key: 'moistureLiveHerb', values: [0.5]},
    {key: 'moistureLiveStem', values: [1.5]},
    {key: 'moistureDead1h', values: [0.05]},
    {key: 'moistureDead10h', values: [0.07]},
    {key: 'moistureDead100h', values: [0.09]},
]

// 6 - Set UI input form values into BehavePlus
for(let {key, values} of uiForm)
    bp.props[key].values = values

// 7 - Run the BehavePlusProcessor
bp.run()

// 8 - Display results
console.table(bp.results)
