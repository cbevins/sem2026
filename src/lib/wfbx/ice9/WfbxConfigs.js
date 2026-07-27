/**
 * WfbxConfigs defines optional methods of entering selected input parameters.
 * Once modified by the client, it is used primarily by WfbxScripter
 * (along with a WfbxModules) to generate an appropriate execution script,
 * including the input parameters and their sequence, and the methods to be invoked.
 */
export class WfbxConfigs {
    constructor() {
        this.fuelCuringFrom = 'liveMoisture'     // input, liveMoisture
        this.deadMoistureFrom = 'particles'      // particles, category
        this.liveMoistureFrom = 'particles'       // particles, category
        this.midflameWindSpeedFrom = 'wsrf20ft'     // input, wsrf20ft
        this.midflameWsrfFrom = 'canopyFuel'      // input, canopyFuel
        this.slopeDirectionFrom = 'aspectDegrees'   // aspectDegrees, aspectCompass, upslopeDegrees, upslopeCompass
        this.slopeSteepnessFrom = 'slopeMap'     // slopeDegrees, slopeMap, slopeRatio
        this.windDirectionFrom = 'sourceCompass' // bearingDegrees, sourceCompass, sourceDegrees
        this.windSpeedFrom = 'windSpeed10m'     // windSpeed20ft, windSpeed10m
    }
    
    static Options = {
        fuelCuringFrom: {
            label: 'Cured live fuel fraction is',
            options: [
                {key: 'input', label: 'input.'},
                {key: 'liveMoisture', label: 'estimated from live curable fuel moisture content input.'},]
        },
        deadMoistureFrom: {
            label: 'Dead fuel moisture fraction is',
            options: [
                {key: 'particles', label: 'input for each fuel particle size.'},
                {key: 'category', label: 'a single input value for all dead fuels.'}]
        },
        liveMoistureFrom: {
            label: 'Live fuel moisture fraction is',
            options: [
                {key: 'particles', label: 'input for both live herbs and live stems.'},
                {key: 'category', label: 'a single input value for all live fuels.'}]
        },
        midflameWindSpeedFrom: {
            label: 'The wind speed at midflame height is',
            options: [
                {key: 'input', label: 'input.'},
                {key: 'wsrf20ft', label: 'estimated from 20-ft wind speed and a wind speed reduction factor.'}]
        },
        midflameWsrfFrom: {
            label: 'The midflame wind speed reduction factor is',
            options: [
                {key: 'input', label: 'input.'},
                {key: 'canopyFuel', label: 'estimated from canopy structure and fuel bed depth.'}]
        },
        slopeDirectionFrom: {
            label: 'The terrain slope direction is',
            options: [
                {key: 'aspectDegrees', label: 'input as the aspect (down-slope) direction (degrees clockwise from north).'},
                {key: 'upslopeDegrees', label: 'input as the upslope direction (degreess clockwise from north).'},
                {key: 'aspectCompass', label: 'input as the aspect (down-slope) direction compass point (N, NNE, NE, ENE, E, etc).'},
                {key: 'upslopeCompass', label: 'input as the upslope direction compass point (N, NNE, NE, ENE, E, etc).'}],
            },
        slopeSteepnessFrom: {
            label: 'The terrain slope steepness is',
            options: [
                {key: 'slopeRatio', label: 'input as ratio of vertical rise to horizontal reach.'},
                {key: 'slopeDegrees', label: 'input as degrees above the horizontal plane.'},
                {key: 'slopeMap', label: 'estimated from map measurements.'}]
        },
        windDirectionFrom: {
            label: 'The wind direction is',
            options: [
                {key: 'bearingDegrees', label: 'input as wind bearing (degrees clockwise from north).'},
                {key: 'sourceDegrees', label: 'input as wind source (degrees clockwise from north).'},
                {key: 'sourceCompass', label: 'input as wind source compass point (N, NNE, NE, ENE, E, etc).'},
                {key: 'bearingCompass', label: 'input as wind bearing compass point (N, NNE, NE, ENE, E, etc).'}]
        },
        windSpeedFrom: {
            label: 'The wind speed is',
            options: [
                {key: 'windSpeed10m', label: 'input at 10-m above the surface.'},
                {key: 'windSpeed20ft', label: 'input at 20-ft above the surface.'}]
        },
    }
}
