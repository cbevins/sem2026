/**
 * The FuelModelCatalog accepts a fuel model key and returns a copy of the associated
 * FuelModel's plain old data object.  This service is provided by the get(inputs) method,
 * where the 'inputs' argument is actually a plain-old data object with a 'fuelKey' property.
 * 
 *  The 'fuelKey' may be either the fuel model:
 * - number (i.e., 1-13, 91-93, 98, 99, 101-109, 121-124, 141-149, 161-165, 181-189, 201-204), or
 * - code (i.e. '1'-'13', 'nb1'-'nb3', 'nb8', 'nb9', 'gr1'-'gr9', 'gs1'-'gs4',
 * 'sh1'-'sh9', 'tu1'-'tu5', 'tl1'-'tl9', 'sb1'-'sb4')
 * 
 * If the 'inputs' object has no 'fuelKey' or the provided inputs.fuelKey
 * is not present in the catalog, get() return false.
 * 
 * The has() method should be used to test for the existence of uncertain fuelKeys.
 * 
 * The set(fuelKey, fuelModel) method is used to add custom fuel models to the catalog.
 * 
 * The FuelModelProcessor fuel model catalog already contains:
 * - the original 13 standard fire behavior fuel models documented by Rothermel,
 * Albini, and Anderson (known hereafter as the 'FBFM13' group),
 * - the 40 'dynamic' fire behavior fuel models documented by Scott & Burgan
 * (known hereafter as the 'FBFM40' group), and
 * - the additional 5 no-fuel conditions recognized by LANDFIRE for urban/developed,
 * snow/ice, agriculture, open water, and barren conditions.
 * 
 * Normally all of the 58 fuel models above are present in the catalog.  But if the
 * 'inputs' object passed to the constructor contains a property of 'FBFM13', 'FBFM40',
 * 'LANDFIRE', or 'CUSTOM' that is set to 'false', that group will not be loaded.
 * For example, new FuelModelProcessor({LANDFIRE: false})
 */
import { StandardFuelModels } from "./StandardFuelModels.js"

export function makeFuelCatalog() {
    return new FuelModelCatalog()
}

export class FuelModelCatalog {
    constructor() {
        // Create the fuel model catalog with the requested fuel model groups
        this.catalog = new Map()
        for(let model of StandardFuelModels) {
            this.catalog.set(model.number, model)
            this.catalog.set(model.code.toLowerCase(), model)
        }
    }

    // Ensures all string keys are lower case
    #toKey(key) {
        return (typeof key === 'string') ? key.toLowerCase() : key
    }

    // Returns a reference to the fuel model, or throws an error
    get(fuelKey) {
        const fuelModel = this.catalog.get(this.#toKey(fuelKey)) 
        if (fuelModel === undefined) 
            throw new Error(`FuelModelCatalog.get() fuel key '${fuelKey}' is invalid.`)
        return fuelModel
    }

    // Returns an array of all unique numeric fuel keys
    getNumberKeys() {
        const keys = new Set()
        for (const key of this.catalog.keys()) {
            if(Number.isFinite(key)) keys.add(key)
        }
        return [...keys]
    }

    // Returns an array of all the particle curing classes
    getCuringClasses(fuelKeys=[]) {
        const {curing} = this.#getParticleClasses(fuelKeys)
        return [...curing]
    }

    // Returns an array of all the particle moisture classes
    getMoistureClasses(fuelKeys=[]) {
        const {moisture} = this.#getParticleClasses(fuelKeys)
        return [...moisture]
    }

    // Returns {curing, moisture} where 'curing' is a Set() of all particle curing
    // classes and 'moisture' is a Set() of all fuel moisture classes
    #getParticleClasses(fuelKeys=[]) {
        const curing = new Set()
        const moisture = new Set()
        for (let key of fuelKeys) {
            const fuelModel = this.catalog.get(key)
            for (let particle of fuelModel.particles) {
                moisture.add(particle.deadMoistureClass)
                moisture.add(particle.liveMoistureClass)
                curing.add(particle.curingClass)
            }
        }
        return {moisture, curing}
    }

    // Returns an array of all unique fuel model string keys
    getStringKeys() {
        const keys = new Set()
        for (const key of this.catalog.keys()) {
            if(typeof key === 'string') keys.add(key)
        }
        return [...keys]
    }

    /**
     * @param {number|string} fuelKey A fuelKey number or string
     * @returns TRUE if the fuelKey exists in the catalog, FALSE if it doesn't exist
     */
    has(fuelKey) {
        return this.catalog.has(this.#toKey(fuelKey))
    }

    /**
     * Adds a custom fuel model to the catalog.
     * CAUTION: There is no testing for the validity of the 'fuelModel' object!
     * The fuelModel is added twice to the catalog, once under the fuelModel.number
     * and once under the fuelModel.code.
     * @param {object} FuelModel plain-old data object
     * @returns Reference to *this* (and NOT to the catalog Map())
     */
    set(fuelModel) {
        this.catalog.set(fuelModel.code.toLowerCase(), fuelModel)
        this.catalog.set(fuelModel.number, fuelModel)
        return this
    }
}
