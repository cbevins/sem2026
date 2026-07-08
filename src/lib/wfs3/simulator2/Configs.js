export const FullSurfaceConfig = {
    // Modules
    activeCrownFireModule: 'active',

    surfaceFireModule: 'active',
        fireBehaviorModule: 'active',
            fuelIgnitionModule: 'active',
                fuelBedModule: 'active',
                    fuelModelModule: 'active',
    
    fireSizeModule: 'linkedSurface',  // linkedSurface, standAlone
        headVectorModule: 'active',
        backVectorModule: 'active',
        rightVectorModule: 'active',
        leftVectorModule: 'active',
        betaVectorModule: 'active',
        beta6VectorModule: 'active',
        psiVectorModule: 'active',
        thetaVectorModule: 'active',

    // Processing
    canopyStructureFrom: 'height-base', // 'height-length', 'height-ratio', 'length-base',
    fuelCuringFrom: 'fuelMoistureLiveHerb', // input, fuelMoistureLiveHerb
    fuelModels: 'two',  // 'one, two,
    fuelModelOne: 'standard', // standard, chaparral, aspen, custom, pg
    fuelModelTwo: 'standard', // standard, chaparral, aspen, custom, pg
    deadFuelMoisturesBy: 'particle', // particle, category
    liveFuelMoisturesBy: 'particle', // particle, category
    midflameWindSpeedFrom: 'estimate', // input
    midflameWsrfFrom: 'canopyAndFuelBed', // input, canopyAndFuelBed
    slopeDirectionFrom: 'slopeUpslope', // slopeAspect, slopeUpslope
    slopeSteepnessFrom: 'slopeMap', // slopeDegrees, slopeMap, slopeRatio
    windDirectionFrom: 'windSourceCompass',  // windBearingDegrees, windSourceCompass, windSourceDegrees
    windSpeedFrom: 'windSpeed10m', // windSpeed20ft, windSpeed10m
}
