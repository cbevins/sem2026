// Preferred usage
import { StandardFuelModels } from "./StandardFuelModels.js"

export const ConfigFuelModelCatalog = {
    FBFM13: true,   // originial 13 fire behavior fuel models (plus a '0' no-fuel)
    FBFM40: true,   // 40 Scott & Burgan fuel models
    LANDFIRE: true, // 5 non-burnable fuel model codes added by LANDFIRE
    CUSTOM: true,   // any other group
    CROWN: true     // special case crown canopy fuel model used only by Rothermel's crown fire model
}

export class StandardFuelModelCatalog {
    constructor(config={}) {
        this.config = {...ConfigFuelModelCatalog, ...config}
        this.catalog = new Map()
        for(let model of StandardFuelModels) {
            if (this.config[model.group]) {
                this.catalog.set(model.number, model)
                this.catalog.set(model.code.toLowerCase(), model)
            }
        }
    }
    toKey(key) {
        return (typeof key === 'string') ? key.toLowerCase() : key
    }
    get(key) {
        return this.catalog.get(this.toKey(key)) 
    }
    has(key) {
        return this.catalog.has(this.toKey(key))
    }
    set(key, fuelModel) {
        return this.catalog.set(this.toKey(key), fuelModel)
    }
}
