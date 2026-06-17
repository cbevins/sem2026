// Wildland Fire Simulator index
export { makeFireBehavior } from './src/makeFireBehavior.js'
export { makeFireEllipse } from './src/makeFireEllipse.js'
export { makeFireSize } from './src/makeFireSize.js'
export { makeFuelBed } from './src/makeFuelBed.js'
export { makeFuelCatalog } from './src/makeFuelCatalog.js'
export { makeFuelIgnition } from './src/makeFuelIgnition.js'
export { makeFuelModel } from './src/makeFuelModel.js'
export { makeLogger} from './src/makeLogger.js'
export { makeBetaVector, makeBeta6Vector, makePsiVector, calcPsiSpreadRate} from './src/makeFireVectors.js'

// Input object factories
export { makeFireWeather } from './src/makeFireWeather.js'
export { makeFuelCanopy } from './src/makeFuelCanopy.js'
export { makeFuelCuring } from './src/makeFuelCuring.js'
export { makeFuelMoisture } from './src/makeFuelMoisture.js'

export { WfsBetaFromHead, WfsConfigs, WfsFirePosition, WfsFireTerrain, WfsFireWeather,
    WfsFuelCuring, WfsFuelKey, WfsFuelMoisture, WfsPsiFromHead
} from './src/WfsInputs.js'

export {
    calcBetaFromPsi,
    calcBetaFromTheta,
    calcPsiFromBeta,
    calcPsiFromTheta,
    calcThetaFromBeta,
    calcThetaFromPsi,
} from './src/getEllipseAngles.js'

export {bearingToClockwiseFromHead,
    clamp,
    clampFraction,
    clockwiseFromHeadToBearing,
    clockwiseFromHeadToRotation,
    divide,
    fraction,
    getFlameLength,
    getScorchHeight,
    rotationToClockwiseFromHead,
    toDegrees,
    toRadians,
} from './src/utils.js'