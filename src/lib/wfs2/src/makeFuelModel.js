// eslint-disable-next-line no-unused-vars
export function makeFuelModel(fuelCatalog, fuelKey, log=null, propsLevel=0) {
    let fuelModel = fuelCatalog.get(fuelKey)
    if (! fuelModel) {
        if (log)
            log(`makeFuelModel() fuelKey '${fuelKey}' is not valid: using fuel model 1.`)
        fuelModel = fuelCatalog.get(1)
    }
    return fuelModel
}
