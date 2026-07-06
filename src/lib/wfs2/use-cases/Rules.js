/*
    Each command corresponds to a state module (object)
    Each State object key is a 'module' object key
    Wherever 'self' appears at a 'module' or 'prop' location, the State.key is used

    - 'get module.prop'
        Sets module.prop = input.prop

    - 'get module.prop inputProp'
        Sets module.prop = input.inputProp

        Gets next input.prop and stoes it in module.prop
        If [inputProp] is provided, module.prop is set to input[prop]
        If module is 'self', then the module key is used.

    - 'use module'
        Processes the commands for the module and adds them to the stack
        Can only 'add' a module once.

    - 'call method [module]'
        - method is the invoked *method*
        - module is where the method's returned result is stored,
            if omitted, it i *self* module

    - 'set into from'
        Performs direct assignment without calling a processor function
        Used by fuelMoistureDead, fuelMoistureLive
*/
import { WfsConfigs } from './WfsConfigs.js'

export const Rules = {
    canopyFuel: [
        'use canopyStructure',
        'get self.canopyBulkDensity',
        'get self.canopyHeatContent',
        // determine canopyLoad, canopyHeatPerUnitArea
        'call updateCanopyFuel',
    ],
    canopyStructure: [
        'if canopyStructureInput heightBase',
            'get self.canopyHeight',
            'get self.canopyBase',
            'get self.canopyCover',
            // determine canopyLength, canopyRatio, canopyFill, canopySheltersFuel, canopyWsrf
            'call updateCanopyStructureFromHeightBase',
        'endif',
    ],
    crownFuelBed: [
        'call makeCrownFuelBed',
    ],
    crownFuelIgnition: [
        'use crownFuelBed',
        'use moistureLiveHerb',
        'use moistureLiveStem',
        'use moistureDead1h',
        'use moistureDead10h',
        'use moistureDead100h',
        'call makeFuelIgnition'
    ],
    crownFireBehavior: [
        'use type1FuelBed',
        'use type1FuelIgnition',
        'use windDirection',
        'use windSpeed',
        'call makeCrownFireBehavior',
    ],

    fuelKeys: [
        'get self.type1FuelKey',
        'if fuelModels two',
            'get self.type2FuelKey',
        'endif',
        'if fuelModels chaparral',
            'use chaparral',
        'endif',
    ],
    fuelCuring: [
        'if fuelCuringInput input',
            'get self.curedHerb',       // try 'get self.['fuelCuringClasses]'
            'get self.curedCheatgrass',
        'endif',
        'if fuelCuringInput estimated',
            'use moistureLiveHerb',
            'call updateCuredHerb',
            'call updateCuredCheatgrass',
        'endif',
    ],
    fuelMoisture: [
        // declaration here forces initiation; all properties are set by input
    ],
    midflameWindSpeed: [
        'if midflameWindSpeedInput input',
            'get self.self',
        'endif',
        'if midflameWindSpeedInput estimated',
            // get/set midflameWindSpeed.midflameWsrf
            'use midflameWsrf',
            // get/set windSpeed.windSpeed20ft
            'use windSpeed',
            // multiply them together
            'call updateMidflameWindSpeed',
        'endif',
    ],
    midflameWsrf: [
        'if midflameWsrfInput input',
            'get midflameWindSpeed.midflameWsrf',
        'endif',
        'if midflameWsrfInput estimated',
            // get/set canopyStructure.canopyMidflameWsrf
            'use canopyStructure',
            // get/set fuel1FuelBed.fuelMidflameWrsf
            'use fuel1FuelBed',
            // Use the minimum of the two
            'call updateMidflameWsrf',
        'endif',
    ],
    moistureDead1h: [
        'use fuelMoisture',
        'if moistureDeadFuelsInput particle',
            'get fuelMoisture.self',    // sets fuelMoisture.moistureDead1h = input.moistureDead1h
        'endif',
        'if moistureDeadFuelsInput category',
            'use moistureDeadCategory',
            'set fuelMoisture.self fuelMoisture.moistureDeadCategory',
        'endif',
    ],
    moistureDead10h: [
        'use fuelMoisture',
        'if moistureDeadFuelsInput particle',
            'get fuelMoisture.self',    // sets fuelMoisture.moistureDead1h = input.moistureDead1h
        'endif',
        'if moistureDeadFuelsInput category',
            'use moistureDeadCategory',
            'set fuelMoisture.self fuelMoisture.moistureDeadCategory',
        'endif',
    ],
    moistureDead100h: [
        'use fuelMoisture',
        'if moistureDeadFuelsInput particle',
            'get fuelMoisture.self',    // sets fuelMoisture.moistureDead1h = input.moistureDead1h
        'endif',
        'if moistureDeadFuelsInput category',
            'use moistureDeadCategory',
            'set fuelMoisture.self fuelMoisture.moistureDeadCategory',
        'endif',
    ],
    moistureDeadCategory: [
        'use fuelMoisture',
        'get fuelMoisture.self',    // sets fuelMoisture.moistureDeadCategory = input.moistureDeadCategory
    ],
    moistureLiveCategory: [
        'use fuelMoisture',
        'get fuelMoisture.self',    // sets fuelMoisture.moistureLiveCategory = input.moistureLiveCategory
    ],
    moistureLiveHerb: [
        'use fuelMoisture',
        'if moistureLiveFuelsInput particle',
            // set fuelMoisture.moistureLiveHerb = input.moistureLiveHerb
            'get fuelMoisture.moistureLiveHerb',
        'endif',
        'if moistureLiveFuelsInput category',
            'use moistureLiveCategory',
            'set fuelMoisture.self fuelMoisture.moistureLiveCategory',
        'endif',
    ],
    moistureLiveStem: [
        'use fuelMoisture',
        'if moistureLiveFuelsInput particle',
            // set fuelMoisture.moistureLiveStem = input.moistureLiveStem
            'get fuelMoisture.self',
        'endif',
        'if moistureLiveFuelsInput category',
            'use moistureLiveCategory',
            'set fuelMoisture.self fuelMoisture.moistureLiveCategory',
        'endif',
    ],
    slopeDirection: [
        'if slopeDirectionInput slopeDegrees',
            'get self.slopeDegrees',
            'call updateSlopeDirectionFromDegrees',
        'endif',
        'if slopeDirectionInput slopeMap',
            'use slopeMap',
            'set self.slopeRatio slopeMap.slopeRatio',
            'set self.slopeDegrees slopeMap.slopeDegrees',
        'endif',
        'if slopeDirectionInput slopeRatio',
            'get self.slopeRatio',
            'call updateSlopeDirectionFromRatio',
        'endif',
    ],
    slopeMap: [
        'get self.mapScale',
        'get self.mapContourInterval',
        'get self.mapContoursCrossed',
        'get self.mapMapDistance',
        'call updateSlopeMap',      // sets slopeMap.slopeRatio
    ],
    type1FuelModel: [
        'use fuelKeys',
        'call makeFuelModel',
    ],
    type1FuelBed: [
        'use type1FuelModel',
        'use fuelCuring',
        'call makeFuelBed',
    ],
    type1FuelIgnition: [
        'use type1FuelBed',
        'use moistureLiveHerb',
        'use moistureLiveStem',
        'use moistureDead1h',
        'use moistureDead10h',
        'use moistureDead100h',
        'call makeFuelIgnition'
    ],
    type1FireBehavior: [
        'use type1FuelBed',
        'use type1FuelIgnition',
        'use slopeDirection',
        'use windDirection',
        'use slopeSteepness',
        'use midflameWindSpeed',
        'call makeFirebehavior',
    ],
    type2FuelModel: [
        'use fuelKeys',
        'call makeFuelModel',
    ],
    type2FuelBed: [
        'use type2FuelModel',
        'use fuelCuring',
        'call makeFuelBed',
    ],
    type2FuelIgnition: [
        'use type2FuelBed',
        'use moistureLiveHerb',
        'use moistureLiveStem',
        'use moistureDead1h',
        'use moistureDead10h',
        'use moistureDead100h',
        'call makeFuelIgnition'
    ],
    type2FireBehavior: [
        'use type1FuelBed',
        'use type1FuelIgnition',
        'use slopeDirection',
        'use windDirection',
        'use slopeSteepness',
        'use midflameWindSpeed',
        'call makeFirebehavior',
    ],
    surfaceFireBehavior: [
        'use type1FireBehavior',
        'if fuelModelInput one',
            'set surfaceFireBehavior type1FireBehavior',
        'endif',
        'if fuelModelInput two',
            'use weightedFireBehavior',
            'set surfaceFireBehavior weightedFireBehavior',
        'endif',
    ],
    weightedFireBehavior: [
        'get fuelKeys.type1FuelCover',
        'use type2FireBehavior',
        'call makeWeightedFireBehavior',
    ]
}

function resolve(config, rules, module) {
    const lines = rules[module]
    let blockStack = [true]
    let blockIdx = 0
    for(let i=0; i<lines.length; i++) {
        const words = lines[i].split(' ')
        const cmd = words[0]
        if (cmd === 'if') {
            const [,cfgKey,cfgVal] = words
            const current = (config[cfgKey] === cfgVal)
            blockStack.push(current)
            blockIdx++
        } else if (cmd === 'endif') {
            blockStack.pop()
            blockIdx--
        } else if (cmd === 'call' && blockStack[blockIdx]) {
            const[, method, storeProp='self'] = words
        } else if (cmd === 'get' && blockStack[blockIdx]) {
            const [, module, prop='self', inputProp=''] = words

        } else if (cmd === 'set' && blockStack[blockIdx]) {
        } else if (cmd === 'use' && blockStack[blockIdx]) {
        }
    }
}

resolve(WfsConfigs, Rules, 'surfaceFireBehavior')
