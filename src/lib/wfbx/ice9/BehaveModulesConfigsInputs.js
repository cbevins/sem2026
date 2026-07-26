// Contains the typical/standard setup for a BehavePlus-ish application

export const BehaveModules = {
    fuelCuring: true,
    fuelModel: true,
    fuelBed: true,
    fuelIgnition: true,
    twoFuels: true,
    crownFireBehavior: true,
    surfaceFireBehavior: true,
    fireShape: true,
    fireSize: true,
    firePosition: true,
    fireVectors: true,
    fireVectorBeta: true,
    fireVectorBeta6: true,
    fireVectorPsi: true,
    fireVectorTheta: true,
    scorchHeight: true,
    treeMortality: true,
}

export const BehaveConfigs = {
    fuelCuringFrom: 'liveMoisture',     // input, liveMoisture
    deadMoistureFrom: 'particles',      // particles, category
    liveMoistureFrom: 'particles',       // particles, category
    midflameWindSpeedFrom: 'wsrf20ft',     // input, wsrf20ft
    midflameWsrfFrom: 'canopyFuel',      // input, canopyFuel
    slopeDirectionFrom: 'aspect',      // aspect, upslope
    slopeSteepnessFrom: 'slopeMap',     // slopeDegrees, slopeMap, slopeRatio
    windDirectionFrom: 'sourceCompass', // bearingDegrees, sourceCompass, sourceDegrees
    windSpeedFrom: 'windSpeed10m',     // windSpeed20ft, windSpeed10m
}

// This is initialized with only those input properties that can be directly references by the WfbxScripter
export const BehaveState = {
    fuelKeys: {
        fuelKey1: 0,
        fuelKey2: 0
    },
    fuelMoisture: {
        // the following keys match the FuelModel Particle moisture class keys
        moistureDead1h: 1,
        moistureDead10h: 1,
        moistureDead100h: 1,
        moistureDeadCategory: 1,
        moistureLiveCategory: 5,
        moistureLiveCurable: 5,
        moistureLiveHerb: 5,
        moistureLiveStem: 5,
    },
    midflame: {
        windSpeed: 880,
        wsrf: 1
    },
    slopeDirection: {
        slopeAspect: 180,
        slopeUpslope: 0
    },
    slopeMap: {
        scale: 24000,
        contourInterval:100,
        contoursCrossed: 0,
        distance: 0
    },
    slopeSteepness: {
        slopeDegrees: 12,
        slopeRatio: 0.25
    },
    windDirection: {
        bearingDegrees: 90,
        sourceDegrees: 270,
        sourceCompass: 'W',
        bearingCompass: 'E'
    },
    windSpeed: {
        windSpeed10m: 0,
        windSpeed20ft: 0
    },
    canopyStructure: {
        height: 0,
        base: 0,
        cover: 0,
        fill: 0,                // updated
        sheltersFuel: false,    // updated
        midflameWsrf: 1         // updated
    },
    observedFire: {
        headSpreadRate: 0,
        headBearing: 0,
        headFlameLength: 0,
        lengthWidthRatio: 1
    },
    // these don't have modules (yet?)
    elapsedTime: 0,
    ignEast: 0,
    ignNorth: 0,
    angleFromHead: 0,
}

export const BehaveInputs = {
    fuelKey1: [10],
    fuelKey2: [124],
    curedHerb: [0.778],
    moistureDead1h: [0.05],
    moistureDead10h: [0.07],
    moistureDead100h: [0.09],
    moistureDeadCategory: [0.1],
    moistureLiveCategory: [1.5],
    moistureLiveCurable: [0.5],
    moistureLiveHerb: [0.5],
    moistureLiveStem: [1.5],
    slopeAspect: [180],
    slopeUpslope: [0],
    slopeDegrees: [12],
    slopeRatio: [0.25],
    mapScale: [24000],
    mapContourInterval: [100],
    mapContoursCrossed: [10],
    mapDistance: [10],
    windSpeed20ft: [880],
    windSpeed10m: [880 * 1.13],
    windBearingCompass: ['E'],
    windBearinfDegrees: [90],
    windSourceCompass: ['W'],
    windSourceDgerees: [270],
    midflameWindSpeed: [880],
    midflameWsrf: [1],
    canopyHeight: [40],
    canopyBase: [6],
    canopyCover: [0.5],
    observedHeadSpreadRate: [10],
    observedHeadBearing: [90],
    observedHeadFlameLength: [5],
    observedLengthWidthRatio: [2],
    elapsedTime: [60],
    ignEast: [0],
    ignNorth: [0],
    angleFromHead: [0],
}
