export function makeFuelModel(inputs={}, configs={}) {
    // Get applicable input objects
    const {fuelCatalog=null, fuelKey=null} = inputs
    
    if (fuelCatalog === null) 
        throw new Error(`makeFuelModel() is missing required 'fuelCatalog' inputs object.`)
    
    const fuelModel = fuelCatalog.get(fuelKey)
    if (fuelModel === null && configs.logger) {
        configs.logger.log(`makeFuelModel() inputs.fuelKey '${fuelKey}' is not valid: assuming fuel model 1.`)
        return fuelCatalog.get(1)
    }
    return fuelModel
}
