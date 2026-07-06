export { CanopyStructure } from './modules/CanopyStructure.js'
export { FuelCuring } from './modules/FuelCuring.js'
export { FuelMoisture } from './modules/FuelMoisture.js'
export { MidflameWindSpeed } from './modules/MidflameWindSpeed.js'
export { MidflameWsrf } from './modules/MidflameWsrf.js'
export { SlopeMap } from './modules/SlopeMap.js'
export { SlopeSteepness } from './modules/SlopeSteepness.js'
export { WindSpeed } from './modules/WindSpeed.js'

// src/simulator
export { BehaveRules, BehaveConfigs } from './simulator/BehaveRules.js'
export { BehaveRules2, BehaveConfigs2 } from './simulator/BehaveRules2.js'
export { RulesCompiler } from './simulator/RulesCompiler.js'
export { RulesCompiler2 } from './simulator/RulesCompiler2.js'
export { State } from './simulator/State.js'

// src/utils
export {
    bearingToClockwiseFromHead,
    clamp,
    clockwiseFromHeadToBearing,
    clockwiseFromHeadToRotation,
    divide,
    fraction,
    getFlameLength,
    getScorchHeight,
    rotationToClockwiseFromHead,
    sortedTable,
    toDegrees,
    toRadians,
} from './functions/utils.js'