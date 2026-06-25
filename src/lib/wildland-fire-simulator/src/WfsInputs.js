/**
 * Collection of standard WFSM input objects.
 * These are complete commonly-used WSF input objects the client can use as follows:
 * let myFireWeather = {...WfsFireWeather}
 * let myFireWeather = {...WfsFireWeather, midflameWindSpeed: 880}
 */

export const WfsBetaFromHead = 45
// Use as follows:
// const betaVector = makeBetaVector({fireSize, betaFromHead}, configs)
// const beta6Vector = makeBeta6Vector({fireSize, betaFromHead}, configs)

export const WfsConfigs = {
    // Wfs system options
    detailLevel: 2,
    logger: null,
    validateInputs: true,               // not yet implemented

    // input options:
    canopyHeightInputs: 'height-base',  // 'height-base', 'height-ratio', height-length', 'length-base', 'length-ratio', 'base-ratio'
    fuelCuringInput: 'input',           // 'estimated' or 'input'
    fuelModelInput: 'one',              // 'one', 'two', 'chaparral', 'aspen', 'pg',
    fuelModelWeighting: 'arithmetic',   // 'arithmetic', 'harmonic', or 'primary'
    deadFuelMoistureInput: 'particle',  // input by 'particle' or by 'life' category
    liveFuelMoistureInput: 'particle',  // input by 'particle' or by 'life' category
    midflameReductionInput: 'estimated',// 'input' or 'estimated' from fuel and canopy wind reduction
    midflameWindSpeedInput: 'input',    // 'input' or 'estimated' from 20ft/10m wind speed and reduction factor
    slopeDirectionInput: 'aspect',      // 'aspect' or 'upslope'
    slopeSteepnessInput: 'ratio',       // 'degrees', 'ratio', 'map'
    windDirectionInput: 'bearing',      // 'bearing' or 'source'
    windSpeedInput: '20ft',             // '20ft', '10m'

    // linkages:
    linkBehaviorEllipse: true,
    linkBehaviorSpotting: true,
    linkBehaviorCrowning: true,
    linkBehaviorMortality: true,

    // Modules
    surfaceModuleActive: true,
    
    // simulation computation option
    limitWindFactor: true,      // limit wind coefficient to 0.9 wind speed / reaction intensity
    limitSpreadRate: true,      // limit max spread rate to effective wind speed
    includeFlameLength: true,   // include flame length computation in fire vectors
    includeScorchHeight: true,  // include scorch height computation in fire vectors
}

// inputs required by makeFireSize()
export const WfsFirePosition = {
    elapsedTime: 60,            
    ignEast: 0,
    ignNorth: 0
}

// input to makeFireBehavior
export const WfsFireTerrain = {
    aspect: 180,                // required by makeFireBehavior
    elevation: 3000,
    ridgeValleyDistance: 5000,
    ridgeValleyElevation: 1000,
    slopeDegrees: 14.03624347,
    slopeRatio: 0.25,           // required by makeFireBehavior
    topography: 'ridgetop',
    upslope: 0,
}

// input to makeFireBehavior(), may be modified by getMidflameWindSpeed()
export const WfsFireWeather = {
    // managed by makeFireWeather()
    airTemp: 95,            // only used by scorch height
    windBearing: 90,        // required by makeFireBehavior()
    windFromUpslope: 90,    // 
    windSource: 180,        // used/created by makeFireWeather
    windSpeed10m: 900,      // used/created by makeFireWeather
    windSpeed20ft: 880,     // used/created by makeFireWeather
    // managed by makeMidflameWind()
    fuelBedReduction: 1,
    canopyReduction: 1,
    midflameReduction: 1,   // output
    midflameWindSpeed: 880, // required by makeFireBehavior()
}

// input to makeFuelCanopy()
export const WfsFuelCanopy = {
    canopyBaseHeight: 0,
    canopyBulkDensity: 0,
    canopyCover: 0,
    canopyFill: 0,
    canopyFuelLoad: 0,
    canopyHeat: 8000,
    canopyHeatPerUnitArea: 0,
    canopyHeight: 0,
    canopyLength: 0,
    canopyRatio: 0,
    canopySheltersFuel: false,
    canopyWindReductionFactor: 0,
}

export const WfsFuelCuring = {
    curedHerb: 0.778,       // required input to makeFuelModel()
}
// Add custom fuel curing classes like so:
// const myFuelCuring = {...WfsFuelCuring,
    // curedCheatgrass: 0.5    // an example custom fuel curing class
// }

export const WfsFuelKeys = {
    fuelCover1: 1,
    fuelKey1: 1,
    fuelKey2: 1,
}

export const WfsFuelMoisture = {
    moistureDead1h: 0.05,       // required input to makeFuelIgnition()
    moistureDead10h: 0.07,      // required input to makeFuelIgnition()
    moistureDead100h: 0.09,     // required input to makeFuelIgnition()
    moistureLiveHerb: 0.5,      // required input to makeFuelIgnition()
    moistureLiveStem: 1.5,      // required input to makeFuelIgnition()
    moistureDeadFuels: 0.1,     // used when configs.deadFuelMoistures = 'category'
    moistureLiveFuels: 3,       // used when configs.liveFuelMoistures = 'category'
    moistureLiveCurable: 3,
}
// Add custom fuel moisture classes like so:
// Now FuelModel particle's can reference the 'moistureLiveCheatgrass' moisture class
// so they get the value of the 'moistureLiveCheatgrass' moisture content
// const myFuelMoisture = {...WfsFuelMoisture,
//     moistureLiveCheatgrass: 0.5,    // an example custom fuel moisture class
// }

// inputs into makeFireEllipse (all are present in fireBehavior object)
// required when configs.fireEllipse = 'standalone'
export const WfsObservedFireBehavior = { 
    headingSpreadRate: 0,
    bearing: 0,
    lengthWidthRatio: 1,
    flameLength: 0,
}
// Use as follows:
// let myFireBehavior = makeFireBehavior({fuelBed, fuelIgnition, fireWeather, fireTerrain}, configs)
// if (configs.fireEllipse === 'standalone') {
//     myFireBehavior = {headingSpreadRate: 20, bearing: 90, lengthWidthRatio: 2, flameLength: 3}
// }

export const WfsPsiFromHead = 45
// Use as follows:
// const psiVector = makePsiVector({fireSize, psiFromHead}, configs)

// inputs to makeFireTerrain when slopeSteepnessInputs = 'map'
export const WfsSlopeMap = {
    mapScale: 24000,            // map sacle factor (Greater than 1, i.e., 24000)
    mapContourInterval: 20,     // map contour interval (ft)
    mapContours: 0,             // number of contours crossed in mapDistance
    mapDistance: 0,             // map distance covered in the measurement
}
