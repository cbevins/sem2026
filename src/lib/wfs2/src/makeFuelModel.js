// eslint-disable-next-line no-unused-vars
export function makeFuelModel(fuelCatalog, fuelKey, logger=null, propsLevel=0) {
    let fuelModel = fuelCatalog.get(fuelKey)
    if (! fuelModel) {
        if (logger)
            logger.log(`makeFuelModel() fuelKey '${fuelKey}' is not valid: using fuel model 1.`)
        fuelModel = fuelCatalog.get(1)
    }
    return fuelModel
}
