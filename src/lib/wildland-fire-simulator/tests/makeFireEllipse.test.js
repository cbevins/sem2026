import { describe, it, expect } from 'vitest'
import { makeFireBehavior, makeFireEllipse, makeFireSize,
    makeFuelBed, makeFuelCatalog, makeFuelCuring, makeFuelIgnition, makeFuelModel, makeFuelMoisture,
    makeLogger } from '../Wfs.js'
import { Bp6Configs, Bp6FirePosition, Bp6FireTerrain, Bp6FireWeather, Bp6FuelCuring, Bp6FuelMoisture } from './Bp6Inputs.js'

import { parts, ppb, ppm, ppt } from './assertions.js'
expect.extend({ parts })

// Dummy functions to test error
function noFireBehaviorArg() { makeFireEllipse() }
function noFireEllipseArg() { makeFireSize() }

// Inputs
let configs = {...Bp6Configs}
configs.logger = makeLogger()

let fuelCatalog = makeFuelCatalog(configs)
let fuelMoisture = {...Bp6FuelMoisture}
fuelMoisture = makeFuelMoisture({fuelMoisture}, configs)
let fuelCuring = {...Bp6FuelCuring}
fuelCuring = makeFuelCuring({fuelCuring, fuelMoisture}, configs)
let fireWeather = {...Bp6FireWeather}
let fireTerrain = {...Bp6FireTerrain}
let firePosition = {...Bp6FirePosition}

//------------------------------------------------------------------------------
// BehavePlus 5 and V6-beta values
//------------------------------------------------------------------------------
let elapsed = firePosition.elapsedTime
const bpFireEllipse = {
    // inputs
    headingSpreadRate: [18.551680325448835, 48.47042599399056],
    flameLength: [6.9996889013229229, 16.35631663317114],
    bearing: [87.573367385837855, 87.613728665173383],
    lengthWidthRatio: [3.5015680219321221, 3.5015819412846603],
    // makeFireEllipse() outputs
    firelineIntensity: [389.95413667947145, 2467.9286450361865],
    eccentricity: [0.95835298387126711, 0.95835332217217739],
    backingSpreadRate: [0.39452649041938642, 1.0307803973340242],
    majorExpansionRate: [0.39452649041938642 + 18.551680325448835, 1.0307803973340242 + 48.47042599399056],
    minorExpansionRate: [2 * 2.7053889424963877, 2 * 7.0684061120619655],
    fSpreadRate: [9.4731034079341114, 1485.0361917397374 / elapsed],
    hSpreadRate: [2.7053889424963877, 424.10436672371787 / elapsed],
    gSpreadRate: [9.0785769175147255, 1423.189367899696 / elapsed],
}
const bpFireSize = {
    elapsedTime: [elapsed, elapsed],
    ignX: [0, 0],
    ignY: [0, 0],
    ignEast: [0, 0],
    ignNorth: [0, 0],
    headingDistance: [1113.1008195269301, 2908.2255596394334],
    backingDistance: [23.671589425163184, 61.846823840041452],
    fDistance: [elapsed * 9.4731034079341114, 1485.0361917397374],
    hDistance: [elapsed * 2.7053889424963877, 424.10436672371787],
    gDistance: [elapsed * 9.0785769175147255, 1423.189367899696],
    length: [1136.7724089520932, 2970.0723834794749],
    width: [324.64667309956644, 848.20873344743575],
    // betaDegrees: [45, 45],
}
// The following are off by a bit more than ppb
const area = [289850.691417, 45.422576205218135 * (66.0 * 660.0)]
const perimeter = [2476.2400999186934, 6469.7282289420209]

describe('makeFireEllipse()', () => {
    it('throws an error if makeFireEllipse() is not passed an inputs.fireBehavior property', () => {
        expect(() => noFireBehaviorArg()).toThrow()
    })
    it(`Fuel Model 10 and 124 FireEllipse properties match BehavePlus v5 and v6 beta:`, () => {
        const fuel = [10, 124]
        for(let idx=0; idx<=1; idx++) {
            configs.logger.clear()
            let fuelKey = fuel[idx]
            let fuelModel = makeFuelModel({fuelCatalog, fuelKey}, configs)
            let fuelBed = makeFuelBed({fuelModel, fuelCuring}, configs)
            let fuelIgnition = makeFuelIgnition({fuelBed, fuelMoisture}, configs)
            let fireBehavior = makeFireBehavior({fuelBed, fuelIgnition, fireWeather, fireTerrain}, configs)
            let fireEllipse = makeFireEllipse({fireBehavior}, configs)
            expect(configs.logger.length()).toBe(0)

            for(let [prop, values] of Object.entries(bpFireEllipse)) {
                console.log(`FM ${fuel[idx]} prop ${prop} expect ${values[0]} received ${fireEllipse[prop]}`)
                expect(fireEllipse[prop]).parts(values[idx], ppb)
            }
        }
    })
})

describe('makeFireSize()', () => {
    it('throws an error if makeFireSize() is not passed an inputs.fireEllipse property', () => {
        expect(() => noFireEllipseArg()).toThrow()
    })
    it('Uses WfsFirePosition if makeFireSize() is not passed a inputs.firePosition property', () => {
        configs.logger.clear()
        let fuelModel = makeFuelModel({fuelCatalog, fuelKey: 10}, configs)
        let fuelBed = makeFuelBed({fuelModel, fuelCuring}, configs)
        let fuelIgnition = makeFuelIgnition({fuelBed}, configs)
        let fireBehavior = makeFireBehavior({fuelBed, fuelIgnition, fireWeather, fireTerrain}, configs)
        let fireEllipse = makeFireEllipse({fireBehavior}, configs)
        let fireSize = makeFireSize({fireEllipse})
        expect(configs.logger.length()).toBe(1)
        expect(fireSize.length).parts(bpFireSize.length[0])
    })

    it(`Fuel Model 10 and 124 FireEllipse properties match BehavePlus v5 and v6 beta:`, () => {
        const fuel = [10, 124]
        for(let idx=0; idx<=1; idx++) {
            configs.logger.clear()
            let fuelKey = fuel[idx]
            let fuelModel = makeFuelModel({fuelCatalog, fuelKey}, configs)
            let fuelBed = makeFuelBed({fuelModel, fuelCuring}, configs)
            let fuelIgnition = makeFuelIgnition({fuelBed, fuelMoisture}, configs)
            let fireBehavior = makeFireBehavior({fuelBed, fuelIgnition, fireWeather, fireTerrain}, configs)
            let fireEllipse = makeFireEllipse({fireBehavior}, configs)
            let fireSize = makeFireSize({fireEllipse, firePosition})
            expect(configs.logger.length()).toBe(0)

            for(let [prop, values] of Object.entries(bpFireSize)) {
                console.log(`FM ${fuel[idx]} prop ${prop} expect ${values[0]} received ${fireSize[prop]}`)
                expect(fireSize[prop]).parts(values[idx], ppb)
            }
            expect(fireSize.area).parts(area[idx], ppm)
            expect(fireSize.perimeter).parts(perimeter[idx], ppt)
        }
    })
})
