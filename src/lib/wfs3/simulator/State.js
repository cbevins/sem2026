import {
    CanopyStructure,
    FuelCuring,
    FuelMoisture,
    MidflameWindSpeed,
    MidflameWsrf,
    SlopeSteepness,
    SlopeMap,
    WindSpeed,
} from '../Wfs.js'

export class State {
    constructor() {
        this.canopyStructure = new CanopyStructure()
        this.fuelCuring = new FuelCuring()
        this.fuelMoisture = new FuelMoisture()
        this.midflameWindSpeed = new MidflameWindSpeed()
        this.midflameWsrf = new MidflameWsrf()
        this.slopeSteepness = new SlopeSteepness()
        this.slopeMap = new SlopeMap()
        this.windSpeed = new WindSpeed()
    }
}