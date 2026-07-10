export class State {
    constructor() {
        this.canopy = {
            base: 0,
            bulkDensity: 0,
            cover: 0,
            fill: 0,
            fuelLoad: 0,
            heatContent: 8000,
            heatPerUnitArea: 0,
            height: 0,
            length: 0,
            midflameWsrf: 1,
            ratio: 0,
            sheltersWind: 0,
        }
        this.deadFuelMoisture = {
            category: 0.1,
            dead1h: 0.1,
            dead10h: 0.1,
            dead100h: 0.1,
        }
        this.fuelBed = {
            one: {
                depth: 1,
                midflameWsrf: 1,
            },
            two: {
                depth: 1,
                midflameWsrf: 1,
            }
        }
        this.fuelCatalog = null// new FuelCatalog()
        this.fuelCuring = {
            curedHerb: 0,
        }
        this.liveFuelMoisture = {
            category: 3,
            herb: 3,
            stem: 3,
        }
        this.midflame = {
            windSpeed: 0,
            wrsf: 1,
        }
        this.slopeDirection = {
            aspect: 180,
            upslope: 0,
        }
        this.slopeMap = {
            mapScale: 24000,
            mapContourInterval: 100,
            mapContoursCrossed: 0,
            mapDistance: 0,
            slopeRatio: 0,
            slopeDegrees: 0,
        }
        this.slopeSteepness = {
            degrees: 0,
            ratio: 0,
        }
        this.windDirection = {
            bearingDegrees: 0,
            sourceCompass: 'S',
            sourceDegrees: 180,
        }
        this.windSpeed = {
            windSpeed10m: 0,
            windSpeed20ft: 0,
        }
        this.compassPts = {
            N: 0, NNE: 1, NE: 2,  ENE: 3,  E: 4,  ESE: 5,  SE: 6,  SSE: 7, 
            S: 8, SSW: 9, SW: 10, WSW: 11, W: 12, WNW: 13, NW: 14, NNW: 15
        }
    }
    // utils
    fraction(value) { return Math.max(0, Math.min(1, value)) }
    toDegrees(radians) { return radians * 180 / Math.PI }
    toRadians(degrees) { return degrees * Math.PI / 180 }
    // stack calls
    makeActiveCrownFireBehavior() {}
    makeActiveCrownFireFuelBed() {}
    makeActiveCrownFireFuelIgnition() {}
    makeFireBehavior() {}
    makeFireEllipseFromObservedFire() {}
    makeFireEllipseFromSurfaceFire() {}
    makeFirePositionFromElapsedTime() {}
    makeFireSizeFromElapsedTime() {}
    makeFireVectorBeta() {}
    makeFireVectorBeta6() {}
    makeFireVectorPsi() {}
    makeFireVectorTheta() {}
    makeFuelBedsFromFuelModelsAndCuring() {}
    makeFuelCatalog() {}
    makeFuelIgnitionsFromFuelMoisture() {}
    makeFuelModelsFromFuelKeys() {}
    updateCanopyFromHeightBase() {
        const obj = this.canopy
        obj.length = Math.max(0, obj.height - obj.base)
        obj.ratio = (obj.height > 0) ? (obj.length / obj.height) : 0
        this.updateCanopyStructure()
    }
    updateCanopyFromHeightLength() {
        const obj = this.canopy
        obj.base = Math.max(0, obj.height - obj.length)
        obj.ratio = (obj.height > 0) ? (obj.length / obj.height) : 0
        this.updateCanopyStructure()
    }
    updateCanopyFromHeightRatio() {
        const obj = this.canopy
        obj.length = obj.height * obj.ratio
        obj.base = Math.max(0, obj.height - obj.length)
        this.updateCanopyStructure()
    }
    updateCanopyFromLengthBase() {
        const obj = this.canopy
        obj.height = obj.length + obj.base
        obj.ratio = (obj.height > 0) ? (obj.length / obj.height) : 0
        this.updateCanopyStructure()
    }
    updateCanopyFuel() {
        const obj = this.canopy
        obj.fuelLoad = obj.bulkDensity * obj.length             // lb/ft2
        obj.heatPerUnitArea = obj.fuelLoad * obj.heatContent    // BTU/ft2
    }
    updateCanopyStructure() {
        const obj = this.canopy
        obj.Fill = obj.Cover * obj.ratio / 3
        obj.sheltersFuel = obj.cover >= 0.01
            && obj.fill >= 0.05 && obj.height >= 6
        const ht = obj.height
        obj.midflameWsrf = (! obj.sheltersFuel) ? 1
            : 0.555 / (Math.sqrt(obj.fill * ht) * Math.log((20 + 0.36 * ht) / (0.13 * ht)))
    }
    updateDeadFuelMoistureFromCategory() {
        const obj = this.deadFuelMoisture
        obj.dead1h = obj.category
        obj.dead10h = obj.category
        obj.dead100h = obj.category
    }
    updateFuelCuringFromLiveHerbMoisture() {
        const obj = this.fuelCuring
        obj.curedHerb = this.fraction(1.333 - 1.11 * this.liveFuelMoisture.herb)
    }
    updateLiveFuelMoistureFromCategory() {
        const obj = this.liveFuelMoisture
        obj.herb = obj.category
        obj.stem = obj.category
    }
    updateMidflameWindSpeedFromWsrfAnd20ftWind() {
        this.midflame.windSpeed = this.midflame.wsrf * this.windSpeed.windSpeed20ft
    }
    updateMidflameWsrfFromCanopyAndFuelBed() {
        this.midflame.wsrf = Math.min(
            this.canopy.midflameWsrf, this.fuelBed.one.midflameWsrf)
    }
    updateSlopeDirectionFromAspect() {
        const obj = this.slopeDirection
        obj.upslope = (180 + obj.aspect) % 360
    }
    updateSlopeDirectionFromUpslope() {
        const obj = this.slopeDirection
        obj.aspect = (180 + obj.upslope) % 360
    }
    updateSlopeMap() {
        const obj = this.slopeMap
        const reach = Math.max(0, obj.mapScale * obj.mapDistance)
        const rise = Math.max(0, obj.mapContoursCrossed * obj.mapContourInterval)
        obj.slopeRatio = (reach > 0) ? (rise / reach) : 0
        obj.slopeDegrees = this.toDegrees(Math.atan(obj.slopeRatio))
    }
    updateSlopeSteepnessFromDegrees() {
        const obj = this.slopeSteepness
        obj.ratio = Math.tan(this.toRadians(obj.degrees))
    }
    updateSlopeSteepnessFromMap() {
        const obj = this.slopeSteepness
        const map = this.slopeMap
        obj.degrees = map.slopeDegrees
        obj.ratio = map.slopeRatio
    }
    updateSlopeSteepnessFromRatio() {
        const obj = this.slopeSteepness
        obj.degrees = this.toDegrees(Math.atan(obj.ratio))
    }
    updateWindDirectionFromBearingDegrees() {
        const obj = this.windDirection
        obj.sourceDegrees = (180 + obj.bearingDegrees) % 360
    }
    updateWindDirectionFromSourceCompass() {
        const obj = this.windDirection
        obj.sourceDegrees = this.compassPts[obj.sourceCompass]
        obj.bearingDegrees = (180 + obj.sourceDegrees) % 360
    }
    updateWindDirectionFromSourceDegrees() {
        const obj = this.windDirection
        obj.bearingDegrees = (180 + obj.sourceDegrees) % 360
    }
    updateWindSpeedFrom10m() {
        const obj = this.windSpeed
        obj.windSpeed20ft = obj.windSpeed10m / 1.13
    }
    updateWindSpeedFrom20ft() {
        const obj = this.windSpeed
        obj.windSpeed10m = 1.13 * obj.windSpeed10m
    }
}