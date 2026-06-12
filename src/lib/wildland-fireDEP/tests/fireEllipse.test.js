import { describe, it, expect } from 'vitest'
import { StandardFuelModelCatalog } from '../src/StandardFuelModelCatalog.js'
import { FuelBed } from '../src/FuelBed.js'
import { FuelIgnition } from '../src/FuelIgnition.js'
import { FireBehavior } from '../src/FireBehavior.js'
import { FireEllipse } from '../src/FireEllipse.js'
import { BetaFireVector, Beta6FireVector, PsiFireVector, ThetaVector } from '../src/FireVector.js'
import { calcBetaFromTheta, calcThetaFromBeta, calcPsiFromTheta } from '../src/ellipseAngles.js'

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
// console.log('beta5Fromhead', beta5FromHead) prints: [ 317.42663261416214, 317.38627133482663 ]
const beta6FromHead = [360 - 42.573367385837855, 360 - 42.613728665173383]
const psiFromHead   = [360 - 42.573367385837855, 360 - 42.613728665173383]
const beta5FromNorth  = [45, 45]
const beta6FromNorth = [45, 45]
const psiFromNorth   = [45, 45]

const beta5FromUpslope  = [45, 45]
const beta6FromUpslope = [45, 45]
const psiFromUpslope   = [45, 45]

function scorchHeight(fli, airTemp=77, midflameWindSpeed=0) {
    const mph = midflameWindSpeed / 88
    return (fli > 0) ? ((63 / (140 - airTemp)) * fli**1.166667) /
        Math.sqrt(fli + mph * mph * mph) : 0
}

// beta.fli = head.fli * beta5.ros / head.ros
const beta5fli010 = (389.95413667947145 * 2.6256648650882601) / 18.551680325448835
// console.log('beta5fli010', beta5fli010) prints: 55.191166391033725
const beta5fl010 = 0.45 * Math.pow(beta5fli010, 0.46)
const beta5scht010 = scorchHeight(beta5fli010, airTemp, midflame)

