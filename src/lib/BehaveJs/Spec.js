// TO DO
// - Split StandardFuelModels into Fbfm13, Fbfm40, and FbfmLandfire
// - Refactor FuelModelParticle with life = "dead", "live", or "cured"
import { StandardFuelModelCatalog } from "./StandardFuelModelCatalog.js"
import { FuelBed } from "./FuelBed.js"
import { FireBed } from "./FireBed.js"
import { FireBehavior } from "./FireBehavior.js"
import { FireEllipse } from "./FireEllipse.js"
import { FireLocation } from "./FireLocation.js"
import { Fire } from "./Fire.js"

// 1 - Use a standard fuel model catalog and add any custom fuel models to it
const catalog = new StandardFuelModelCatalog()
catalog.set({number: 999, code: 'cheatgrass', label: "Cheat Grass", desc: "Awful stuff", depth: 1, deadMext: 0.15, particles: []})

// 2 - Create a FuelBed from a FuelModel and the seasonal curing conditions
const fuelModel = catalog.get('gr4')
const curingConditions = {herb: 0.778, cheatgrass: 1}
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

// Create a FireLocation from FireEllipse, duration, and ignition point
const elapsedTime = 1
const ignitionLocation = {east: 0, north: 0}
const fireLocation = new FireLocation(fireEllipse, elapsedTime, ignitionLocation)
const perimerLocation = fireLocation.perimeterLocationAtBearing(90)

const fire = new Fire()
    .setFuel('gr4', curingConditions)
    .setMoisture(moistureConditions)
    .setWindSlope(windSlopeConditions)
    .setElapsedTime(elapsedTime)
