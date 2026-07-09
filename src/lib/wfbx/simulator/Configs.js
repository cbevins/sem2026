export const FullSurfaceConfig = {
    activeCrownFireModule: 'active',
    surfaceFireModule: 'active',
    surfaceFireSizeModule: 'active',
    surfaceFireVectorModule: 'active',
    // surfaceFuelBedModule: 'active',
    // surfaceFuelIgnitionModule: 'active',
    // surfaceFuelModelModule: 'active',

    standAloneFireSizeModule: 'inactive',
    fireVectorBeta: 'active',
    fireVectorBeta6: 'active',
    fireVectorPsi: 'active',
    fireVectorTheta: 'active',


    canopyStructureFrom: 'HeightBase', // ['HeightBase', 'HeightLength', 'HeightRatio', 'LengthBase'],
    deadFuelMoistureFrom: 'Particles',   // ['Particles', 'Category'],
    fuelCuringFrom: 'LiveHerbMoisture', // ['input', 'LiveHerbMoisture'],
    fuelModels: 'two',  // ['one', 'two'],
    liveFuelMoistureFrom: 'Particles',   // ['Particles', 'Catgeory'],
    midflameWindSpeedFrom: 'WsrfAnd20ftWind', // ['input', 'WsrfAnd20ftWind'],
    midflameWsrfFrom: 'CanopyAndFuelBed', // ['input', 'CanopyAndFuelBed'],
    slopeDirectionFrom: 'Upslope',  // ['Aspect', 'Upslope'],
    slopeSteepnessFrom: 'Map',  // ['Degrees', 'Map', 'Ratio'],
    surfaceFireBehaviorModule: 'active',
    windDirectionFrom: 'SourceDegrees', // ['BearingDegrees', 'SourceDegrees', 'SourceCompass'],
    windSpeedFrom: '20ft',  // ['10m', '20ft'],
}
