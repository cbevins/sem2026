import { WfsFireWeather } from "./WfsInputs.js"

export function  makeFireWeather(inputs={}, configs={}) {
    // Get applicable input objects
    let {fireWeather=null} = inputs

     // Get applicable configs
    const {windSpeedInput} = configs

    // Use either the provided fireWeather object, or get the standard object
    const pod = (fireWeather === null) ? {...WfsFireWeather} : {...fireWeather}

    // Determine the 20-ft or 10-m wind speed
    if (windSpeedInput === '10m') {
        pod.windSpeed20ft = pod.windSpeed10m / 1.13
    } else { // (windSpeedInput === '20ft') {
        pod.windSpeed10m = 1.13 * pod.windSpeed20ft
    }
    return pod
}
