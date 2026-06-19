import { WfsFireWeather, WfsFuelCanopy } from "./WfsInputs.js"
import { checkInputs, clamp } from './utils.js'

export function  makeFireWeather(inputs={}, configs={}) {
    // Get applicable input objects
    let {fireWeather=null, fuelCanopy=null, fuelBed=null, fuelDepth=null} = inputs
     // Get applicable configs
    const {windSpeedInput, midflameWindSpeedInput, midflameReductionInput} = configs

    // Use either the provided fireWeather object, or get the standard object
    const pod = (fireWeather === null) ? {...WfsFireWeather} : {...fireWeather}

    // Determine the 20-ft or 10-m wind speed
    if (windSpeedInput === '10m') {
        pod.windSpeed20ft = pod.windSpeed10m / 1.13
    } else { // (windSpeedInput === '20ft') {
        pod.windSpeed10m = 1.13 * pod.windSpeed20ft
    }

    // Does the midflame wind speed need to be estimated?
    if (midflameWindSpeedInput === 'estimated') {
        // If so, does the midflame wind speed reduction factor need to be estimated?
        if (midflameReductionInput === 'estimated') {
            // Use either the provided 'fuelCanopy' object, or get the standard WfsFuelCanopy object
            fuelCanopy = checkInputs('makeFireWeather()', fuelCanopy, 'fuelCanopy', WfsFuelCanopy, 'WfsFuelCanopy', configs)
            let canopyWsrf = fuelCanopy.canopyWindReductionFactor
            let canopySheltersFuel = pod.canopySheltersFuel

            // If no fuelBed object or fuelDepth property provided, assume 1 foot bed depth
            let depth = 1
            if (fuelDepth !== null) {
                depth = fuelDepth
            } else if (fuelBed !== null) {
                depth = fuelBed?.depth ?? 1
            } else {
                if (configs.logger)
                    configs.logger.log(`makeFireWeather() missing required 'fuelBed' input object or 'fuelDepth' value to determine midflame wind speed reduction factor: assuming a 1-ft fuel depth.`)
            }
            depth = clamp(depth, 0.1, 6)
            const fuelWsrf = 1.83 / Math.log((20 + 0.36 * depth) / (0.13 * depth))
            pod.midflameReduction = canopySheltersFuel ? canopyWsrf : fuelWsrf
        }
        pod.midflameWindSpeed = pod.midflameReduction * pod.windSpeed20ft
    }
    return pod
}
