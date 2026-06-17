import { WfsFuelMoisture } from "./WfsInputs.js"

export function makeFuelMoisture(inputs={}, configs={}) {
    const {fuelMoisture=null} = inputs
    const {deadFuelMoistureInput='particle', liveFuelMoistureInput='particle'} = configs

    // Use either the provided fuel moisture object, or get the standard object
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