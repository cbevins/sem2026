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
const ppm = 1.0e-6  // parts per million
const ppt = 1.0e-3  // parts per thousand

//------------------------------------------------------------------------------
// Fixed input values used in results computations
//------------------------------------------------------------------------------
const airTemp = 95
const elapsed = 60
const mapScale = 24000
const midflame = 880
// ['site.fire.vector.fromNorth', [45]],
// ['site.map.scale', [mapScale]],
// ['site.moisture.dead.tl1h', [0.05]],
// ['site.moisture.dead.tl10h', [0.07]],
// ['site.moisture.dead.tl100h', [0.09]],
// ['site.moisture.dead.category', [0.05]],
// ['site.moisture.live.herb', [0.5]],
// ['site.moisture.live.stem', [1.5]],
// ['site.moisture.live.category', [1.5]],
// ['site.slope.direction.aspect', [180]],
// ['site.slope.steepness.ratio', [0.25]],
// ['site.wind.direction.source.fromNorth', [270]],
// ['site.wind.speed.atMidflame', [midflame]],

const headingFromNorth = [87.573367385837855, 87.613728665173383]
const beta5FromHead  = [360 - 42.573367385837855, 360 - 42.613728665173383]
const beta6FromHead = [360 - 42.573367385837855, 360 - 42.613728665173383]
const psiFromHead   = [360 - 42.573367385837855, 360 - 42.613728665173383]

const beta5FromNorth  = [45, 45]
const beta6FromNorth = [45, 45]
const psiFromNorth   = [45, 45]

const beta5FromUpslope  = [45, 45]
const beta6FromUpslope = [45, 45]
const psiFromUpslope   = [45, 45]


// beta.fli = head.fli * beta5.ros / head.ros
const beta5fli010 = (389.95413667947145 * 2.6256648650882601) / 18.551680325448835
const beta5fl010 = 0.45 * Math.pow(beta5fli010, 0.46)
// const beta5scht010 = SurfaceFire.scorchHeight(beta5fli010, midflame, airTemp)

// beta.fli = head.fli * beta5.ros / head.ros 
const beta5fli124 = (2467.9286450361865 * 6.8494531181657319) / 48.47042599399056
const beta5fl124 = 0.45 * Math.pow(beta5fli124, 0.46)
// const beta5scht124 = SurfaceFire.scorchHeight(beta5fli124, midflame, airTemp)

const m = mapScale
const m2 = m * m

//------------------------------------------------------------------------------
// BehavePlus 5 and V6-beta values
// 'null' values means there are no BP5/6 results for comparison
// commented properties means no FireEllipse values have been generated yet
//------------------------------------------------------------------------------
const bpProps = {
    // inputs
    headingSpreadRate: [18.551680325448835, 48.47042599399056],
    flameLength: [6.9996889013229229, 16.35631663317114],
    bearing: [87.573367385837855, 87.613728665173383],
    lengthWidthRatio: [3.5015680219321221, 3.5015819412846603],
    elapsedTime: [elapsed, elapsed],
    ignX: [0, 0],
    ignY: [0, 0],
    ignEast: [0, 0],
    ignNorth: [0, 0],
    // betaDegrees: [45, 45],

    // setFireEllipse() outputs
    firelineIntensity: [389.95413667947145, 2467.9286450361865],
    eccentricity: [0.95835298387126711, 0.95835332217217739],
    backingSpreadRate: [0.39452649041938642, 1.0307803973340242],
    majorExpansionRate: [0.39452649041938642 + 18.551680325448835, 1.0307803973340242 + 48.47042599399056],
    minorExpansionRate: [2 * 2.7053889424963877, 2 * 7.0684061120619655],
    fSpreadRate: [9.4731034079341114, 1485.0361917397374 / elapsed],
    hSpreadRate: [2.7053889424963877, 424.10436672371787 / elapsed],
    gSpreadRate: [9.0785769175147255, 1423.189367899696 / elapsed],
    // setElapsedTime() outputs
    headingDistance: [1113.1008195269301, 2908.2255596394334],
    backingDistance: [23.671589425163184, 61.846823840041452],
    fDistance: [elapsed * 9.4731034079341114, 1485.0361917397374],
    hDistance: [elapsed * 2.7053889424963877, 424.10436672371787],
    gDistance: [elapsed * 9.0785769175147255, 1423.189367899696],
    length: [1136.7724089520932, 2970.0723834794749],
    width: [324.64667309956644, 848.20873344743575],
    // The following are off by a bit more than ppb
    // area: [289850.691417, 45.422576205218135 * (66.0 * 660.0)],
    // perimeter: [2476.2400999186934, 6469.7282289420209],

    // These may be implemented by setFireVector() to 0, 90, 180, 270
    // headScorch: [39.580181786322299, 215.6827714],
    // backFli: [8.2929003879841954, 52.483394093499705],
    // backFlame: [1.1907414731175683, 2.7824194067294856],
    // backScorch: [0.52018662032054752, 4.382412107193391,],
    // flankRos: [2.7053889424963877, 7.0684061120619655],
    // flankDist: [162.32333654978328, 424.10436672371793],
    // flankFli: [56.866957074505869, 359.89619544220318],
    // flankFlame: [2.8870088099013929, 6.7461198324614715],
    // flankScorch: [4.8023644521509334, 36.440372402518008],
}

