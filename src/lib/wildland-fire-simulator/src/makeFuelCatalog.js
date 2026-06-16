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

    #clone(fuelModel) {
        const particles = []
        for(let particle of fuelModel.particles)
            particles.push({...particle})
        const {number, code, group, label, desc, depth, deadMext} = fuelModel
        return {number, code, group, label, desc, depth, deadMext, particles}
    }

    /**
     * @param {object} inputs A plain old data object with a 'fuelKey' property
     * @returns A copy of the FuelModel plain-old data object,
     * or FALSE if fuelKey doesn't exist
     */
    get(fuelKey) {
        const fuelModel = this.catalog.get(this.#toKey(fuelKey)) 
        return (fuelModel === undefined) ? null : this.#clone(fuelModel)
    }

    /**
     * @param {number|string} A fuelKey number or string
     * @returns TRUE if the fuelKey exists in the catalog, FALSE if it doesn't exist
     */
    has(fuelKey) {
        return this.catalog.has(this.#toKey(fuelKey))
    }

    /**
     * Adds a custom fuel model to the catalog.
     * CAUTION: There is no testing for the validity of the 'fuelModel' object!
     * @param {string|integer} fuelKey 
     * @param {object} FuelModel plain-old data object
     * @returns Reference to *this* (and NOT to the catalog Map())
     */
    set(fuelKey, fuelModel) {
        this.catalog.set(this.#toKey(fuelKey), fuelModel)
        return this
    }
    
    add(inputs={}) {
        const {fuelKey, fuelModel} = inputs
        this.catalog.set(this.#toKey(fuelKey), fuelModel)
        return this
    }
}
