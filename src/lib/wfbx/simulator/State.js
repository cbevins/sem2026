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

        this.surface = {
            one: {
                key: 0,
                fuelModel: null,
                fuelBed: null,
                fuelIgnition: null,
                fireBehavior: null,
            }
        }
        this.surface.two = {...this.surface.one}

        this.fuelBedOne = {
            depth: 1,
            midflameWsrf: 1,
        }

        this.fuelModelOne = {
            depth: 1,
            deadMext: 0.12,
        }

        this.fuelIgnitionOne = {
            heatSink: 0,
            heatSource: 0,
            noWindSlopeSpreadRate: 0,
            reactionIntensity: 0,
        }

        this.fireBehaviorOne = {
            headBearing: 0,
            headFirelineIntensity: 0,
            headFlameLength: 0,
            headSpreadRate: 0,
            lengthWidthRatio: 1,
        }

        this.fireBehaviorObserved = {
            headBearing: 0,
            headFirelineIntensity: 0,
            headFlameLength: 0,
            headSpreadRate: 0,
            lengthWidthRatio: 1,
        }
        
        const fireVector = {
            angleFromHead: 0,
            bearing: 0,
            distance: 0,
            easting: 0,
            firelineIntensity: 0,
            flameLength: 0,
            northing: 0,
            spreadRate: 0,
        }

        // Creates vectors with valid 'spreadRate' props
        this.fireEllipse = {
            back: {...fireVector},
            center: {...fireVector},
            eccentricity: 0,
            rotation: 0,
            head: {...fireVector},
            left: {...fireVector},
            right: {...fireVector},
        }

        // Updates vector 'distance' props
        this.fireSize = {
            elapsedTime: 0,     // INPUT
            area: 0,
            acres: 0,
            perimeter: 0,
        }

        //
        this.firePosition = {
            ignEast: 0,
            ignNorth: 0,
        }

        // Adds beta, beta6, psi, and theta vectors
        this.fireVectors = {
            angleFromHead: 0,   // INPUT
            beta: {...fireVector},
            beta6: {...fireVector},
            psi: {...fireVector},
            theta: {...fireVector},
        }

        this.fuelCatalog = new FuelCatalog()
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
            scale: 24000,
            contourInterval: 100,
            contoursCrossed: 0,
            distance: 0,
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
            at10m: 0,
            at20ft: 0,
        }
        this.compassPts = {
            N: 0, NNE: 1, NE: 2,  ENE: 3,  E: 4,  ESE: 5,  SE: 6,  SSE: 7, 
            S: 8, SSW: 9, SW: 10, WSW: 11, W: 12, WNW: 13, NW: 14, NNW: 15
        }
    }
    addCrownFire() {
        this.fuelModelCrown = {...this.fuelModelOne}
        this.fuelBedCrown = {...this.fuelBedOne}
        this.fuelIgnitionCrown = {...this.fuelIgnitionOne}
        this.fireBehaviorCrown = {...this.fireBehaviorCrown}

    }
    addFuelTwo() {
        this.fuelModelTwo = {...this.fuelModelOne}
        this.fuelBedTwo = {...this.fuelBedOne}
        this.fuelIgnitionTwo = {...this.fuelIgnitionOne}
        this.fireBehaviorTwo = {...this.fireBehaviorOne}
        this.fireBehaviorWeighted = {...this.fireBehaviorOne}
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
        this.midflame.windSpeed = this.midflame.wsrf * this.windSpeed.at20ft
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
        const reach = Math.max(0, obj.scale * obj.distance)
        const rise = Math.max(0, obj.contoursCrossed * obj.contourInterval)
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
        obj.at20ft = obj.at10m / 1.13
    }
    updateWindSpeedFrom20ft() {
        const obj = this.windSpeed
        obj.at10m = 1.13 * obj.at10m
    }
}