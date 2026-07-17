export const WfbxConfig = {
    // Module toggles
    // These shoukd only enable/disable calling update*() methods,
    // and NOT interfere with calling input processing methods
    surfaceFuelCatalogActive: true,     // Module 0: always acive
    surfaceFuelModelActive: true,       // Module 1
    surfaceFuelCuringActive: true,      // Module 2
    surfaceFuelBedActive: true,         // Module 3
    surfaceFuelIgnitionActive: true,    // Module 4
    surfaceFireBehaviorActive: true,    // Module 5
    surfaceFireSpottingActive: false,   // not yet implemented
    surfaceFireShapeActive: true,
    surfaceFireSizeActive: true,
    surfaceFireVectorActive: true,
    surfaceCrownFireActive: true,
    surfaceCrownFireSpottingActive: false,

    surfaceFuelModels: 1,

    fireShapeActive: true,
    fireSizeActive: false,
    fireVectorActive: false,

    crownFireActive: false,
    crownFireSpottingActive: false,

    // Input options
    fuelCuringFrom: 'input',    // input, etimate
    deadMoistureFrom: 'particles',  // particles, category
    liveMoistureFrom: 'category',  // particles, category
    midflameWindSpeedFrom: 'input',    // input, estimate
    midflameWsrfFrom: 'input',      // input, estimate
    slopeDirectionFrom: 'upslope',  // aspect, upslope
    slopeSteepnessFrom: 'slopeMap',  // slopeDegrees, slopeMap, slopeRatio
    windDirectionFrom: 'sourceCompass',  // bearingDegrees, sourceCompass, sourceDegrees
}
