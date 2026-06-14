import { describe, it, expect } from 'vitest'
import { FuelModelProcessor } from '../src/FuelModelProcessor.js'
import { FuelBedProcessor } from '../src/FuelBedProcessor.js'

import { parts, ppb } from './assertions.js'
expect.extend({ parts })

// Inputs
const inputs = {
    saveProps: 2,
    curedHerb: 0.778,
}

const catalog = new FuelModelProcessor()

describe('FuelBedProcessor Class', () => {
    it('Fuel Model 10 FuelBed properties match BehavePlus v5 and v6 beta:', () => {
        const fuelModel = catalog.get({fuelKey: 10})
        const fuelBed = FuelBedProcessor.get({...fuelModel, ...inputs})
        
        expect(fuelBed.bulkDensity).parts(0.552, ppb)
        expect(fuelBed.depth).parts(1, ppb)
        expect(fuelBed.liveMextFactor).parts(6.908948234294801, ppb)
        expect(fuelBed.ovendryLoad).parts(0.552, ppb)
        expect(fuelBed.packingRatio).parts(0.01725, ppb)
        expect(fuelBed.packingRatioOpt).parts(0.0073478593798598172, ppb)
        expect(fuelBed.packingRatioFraction).parts(2.3476224990480286, ppb)
        expect(fuelBed.propagatingFluxRatio).parts(0.048317062998571636, ppb)
        expect(fuelBed.reactionVelocityExp).parts(0.35878365060452616, ppb)
        expect(fuelBed.reactionVelocityMax).parts(15.13331887756658, ppb)
        expect(fuelBed.reactionVelocityOpt).parts(12.674359628667819, ppb)
        expect(fuelBed.savr).parts(1764.3319812126388, ppb)
        expect(fuelBed.savr15).parts(74108.915800396862, ppb)
        expect(fuelBed.surfaceArea).parts(13.4665, ppb)

        expect(fuelBed.dead.fineFuelLoad).parts(0.15704963842638839, ppb)
        expect(fuelBed.dead.heat).parts(8000.0, ppb)
        expect(fuelBed.dead.mext).parts(0.25, ppb)
        expect(fuelBed.dead.mineralDamping).parts(0.41739692790939131, ppb)
        expect(fuelBed.dead.netLoad).parts((1 - 0.0555) *0.13859233668341708, ppb)
        expect(fuelBed.dead.ovendryLoad).parts(0.46, ppb)
        expect(fuelBed.dead.reactionIntensityDry).parts(5539.9575948899355, ppb)
        expect(fuelBed.dead.savr).parts(1888.8602386934672, ppb)
        expect(fuelBed.dead.surfaceArea).parts(9.154, ppb)

        expect(fuelBed.live.heat).parts(8000, ppb)
        expect(fuelBed.live.mineralDamping).parts(0.41739692790939131, ppb)
        expect(fuelBed.live.netLoad).parts((1 - 0.0555) * 0.092, ppb)
        expect(fuelBed.live.ovendryLoad).parts(0.092, ppb)
        expect(fuelBed.live.reactionIntensityDry).parts(3677.5200629895871, ppb)
        expect(fuelBed.live.savr).parts(1500, ppb)

        expect(fuelBed.midflameWindReduction).parts(0.36210426360602416, ppb)
    })
    
    it('Fuel Model 124 FuelBed properties match BehavePlus v5 and v6 beta:', () => {
        const fuelModel = catalog.get({fuelKey: 124})
        const fuelBed = FuelBedProcessor.get({...fuelModel, ...inputs})

        expect(fuelBed.surfaceArea).parts(29.062930440771346, ppb)
        expect(fuelBed.savr).parts(1631.1287341340956, ppb)
        expect(fuelBed.bulkDensity).parts(0.27985482530937067, ppb)

        expect(fuelBed.liveMextFactor).parts(2.1558023634049093, ppb)
        expect(fuelBed.packingRatio).parts(0.0087454632909178334, ppb)
        expect(fuelBed.packingRatioOpt).parts(0.0078357185983373434, ppb)
        expect(fuelBed.packingRatioFraction).parts(1.11610226696675, ppb)
        expect(fuelBed.propagatingFluxRatio).parts(0.035258653482453904, ppb)
        expect(fuelBed.reactionVelocityExp).parts( 0.38177694461561407, ppb)
        expect(fuelBed.reactionVelocityMax).parts(14.944549319976806, ppb)
        expect(fuelBed.reactionVelocityOpt).parts(14.908876941781589, ppb)

        expect(fuelBed.dead.mineralDamping).parts(0.41739692790939131, ppb)
        expect(fuelBed.dead.netLoad).parts((1 - 0.0555) * 0.20777819078484744, ppb)
        expect(fuelBed.dead.reactionIntensityDry).parts(9769.8093293148086, ppb)
        expect(fuelBed.dead.savr).parts(1682.0151742581315, ppb)
        expect(fuelBed.dead.surfaceArea).parts(11.030790863177224, ppb)

        expect(fuelBed.live.mineralDamping).parts(0.41739692790939131, ppb)
        expect(fuelBed.live.netLoad).parts((1 - 0.0555) * 0.36064279155188239, ppb)
        expect(fuelBed.live.reactionIntensityDry).parts(16957.560830348066, ppb)
        expect(fuelBed.live.savr).parts(1600, ppb)
    })
})
