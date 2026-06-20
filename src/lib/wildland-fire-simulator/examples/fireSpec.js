import { WfsFire } from '../Wfs.js'
import {Bp6Configs, Bp6FirePosition, Bp6FireTerrain, Bp6FireWeather,
    Bp6FuelCanopy, Bp6FuelCuring, Bp6FuelMoisture, 
    Bp6SlopeMap} from '../tests/Bp6Inputs.js'

const div = '\n-------------------------------------------------------------------\n'
console.clear()
console.log(div,'\n\n\nBasic Wildfire Simulator', new Date())

// Inputs
const inputs = {
    configs: {...Bp6Configs},
    fuelMoisture: {...Bp6FuelMoisture},
    fuelCuring: {...Bp6FuelCuring},
    fuelCanopy: {...Bp6FuelCanopy},
    fireWeather: {...Bp6FireWeather},
    fireTerrain: {...Bp6FireTerrain},
    firePosition: {...Bp6FirePosition},
    slopeMap: {...Bp6SlopeMap},
    fuelKey: 10,
    angleFromHead: 45,
}

const fire = new WfsFire()
const results = fire.run(inputs)
console.log(results)