// beta.fli = head.fli * beta5.ros / head.ros 
const beta5fli124 = (2467.9286450361865 * 6.8494531181657319) / 48.47042599399056
// console.log('beta5fli124', beta5fli124) prints: 348.7479469491235
const beta5fl124 = 0.45 * Math.pow(beta5fli124, 0.46)
const beta5scht124 = scorchHeight(beta5fli124, airTemp, midflame)
// const m = mapScale
// const m2 = m * m

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
}
// The following are off by a bit more than ppb
const area = [289850.691417, 45.422576205218135 * (66.0 * 660.0)]
const perimeter = [2476.2400999186934, 6469.7282289420209]


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
    beta5Scorch: [beta5scht010, beta5scht124],
    
    beta6Ros: [2.6256648650882601, 6.8494531181657319],
    beta6Dist: [elapsed * 2.6256648650882601, elapsed * 6.8494531181657319],
    beta6Fli: [22.809320529051977, 144.22374220988746],
    beta6Flame: [1.896462213587117, 4.4296501098298906],
    beta6Scorch: [1.6814949065754006, 13.669401441568459],
    beta6Theta: [138.95912883244358, 138.998426267168],
    beta6Psi: [108.16241745554537, 108.185867694348],
    
    // The flank ROS is actually the *expansion rate* at 90 and 270 degrees from ellipse center,
    // and IS NOT a fire spread rate. So while the 'ros' and 'dist' properties are valid,
    // the Fli, Flame, and Scorch are not, as the fire did NOT come from the ellipse center.
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
    it(`Fuel Model 10 and 124 FireEllipse properties match BehavePlus v5 and v6 beta:`, () => {
        const fuel = [10, 124]
        for(let idx=0; idx<=1; idx++) {
            const fuelModel = catalog.get(fuel[idx])
            const fuelBed = new FuelBed(fuelModel, curingConditions, config)
            const fuelIgnition = new FuelIgnition(fuelBed, moistureConditions, config)
            const fireBehavior = new FireBehavior(fuelIgnition, windSlopeConditions,
                behaviorConfig, config)
            const fireEllipse = new FireEllipse({...fireBehavior, elapsedTime: elapsed})
        
            for(let [prop, values] of Object.entries(bpProps)) {
                // console.log(`FM ${idx} prop ${prop} expect ${values[0]} received ${fireEllipse[prop]}`)
                expect(fireEllipse[prop]).parts(values[idx], ppb)
            }
            expect(fireEllipse.area).parts(area[idx], ppm)
            expect(fireEllipse.perimeter).parts(perimeter[idx], ppt)

            let head = new BetaFireVector(fireEllipse,0)
            expect(head.spreadRate).parts(bpMethod.headRos[idx])
            expect(head.distance).parts(bpMethod.headDist[idx])
            expect(head.firelineIntensity).parts(bpMethod.headFli[idx])
            expect(head.getFlameLength()).parts(bpMethod.headFlame[idx])
            expect(head.getScorchHeight(airTemp, midflame)).parts(bpMethod.headScorch[idx])
            
            let back = new BetaFireVector(fireEllipse, 180)
            expect(back.spreadRate).parts(bpMethod.backRos[idx])
            expect(back.distance).parts(bpMethod.backDist[idx])
            expect(back.firelineIntensity).parts(bpMethod.backFli[idx])
            expect(back.getFlameLength()).parts(bpMethod.backFlame[idx])
            expect(back.getScorchHeight(airTemp, midflame)).parts(bpMethod.backScorch[idx])

            let beta5 = new BetaFireVector(fireEllipse, beta5FromHead[idx])
            expect(beta5.spreadRate).parts(bpMethod.beta5Ros[idx])
            expect(beta5.distance).parts(bpMethod.beta5Dist[idx])
            expect(beta5.firelineIntensity).parts(bpMethod.beta5Fli[idx])
            expect(beta5.getFlameLength()).parts(bpMethod.beta5Flame[idx])
            expect(beta5.getScorchHeight(airTemp, midflame)).parts(bpMethod.beta5Scorch[idx])

            let beta6 = new Beta6FireVector(fireEllipse, beta6FromHead[idx])
            expect(beta6.spreadRate).parts(bpMethod.beta6Ros[idx])
            expect(beta6.distance).parts(bpMethod.beta6Dist[idx])
            expect(beta6.theta).parts(bpMethod.beta6Theta[idx])
            expect(beta6.psi).parts(bpMethod.beta6Psi[idx])
            expect(beta6.firelineIntensity).parts(bpMethod.beta6Fli[idx], ppm)
            expect(beta6.getFlameLength()).parts(bpMethod.beta6Flame[idx])
            expect(beta6.getScorchHeight(airTemp, midflame)).parts(bpMethod.beta6Scorch[idx], ppm)

            let psi = new PsiFireVector(fireEllipse, psiFromHead[idx])
            expect(psi.spreadRate).parts(bpMethod.psiRos[idx])
            expect(psi.distance).parts(bpMethod.psiDist[idx])
            expect(psi.firelineIntensity).parts(bpMethod.psiFli[idx])
            expect(psi.getFlameLength()).parts(bpMethod.psiFlame[idx])
            expect(psi.getScorchHeight(airTemp, midflame)).parts(bpMethod.psiScorch[idx])

            // Flanking is an *expansion rate* from the ellipse center,
            // and NOT a spread rate from the ignition point
            // Therefore, fireline intensity and flame length must use beta or phi
            let theta = new ThetaVector(fireEllipse, 90)
            expect(theta.spreadRate).parts(bpMethod.flankRos[idx])
            expect(theta.distance).parts(bpMethod.flankDist[idx])
            expect(theta.firelineIntensity).parts(bpMethod.flankFli[idx])
            expect(theta.getFlameLength()).parts(bpMethod.flankFlame[idx])
            expect(theta.getScorchHeight(airTemp, midflame)).parts(bpMethod.flankScorch[idx])
        }
    })
})
