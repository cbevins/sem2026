import { WfsFuelMoisture } from "./WfsInputs.js"

export function makeFuelMoisture(inputs={}, configs={}) {
    // Get applicable input objects
    let {fuelMoisture=null} = inputs
    // Get the applicable configs
    let {deadFuelMoistureInput='particle', liveFuelMoistureInput='particle'} = configs

    // Use either the provided fuelMoisture object, or clone the WfsFuelMoisture object
    const pod = (fuelMoisture === null) ? {...WfsFuelMoisture} : {...fuelMoisture}

    if (deadFuelMoistureInput === 'life') {
        pod.moistureDead1h = pod.moistureDeadFuels
        pod.moistureDead10h = pod.moistureDeadFuels
        pod.moistureDead100h = pod.moistureDeadFuels
    }
    if (liveFuelMoistureInput === 'life') {
        pod.moistureLiveHerb = pod.moistureLiveFuels
        pod.moistureLiveStem = pod.moistureLiveFuels
    }
    return pod
}