// The FireEllipse methods should match these BehavePlus results
// for FBFM13 10 and FBFM40 124
const bpMethod = {
    headRos: [18.551680325448835, 48.47042599399056],
    headDist: [1113.1008195269301, 2908.2255596394334],
    headFli: [389.95413667947145, 2467.9286450361865],
    headFlame: [6.9996889013229229, 16.35631663317114],
    headScorch: [39.580181786322299, 215.6827714],

    backRos: [0.39452649041938642, 1.0307803973340242],
    backDist: [23.671589425163184, 61.846823840041452],
    backFli: [8.2929003879841954, 52.483394093499705],
    backFlame: [1.1907414731175683, 2.7824194067294856],
    backScorch: [0.52018662032054752, 4.382412107193391,],
    
    beta5Ros: [2.6256648650882601, 6.8494531181657319],
    beta5Dist: [elapsed * 2.6256648650882601, elapsed * 6.8494531181657319],
    beta5Fli: [beta5fli010, beta5fli124],
    beta5Flame: [beta5fl010, beta5fl124],
    // beta5Scorch: [beta5scht010, beta5scht124],

    beta6Ros: [2.6256648650882601, 6.8494531181657319],
    beta6Dist: [elapsed * 2.6256648650882601, elapsed * 6.8494531181657319],
    beta6Fli: [22.809320529051977, 144.22374220988746],
    beta6Flame: [1.896462213587117, 4.4296501098298906],
    beta6Scorch: [1.6814949065754006, 13.669401441568459],
    beta6Theta: [138.95912883244358, 138.998426267168],
    beta6Psi: [108.16241745554537, 108.185867694348],

    flankRos: [2.7053889424963877, 7.0684061120619655],
    flankDist: [162.32333654978328, 424.10436672371793],
    flankFli: [56.866957074505869, 359.89619544220318],
    flankFlame: [2.8870088099013929, 6.7461198324614715],
    flankScorch: [4.8023644521509334, 36.440372402518008],

    psiRos: [13.8977795836636, 36.2892704981354],
    psiDist: [elapsed * 13.8977795836636, elapsed * 36.2892704981354],
    psiFlame: [6.12882661647451, 14.3173998471815],
    psiFli: [292.129690908633, 1847.71081196849],
    psiScorch: [29.307635864149884, 169.80644998818718],
}

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

