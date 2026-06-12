// Preferred usage
import { StandardFuelModels } from "./StandardFuelModels.js"

export class StandardFuelModelCatalog {
    constructor(config={}) {
        this.config = {fbfm13: true, fbfm40: true, landfire: true, config}
        this.catalog = new Map()
        for(let model of StandardFuelModels) {
            this.catalog.set(model.number, model)
            this.catalog.set(model.code, model)
        }
    }
    get(key) {
        return this.catalog.get(key) 
    }
    has(key) {
        return this.catalog.has(key)
    }
    set(key, fuelModel) { return this.catalog.get(key, fuelModel) }
}
