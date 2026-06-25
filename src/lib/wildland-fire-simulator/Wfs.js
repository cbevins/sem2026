// Wildland Fire Simulator index
export { makeFireBehavior } from './src/makeFireBehavior.js'
export { makeFireEllipse } from './src/makeFireEllipse.js'
export { makeFireSize } from './src/makeFireSize.js'
export { makeFireTerrain } from './src/makeFireTerrain.js'
export { makeFuelBed } from './src/makeFuelBed.js'
export { makeFuelCatalog } from './src/makeFuelCatalog.js'
export { makeFuelIgnition } from './src/makeFuelIgnition.js'
export { makeFuelModel } from './src/makeFuelModel.js'
export { makeLogger} from './src/makeLogger.js'
export { makeWeightedFireBehavior } from './src/makeWeightedFireBehavior.js'
export { makeBetaVector, makeBeta6Vector, makePsiVector, calcPsiSpreadRate} from './src/makeFireVectors.js'

// WFS input object factories
export { makeFireWeather } from './src/makeFireWeather.js'
export { makeFuelCanopy } from './src/makeFuelCanopy.js'
export { makeFuelCuring } from './src/makeFuelCuring.js'
export { makeFuelMoisture } from './src/makeFuelMoisture.js'
export { makeMidflameWind } from './src/makeMidflameWind.js'

// Standard WFS data object templates
export { WfsBetaFromHead, WfsConfigs, WfsFirePosition, WfsFireTerrain, WfsFireWeather,
    WfsFuelCuring, WfsFuelKeys, WfsFuelMoisture, WfsSlopeMap, WfsPsiFromHead
} from './src/WfsInputs.js'

export { WfsFire } from './src/WsfFire.js'

export {
    calcBetaFromPsi,
    calcBetaFromTheta,
    calcPsiFromBeta,
    calcPsiFromTheta,
    calcThetaFromBeta,
    calcThetaFromPsi,
} from './src/getEllipseAngles.js'

export {bearingToClockwiseFromHead,
    checkInputs,
    clamp,
    clampFraction,
    clockwiseFromHeadToBearing,
    clockwiseFromHeadToRotation,
    divide,
    fraction,
    getFlameLength,
    getScorchHeight,
    requireInputs,
    rotationToClockwiseFromHead,
    toDegrees,
    toRadians,
} from './src/utils.js'