describe('FireEllipse Class', () => {
    it(`Fuel Model 10 FireEllipse properties match BehavePlus v5 and v6 beta:`, () => {
        const idx = 0
        const fuelModel = catalog.get(10)
        const fuelBed = new FuelBed(fuelModel, curingConditions, config)
        const fuelIgnition = new FuelIgnition(fuelBed, moistureConditions, config)
        const fireBehavior = new FireBehavior(fuelIgnition, windSlopeConditions,
            behaviorConfig, config)
        const fireEllipse = new FireEllipse({...fireBehavior, elapsedTime: elapsed})
    
        for(let [prop, values] of Object.entries(bpProps)) {
            console.log(`FM010 prop ${prop} expect ${values[0]} received ${fireEllipse[prop]}`)
            expect(fireEllipse[prop]).parts(values[idx], ppb)
        }
        expect(fireEllipse.area).parts(289850.691417, ppm)
        expect(fireEllipse.perimeter).parts(2476.2400999186934, ppt)

        let head = fireEllipse.getBetaFireVector(0)
        expect(head.spreadRate).parts(bpMethod.headRos[idx])
        expect(head.distance).parts(bpMethod.headDist[idx])
        expect(head.firelineIntensity).parts(bpMethod.headFli[idx])
        expect(head.flameLength).parts(bpMethod.headFlame[idx])
        
        let back = fireEllipse.getBetaFireVector(180)
        expect(back.spreadRate).parts(bpMethod.backRos[idx])
        expect(back.distance).parts(bpMethod.backDist[idx])
        expect(back.firelineIntensity).parts(bpMethod.backFli[idx])
        expect(back.flameLength).parts(bpMethod.backFlame[idx])

        let beta = fireEllipse.getBetaFireVector(beta5FromHead[0])
        expect(beta.spreadRate).parts(bpMethod.beta5Ros[idx])
        expect(beta.distance).parts(bpMethod.beta5Dist[idx])
        expect(beta.firelineIntensity).parts(bpMethod.beta5Fli[idx])
        expect(beta.flameLength).parts(bpMethod.beta5Flame[idx])
        
        // CURRENTLY - cannot get flank rates to agree
        const b = Angle.calcBetaFromTheta(fireEllipse, 90) // beta=16.593900200299192
        console.log(`**********At theta=90, beta=${b}`)
        // beta = fireEllipse.getBetaFireVector(b)
        // expect(beta.spreadRate).parts(bpMethod.flankRos[idx])
        
        // Flanking spread rate is returning the HEAD fSpreadRate
        // instead of the FLANK hSpreadRate

        let flank = fireEllipse.getBetaFireVector(16.593900200299192)
        expect(flank.spreadRate).parts(bpProps.hSpreadRate[idx])
        // expect(flank.spreadRate).parts(bpMethod.flankRos[idx])
        // expect(flank.distance).parts(bpMethod.flankDist[idx])
        // expect(flank.firelineIntensity).parts(bpMethod.flankFli[idx])
        // expect(flank.flameLength).parts(bpMethod.flankFlame[idx])
    })

    it(`Fuel Model 124 FireEllipse properties match BehavePlus v5 and v6 beta:`, () => {
        const idx = 1
        const fuelModel = catalog.get(124)
        const fuelBed = new FuelBed(fuelModel, curingConditions, config)
        const fuelIgnition = new FuelIgnition(fuelBed, moistureConditions, config)
        const fireBehavior = new FireBehavior(fuelIgnition, windSlopeConditions,
            behaviorConfig, config)
        const fireEllipse = new FireEllipse({...fireBehavior, elapsedTime: elapsed})
    
        for(let [prop, values] of Object.entries(bpProps)) {
            console.log(`FM124 prop ${prop} expect ${values[1]} received ${fireEllipse[prop]}`)
            expect(fireEllipse[prop]).parts(values[idx], ppb)
        }
        expect(fireEllipse.area).parts(45.422576205218135 * (66.0 * 660.0), ppm)
        expect(fireEllipse.perimeter).parts(6469.7282289420209, ppt)

        let head = fireEllipse.getBetaFireVector(0)
        expect(head.spreadRate).parts(bpMethod.headRos[idx])
        expect(head.distance).parts(bpMethod.headDist[idx])
        expect(head.firelineIntensity).parts(bpMethod.headFli[idx])
        expect(head.flameLength).parts(bpMethod.headFlame[idx])
        
        let back = fireEllipse.getBetaFireVector(180)
        expect(back.spreadRate).parts(bpMethod.backRos[idx])
        expect(back.distance).parts(bpMethod.backDist[idx])
        expect(back.firelineIntensity).parts(bpMethod.backFli[idx])
        expect(back.flameLength).parts(bpMethod.backFlame[idx])

        let beta = fireEllipse.getBetaFireVector(beta5FromHead[1])
        expect(beta.spreadRate).parts(bpMethod.beta5Ros[idx])
        expect(beta.distance).parts(bpMethod.beta5Dist[idx])
        expect(beta.firelineIntensity).parts(bpMethod.beta5Fli[idx])
        expect(beta.flameLength).parts(bpMethod.beta5Flame[idx])
    })
})
