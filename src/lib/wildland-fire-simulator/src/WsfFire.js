import { makeBetaVector, makeBeta6Vector, makePsiVector} from '../Wfs.js'
import { makeFireBehavior } from '../Wfs.js'
import { makeFireEllipse } from '../Wfs.js'
import { makeFireSize } from '../Wfs.js'
import { makeFuelBed } from '../Wfs.js'
import { makeFuelCatalog } from '../Wfs.js'
import { makeFuelIgnition } from '../Wfs.js'
import { makeFuelModel } from '../Wfs.js'
import { makeLogger } from '../Wfs.js'
// import { makeWeightedFireBehavior } from '../Wfs.js'

// Input object updaters
import {
    makeFireTerrain,
    makeFireWeather,
    makeFuelCanopy,
    makeFuelCuring,
    makeFuelMoisture}
from '../Wfs.js'

export class WfsFire {
    constructor() {
        this.logger = makeLogger()
        this.fuelCatalog = makeFuelCatalog()
    }
    run(inputs) {
        let {configs=null,
            angleFromHead=null,
            fireWeather=null,
            firePosition=null,
            fireTerrain=null,
            fuelCanopy=null,
            fuelCuring=null,
            fuelKey=null,
            fuelMoisture=null,
            slopeMap=null} = inputs
        const props = ['configs', 'fuelKey', 'fuelCuring', 'fuelMoisture',
            'fuelCanopy', 'fireWeather', 'fireTerrain', 'firePosition',
            'angleFromHead', 'slopeMap']
        let missing = 0
        for(let prop of props) {
            if(!Object.hasOwn(inputs, prop)) {
                console.log(`Missing required inputs property '${prop}'`)
                missing++
            }
        }
        if (missing) return {}

        // Add reference to this logger
        configs.logger = this.logger

        // Determine the fuel model for the requested fuel key
        const fuelModel = makeFuelModel({fuelCatalog: this.fuelCatalog, fuelKey}, configs)

        // Update fuelMoisture based on configs
        fuelMoisture = makeFuelMoisture({fuelMoisture}, configs)

        // Update fuelCuring fractions for the fuel curing classes based on configs
        fuelCuring = makeFuelCuring({fuelCuring, fuelMoisture}, configs)

        // Determine dry fuel bed structure (savr, packing, bulk density, wind/slope factors)
        const fuelBed = makeFuelBed({fuelModel, fuelCuring}, configs)

        // Determine fuel bed ignition (heat source/sink, reaction intensity, no-wind spread rate)
        // fuelMoisture was previously updated for fuelCuring, so good to go
        const fuelIgnition = makeFuelIgnition({fuelBed, fuelMoisture}, configs)

        // Update fuelCanopy (wind speed reduction) based on configs
        fuelCanopy = makeFuelCanopy({fuelCanopy}, configs)

        // Update fire weather (wind bearing, midflame wind speed and reduction factor)
        fireWeather = makeFireWeather({fireWeather, fuelCanopy, fuelBed}, configs)

        // Update fire terrain (slope steepness)
        fireTerrain = makeFireTerrain({fireTerrain, slopeMap}, configs)

        // Determine fire behavior (spread rate, bearing, effective wind speed, length-to-width ratio)
        const fireBehavior = makeFireBehavior({fuelBed, fuelIgnition, fireWeather, fireTerrain}, configs)

        // Determine fire ellipse (eccentricity, expansion rates)
        const fireEllipse = makeFireEllipse({fireBehavior}, configs)

        // Determine the fire ellipse size
        const fireSize = makeFireSize({fireEllipse, firePosition}, configs)

        // Determine fire vector rates, positions, and behaviors
        // at head, back, beta, beta6, and psi
        const headVector = makeBetaVector({fireSize, fireWeather, betaFromHead: 0}, configs)
        const backVector = makeBetaVector({fireSize, fireWeather, betaFromHead: 180}, configs)
        const betaVector = makeBetaVector({fireSize, fireWeather, betaFromHead: angleFromHead}, configs)
        const beta6Vector = makeBeta6Vector({fireSize, fireWeather, betaFromHead: angleFromHead}, configs)
        const psiVector = makePsiVector({fireSize, fireWeather, psiFromHead: angleFromHead}, configs)

        // return all the results, plus the 'messages' prop from logger
        return {fuelModel, fuelBed, fuelIgnition, fireBehavior, fireEllipse, fireSize,
            headVector, backVector, betaVector, beta6Vector, psiVector,
            messages: this.logger.messages}
    }
}
