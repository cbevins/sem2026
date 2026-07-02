// Illustrates the WFS fundamental design concept:
// 1 - identify the latest possible points in the fire behavior
// computation chain at which input parameters may be introduced, and
// 2 - combine all computation between those points to produce a state.
// The code below identifies those points:
import * as Wfs from '../src/Wfs.js'

export const WfsSimpleConfigs = {
    propsLevel: 2,
    activeCrownFireModule: 'active',
    surfaceFireModule: 'active',
    surfaceSizeModule: 'active',
    surfaceVectorModule: 'active',

    midflameWindSpeedInput: 'estimated',    // 'input', 'estimated'
    midflameWsrfInput: 'estimated',         // 'input', 'estimated'
    moistureDeadFuelsInput: 'particle',     // 'particle', 'life'
    moistureLiveFuelsInput: 'particle',     // 'particle', 'life'
    slopeDirectionInput: 'aspect',          // 'aspect', 'upslope'
    windDirectionInput: 'bearing',          // 'bearing', 'source'
    windSpeedInput: '20ft',                 // '10m' or '20ft'
}

export const WfsSimpleInputs = {
    // canopyPod needed if estimating midflame wind speed or running the crown fire
    canopyHeight: 40,           // ft
    canopyBase: 6,              // ft
    canopyCover: 1,             // fraction [0..1]
    canopyBulkDensity: 0.02,    // lb/ft3
    canopyHeatContent: 8000,    // Btu/lb

    fuelKey: 10,                // numeric or string FuelCatalog key

    // fuelCuringPod
    curedHerb: 0.778,           // fraction [0..1], required standard curing class
    curedCheatgrass: 0.5,       // example custom curing class

    // fuelMoisturePod
    moistureLiveCheatgrass: 1,  // ratio, example custom live moisture class
    moistureLiveStem: 1.5,      // ratio, required standard moisture class
    moistureLiveHerb: 0.5,      // ratio, required standard moisture class
    moistureLiveFuels: 1.5,     // ratio, only used if moistureLiveFuelInput === 'life'
    moistureDeadDuff: 0.1,      // ratio, example custom dead moisture class
    moistureDead100h: 0.09,     // ratio, required standard moisture class
    moistureDead10h: 0.07,      // ratio, required standard moisture class
    moistureDead1h: 0.05,       // ratio, required standard moisture class
    moistureDeadFuels: 0.05,    // ratio, only used if moistureDeadFuelInput === 'life'

    // windSlopePod
    aspect: 180,                // down-slope direction, compass degrees clockwise from n orth
    slopeRatio: 0.25,           // ratio of vertical rise to horizontal distance
    windBearing: 90,
    // Set windSpeed20ft to desired value if activeCrownFireModule is active OR midflameWindSpeedInput='estimated'
    windSpeed20ft: 880,         // ft/min
    // Set midflameWsrf to desired value if midflameWsrfInput='input' AND midflameWindSpeedInput='estimated'
    midflameWsrf: 1,            // fraction [0..1]
    // Set midflameWindSpeed to desired value if midflameWindSpeedInput='input', otherwise itwill be re-calculated
    midflameWindSpeed: 880,     // ft/min

    // firePositionPod needed if fireSizeModule is active
    ignEast: 1000,              // fale easting (ft)
    ignNorth: 2000,             // false northing (ft)
    elapsedTime: 60,            // min

    angleFromHead: 45,          // beta/psi degrees clockwise from fire heading direction
    airTemp: 95,                // oF
}

