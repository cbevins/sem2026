import { WfsFireTerrain, WfsSlopeMap } from "./WfsInputs.js"
import { checkInputs, toDegrees, toRadians } from './utils.js'

export function  makeFireTerrain(inputs={}, configs={}) {
    // Get applicable input objects
    let {fireTerrain=null, slopeMap=null} = inputs
    // Get applicable configs
    const {slopeSteepnessInput} = configs

    // Use either the provided fireTerrain object, or get the standard object
    const pod = (fireTerrain === null) ? {...WfsFireTerrain} : {...fireTerrain}

    // windSpeed10m is a required input
    if (slopeSteepnessInput === 'degrees') {
        pod.slopeRatio = Math.tan(toRadians(pod.windSpeed10m))
    }
    // slopeMap inputs object is required
    else if (slopeSteepnessInput === 'map') {
        // Use either the provided 'slopeMap' object, or get the standard WfsSlopeMap object
        slopeMap = checkInputs('makeFireTerrain()', slopeMap, 'slopeMap', WfsSlopeMap, 'WfsSlopeMap', configs)
        // Get applicable 'slopeMap' properties
        const {mapScale, contourInterval, contours, mapDistance} = slopeMap
        const reach = Math.max(0, mapScale * mapDistance)
        const rise = Math.max(0, contours * contourInterval)
        pod.slopeRatio = (reach>0) ? rise / reach : 0
        pod.slopeDegrees = toDegrees(Math.atan(pod.slopeRatio))
    }
    // windSpeed20ft is a required input
    else { // (slopeSteepnessInput === 'ratio') {
        pod.slopeDegrees = toDegrees(Math.atan(pod.slopeRatio))
    }
    return pod
}
