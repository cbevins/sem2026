// Preferred usage
import { StandardFuelModels } from "./StandardFuelModels.js"

export class StandardFuelModelCatalog {
    constructor() {
        this.catalog = new Map()
        for(let model of StandardFuelModels) {
            this.catalog.set(model.number, model)
            this.catalog.set(model.code, model)
        }
    }
    get(key) { return this.catalog.get(key) }
    has(key) { return this.catalog.has(key) }
    set(key, fuelModel) { return this.catalog.get(key, fuelModel) }
}

export class FuelBed {
    constructor(fuelModel, curingConditions={herb: 0}) {
        this.fuelModel = fuelModel
        this.curingConditions = curingConditions
    }
}

export class FireBed {
    constructor(fuelBed, moistureConditions){
        this.fuelBed = fuelBed
        this.moistureConditions = moistureConditions
        // primary outputs
        this.noWindSpreadRate = fuelBed.noWindSpreadRate
        this.reactionIntensity = fuelBed.reactionIntensity
    }
}

export class FireBehavior {
    constructor(fireBed, windSlopeConditions, config={}) {
        // inputs
        this.config = config
        this.fireBed = fireBed  // an object with the following properties:
        this.noWindSpreadRate = fireBed.noWindSpreadRate
        this.reactionIntensity = fireBed.reactionIntensity
        // primary outputs
        this.spreadRate = 0
        this.bearing = 0
        this.lengthWidthRatio = 1
        this.firelineIntensity = 0
        this.flameLength = 0
        this.scorchHeight = 0
        this.heatPerUnitArea = 0
        // secondary outputs
        this.effectiveWindSpeed = 0
        this.headAngleFromUpslope = 0
    }
}

export class FireEllipse {
    constructor(fireBehavior) {
        // inputs
        this.lengthWidthRatio = fireBehavior.lengthWidthRatio
        this.head = {
            spreadRate: fireBehavior.spreadRate,
            bearing: fireBehavior.bearing,
            flameLength: 0,
            firelineIntensity: 0}
        // primary outputs
        this.back = {spreadRate: 0, bearing: 0, flameLength: 0, firelineIntensity: 0}
        this.right = {spreadRate: 0, bearing: 0, flameLength: 0, firelineIntensity: 0}
        this.left = {spreadRate: 0, bearing: 0, flameLength: 0, firelineIntensity: 0}
    }
    // Returns ratio of distance-to-perimeter at angle / distance-to-head
    // Used to scale spread rate, distance, reaction intensity, flame length, etc
    firelineIntensityAtAngleFromHead(angle) { return 0 }
    firelineIntensityAtBearing(bearing) { return 0 }
    flameLengthAtAngleFromHead(angle) { return 0 }
    flameLengthAtBearing(bearing) { return 0 }
    spreadRateAtAngleFromHead(angle) { return 0 }
    spreadRateAtBearing(bearing) { return 0}
}

export class FirePosition {
    constructor(fireEllipse, elapsedTime, ignitionPoint) {
        this.fireEllipse = fireEllipse
        this.elapsedTime = elapsedTime
        this.ignitionPoint = ignitionPoint
        // primary outputs
        this.head = { distance: 0, point: {east: 0, north: 0}}
        this.back ={ distance: 0, point: {east: 0, north: 0}}
        this.right = { distance: 0, point: {east: 0, north: 0}}
        this.left = { distance: 0, point: {east: 0, north: 0}}
        this.center = { distance: 0, point: {east: 0, north: 0}}
        this.area = 0
        this.perimeter = 0
    }
    perimeterDistanceAtAngleFromHead(angle) {
        return {east: 0, north: 0}
    }
    perimeterDistanceAtBearing(bearing) {
        return {east: 0, north: 0}
    }
    perimeterPointAtAngleFromHead(angle) {
        return {east: 0, north: 0}
    }
    perimeterPointAtBearing(bearing) {
        return {east: 0, north: 0}
    }
}

// 1 - Use a standard fuel model catalog and add any custom fuel models to it
const catalog = new StandardFuelModelCatalog()
catalog.set({number: 999, code: 'cheatgrass', label: "Cheat Grass", desc: "Awful stuff", depth: 1, deadMext: 0.15, particles: []})

// 2 - Create a FuelBed from a FuelModel and the seasonal curing conditions
const fuelModel = catalog.get('gr4')
const curingConditions = {herb: 0.5, cheatgrass: 1}
const fuelBed = new FuelBed(fuelModel, curingConditions)

// 3 - Create a FireBed from a FuelBed and fuel moisture conditions
const moistureConditions = {dead1h: 0.05, dead10h: 0.07, dead100h: 0.09, herb: 0.5, stem: 1.5}
const fireBed = new FireBed(fuelBed, moistureConditions)

// 4 - Create FireBehavior from a FireBed and wind and slope conditions
const windSlopeConditions = {midflameWindSpeed: 880, midflameWindBearing: 90, aspect: 180, slopeRatio: 0.5, airTemp: 77}
const config = {applySpreadRateLimit: true}
const fireBehavior = new FireBehavior(fireBed, windSlopeConditions, config)

// 5 - Create a FireEllipse from FireBehavior
const fireEllipse = new FireEllipse(fireBehavior)

// Create a FirePosition from FireEllipse, duration, and ignition point
const elapsedTime = 1
const ignitionPoint = {east: 0, north: 0}
const firePosition = new FirePosition(fireEllipse, elapsedTime, ignitionPoint)
const point = firePosition.perimeterPointAtBearing(90)

// -----------------------------------------------------------------------------
// Fire is a convenience class that combines all the other classes
// -----------------------------------------------------------------------------

export class Fire {
    constructor(config={}) {
        this.config = {
            cascade: true,
            applySpreadRateLimit: true,
            ...config}
        this.catalog = new StandardFuelModelCatalog()
        this.fuelModel = null
        this.fuelBed = null
        this.fireBed = null
        this.behavior = null
        this.ellipse = null
        this.curingConditions = {herb: 0}
        this.moistureConditions = {dead1h: 0.05, dead10h: 0.07, dead100h: 0.09, herb: 0.5, stem: 1.5}
        this.windSlopeConditions = {midflameWindSpeed: 880, midflameWindBearing: 90, aspect: 180, slopeRatio: 0.5, airTemp: 77}
    }
    setFuel(fuelModelKey, curingConditions){
        this.fuelModel = this.catalog.get(fuelModelKey)
        this.fuelBed = new FuelBed(fuelModel, curingConditions)
        return this
    }
    setMoisture(moistureConditions) {
        this.moistureCondition = moistureConditions
        this.fireBed = new FireBed(this.fuelBed, moistureConditions)
        return this
    }
    setWindSlope(windSlopeConditions) {
        this.windSlopeConditions = windSlopeConditions
        this.behavior = new FireBehavior(this.fireBed, windSlopeConditions)
        return this
    }
    setElapsedTime(elapsedTime) {
        this.elapsedTime = elapsedTime
        this.ellipse = new FireEllipse(this.behavior)
        return this
    }
}

const fire = new Fire()
    .setFuel(fuelModel, curingConditions)
    .setMoisture(moistureConditions)
    .setWindSlope(windSlopeConditions)
    .setElapsedTime(elapsedTime)

console.log(fuelBed)