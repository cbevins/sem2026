import { describe, it, expect } from 'vitest'
import { StandardFuelModelCatalog } from '../src/StandardFuelModelCatalog.js'
import { FuelBed } from '../src/FuelBed.js'
import { FuelIgnition } from '../src/FuelIgnition.js'
import { FireBehavior } from '../src/FireBehavior.js'
import { FireEllipse } from '../src/FireEllipse.js'
import * as Angle from '../src/ellipseAngles.js'

import { parts } from './assertions.js'
expect.extend({ parts })
const ppb = 1.0e-9  // parts per billion

// This has been tested in ./standardFuelModelCatalog.test.js
const catalog = new StandardFuelModelCatalog()

const behaviorConfig = {
    limitSpreadRateByReactionIntensity: true,
    limitSpreadRateByEffWindSpeed: false
}
const config = {saveInfoProps: true, saveTestProps: true}
const curingConditions = {herb: 0.778}
const moistureConditions = {dead1h: 0.05, dead10h: 0.07, dead100h: 0.09, herb: 0.5, stem: 1.5}
const windSlopeConditions = {midflameWindSpeed: 10*88, windBearing: 90, aspect: 180, slopeRatio: 0.25}

describe('ellipseAngles.js functions', () => {
    it(`Beta-Theta-Psi call sequence works forward and backward:`, () => {
        // Build FireEllipse from direct input parameters for FM 10:
        const fuelModel = catalog.get(10)
        const fuelBed = new FuelBed(fuelModel, curingConditions, config)
        const fuelIgnition = new FuelIgnition(fuelBed, moistureConditions, config)
        const fireBehavior = new FireBehavior(fuelIgnition, windSlopeConditions,
            behaviorConfig, config)
        const fe = new FireEllipse({...fireBehavior, elapsedTime: 60})
        expect(fe.headingSpreadRate).parts(fireBehavior.headingSpreadRate, ppb)
        expect(fe.firelineIntensity).parts(389.95413667947145, ppb)
        expect(fe.lengthWidthRatio).parts(3.5015680219321221, ppb)

        for(let thetaDegFromInput = 0; thetaDegFromInput<=360; thetaDegFromInput++) {
            const betaDegFromTheta = Angle.calcBetaFromTheta(fe, thetaDegFromInput)
            const psiDegFromTheta = Angle.calcPsiFromTheta(fe, thetaDegFromInput)
            
            const betaDegFromPsi = Angle.calcBetaFromPsi(fe, psiDegFromTheta)
            expect(betaDegFromPsi).parts(betaDegFromTheta, ppb)
            
            const psiDegFromBeta = Angle.calcPsiFromBeta(fe, betaDegFromTheta)
            expect(psiDegFromBeta).parts(psiDegFromTheta, ppb)
            
            const thetaDegFromPsi = Angle.calcThetaFromPsi(fe, psiDegFromTheta)
            const thetaDegFromBeta = Angle.calcThetaFromBeta(fe, betaDegFromTheta)
            expect(thetaDegFromPsi).parts(thetaDegFromInput, ppb)
            expect(thetaDegFromBeta).parts(thetaDegFromInput, ppb)
        }

        for(let betaDegFromInput = 0; betaDegFromInput<=360; betaDegFromInput++) {
            const thetaDegFromBeta = Angle.calcThetaFromBeta(fe, betaDegFromInput)
            const psiDegFromBeta = Angle.calcPsiFromBeta(fe, betaDegFromInput)
            const psiDegFromTheta = Angle.calcPsiFromTheta(fe, thetaDegFromBeta)
            expect(psiDegFromBeta).parts(psiDegFromTheta, ppb)

            const betaDegFromPsi = Angle.calcBetaFromPsi(fe, psiDegFromTheta)
            expect(betaDegFromPsi).parts(betaDegFromInput, ppb)

            const betaDegFromTheta = Angle.calcBetaFromTheta(fe, thetaDegFromBeta)
            expect(betaDegFromTheta).parts(betaDegFromInput, ppb)
            
            const thetaDegFromPsi = Angle.calcThetaFromPsi(fe, psiDegFromBeta)
            expect(thetaDegFromBeta).parts(thetaDegFromPsi, ppb)

            const betaDegFromTheta2 = Angle.calcBetaFromTheta(fe, thetaDegFromPsi)
            expect(betaDegFromTheta2).parts(betaDegFromInput, ppb)
        }
    })
})
