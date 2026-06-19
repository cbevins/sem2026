import { WfsFuelCanopy } from "./WfsInputs.js"
import { divide, fraction, positive } from './utils.js'

export function makeFuelCanopy(inputs={}, configs={}) {
    // Get applicable input objects
    const {fuelCanopy=null} = inputs
    // Get applicable configs
    const {canopyHeightInputs} = configs

    // Use either the provided fuelCanopy object, or get the standard object
    const pod = (fuelCanopy === null) ? {...WfsFuelCanopy} : {...fuelCanopy}
    
    let base, height, length, ratio
    if (canopyHeightInputs === 'height-length') {
        height = pod.canopyHeight
        length = pod.canopyLength
        base = positive(height - length)
        ratio = crownRatioFromLengthBase(length, base)
    } else if (canopyHeightInputs === 'height-ratio') {
        height = pod.canopyHeight
        ratio = pod.canopyRatio
        base = height * positive((1 - ratio))
        length = positive(ratio * height)
    } else if (canopyHeightInputs === 'length-base') {
        length = pod.canopyLength
        base = pod.canopyBaseHeight
        height = positive(length + base)
        ratio = divide(length, height)
    } else if (canopyHeightInputs === 'length-ratio') {
        length = pod.canopyLength
        ratio = pod.canopyRatio
        base = positive(divide(length, ratio) - length)
        height = positive(base + length)
    } else if (canopyHeightInputs === 'base-ratio') {
        ratio = pod.canopyRatio
        base = pod.canopyBaseHeight
        height = divide(base, positive((1 - ratio)))
        length = positive(height - base)
    } else {    // (canopyHeightInputs === 'height-base') {
        base = pod.canopyBaseHeight
        height = pod.canopyHeight
        length = positive(height - base)
        ratio = divide(length, height)
    }
    pod.canopyBaseHeight = base
    pod.canopyHeight = height
    pod.canopylength = length
    pod.canopyRatio = ratio

    pod.canopyFill = pod.canopyCover * ratio / 3
    pod.canopySheltersFuel = pod.canopyCover >= 0.01 && pod.canopyFill >= 0.05 && height >= 6
    pod.canopyWindReductionFactor = (! pod.canopySheltersFuel) ? 1
        : 0.555 / (Math.sqrt(pod.canopyFill * height) * Math.log((20 + 0.36 * height) / (0.13 * height)))

    pod.canopyFuelLoad = pod.canopyBulkDensity * length
    pod.canopyHeatPerUnitArea = pod.canopyFuelLoad * pod.canopyHeat
    return pod
}

// Canopy volumetric fill ratio the volume under the canopy top that
// is filled with tree crowns (division by 3 assumes conical crown shapes).
export function crownFill (cover, cratio) {
    return (fraction(cratio) * fraction(cover)) / 3
}
export function crownFillRatio(cover, cratio) {
    return crownFill(cover, cratio) 
}

// Canopy base height
export function canopyBaseFromRatioHeight(ratio, height) {
    return height * positive((1 - ratio))
}
export function canopyBaseFromRatioLength(ratio, length) {
    return positive(divide(length, ratio) - length)
}
export function canopyBaseFromHeightLength(height, length) {
    return positive(height - length)
}

// Canopy fuel load
export function canopyFuelLoad (bulk, length) {
    return positive(bulk * length)
}

// Canopy heat per unit area
export function canopyHeatPerUnitArea (load, heat) {
    return positive(load * heat)
}

// Canopy total height
export function canopyHeightFromLengthBase(length, base) {
    return length + base
}
export function canopyHeightFromRatioBase(ratio, base) {
    return divide(base, positive((1 - ratio))) // OK
}
export function canopyHeightFromRatioLength(ratio, length) {
    return divide(length, ratio)
}

// Canopy crown length
export function crownLengthFromRatioHeight(ratio, height) {
    return positive(ratio * height)
}
export function crownLengthFromRatioBase(ratio, base) {
    const height = divide(base, positive((1 - ratio)))
    return positive(height - base)
}
export function crownLengthFromHeightBase(height, base) {
    return positive(height - base)
}

// Canopy ratio
export function crownRatioFromHeightLength(height, length) {
    return fraction(divide(length, height))
}
export function crownRatioFromHeightBase(height, base) {
    return fraction(divide(positive((height-base)), height))
}
export function crownRatioFromLengthBase(length, base) {
    return fraction(divide(length, (length+base)))
} 

// Returns true if canopy effectively shelters the fuel from wind
export function canopySheltersFuelFromWind (canopyCoverFraction, canopyTotalHeight, canopyFillFraction) {
    return canopyCoverFraction >= 0.01 && canopyFillFraction >= 0.05 && canopyTotalHeight >= 6
}

// Canopy-induced midflame windspeed adjustment factor
export function canopyWindSpeedAdjustmentFactor (cover, ht, fill) {
    const waf = (canopySheltersFuelFromWind(cover, ht, fill))
        ? 0.555 / (Math.sqrt(fill * ht) * Math.log((20 + 0.36 * ht) / (0.13 * ht)))
        : 1
    return fraction(waf)
}
