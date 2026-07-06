import { fraction} from '../Wfs.js'

export class FuelCuring {
    constructor() {
        this.curingClasses = ['curedHerb', 'curedCheatgrass']
        this.curedHerb = 0
        this.curedCheatgrass = 0
    }
    addCuringClass(key) {
        this.curingClasses.push(key)
        this[key] = 0
    }
    updateFromMoistureLiveHerb(state) {
        const liveHerb = state.fuelMoisture.moistureLiveHerb
        this.curedHerb = fraction(1.333 - 1.11 * liveHerb)
        this.curedCheatGrass = fraction(2 * this.curedHerb)
    }
}