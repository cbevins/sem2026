/**
 * The functions serve as adapters between the input{} object and the state.object{}.
 * They then may set additional properties on the state.object{} by:
 *  - calling a makeSomething() function, or
 *  - directly setting the properties themselves.
 */
import {
    makeFireBehavior, makeFuelBed, makeFuelCatalog, makeFuelIgnition, makeFuelModel,
    fraction, toDegrees, toRadians,
    makeCanopyFuels, makeMidflameWindSpeed,
} from '../src/Wfs.js'

export function canopyFromHeightBase() {
    this.canopy.canopyBase = this.input.canopyBase
    this.canopy.canopyHeight = this.input.canopyHeight
    this.canopy.canopyCover = this.input.canopyCover
    // Derives canopyLength, canopyRatio, canopyFill, canopy.canopySheltersFuel,
    // canopyMidflameWsrf, and sets missing default for/ canopyBulkDensity,
    // canopyHeatContent, canopyFueLoad, and canopyHeatPerUnitArea
    this.canopy = makeCanopyFuels(this.canopy, this.propsLevel)
}

export function fuelCatalog() {
    this.fuelCatalog = makeFuelCatalog() 
}
export function fuelCuringClasses() {
    this.fuelCuringClasses = this.fuelCatalog.getCuringClasses()
}
export function fuelMoistureClasses() {
    this.fuelMoistureClasses = this.fuelCatalog.getMoistureClasses()
}
export function moistureDeadFuelsFromParticle() {
    this.fuelMoisture.moistureDead1h = this.input.moistureDead1h
    this.fuelMoisture.moistureDead10h = this.input.moistureDead10h
    this.fuelMoisture.moistureDead100h = this.input.moistureDead100h
}
export function moistureLiveFuelsFromParticles() {
    this.fuelMoisture.moistureLiveHerb = this.input.moistureLiveHerb
    this.fuelMoisture.moistureLiveStem = this.input.moistureLiveStem
}
export function fuelCuringFromMoisture() {
    this.fuelCuring.curedHerb =
        fraction(1.333 - 1.11 * this.fuelMoisture.moistureLiveHerb)
}
export function midflameWsrfFromCanopyFuel() {
    this.windSpeed.midflameWsrf = Math.min(
        this.canopy.canopyMidflameWsrf,
        this.surface.fuel1.fuelMidflameWsrf)
    this.windSpeed.midflameWindSpeed = this.windSpeed.windAt20ft * this.windSpeed.midflameWsrf
}
export function surfaceCrownFireBehavior() {
    this.surface.crown.fireBehavior = makeFireBehavior(
        this.surface.crown.fuelBed,
        this.surface.crown.fuelIgnition,
        {aspect: 0},        // no slope for Rothermel's crown fire model
        {ratio: 0},         // no slope for Rothermel's crown fire model
        this.windDirection,
        this.windSpeed20ft, // use 20-ft wind speed
        this.propsLevel)
}
export function surfaceCrownFuelBed() {
    this.surface.crown.fuelBed = makeFuelBed(
        this.surface.crown.fuelModel,
        this.fuelCuring,
        this.propsLevel)
}
export function surfaceCrownFuelIgnition() {
    this.surface.crown.fuelIgnition = makeFuelIgnition(
        this.surface.crown.fuelBed,
        this.fuelMoisture,
        this.propsLevel)
}
export function surfaceCrownFuelModel() {
    this.surface.crown.fuelModel = makeFuelModel(
        this.fuelCatalog,
        10,
        this.propsLevel)
}
export function surfaceFuel1FireBehavior() {
    this.surface.fuel1.fireBehavior = makeFireBehavior(
        this.surface.fuel1.fuelBed,
        this.surface.fuel1.fuelIgnition,
        this.slopeDirection,
        this.slopeSteepness,
        this.windDirection,
        this.midflameWindSpeed,
        this.propsLevel)
}
export function surfaceFuel1FuelBed() {
    this.surface.fuel1.fuelBed = makeFuelBed(
        this.surface.fuel1.fuelModel,
        this.fuelCuring,
        this.propsLevel)
}
export function surfaceFuel1FuelIgnition() {
    this.surface.fuel1.fuelIgnition = makeFuelIgnition(
        this.surface.fuel1.fuelBed,
        this.fuelMoisture,
        this.propsLevel)
}
export function surfaceFuel1FuelModel() {
    this.surface.fuel1.fuelModel = makeFuelModel(
        this.fuelCatalog,
        this.input.fuelKey1,
        this.propsLevel)
}
export function windDirectionByBearingDegrees() {
    const bearing = this.input.windDirectionDegrees
    const source = (bearing + 180) % 360
    this.windDirection.bearing = bearing
    this.windDirection.source = source
}
export function slopeDirectionFromAspect() {
    const aspect = this.input.slopeAspect
    const upslope = (aspect + 180) % 360
    this.slopeDirection.slopeAspect = aspect
    this.slopeDirection.slopeUpslope = upslope
}
export function slopeDirectionFromUpslope() {
    const upslope = this.input.slopeUpslope
    const aspect = (upslope + 180) % 360
    this.slopeDirection.slopeAspect = aspect
    this.slopeDirection.slopeUpslope = upslope
}
export function slopeSteepnessFromRatio() {
    const ratio = this.input.slopeRatio
    const degrees = toDegrees(Math.atan(ratio))
    this.slopeSteepness.slopeRatio = ratio
    this.slopeSteepness.slopeDegrees = degrees
}
export function slopeSteepnessFromDegrees() {
    const degrees = this.input.slopeDegrees
    const ratio = Math.tan(toRadians(degrees))
    this.slopeSteepness.slopeRatio = ratio
    this.slopeSteepness.slopeDegrees = degrees
}
export function slopeSteepnessFromMap() {
    const [mapScale, mapContourInterval, mapContoursCrossed, mapDistance] = this.inputs
    const reach = Math.max(0, mapScale * mapDistance)
    const rise = Math.max(0, mapContoursCrossed * mapContourInterval)
    const slopeRatio = (reach>0) ? rise / reach : 0
    this.slopeSteepness.slopeRatio = slopeRatio
    const slopeDegrees = toDegrees(Math.atan(slopeRatio))
    this.slopeSteepness.slopeDegrees = slopeDegrees
}
export function windSpeedAt10m() {
    const windSpeed10m = this.input.windSpeed10m
    const windSpeed20ft = windSpeed10m / 1.13
    this.windSpeed.windSpeed20ft = windSpeed20ft
    this.windSpeed.windSpeed10m = windSpeed10m
}
export function windSpeedAt20ft() {
    const windSpeed20ft = this.input.windSpeed20ft
    const windSpeed10m = 1.13 * windSpeed20ft
    this.windSpeed.windSpeed20ft = windSpeed20ft
    this.windSpeed.windSpeed10m = windSpeed10m
}
export function unweightedFireBehavior() {
    this.surface.fireBehavior = this.surface.fuel1.fireBehavior
}
export function surfaceFireSize() {
    this.msg = 'IMPLEMENT surfaceFireSize()'
    console.log(this.msg)
}
export function fireVectorHead() {
    this.msg = 'IMPLEMENT fireVectorHead()'
    console.log(this.msg)
    console.log(this.msg)
}
export function fireVectorBack() {
    this.msg = 'IMPLEMENT fireVectorBack()'
    console.log(this.msg)
}
export function fireVectorRight() {
    this.msg = 'IMPLEMENT fireVectorRight()'
    console.log(this.msg)
}
export function fireVectorLeft() {
    this.msg = 'IMPLEMENT fireVectorLeft()'
    console.log(this.msg)
}
export function fireVectorBeta() {
    this.msg = 'IMPLEMENT fireVectorBeta()'
    console.log(this.msg)
}
export function fireVectorBeta6() {
    this.msg = 'IMPLEMENT fireVectorBeta6()'
    console.log(this.msg)
}
export function fireVectorPsi() {
    this.msg = 'IMPLEMENT fireVectorPsi()'
    console.log(this.msg)
}
export function fireVectorTheta() {
    this.msg = 'IMPLEMENT fireVectorTheta()'
    console.log(this.msg)
}