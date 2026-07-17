/*
Live Curable Fuel Moisture

                                FUEL CURING MODULE
                                Cured herb

Cured Herb

Fuel Model Key (Fuel1, Fuel2)
                                FUEL CATALOG
                                |
                                FUEL MODEL (Fuel1, Fuel2, Crown)
                                Fuel depth, dead mext
                                Particle load, size, heat, density, etc
                                |
                                FUEL BED MODULE (Fuel1, Fuel2, Crown)
                                Fuel load, depth, volume, surface area, net load
                                Bulk density, packing ratio, savr, dry reaction intensity
                                Wind and slope factors
                                Midflame WSRF
                                (All moisture-independent fuel bed properties)

Live Category Moisture

                                LIVE FUEL MOISTURE MODULE

Live Herb Moisture              
Live Stem Moisture              

Dead Category Moisture

                                DEAD FUEL MOISTURE MODULE

Dead 1-h Fuel Moisture
Dead 10-h Fuel Moisture
Dead 100-h Fuel Moisture

                                FUEL IGNITION MODULE (Fuel1, Fuel2, Crown)
                                Reaction intensity, heat sink, heat source
                                No-wind, no-slope ros
                                Live fuel extinction moisture

Canopy height (or length)
Canopy base height (or ratio)
Canopy cover
Canopy Bulk Density
Canopy Heat Content

                                CANOPY MODULE
                                Canopy height, base, length, ratio
                                Canopy MidflameWSRF, shelters fuel, fill
                                Canopy HPUA, Bulk Density, Heat

Wind Speed at 10m

                                WIND SPEED MODULE
                                WInd speed at 20ft
                                wind speed at 10m

Wind Speed at 20ft (req by crown fire)

Wind Source Compass
or Wind Source Degrees
or Wind Bearing Compass
                                WIND DIRECTION MODULE
                                Wind bearing compass
                                Wind bearing degrees
                                Wind source degrees
                                WInd source compass

Wind Bearing Compass

                                ACTIVE CROWN FIRE
                                Predicted spread rate, bearing, flame length
                                Plume-dominated v wind-driven

                                WIND SPEED REDUCTION FACTOR MODULE
                                If estimated, uses Canopy and FuelBed
                                Canopy midflameWsrf
                                FuelBed midflameWsrf
                                Wsrf

Wind Speed Reduction Factor

                                MIDFLAME WIND SPEED MODULE
                                If estimated, uses WSRF and WindSpeed20ft
                                WIndSpeed20ft
                                WSRF
                                Midflame wind speed

Midflame Wind Speed
(must input this or wsrf if crown fire active, as 20ft wind is also input)

Slope Upslope Degrees
or Slope Aspect Compass

                                SLOPE DIRECTION MODULE
                                Slope upslope degrees
                                Slope aspect degrees
                                Slope aspect compass

Slope Aspect Degrees

Map Scale
Map Contour Interval
Map Contours Crossed
MapDistance

                                SLOPE MAP MODULE
                                Map scale
                                Map contour interval
                                Map contours crossed
                                Map distance
                                Slope degrees
                                Slope ratio

Slope Degrees

                                SLOPE STEEPNESS MODULE
                                Slope degrees
                                Slope ratio

Slope Ratio

                                PREDICTED SURFACE FIRE MODULE (Fuel1, Fuel2, Weighted)
                                Predicted Head Spread Rate
                                Predicted Head Bearing
                                Predicted Head Flame Length, FLI
                                Predicted length-Width Ratio

OBSERVED SURFACE FIRE BEHAVIOR
Observed Head Spread Rate       
Observed Head Bearing           
Observed Head Flame Length      
Observed Length-Width Ratio     

                                FIRE SHAPE MODULE
                                Head ros, fli, flame length
                                Back ros, fli, flame length
                                Center ros
                                Right and left flank ros, fli, flame length

Elapsed Time                    

                                FIRE SIZE MODULE
                                Fire ellipse length, width
                                Fire ellipse area, perimeter
                                Head, back, flank, center distances

Ign Easting, Northing           

                                FIRE POSITION MODULE
                                Head, back, center, flank geographic positions

Angle From Head

                                FIRE VECTOR MODULE
                                Beta ros, fli, flame length, perimeter point
                                Beta6 ros, fli, flame length, perimeter point
                                Psi ros, fli, flame length, perimeter point
                                Theta ros, fli, flame length, perimeter point

Midflame Wind Speed     
Air Temperature     

                                SCORCH HEIGHT MODULE
                                Beta, beta6, psi, theta scorch height

Tree Species        
Bark Thickness      
                                TREE MORTALITY MODULE
                                Beta, beta6, psi, theta tree mortality
*/
import { makeFireBehavior } from './makeFireBehavior.js'
import { makeFuelCatalog } from './makeFuelCatalog.js'
import { makeFuelBed } from './makeFuelBed.js'
import { makeFuelIgnition } from './makeFuelIgnition.js'
import { makeFuelModel } from './makeFuelModel.js'
import { updateCanopy } from './updateCanopy.js'

