import { describe, it, expect } from 'vitest'
import { StandardFuelModelCatalog } from '../src/StandardFuelModelCatalog.js'
import { FuelBed } from '../src/FuelBed.js'
import { FuelIgnition } from '../src/FuelIgnition.js'
import { FireBehavior } from '../src/FireBehavior.js'
import { FireEllipse } from '../src/FireEllipse.js'

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
// BehavePlus 5 and V6beta values
//------------------------------------------------------------------------------
const behavePlusProps = [
    ['lengthWidthRatio', [3.5015680219321221, 3.5015819412846603]],
    ['headingSpreadRate', [18.551680325448835, 48.47042599399056]],
    ['eccentricity', [0.95835298387126711, 0.95835332217217739]],
    ['majorExpansionRate', [0.39452649041938642 + 18.551680325448835, 1.0307803973340242 + 48.47042599399056]],
    ['minorExpansionRate', [2 * 2.7053889424963877, 2 * 7.0684061120619655]],
    ['fSpreadRate', [9.4731034079341114, 1485.0361917397374 / elapsed]],
    ['gSpreadRate', [9.0785769175147255, 1423.189367899696 / elapsed]],
    ['hSpreadRate', [2.7053889424963877, 424.10436672371787 / elapsed]],
    ['backingSpreadRate', [0.39452649041938642, 1.0307803973340242]],
]

