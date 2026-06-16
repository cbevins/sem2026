export function makeFuelModel(inputs={}, configs={}) {
    const {fuelCatalog, fuelKey} = inputs
    const fuelModel = fuelCatalog.get(fuelKey)
    if (fuelModel === null && configs.logger)
        configs.logger.log(`makeFuelModel() inputs.fuelKey '${fuelKey}' is not valid.`)
    return fuelModel
}
