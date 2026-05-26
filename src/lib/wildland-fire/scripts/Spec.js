import { StandardFuelModelCatalog } from "./StandardFuelModelCatalog.js"
import { FuelBed } from "./FuelBed.js"
// import { FireIgnition } from "./FireIgnition.js"
// import { FireBehavior } from "./FireBehavior.js"
// import { FireEllipse } from "./FireEllipse.js"
// import { FireLocation } from "./FireLocation.js"
// import { WildlandFire } from "./WildlandFire.js"

// The Fire model splits the full chain of fire behavior computations into a sequence
// of computation classes, where each computation class builds upon the previous one.
// The classes are divided at those points in the computation chain where critical new
// parameters are required.  Since each class builds upon and uses properties of previous
// classes, the client application can optimize thier use.  For example, the client can
// efficiently determine fire perimeter locations recomputing the fuel bed structure,
// fuel ignition requirements, fire behavior, and fire shape properties.

// 1 - FuelModel
// The chain begins with the FuelModel class. This is a "plain old data" (POD) class
// defining the basic parameters of the surface fuel bed and particles, such as bed depth
// and particles loads, sizes, heat contents, densities, and mineral contents.
// Fuel models are used to simplify fuel classification.  Rothermel and Albini first described
// 13 "fire behavior fuel models", and Scott & Burgan later added 40 more.  These are
// referred to a the "standard fie behavior fuel models".  By convention, these fuel models
// have been assigned a unique number and a short key.  We use a catalog to store the
// fuel models for easily retrieval by either its number or key.  New, "custom",
// fuel models may be added to the catalog by the client.
//
const catalog = new StandardFuelModelCatalog()

// 2 - Create a FuelBed from a FuelModel and the seasonal curing conditions
const fuelModel = catalog.get('gr4')
const curingConditions = {herb: 0.778}
const fuelBed = new FuelBed(fuelModel, curingConditions)

// 3 - Create a FireIgnition from a FuelBed and fuel moisture conditions
const moistureConditions = {dead1h: 0.05, dead10h: 0.07, dead100h: 0.09, herb: 0.5, stem: 1.5}
const fireIgnition = new FireIgnition(fuelBed, moistureConditions)

// 4 - Create FireBehavior from a FireIgnition and wind-slope conditions
const windSlopeConditions = {windSpeed: 880, bearing: 90, aspect: 180, slopeRatio: 0.5, airTemp: 77}
const config = {applySpreadRateLimit: true}
const fireBehavior = new FireBehavior(fireIgnition, windSlopeConditions, config)

// 5 - Create a FireEllipse from FireBehavior
// and query it's behavior at various angles of interest
const fireEllipse = new FireEllipse(fireBehavior)

// 6 - Create a FireLocation from FireEllipse, elapsed time, and ignition point
// and query its location at vaious bearings of interest
const elapsedTime = 1
const ignitionLocation = {east: 0, north: 0}
const fireLocation = new FireLocation(fireEllipse, elapsedTime, ignitionLocation)
const perimeterLocation = fireLocation.perimeterLocationAtBearing(90)

// 7 - Use single-step Fire wrapper
const fire = new WildlandFire()
    .setFuel('gr4', curingConditions)
    .setMoisture(moistureConditions)
    .setWindSlope(windSlopeConditions)
    .setLocation(elapsedTime, ignitionLocation)
