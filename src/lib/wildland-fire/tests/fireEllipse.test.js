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
    // elapsedTime: [elapsed, elapsed],
    // ignitionPcs: [{x:0, y:0}, {x:0, y:0}],
    // betaDegrees: [45, 45],

    // setEllipse() outputs
    firelineIntensity: [389.95413667947145, 2467.9286450361865],
    eccentricity: [0.95835298387126711, 0.95835332217217739],
    backingSpreadRate: [0.39452649041938642, 1.0307803973340242],
    majorExpansionRate: [0.39452649041938642 + 18.551680325448835, 1.0307803973340242 + 48.47042599399056],
    minorExpansionRate: [2 * 2.7053889424963877, 2 * 7.0684061120619655],
    fSpreadRate: [9.4731034079341114, 1485.0361917397374 / elapsed],
    hSpreadRate: [2.7053889424963877, 424.10436672371787 / elapsed],
    gSpreadRate: [9.0785769175147255, 1423.189367899696 / elapsed],
    // latusRectumSpreadRate: [null, null],
    // degRot: [null, null],
    // radRot: [null, null],
    // cosRot: [null, null],
    // sinRot: [null, null],
    // cosInvRot: [null, null],
    // sinInvRot: [null, null],

    // setElapsedTime() outputs
    headingDistance: [1113.1008195269301, 2908.2255596394334],
    backingDistance: [23.671589425163184, 61.846823840041452],
    fDistance: [elapsed * 9.4731034079341114, 1485.0361917397374],
    hDistance: [elapsed * 2.7053889424963877, 424.10436672371787],
    gDistance: [elapsed * 9.0785769175147255, 1423.189367899696],
    // latusRectumDistance: [null, null],
    length: [1136.7724089520932, 2970.0723834794749],
    width: [324.64667309956644, 848.20873344743575],
    // ignitionLcs: [{east:0, north:0}, {east:0, north:0}],
    // centerLcs: [{east:0, north:0}, {east:0, north:0}],
    // headLcs: [{east:0, north:0}, {east:0, north:0}],
    // backLcs: [{east:0, north:0}, {east:0, north:0}],
    // rightLcs: [{east:0, north:0}, {east:0, north:0}],
    // leftLcs: [{east:0, north:0}, {east:0, north:0}],

    // The following are off by a bit more than ppb
    // area: [289850.691417, 45.422576205218135 * (66.0 * 660.0)],
    // perimeter: [2476.2400999186934, 6469.7282289420209],

    betaSpreadRate: [2.6256648650882601, 6.8494531181657319],
    betaDistance: [elapsed * 2.6256648650882601, elapsed * 6.8494531181657319],
    betaFirelineIntensity: [beta5fli010, beta5fli124],
    betaFlameLength: [beta5fl010, beta5fl124],

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

