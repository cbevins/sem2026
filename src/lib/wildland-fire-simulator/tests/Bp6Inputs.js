/**
 * Collection of standard WFS input objects used for testing
 * These are complete commonly-used WSF input objects the client can use as follows:
 * let myFireWeather = {...Bp6FireWeather}
 * let myFireWeather = {...Bp6FireWeather, midflameWindSpeed: 880}
 */

export const Bp6BetaFromHead = 45
// Use as follows:
// const betaVector = makeBetaVector({fireSize, betaFromHead}, configs)
// const beta6Vector = makeBeta6Vector({fireSize, betaFromHead}, configs)

export const Bp6Configs = {
    // Bp6 system options
    detailLevel: 2,
    logger: null,
    validateInputs: true,

    // input options:
    canopyHeightInputs: 'height-base',  // 'height-base', 'height-ratio', height-length', 'length-base', 'length-ratio', 'base-ratio'
    fuelCuringInput: 'input',           // 'estimated' or 'input'
    deadFuelMoistureInput: 'particle',  // input by 'particle' or by 'life' category
    liveFuelMoistureInput: 'particle',  // input by 'particle' or by 'life' category
    midflameWindSpeedInput: 'input',    // 'input', 'estimated'
    slopeSteepnessInput: 'ratio',       // 'degrees', 'ratio'
    windSpeedInput: 'midflame',         // 'midflame', '20ft', '10m'

    // simulation computation option
    limitWindFactor: true,      // limit wind coefficient to 0.9 wind speed / reaction intensity
    limitSpreadRate: true,      // limit max spread rate to effective wind speed
    includeFlameLengths: false, // include flame length computation in fire vectors
    includeScorchHeightLengths: false, // include scorch height computation in fire vectors
}

// inputs required by makeFireSize()
export const Bp6FirePosition = {
    elapsedTime: 60,            
    ignEast: 0,
    ignNorth: 0
}

// input to makeFireBehavior
export const Bp6FireTerrain = {
    aspect: 180,                // required by makeFireBehavior
    elevation: 3000,
    slopeDegrees: 14.03624347,
    slopeRatio: 0.25,           // required by makeFireBehavior
    topography: 'ridgetop',
    upslope: 0,
}

// input to makeFireBehavior(), may be modified by getMidflameWindSpeed()
export const Bp6FireWeather = {
    airTemp: 95,            // only used by scorch height
    midflameReduction: 1,   // output
    midflameWindSpeed: 880, // required by makeFireBehavior()
    windBearing: 90,        // required by makeFireBehavior()
    windSource: 180,        // used/created by makeFireWeather
    windSpeed10m: 900,      // used/created by makeFireWeather
    windSpeed20ft: 880,     // used/created by makeFireWeather
}

// input to makeFireWeather)()
export const Bp6FuelCanopy = {
    canopyBaseHeight: 6,
    canopyBulkDensity: 0.02,
    canopyCover: 0.5,
    canopyFill: 0,
    canopyFuelLoad: 0,
    canopyHeat: 8000,
    canopyHeatPerUnitArea: 0,
    canopyHeight: 40,
    canopyLength: 0,
    canopyRatio: 0,
    canopySheltersFuel: false,
    canopyWindReductionFactor: 0,
}

export const Bp6FuelCuring = {
    curedHerb: 0.778,       // required input to makeFuelModel()
}
// Add custom fuel curing classes like so:
// const myFuelCuring = {...Bp6FuelCuring,
    // curedCheatgrass: 0.5    // an example custom fuel curing class
// }

export const Bp6FuelKey = 10


// Add custom fuel moisture classes like so:
// Now FuelModel particle's can reference the 'moistureLiveCheatgrass' moisture class
// so they get the value of the 'moistureLiveCheatgrass' moisture content
// const myFuelMoisture = {...Bp6FuelMoisture,
//     moistureLiveCheatgrass: 0.5,    // an example custom fuel moisture class
// }
export const Bp6FuelMoisture = {
    moistureDead1h: 0.05,       // required input to makeFuelIgnition()
    moistureDead10h: 0.07,      // required input to makeFuelIgnition()
    moistureDead100h: 0.09,     // required input to makeFuelIgnition()
    moistureLiveHerb: 0.5,      // required input to makeFuelIgnition()
    moistureLiveStem: 1.5,      // required input to makeFuelIgnition()
    moistureDeadFuels: 0.1,     // used when configs.deadFuelMoistures = 'category'
    moistureLiveFuels: 3,       // used when configs.liveFuelMoistures = 'category'
}

// inputs into makeFireEllipse (all are present in fireBehavior object)
// required when configs.fireEllipse = 'standalone'
export const Bp6ObservedFireBehavior = { 
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

export const Bp6PsiFromHead = 45
// Use as follows:
// const psiVector = makePsiVector({fireSize, psiFromHead}, configs)
