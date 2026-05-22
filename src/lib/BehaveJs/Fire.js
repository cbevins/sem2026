// -----------------------------------------------------------------------------
// Fire is a convenience class that combines all the other classes
// -----------------------------------------------------------------------------
import { StandardFuelModelCatalog } from "./StandardFuelModelCatalog.js"
import { FuelBed } from "./FuelBed.js"
import { FireBed } from "./FireBed.js"
import { FireBehavior } from "./FireBehavior.js"
import { FireEllipse } from "./FireEllipse.js"
import { FireLocation } from "./FireLocation.js"

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
        this.fuelBed = new FuelBed(this.fuelModel, curingConditions)
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