// The FireEllipse methods should match these BehavePlus results
// for FBFM13 10 and FBFM40 124
const bpMethod = {
    area: [289850.691417, 45.422576205218135 * (66.0 * 660.0)],
    length: [1136.7724089520932, 2970.0723834794749],
    perimeter: [2476.2400999186934, 6469.7282289420209],
    width: [324.64667309956644, 848.20873344743575],

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

describe('FuelEllipse Class', () => {
    it(`Fuel Model 10 FireEllipse properties match BehavePlus v5 and v6 beta:`, () => {
        const idx = 0
        const fuelModel = catalog.get(10)
        const fuelBed = new FuelBed(fuelModel, curingConditions, config)
        const fuelIgnition = new FuelIgnition(fuelBed, moistureConditions, config)
        const fireBehavior = new FireBehavior(fuelIgnition, windSlopeConditions,
            behaviorConfig, config)
        const fireEllipse = new FireEllipse(fireBehavior, config)
    
        for(let [prop, values] of behavePlusProps) {
            expect(fireEllipse[prop]).parts(values[idx], ppb)
        }
        expect(fireEllipse.calcLength(elapsed)).parts(bpMethod.length[idx], ppb)
        expect(fireEllipse.calcWidth(elapsed)).parts(bpMethod.width[idx], ppb)
        expect(fireEllipse.calcArea(elapsed)).parts(bpMethod.area[idx], ppm)
        expect(fireEllipse.calcPerimeterLength(elapsed)).parts(bpMethod.perimeter[idx], ppt)
        expect(fireEllipse.calcHeadingDistance(elapsed)).parts(bpMethod.headDist[idx], ppb)
        expect(fireEllipse.calcBackingDistance(elapsed)).parts(bpMethod.backDist[idx], ppb)

        // Beta ros, distance
        expect(fireEllipse.calcIgnitionSpreadRate(beta5FromHead[idx], elapsed)).parts(bpMethod.beta5Ros[idx], ppb)
        expect(fireEllipse.calcIgnitionDistance(beta5FromHead[idx], elapsed)).parts(bpMethod.beta5Dist[idx], ppb)
        expect(fireEllipse.calcIgnitionFirelineIntensity(beta5FromHead[idx], elapsed)).parts(bpMethod.beta5Fli[idx], ppb)

        // Perimeter LCS at beta angles
        let betaLcs = fireEllipse.calcIgnitionPerimeterLcs(0, elapsed)
        expect(betaLcs.x).parts(bpMethod.headDist[idx], ppb)
        expect(betaLcs.y).parts(0, ppb)
        
        betaLcs = fireEllipse.calcIgnitionPerimeterLcs(180, elapsed)
        expect(betaLcs.x).parts(-bpMethod.backDist[idx], ppb)
        expect(betaLcs.y).parts(0, ppb)
        
        // Ellipse center LCS unrotated
        let centerDist = fireEllipse.gSpreadRate * elapsed
        expect(fireEllipse.calcCenterDistance(elapsed)).parts(centerDist, ppb)
        let centerLcs = fireEllipse.calcCenterLcs(elapsed, 0)
        expect(centerLcs.x).parts(centerDist, ppb)
        expect(centerLcs.y).parts(0, ppb)
        
        // Ellipse center LCS, rotated 45 degreesa
        centerLcs = fireEllipse.calcCenterLcs(elapsed, 45)
        let radians = 45 * Math.PI / 180
        expect(centerLcs.x).parts(centerDist * Math.cos(radians), ppb)
        expect(centerLcs.y).parts(centerDist * Math.sin(radians), ppb)

        // Theta angles to get flank LCS, unrotated
        let flankLcs = fireEllipse.calcPerimeterPointFromCenter(90, elapsed, 0)
        expect(flankLcs.x).parts(centerDist, ppb)
        expect(flankLcs.y).parts(fireEllipse.calcMinorDistance(elapsed), ppb)

        flankLcs = fireEllipse.calcPerimeterPointFromCenter(270, elapsed, 0)
        expect(flankLcs.x).parts(centerDist, ppb)
        expect(flankLcs.y).parts(-fireEllipse.calcMinorDistance(elapsed), ppb)

        // theta head LCS
        let thetaLcs = fireEllipse.calcPerimeterPointFromCenter(0, elapsed, 0)
        expect(thetaLcs.x).parts(fireEllipse.calcMajorDistance(elapsed), ppb)
        expect(thetaLcs.y).parts(0, ppb)

        thetaLcs = fireEllipse.calcPerimeterPointFromCenter(180, elapsed, 0)
        expect(thetaLcs.x).parts(-fireEllipse.calcMajorDistance(elapsed), ppb)
        expect(thetaLcs.y).parts(0, ppb)

        // expect(fireEllipse.calcThetaFromBeta(beta5FromHead[idx])).parts(bpMethod.beta6Theta[idx], ppb)
        let betaFromTheta = fireEllipse.calcBetaFromTheta(90)
        let thetaFromBeta = fireEllipse.calcThetaFromBeta(betaFromTheta)
        console.log(`theta 90 => beta ${betaFromTheta} => theta ${thetaFromBeta}`)
        expect(thetaFromBeta).parts(90, ppb)

        // thetaFromBeta = fireEllipse.calcThetaFromBeta(90)
        // betaFromTheta = fireEllipse.calcBetaFromTheta(thetaFromBeta)
        // console.log(`beta 90 => theta ${thetaFromBeta} => beta ${betaFromTheta}`)
        // expect(betaFromTheta).parts(90, ppb)
    })

    it(`Fuel Model 124 FireEllipse properties match BehavePlus v5 and v6 beta:`, () => {
        const idx = 1
        const fuelModel = catalog.get(124)
        const fuelBed = new FuelBed(fuelModel, curingConditions, config)
        const fuelIgnition = new FuelIgnition(fuelBed, moistureConditions, config)
        const fireBehavior = new FireBehavior(fuelIgnition, windSlopeConditions,
            behaviorConfig, config)
        const fireEllipse = new FireEllipse(fireBehavior, config)
    
        for(let [prop, values] of behavePlusProps) {
            expect(fireEllipse[prop]).parts(values[idx], ppb)
        }
        expect(fireEllipse.calcLength(elapsed)).parts(bpMethod.length[idx], ppb)
        expect(fireEllipse.calcWidth(elapsed)).parts(bpMethod.width[idx], ppb)
        expect(fireEllipse.calcArea(elapsed)).parts(bpMethod.area[idx], ppm)
        expect(fireEllipse.calcPerimeterLength(elapsed)).parts(bpMethod.perimeter[idx], ppt)
        expect(fireEllipse.calcHeadingDistance(elapsed)).parts(bpMethod.headDist[idx], ppb)
        expect(fireEllipse.calcBackingDistance(elapsed)).parts(bpMethod.backDist[idx], ppb)
        expect(fireEllipse.calcIgnitionSpreadRate(beta5FromHead[idx], elapsed)).parts(bpMethod.beta5Ros[idx], ppb)
        expect(fireEllipse.calcIgnitionDistance(beta5FromHead[idx], elapsed)).parts(bpMethod.beta5Dist[idx], ppb)
        expect(fireEllipse.calcIgnitionFirelineIntensity(beta5FromHead[idx], elapsed)).parts(bpMethod.beta5Fli[idx], ppb)
        
        let lcs =  fireEllipse.calcIgnitionPerimeterLcs(0, elapsed)
        expect(lcs.x).parts(bpMethod.headDist[idx], ppb)
        expect(lcs.y).parts(0, ppb)
        
        lcs =  fireEllipse.calcIgnitionPerimeterLcs(180, elapsed)
        expect(lcs.x).parts(-bpMethod.backDist[idx], ppb)
        expect(lcs.y).parts(0, ppb)
    })
})