export const config = {
    fuelModels: 2,
    // Input options
    fuelCuringFrom: 'input',    // input, etimate
    deadMoistureFrom: 'particles',  // particles, category
    liveMoistureFrom: 'category',  // particles, category
    midflameWindSpeedFrom: 'input',    // input, estimate
    midflameWsrfFrom: 'input',      // input, estimate
    slopeDirectionFrom: 'upslope',  // aspect, upslope
    slopeSteepnessFrom: 'slopeMap',  // slopeDegrees, slopeMap, slopeRatio
    windDirectionFrom: 'sourceCompass',  // bearingDegrees, sourceCompass, sourceDegrees
}

export const state = {
    canopy: {height: 0, base: 0, length: 0, ratio: 0, fill: 0,
        sheltersFuel: false, midflameWsrf: 1,
        bulkDensity: 0, heatContent: 8000, fuelLoad: 0, heatPerUnitArea: 0},
    fuelBed1: null,
    fuelBed2: null,
    fuelBedCrown: null,
    fuelCatalog: makeFuelCatalog(),
    fuelCuring: {curedHerb: 0},
    fuelIgnition1: null,
    fuelIgnition2: null,
    fuelIgnitionCrown: null,
    fuelModel1: null,
    fuelModel2: null,
    fuelModelCrown: null,
    fuelMoisture: {
        moistureDeadCategory: 1,
        moistureDead1h: 0.05,
        moistureDead10h: 0.07,
        moistureDead100h: 0.09,
        moistureLiveCategory: 5,
        moistureLiveHerb: 0.5,
        moistureLiveStem: 1.5,
    },
    midflame: {windSpeed: 880, wsrf: 1},
    slopeDirection: {slopeAspect: 180, slopeUpslope: 0},
    slopeSteepness: {slopeDegrees: 12, slopeRatio: 0.25},
    windDirection: {bearingDegrees: 90, sourceDegrees: 270, sourceCompass: 'W', bearingCompass: 'E'},
    windSpeed: {windSpeed10m: 0, windSpeed20ft: 0},
}

export const input = {
    liveCurableMoisture: [0.5],
    fuelKey1: [10],
    fuelKey2: [124],
    moistureLiveHerb: [0.5],
    moistureLiveStem: [1.5],
    moistureDead1h: [0.05],
    moistureDead10h: [0.07],
    moistureDead100h: [0.09],
    slopeAspect: [180],
    slopeRatio: [0.25],
    windBearingDegrees: [90],
    canopyHeight: [40],
    canopyBase: [6],
    canopyCover: [0.5],
    canopyBulkDensity: [0.02],
    canopyHeatContent: [8000],
    windSpeed20ft: [880],
    midflameWindSpeed: [880],
    midflameWsrf: [1],
}