describe('FuelEllipse Class', () => {
    it(`Fuel Model 10 FireEllipse properties match BehavePlus v5 and v6 beta:`, () => {
        const idx = 0
        const fuelModel = catalog.get(10)
        const fuelBed = new FuelBed(fuelModel, curingConditions, config)
        const fuelIgnition = new FuelIgnition(fuelBed, moistureConditions, config)
        const fireBehavior = new FireBehavior(fuelIgnition, windSlopeConditions,
            behaviorConfig, config)
        const fireEllipse = new FireEllipse(fireBehavior, config)
            .setElapsedTime(elapsed)
            .setFireVectorAngle(beta5FromHead[0])
    
        for(let [prop, values] of Object.entries(bpProps)) {
            console.log(`FM010 prop ${prop} value ${values[1]}`)
            expect(fireEllipse[prop]).parts(values[idx], ppb)
        }
        expect(fireEllipse.area).parts(289850.691417, ppm)
        expect(fireEllipse.perimeter).parts(2476.2400999186934, ppt)

        fireEllipse.setFireVectorAngle(0)
        expect(fireEllipse.betaSpreadRate).parts(bpProps.headingSpreadRate[idx])
        // expect(betaLcs.y).parts(0, ppb)
        
        // betaLcs = fireEllipse.calcIgnitionVectorPerimeterLcs(180, elapsed)
        // expect(betaLcs.x).parts(-bpMethod.backDist[idx], ppb)
        // expect(betaLcs.y).parts(0, ppb)
        
        // Ellipse center LCS unrotated
        expect(fireEllipse.centerLcs.x).parts(fireEllipse.gDistance, ppb)
        expect(fireEllipse.centerLcs.y).parts(0, ppb)
        
        // // Ellipse center LCS, rotated 45 degreesa
        // centerLcs = fireEllipse.calcCenterLcs(elapsed, 45)
        // let radians = 45 * Math.PI / 180
        // expect(centerLcs.x).parts(centerDist * Math.cos(radians), ppb)
        // expect(centerLcs.y).parts(centerDist * Math.sin(radians), ppb)

        // // Theta angles to get flank LCS, unrotated
        // let flankLcs = fireEllipse.calcPerimeterPointFromCenter(90, elapsed, 0)
        // expect(flankLcs.x).parts(centerDist, ppb)
        // expect(flankLcs.y).parts(fireEllipse.calcMinorDistance(elapsed), ppb)

        // flankLcs = fireEllipse.calcPerimeterPointFromCenter(270, elapsed, 0)
        // expect(flankLcs.x).parts(centerDist, ppb)
        // expect(flankLcs.y).parts(-fireEllipse.calcMinorDistance(elapsed), ppb)

        // // theta head LCS
        // let thetaLcs = fireEllipse.calcPerimeterPointFromCenter(0, elapsed, 0)
        // // expect(thetaLcs.x).parts(fireEllipse.calcMajorDistance(elapsed), ppb)
        // // expect(thetaLcs.y).parts(0, ppb)

        // thetaLcs = fireEllipse.calcPerimeterPointFromCenter(180, elapsed, 0)
        // // expect(thetaLcs.x).parts(-fireEllipse.calcMajorDistance(elapsed), ppb)
        // expect(thetaLcs.y).parts(0, ppb)

        // // expect(fireEllipse.calcThetaFromBeta(beta5FromHead[idx])).parts(bpMethod.beta6Theta[idx], ppb)
        // let betaFromTheta = fireEllipse.calcBetaFromTheta(90)
        // let thetaFromBeta = fireEllipse.calcThetaFromBeta(betaFromTheta)
        // console.log(`theta 90 => beta ${betaFromTheta} => theta ${thetaFromBeta}`)
        // expect(thetaFromBeta).parts(90, ppb)

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
            .setElapsedTime(elapsed)
            .setFireVectorAngle(beta5FromHead[1])
    
        for(let [prop, values] of Object.entries(bpProps)) {
            console.log(`FM124 prop ${prop} value ${values[1]}`)
            expect(fireEllipse[prop]).parts(values[idx], ppb)
        }
        expect(fireEllipse.area).parts(45.422576205218135 * (66.0 * 660.0), ppm)
        expect(fireEllipse.perimeter).parts(6469.7282289420209, ppt)
        
        // let lcs =  fireEllipse.calcIgnitionVectorPerimeterLcs(0, elapsed)
        // expect(lcs.x).parts(bpMethod.headDist[idx], ppb)
        // expect(lcs.y).parts(0, ppb)
        
        // lcs =  fireEllipse.calcIgnitionVectorPerimeterLcs(180, elapsed)
        // expect(lcs.x).parts(-bpMethod.backDist[idx], ppb)
        // expect(lcs.y).parts(0, ppb)
    })

    it(`Beta-Theta-Psi call sequence works forward and backward:`, () => {
        // Build FireEllipse from direct input parameters for FM 10:
        const behavior = {
            spreadRate: 18.551680325448835,
            // firelineIntensity: 389.95413667947145,
            flameLength: 6.9996889013229229,
            lengthWidthRatio: 3.5015680219321221,
            headingFromNorth: 87.573367385837855,
        }
        const fireEllipse = new FireEllipse(behavior, config)
        expect(fireEllipse.headingSpreadRate).parts(behavior.spreadRate, ppb)
        expect(fireEllipse.firelineIntensity).parts(389.95413667947145, ppb)
        expect(fireEllipse.lengthWidthRatio).parts(3.5015680219321221, ppb)

        for(let thetaDegFromInput = 0; thetaDegFromInput<=360; thetaDegFromInput++) {
            const betaDegFromTheta = fireEllipse.calcBetaFromTheta(thetaDegFromInput)
            const psiDegFromTheta = fireEllipse.calcPsiFromTheta(thetaDegFromInput)
            
            const betaDegFromPsi = fireEllipse.calcBetaFromPsi(psiDegFromTheta)
            expect(betaDegFromPsi).parts(betaDegFromTheta, ppb)
            
            const psiDegFromBeta = fireEllipse.calcPsiFromBeta(betaDegFromTheta)
            expect(psiDegFromBeta).parts(psiDegFromTheta, ppb)
            
            const thetaDegFromPsi = fireEllipse.calcThetaFromPsi(psiDegFromTheta)
            const thetaDegFromBeta = fireEllipse.calcThetaFromBeta(betaDegFromTheta)
            expect(thetaDegFromPsi).parts(thetaDegFromInput, ppb)
            expect(thetaDegFromBeta).parts(thetaDegFromInput, ppb)
        }

        for(let betaDegFromInput = 0; betaDegFromInput<=360; betaDegFromInput++) {
            const thetaDegFromBeta = fireEllipse.calcThetaFromBeta(betaDegFromInput)
            const psiDegFromBeta = fireEllipse.calcPsiFromBeta(betaDegFromInput)
            const psiDegFromTheta = fireEllipse.calcPsiFromTheta(thetaDegFromBeta)
            expect(psiDegFromBeta).parts(psiDegFromTheta, ppb)

            const betaDegFromPsi = fireEllipse.calcBetaFromPsi(psiDegFromTheta)
            expect(betaDegFromPsi).parts(betaDegFromInput, ppb)

            const betaDegFromTheta = fireEllipse.calcBetaFromTheta(thetaDegFromBeta)
            expect(betaDegFromTheta).parts(betaDegFromInput, ppb)
            
            const thetaDegFromPsi = fireEllipse.calcThetaFromPsi(psiDegFromBeta)
            expect(thetaDegFromBeta).parts(thetaDegFromPsi, ppb)

            const betaDegFromTheta2 = fireEllipse.calcBetaFromTheta(thetaDegFromPsi)
            expect(betaDegFromTheta2).parts(betaDegFromInput, ppb)
        }
    })
})
