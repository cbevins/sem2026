import { WfsStatus } from './WfsStatus.js'

const active = 'active'
const inactive = 'inactive'
const input = 'input'
const estimated = 'estimated'
export const configs = {
    surfaceFireModule: active,
    surfaceSizeModule: inactive,
    surfaceVectorModule: inactive,
    activeCrownFireModule: inactive,

    fuelCuringInput: input,                // 'input' or 'estimated'
    midflameWindSpeedInput: input,    // 'input', 'estimated'
    midflameWsrfInput: estimated,         // 'input', 'estimated'
    moistureDeadFuelsInput: 'particle',     // 'particle', 'life'
    moistureLiveFuelsInput: 'particle',     // 'particle', 'life'
    slopeDirectionInput: 'aspect',          // 'aspect', 'upslope'
    slopeSteepnessInput: 'ratio',     // 'ratio', 'degrees', or 'map'
    windDirectionInput: 'bearing',          // 'bearing', 'source'
    windSpeedInput: '20ft',                  // '20ft', '10m'
}

function sortedTable(title, status) {
    const obj = {}
    const keys = Object.keys(status).sort()
    for(let key of keys)
        obj[key] = status[key]
    console.log(`${title} (${keys.length}):`)
    console.table(obj)
}

console.log(new Date())
console.log('Current Configuration:')
console.table(configs)

const wfs = new WfsStatus()
const status = wfs.getStatus(configs)
sortedTable('ALL Inputs', wfs.getInputs())
sortedTable('Status of All Processors', wfs.getProcessors())
sortedTable('Status of All Modules', wfs.getModules())
// sortedTable('Status of All Properties', wfs.getProperties())
// sortedTable('Full Status Object', status)
console.log('Call Queue:')
console.table(wfs.getSequence(status))

console.log('Javascript')
console.log(wfs.getScript())
