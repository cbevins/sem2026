import { WfsFireWeather } from "./WfsInputs.js"
import { clamp } from './utils.js'

export function  makeFireWeather(inputs={}, configs={}) {
    let {fireWeather=null, fuelCanopy=null, fuelBed=null} = inputs
    // Use either the provided fireWeather object, or get the standard object
    const pod = (fireWeather === null) ? {...WfsFireWeather} : {...fireWeather}

    const {windSpeedInput, midflameWindSpeedInput} = configs
    if (windSpeedInput === '10m') {
        pod.windSpeed20ft = pod.windSpeed10m / 1.13
    } else { // (windSpeedInput === '20ft') {
        pod.windSpeed10m = 1.13 * pod.windSpeed20ft
    }

    let canopySheltersFuel = false
    let canopyWsrf = 1
    if (midflameWindSpeedInput === 'estimated') {
        // If no fuelCanopy object provided, assume there is no canopy
        if (fuelCanopy === null) {
            if (configs.logger)
                configs.logger.log(`makeFireWeather() missing required 'fuelCanopy' input object to determine midflame wind speed: assuming no fuel canopy.`)
        } else {
            canopyWsrf = fuelCanopy.canopyWindReductionFactor
            canopySheltersFuel = pod.canopySheltersFuel
        }
        // If no fuelCanopy object provided, assume 1 foot bed depth
        let fuelDepth = 1
        if (fuelBed === null) {
            if (configs.logger)
                configs.logger.log(`makeFireWeather() missing required 'fuelBed' input object to determine midflame wind speed: assuming a 1-ft fuel depth.`)
        } else {
            fuelDepth = fuelBed.depth
        }
        fuelDepth = clamp(fuelDepth, 0.1, 6)
        const fuelWsrf = 1.83 / Math.log((20 + 0.36 * fuelDepth) / (0.13 * fuelDepth))
        pod.midflameReduction = canopySheltersFuel ? canopyWsrf : fuelWsrf
        pod.midflameWindSpeed = pod.midflameReduction * pod.windSpeed20ft
    } // else (midflameWindSpeedInput === 'input') {
    return pod
}
