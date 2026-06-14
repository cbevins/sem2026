/**
 * Fire is a wrapper around the chain of classes including StandardFuelModelCatalog,
 * FuelModel, FuelBed, FuelIgnition, FireBehavior, and FireEllipse.
 * 
 * Clients can access any of these instances as fire.catalog, fire.fuelModel,
 * fire.fuelBed, fire.fuelIgnition, fire.fireBehavior, or fire.fireEllipse.
 * 
 * Besides construction, there is only 1 method, update(inputs), in which new
 * input values are provided.  This is NOT currently optimized,
 * and the entire chain of classes is reconstructed with each update().
 */
import { StandardFuelModelCatalog } from '../src/StandardFuelModelCatalog.js'
import { FuelBed } from '../src/FuelBed.js'
import { FuelIgnition } from '../src/FuelIgnition.js'
import { FireBehavior } from '../src/FireBehavior.js'
import { FireEllipse } from '../src/FireEllipse.js'
import { BetaFireVector } from '../src/FireVector.js'

// Requires an additional 'fuelKey' inputs property
export class Fire {
    static Inputs = [
        // Set default parameter values
        {key: 'saveProps', value: 0, order: 0},
        // FuelBed class inputs (2)
        {key: 'fuelKey', value: 1, order: 1},
        {key: 'curedHerb', value: 0, order: 1},
        // FuelIgnition class inputs (5)
        {key: 'moistureDead1h', value: 0.1, order: 2},
        {key: 'moistureDead10h', value: 0.1, order: 2},
        {key: 'moistureDead100h', value: 0.1, order: 2},
        {key: 'moistureLiveHerb', value: 2, order: 2},
        {key: 'moistureLiveStem', value: 2, order: 2},
        // FireBehavior class inputs (6)
        {key: 'limitSpreadRateByReactionIntensity', value: true, order: 3},
        {key: 'limitSpreadRateByEffWindSpeed', value: false, order: 3},
        {key: 'midflameWindSpeed', value: 0, order: 3},
        {key: 'windBearing', value: 0, order: 3},
        {key: 'aspect', value: 180, order: 3},
        {key: 'slopeRatio', value: 0, order: 3},
        // LINKED FireEllipse class inputs (3)
        {key: 'elapsedTime', value: 0, order: 4},
        {key: 'ignEast', value: 0, order: 4},
        {key: 'ignNorth', value: 0, order: 4},
        // FireVector class inputs (2)
        {key: 'beta', value: 0, order: 5},
        {key: 'psi', value: 0, order: 5},
        // UNLINKED FireEllipse class inputs (4)
        // headingSpreadRate: 0,
        // lengthWidthRatio: 1,
        // flameLength: 0,
        // bearing: 0,
    ]

    constructor(inputs) {
        this.catalog = new StandardFuelModelCatalog()
        this.inputs = {}
        this.update(inputs, true)
    }

    update(inputs={}, init=false) {
        // Update values of all properties present in the 'inputs' object
        let start = 9
        for(let {key, order} of Fire.Inputs) {
            if (Object.hasOwn(inputs, key)) {
                this.inputs[key] = inputs[key]
                start = Math.min(start, order)
            }
        }
        if (init) start = 0

        const fuelModel = this.catalog.get(this.inputs.fuelKey)
        const fuelBed = new FuelBed({fuelModel, ...this.inputs})
        const fuelIgnition = new FuelIgnition({fuelBed, ...this.inputs})
        const fireBehavior = new FireBehavior({fuelIgnition, ...this.inputs})
        // Note that the fireBehavior instance must be spread,
        // as FireEllipse uses its props directly, and NOT indirectly through its reference
        const fireEllipse = new FireEllipse({...fireBehavior, ...this.inputs})
        this.head = new BetaFireVector(fireEllipse, 0)
        this.back = new BetaFireVector(fireEllipse, 180)
        this.beta = new BetaFireVector(fireEllipse, this.inputs.betaFromHead)

        // Store all
        this.fuelModel = fuelModel
        this.fuelBed = fuelBed
        this.fuelIgnition= fuelIgnition
        this.fireBehavior = fireBehavior
        this.fireEllipse = fireEllipse

        return this
    }
}

const inputs = {
    // Set default parameter values
    saveProps: 0,
    // FuelBed class inputs (2)
    fuelKey: 10,
    curedHerb: 0.778,
    // FuelIgnition class inputs (5)
    moistureDead1h: 0.05,
    moistureDead10h: 0.07,
    moistureDead100h: 0.09,
    moistureLiveHerb: 0.5,
    moistureLiveStem: 1.5,
    // FireBehavior class inputs (6)
    limitSpreadRateByReactionIntensity: true,
    limitSpreadRateByEffWindSpeed: false,
    midflameWindSpeed: 880,
    windBearing: 90,
    aspect: 180,
    slopeRatio: 0.25,
    // LINKED FireEllipse class inputs (3)
    elapsedTime: 60,
    ignEast: 0,
    ignNorth: 0,
    // FireVector class inputs (2)
    beta: 45,
    psi: 45,
}

const fire = new Fire(inputs)
console.log(fire)
