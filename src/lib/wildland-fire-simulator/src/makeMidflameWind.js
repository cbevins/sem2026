import { WfsFireWeather, WfsFuelCanopy } from "./WfsInputs.js"
import { checkInputs, clamp } from './utils.js'

export function makeMidflameWind(inputs={}, configs={}) {
    // Get applicable input objects
    let {fireWeather=null, fuelCanopy=null, fuelBed=null, fuelDepth=null} = inputs

     // Get applicable configs
    const {midflameWindSpeedInput, midflameReductionInput} = configs

    // Use either the provided 'fireWeather' object, or get the standard WfsFireWeather object
    const pod = checkInputs('makeMidflameWind()', fireWeather, 'fireWeather', WfsFireWeather, 'WfsFireWeather', configs)

    // Force reduction factors to 1 and return current midflame wind speed value
    if (midflameWindSpeedInput === 'input') {
        pod.fuelBedReduction = 1
        pod.canopyReduction = 1
        pod.midflameReduction = 1
        return pod
    }

    // The midflame wind speed needs to be estimated
    
    // Does the midflame wind speed reduction factor need to be estimated?
    if (midflameReductionInput === 'estimated') {
        // Use either the provided 'fuelCanopy' object, or get the standard WfsFuelCanopy object
        fuelCanopy = checkInputs('makeMidflameWind()', fuelCanopy, 'fuelCanopy', WfsFuelCanopy, 'WfsFuelCanopy', configs)
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
    pod.midflameWindSpeed = pod.midflameReduction * fireWeather.windSpeed20ft
    return pod
}
