import { requireInputs } from "./utils.js"

export function makeFuelModel(inputs={}, configs={}) {
    // Get applicable input objects
    let {fuelCatalog=null, fuelKey=null} = inputs
    
    // Require the fuelCatalog arg
    fuelCatalog = requireInputs('makeFuelModel()', fuelCatalog, 'fuelCatalog')

    // test fuelKey
    if (fuelKey === null) {
        if (configs.logger)
            configs.logger.log(`makeFuelModel() inputs.fuelKey missing: assuming fuel model 1.`)
        fuelKey = 1
    }

    let fuelModel = fuelCatalog.get(fuelKey)
    if (! fuelModel) {
        if (configs.logger)
            configs.logger.log(`makeFuelModel() inputs.fuelKey '${fuelKey}' is not valid: assuming fuel model 1.`)
        fuelModel = fuelCatalog.get(1)
    }
    return fuelModel
}
