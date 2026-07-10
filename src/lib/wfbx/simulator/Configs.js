// This config creates a fully linked surface fire chain
// employing the most-commonly used inputs
export const BaseConfig = {
    summary: 'Fully linked module chain with common inputs',

    // This should in/activate the entire surface fire chain
    surfaceFireModule: 'inactive',
    // These following surface*Module only have effect when surfaceFireModule is 'active',
    // and provide a way to execute just the first few links of the module chain
    // i.e., everything from the first 'active' module will be executed
    // If 'active', will execute FireSize, FireBehavior, FuelIgnition, FuelBed, FuelModel modules
    surfaceFireVectorModule: 'inactive',
    // If 'active', will execute FireBehavior, FuelIgnition, FuelBed, FuelModel modules
    surfaceFireSizeModule: 'inactive',
    // If 'active', will execute FuelIgnition, FuelBed, FuelModel modules
    surfaceFireBehaviorModule: 'active',
    // If 'active', will execute FuelBed and FuelModel modules
    surfaceFuelIgnitionModule: 'inactive',
    // If 'active', will execute FuelModel module
    surfaceFuelBedModule: 'inactive',
    surfaceFuelModelModule: 'inactive',

    // These may be stand-alone or linked to suface
    activeCrownFireModule: 'active',
    fireSizeModule: 'active',
    fireVectorModule: 'active',

    // These only have effect when surfaceFireVectorModule or fireVectorModule is 'active'
    fireVectorBeta: 'active',
    fireVectorBeta6: 'active',
    fireVectorPsi: 'active',
    fireVectorTheta: 'active',

    canopyStructureFrom: 'HeightBase', // ['HeightBase', 'HeightLength', 'HeightRatio', 'LengthBase'],
    deadFuelMoistureFrom: 'Particles',   // ['Particles', 'Category'],
    fuelCuringFrom: 'input', // ['input', 'LiveHerbMoisture'],
    fuelModels: 'one',  // ['one', 'two'],
    liveFuelMoistureFrom: 'Particles',   // ['Particles', 'Catgeory'],
    midflameWindSpeedFrom: 'input', // ['input', 'WsrfAnd20ftWind'],
    midflameWsrfFrom: 'CanopyAndFuelBed', // ['input', 'CanopyAndFuelBed'],
    slopeDirectionFrom: 'Aspect',  // ['Aspect', 'Upslope'],
    slopeSteepnessFrom: 'Ratio',  // ['Degrees', 'Map', 'Ratio'],
    windDirectionFrom: 'BearingDegrees', // ['BearingDegrees', 'SourceDegrees', 'SourceCompass'],
    windSpeedFrom: '20ft',  // ['10m', '20ft'],
}

// This config creates a fully linked surface fire chain employing less-commonly used inputs:
// Two fuels, slopeMap, estimated WSRF, 10m wind, moisture Category, estimated curing
export const FullExpandedSurfaceConfig = { ...BaseConfig,
    summary: 'SURFACE-SIZE-VECTOR-CROWN with expanded curing, wind, slope, wsrf, moisture inputs',
    canopyStructureFrom: 'HeightBase', // ['HeightBase', 'HeightLength', 'HeightRatio', 'LengthBase'],
    deadFuelMoistureFrom: 'Category',   // ['Particles', 'Category'],
    fuelCuringFrom: 'LiveHerbMoisture', // ['input', 'LiveHerbMoisture'],
    fuelModels: 'two',  // ['one', 'two'],
    liveFuelMoistureFrom: 'Category',   // ['Particles', 'Catgeory'],
    midflameWindSpeedFrom: 'WsrfAnd20ftWind', // ['input', 'WsrfAnd20ftWind'],
    midflameWsrfFrom: 'CanopyAndFuelBed', // ['input', 'CanopyAndFuelBed'],
    slopeDirectionFrom: 'Upslope',  // ['Aspect', 'Upslope'],
    slopeSteepnessFrom: 'Map',  // ['Degrees', 'Map', 'Ratio'],
    surfaceFireBehaviorModule: 'active',
    windDirectionFrom: 'SourceDegrees', // ['BearingDegrees', 'SourceDegrees', 'SourceCompass'],
    windSpeedFrom: '20ft',  // ['10m', '20ft'],
}