export class WfsSimple {
    constructor() {
        this.fuelCatalog = Wfs.makeFuelCatalog()
    }
    run(configs, inputs) {
        this.configs = {...configs}
        this.inputs = {...inputs}   // some inputs may be changed!
        const propsLevel = this.configs.propsLevel

        // Adds canopyFuelLoad, canopyHeatPerUnitArea, canopyMidflameWsrf to canopyPod
        const canopyPod = inputs
        this.canopyFuelsPod = Wfs.makeCanopyFuels(canopyPod, propsLevel)

        // Set up Rothermel's crown fire model if active
        this.crownFuelBedPod=null
        this.crownFuelIgnitionPod=null
        this.crownFireBehaviorPod=null
        this.crownFirePod=null
        if (this.configs.activeCrownFireModule === 'active') {
            this.crownFuelModelPod = Wfs.makeFuelModel(this.fuelCatalog, 10, propsLevel)
            this.crownFuelBedPod = Wfs.makeFuelBed(this.crownFuelModelPod, {curedHerb:0}, propsLevel)
        }
    
        // Determine fuel bed structural properties: bulk density, packing ratio,
        // and each dead/live fuel category: surface-are-to-volume ratio, net fuel load, heat content,
        // mineral damping coefficient, and dry reaction intensity.
        this.fuelModelPod = Wfs.makeFuelModel(this.fuelCatalog, this.inputs.fuelKey, propsLevel)

        // fuelCuring may require live fuel mooisture
        if (configs.moistureLiveFuelsInput === 'life') {
            fuelMoisturePod.moistureLiveHerb = fuelMoisturePod.moistureLiveFuels
            fuelMoisturePod.moistureLiveStem = fuelMoisturePod.moistureLiveFuels
        }
        const fuelCuringPod = inputs
        this.fuelBedPod = Wfs.makeFuelBed(this.fuelModelPod, fuelCuringPod, propsLevel)

        // Determine the fuel bed moisture dead and live category properties: moisture
        // damping coefficient, reaction intensity; and fuel bed heat source, heat sink,
        // reaction intensity, and no-wind, no-slope spread rate.
        const fuelMoisturePod = inputs
        if (configs.moistureDeadFuelsInput === 'life') {
            fuelMoisturePod.moistureDead1h = fuelMoisturePod.moistureDeadFuels
            fuelMoisturePod.moistureDead10h = fuelMoisturePod.moistureDeadFuels
            fuelMoisturePod.moistureDead100h = fuelMoisturePod.moistureDeadFuels
        }
        this.fuelIgnitionPod = Wfs.makeFuelIgnition(this.fuelBedPod, fuelMoisturePod, propsLevel)

        // Add crown fire canopy fuel bed if active
        if (this.configs.activeCrownFireModule === 'active') {
            this.crownFuelIgnitionPod = Wfs.makeFuelIgnition(this.crownFuelBedPod, fuelMoisturePod, propsLevel)
        }

        // Estimate midflame wind speed and/or wind speed reduction factor
        const windSlopePod = inputs
        if (this.configs.midflameWindSpeedInput === 'estimated') {   // re-calculate its value
            if (this.configs.midflameWsrfInput === 'estimated') {    // re-calculate its value
                windSlopePod.midflameWsrf = Math.min(this.canopyFuelsPod.canopyMidflameWsrf,
                    this.fuelBedPod.fuelMidflameWsrf)
            }
            windSlopePod.midflameWindSpeed = windSlopePod.windSpeed20ft * windSlopePod.midflameWsrf
        }

        // We can now determine fire heading spread rate, bearing, length-to-width ratio,
        // and fireline intensity/flame length
        this.fireBehaviorPod = Wfs.makeFireBehavior(this.fuelBedPod, this.fuelIgnitionPod,
            windSlopePod, propsLevel)

        // We can also determine basic fire ellipse properties of eccentricity and back rate.
        this.fireEllipsePod = Wfs.makeFireEllipse(this.fireBehaviorPod, propsLevel)

        // Similarly for crown fire, if active
        if (this.configs.activeCrownFireModule === 'active') {
            // Crown fire uses 20-ft wind as midflame wind, and has no slope
            let windSpeed20ft = windSlopePod.windSpeed20ft
            let crownWindSlopePod = {...windSlopePod, aspect:0, slopeRatio:0, midflameWindSpeed: windSpeed20ft}
            this.crownFireBehaviorPod = Wfs.makeFireBehavior(this.crownFuelBedPod,
                this.crownFuelIgnitionPod, crownWindSlopePod, propsLevel)
            this.crownFirePod = Wfs.makeActiveCrownFire(this.crownFireBehaviorPod,
                this.fireBehaviorPod, this.canopyFuelsPod, windSpeed20ft, propsLevel)
        }
    
        // We can now determine fire ellipse area, perimeter length, perimeter location
        const firePositionPod = inputs
        this.fireSizePod = Wfs.makeFireSize(this.fireEllipsePod, firePositionPod, propsLevel)

        // We can also determine distance and position of fixed vectors
        this.headVector = Wfs.makeBetaVector(this.fireSizePod)
        this.backVector = Wfs.makeBetaVector(this.fireSizePod)
        this.leftVector = Wfs.makeLeftFlankVector(this.fireSizePod)
        this.rightVector = Wfs.makeLeftFlankVector(this.fireSizePod)
        this.betaVector = Wfs.makeBetaVector(this.fireSizePod, inputs.angleFromHead)
        this.beta6Vector = Wfs.makeBeta6Vector(this.fireSizePod, inputs.angleFromHead)
        this.psiVector = Wfs.makePsiVector(this.fireSizePod, inputs.angleFromHead)

        // Can now determine scorch height at any vector
        for(let vector of [this.headVector, this.backVector, this.leftVector, this.rightVector,
                this.betaVector, this.beta6Vector, this.psiVector]) {
            vector.scorchHeight = Wfs.getScorchHeight(vector.firelineIntensity,
                inputs.airTemp, windSlopePod.midflameWindSpeed)
        }
    }
}

const start = performance.now()
const configs = {...WfsSimpleConfigs}
const inputs = {...WfsSimpleInputs}
const wfs = new WfsSimple()
const results = []
for(let i=0; i<100; i++) {
    inputs.windSpeed20ft= i*88
    wfs.run(configs, inputs)
    results.push({
        ws20ftMph: i,
        wsMidflameMph: (wfs.fireBehaviorPod.midflameWindSpeed/88).toFixed(2),
        surfaceRos: wfs.fireBehaviorPod.headingSpreadRate.toFixed(2),
        surfaceFlame: wfs.fireBehaviorPod.flameLength.toFixed(2),
        crownRos: wfs.crownFirePod.activeSpreadRate.toFixed(2),
        crownFlame: wfs.crownFirePod.activeFlameLength.toFixed(2),
    })
}
const stop = performance.now()
console.table(results)
console.log(`case1.js ${(stop-start).toFixed(2)} msec`)