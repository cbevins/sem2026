import { WfsFuelCuring, WfsFuelMoisture } from "./WfsInputs.js"
import { clampFraction } from "./utils.js"

export function makeFuelCuring(inputs={}, configs={}) {
    let {fuelCuring=null, fuelMoisture=null} = inputs
    const {fuelCuringInput = 'input'} = configs

    // Use either the provided fuel curing object, or get the standard object
    if (fuelMoisture === null) {
        if (configs.logger)
            configs.logger.log(`makeFuelCuring() missing required 'fuelMoisture' input object: assuming default WfsFuelMoisture values.`)
        fuelMoisture = {...WfsFuelMoisture}
    }

    // Use either the provided fuel curing object, or get the standard object
    const pod = (fuelCuring === null) ? {...WfsFuelCuring} : {...fuelCuring}
    if (fuelCuringInput === 'estimated') {
        pod.curedHerb = curedHerbFraction(fuelMoisture.moistureLiveHerb)
    }
    return pod
}

/**
 * Cured herb fraction is 1 at moisture content of 0.3,
 * and is 0.001 at moisture content of 1.20
 * @param {float} liveHerbMc (fraction)
 * @returns Fraction of cured herb
 */
function curedHerbFraction (liveHerbMc) {
    return clampFraction( 1.333 - 1.11 * liveHerbMc)
}
