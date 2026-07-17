export class FuelCuring {
    constructor(curedHerb=0) {
        this.curedHerb = curedHerb
        this.liveMoistureCurable = Math.max(0, Math.min(1,(1.333-curedHerb) / 1.11))
    }
    setCuredHerb(curedHerb) {
        this.curedHerb = curedHerb
        this.liveMoistureCurable = Math.max(0, Math.min(1,(1.333-curedHerb) / 1.11))
    }
    setLiveMoistureCurable(moisture) {
        this.liveMoistureCurable = moisture
        this.curedHerb = Math.max(0, Math.min(1, 1.333 - 1.11 * moisture))
    }
}