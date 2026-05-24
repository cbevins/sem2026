// -----------------------------------------------------------------------------
// WildlandFire is a convenience class that contains a chain of the FuelModel,
// FuelModelCatalog, FuelBed, FireIgnition, FireBehavior, FireELlipse, and
// FireLocation classes.
// -----------------------------------------------------------------------------
import { StandardFuelModelCatalog } from "./StandardFuelModelCatalog.js"
import { FuelBed } from "./FuelBed.js"
import { FireIgnition } from "./FireIgnition.js"
import { FireBehavior } from "./FireBehavior.js"
import { FireEllipse } from "./FireEllipse.js"
import { FireLocation } from "./FireLocation.js"

const CuringConditions = {}
const MoistureConditions = {dead1h: 0.05, dead10h: 0.07, dead100h: 0.09, herb: 0.5, stem: 1.5}
const WindSlopeConditions = {windSpeed: 880, bearing: 90, aspect: 180, slopeRatio: 0.5, airTemp: 77}

export class WildlandFire {
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
        this.windSlopeConditions = {windSpeed: 880, bearing: 90, aspect: 180, slopeRatio: 0.5, airTemp: 77}
    }
    setFuel(fuelModelKey, curingConditions=CuringConditions){
        const fuelModel = this.catalog.get(fuelModelKey)
        this.fuel = new FuelBed(fuelModel, curingConditions)
        return this
    }
    setMoisture(moistureConditions=MoistureConditions) {
        this.moistureCondition = moistureConditions
        this.ignition = new FireIgnition(this.fuel, moistureConditions)
        return this
    }
    setWindSlope(windSlopeConditions=WindSlopeConditions) {
        this.windSlopeConditions = windSlopeConditions
        this.behavior = new FireBehavior(this.ignition, windSlopeConditions)
        return this
    }
    setLocation(elapsedTime, ignitionLocation={east: 0, north: 0}) {
        this.elapsedTime = elapsedTime
        this.ignitionLocation = ignitionLocation
        this.ellipse = new FireEllipse(this.behavior)
        this.location = new FireLocation(this.ellipse, elapsedTime, ignitionLocation)
        return this
    }
}
