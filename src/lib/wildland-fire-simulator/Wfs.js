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
    getFlameLength,
    getScorchHeight,
    rotationToClockwiseFromHead,
    toDegrees,
    toRadians,
} from './src/utils.js'