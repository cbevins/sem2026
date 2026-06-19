import { WfsFuelCuring, WfsFuelMoisture } from "./WfsInputs.js"
import { fraction, checkInputs } from "./utils.js"

export function makeFuelCuring(inputs={}, configs={}) {
    // Get applicable input objects
    let {fuelCuring=null, fuelMoisture=null} = inputs
    // Get applicable configs
    const {fuelCuringInput = 'input'} = configs

    // Use either the provided fuelCuring object, or get the standard object
    const pod = (fuelCuring === null) ? {...WfsFuelCuring} : {...fuelCuring}

    // If estimating fuel curing, fuelMoisture.moistureLiveHerb is required input
    if (fuelCuringInput === 'estimated') {
        // Use either the provided 'fuelMoisture' object, or get the standard WfsFuelMoisture object
        fuelMoisture = checkInputs('makeFuelCuring()', fuelMoisture, 'fuelMoisture', WfsFuelMoisture, 'WfsFuelMoisture', configs)
        // Use either the provided fuelMoisture object, or get the standard object
        pod.curedHerb = fraction(1.333 - 1.11 * fuelMoisture.moistureLiveHerb)
    }
    return pod
}