export function run(config, input, state) {
    state.fuelModelCrown = state.fuelCatalog.get(10)
    state.fuelBedCrown = makeFuelBed(state.fuelModelCrown, {curedHerb: 0})
    for(let liveCurableMoisture of input.liveCurableMoisture) {
        state.fuelCuring.curedHerb = Math.max(0, Math.min(1, 1.333 - 1.11 * liveCurableMoisture))
        for(let fuelKey1 of input.fuelKey1) {
            state.fuelModel1 = makeFuelModel(state.fuelCatalog, fuelKey1)
            state.fuelBed1 = makeFuelBed(state.fuelModel1, state.fuelCuring)
            for(let fuelKey2 of input.fuelKey2) {
                state.fuelModel2 = makeFuelModel(state.fuelCatalog, fuelKey2)
                state.fuelBed2 = makeFuelBed(state.fuelModel2, state.fuelCuring)
                for(let moistureLiveHerb of input.moistureLiveHerb) {
                    state.moistureLiveHerb = moistureLiveHerb
                    for(let moistureLiveStem of input.moistureLiveStem) {
                        state.moistureLiveStem = moistureLiveStem
                        for(let moistureDead100h of input.moistureDead100h) {
                            state.moistureDead100h = moistureDead100h
                            for(let moistureDead10h of input.moistureDead10h) {
                                state.moistureDead0h = moistureDead10h
                                for(let moistureDead1h of input.moistureDead1h) {
                                    state.moistureDead1h = moistureDead1h

                                    // With all fuel moisture inputs, we can now determine FuelIgnitions
                                    processFuelIgnitions(config, input, state)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function processFuelIgnitions(config, input, state){
    state.fuelIgnition1 = makeFuelIgnition(state.fuelBed1, state.fuelMoisture)
    state.fuelIgnition2 = makeFuelIgnition(state.fuelBed2, state.fuelMoisture)
    state.fuelIgnitionCrown = makeFuelIgnition(state.fuelBedCrown, state.fuelMoisture)
    for(let slopeAspect of input.slopeAspect) {
        state.slopeDirection.slopeAspect = slopeAspect
        for(let slopeRatio of input.slopeRatio) {
            state.slopeSteepness.slopeRatio = slopeRatio
            for(let windBearingDegrees of input.windBearingDegrees) {
                state.windDirection.bearingDegrees = windBearingDegrees

                // Handle midflame wind speed configuration
                if (config.midflameWindSpeedFrom === 'estimate') {
                    processMidflameWindSpeedFromEstimate(config, input, state)
                } else if (config.midflameWindSpeedFrom === 'input') {
                    processMidflameWindSpeedFromInput(config, input, state)
                } else { throw new Error(`Unknown config.midflameWindSpeedFrom value '${config.midflameWindSpeedFrom}'.`) }

            }
        }
    }
}

function processMidflameWindSpeedFromInput(config, input, state) {
    for(let midflameWindSpeed of input.midflameWindSpeed) {
        state.midflame.windSpeed = midflameWindSpeed
        // Only need 20ft if crownFire is active
        // or if midflame wind speed is estimated
        for(let windSpeed20ft of input.windSpeed20ft) {
            state.windSpeed.windSpeed20ft = windSpeed20ft
            // We can now process surface and crown fire behavior
            processFireBehavior(config, input, state)
        }
    }
}

// Processing branch for estimating midflame wind speed from canopy and fuel bed WSRF
function processMidflameWindSpeedFromEstimate(config, input, state) {
    if (config.midflameWsrfFrom === 'input') {
        for(let midflameWsrf of input.midflameWsrf) {
            state.midflame.wsrf = midflameWsrf
            for(let windSpeed20ft of input.windSpeed20ft) {
                state.windSpeed.windSpeed20ft = windSpeed20ft
                state.midflame.windSpeed = state.windSpeed.windSpeed20ft * state.midflame.wsrf
                // We can now process surface and crown fire behavior
                processFireBehavior(config, input, state)
            }
        }
    } else if (config.midflameWsrfFrom === 'estimate') {
        // Need canopy to estimate midflame wind speed reduction factor
        for(let canopyHeight of input.canopyHeight) {
            state.canopy.height = canopyHeight
            for(let canopyBase of input.canopyBase) {
                state.canopy.base = canopyBase
                for(let canopyCover of input.canopyCover) {
                    state.canopy.cover = canopyCover
                    // Should bulk density and heat input loops be deferred until just before crown fire behavior
                    // and put it inside the crowFireActive test
                    for(let canopyBulkDensity of input.canopyBulkDensity) {
                        state.canopy.bulkDensity = canopyBulkDensity
                        for(let canopyHeatContent of input.canopyHeatContent) {
                            state.canopy.heatContent = canopyHeatContent
                            state.canopy = updateCanopy(state.canopy)
                            // We can now estimate the midflame wind speed reduction factor
                            state.midflame.wsrf = Math.min(state.canopy.midflameWsrf,
                                state.fuelBed1.fuelMidflameWsrf
                            )
                            // Now iterate over wind speed
                            for(let windSpeed20ft of input.windSpeed20ft) {
                                state.windSpeed.windSpeed20ft = windSpeed20ft
                                // Determine midflame wind speed
                                state.midflame.windSpeed = state.windSpeed.windSpeed20ft * state.midflame.wsrf

                                // We can now process surface and crown fire behavior
                                processFireBehavior(config, input, state)
                            }
                        }
                    }
                }
            }
        }
    }
}

function processFireBehavior(config, input, state) {
    // Surface fire behavior
    state.fireBehavior1 = makeFireBehavior(state.fuelBed1, state.fuelIgnition1,
        state.midflame.windSpeed,
        state.windDirection.bearingDegrees,
        state.slopeSteepness.slopeRatio,
        state.slopeDirection.slopeAspect)
        
    // if (config.fuelModel === 2) {
        state.fireBehavior2 = makeFireBehavior(state.fuelBed2, state.fuelIgnition2,
            state.midflame.windSpeed,
            state.windDirection.bearingDegrees,
            state.slopeSteepness.slopeRatio,
            state.slopeDirection.slopeAspect)

        // TO-DO: Determine weighted fire behavior BEFORE crown fire
    // }

    // We now have 20-ft wind and surface fire HPUA,
    // and can now estimate active crown fire
    state.fireBehaviorCrown = makeFireBehavior(state.fuelBedCrown, state.fuelIgnitionCrown,
        state.windSpeed.windSpeed20ft,  // use 20-ft wind speed for crown fire midflame wind speed
        state.windDirection.bearingDegrees,
        0, 0)   // Rothermels uses zero slope (and aspect)
}

run(config, input, state)
console.log(state.fireBehavior1)
console.log(state.fireBehavior2)
console.log(state.fireBehaviorCrown)