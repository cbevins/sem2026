import { describe, it, expect } from 'vitest'
import { makeFireBehavior, makeFireEllipse,
    makeFuelBed, makeFuelCatalog, makeFuelCuring, makeFuelIgnition, makeFuelModel, makeFuelMoisture,
    makeLogger } from '../Wfs.js'
import { Bp6Configs, Bp6FireTerrain, Bp6FireWeather, Bp6FuelCuring, Bp6FuelMoisture } from './Bp6Inputs.js'
import { calcBetaFromPsi, calcBetaFromTheta, calcPsiFromBeta, calcPsiFromTheta,
    calcThetaFromBeta, calcThetaFromPsi } from '../Wfs.js'

import { parts } from './assertions.js'
expect.extend({ parts })

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

describe('ellipseAngles.js functions', () => {
    it(`Beta-Theta-Psi call sequence works forward and backward:`, () => {
        // Build FireEllipse from direct input parameters for FM 10:
        let fuelKey = 10
        let fuelModel = makeFuelModel({fuelCatalog, fuelKey}, configs)
        let fuelBed = makeFuelBed({fuelModel, fuelCuring}, configs)
        let fuelIgnition = makeFuelIgnition({fuelBed, fuelMoisture}, configs)
        let fireBehavior = makeFireBehavior({fuelBed, fuelIgnition, fireWeather, fireTerrain}, configs)
        let fireEllipse = makeFireEllipse({fireBehavior}, configs)

        expect(configs.logger.length()).toBe(0)
        expect(fireEllipse.headingSpreadRate).parts(fireBehavior.headingSpreadRate)
        expect(fireEllipse.lengthWidthRatio).parts(3.5015680219321221)
        expect(fireEllipse.firelineIntensity).parts(389.95413667947145)

        for(let thetaDegFromInput = 0; thetaDegFromInput<=360; thetaDegFromInput++) {
            const betaDegFromTheta = calcBetaFromTheta(fireEllipse, thetaDegFromInput)
            const psiDegFromTheta = calcPsiFromTheta(fireEllipse, thetaDegFromInput)
            
            const betaDegFromPsi = calcBetaFromPsi(fireEllipse, psiDegFromTheta)
            expect(betaDegFromPsi).parts(betaDegFromTheta)
            
            const psiDegFromBeta = calcPsiFromBeta(fireEllipse, betaDegFromTheta)
            expect(psiDegFromBeta).parts(psiDegFromTheta)
            
            const thetaDegFromPsi = calcThetaFromPsi(fireEllipse, psiDegFromTheta)
            const thetaDegFromBeta = calcThetaFromBeta(fireEllipse, betaDegFromTheta)
            expect(thetaDegFromPsi).parts(thetaDegFromInput)
            expect(thetaDegFromBeta).parts(thetaDegFromInput)
        }

        for(let betaDegFromInput = 0; betaDegFromInput<=360; betaDegFromInput++) {
            const thetaDegFromBeta = calcThetaFromBeta(fireEllipse, betaDegFromInput)
            const psiDegFromBeta = calcPsiFromBeta(fireEllipse, betaDegFromInput)
            const psiDegFromTheta = calcPsiFromTheta(fireEllipse, thetaDegFromBeta)
            expect(psiDegFromBeta).parts(psiDegFromTheta)

            const betaDegFromPsi = calcBetaFromPsi(fireEllipse, psiDegFromTheta)
            expect(betaDegFromPsi).parts(betaDegFromInput)

            const betaDegFromTheta = calcBetaFromTheta(fireEllipse, thetaDegFromBeta)
            expect(betaDegFromTheta).parts(betaDegFromInput)
            
            const thetaDegFromPsi = calcThetaFromPsi(fireEllipse, psiDegFromBeta)
            expect(thetaDegFromBeta).parts(thetaDegFromPsi)

            const betaDegFromTheta2 = calcBetaFromTheta(fireEllipse, thetaDegFromPsi)
            expect(betaDegFromTheta2).parts(betaDegFromInput)
        }
    })
})
