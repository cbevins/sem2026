export const BehavePlusProps = {

    // WfsFuelCuring
    curedHerb: {
        owner: 'fuelCuring',
        key: 'curedHerb',
        label: 'Cured Herb Fraction',
        module: 'surface',
        type: 'fuelMoisture',
        values: [0],
    },

    // WfsFuelKeys
    fuelCover1: {
        owner: 'fuelKeys',
        key: 'fuelCover1',
        label: 'Primary Fuel Model Coverage Fraction',
        module: 'surface',
        type: 'fraction',
        values: [1],
    },
    fuelKey1: {
        owner: 'fuelKeys',
        key: 'fuelKey1',
        label: 'Primary Fuel Model Key',
        module: 'surface',
        type: 'fuelModelKey',
        output: false,
        values: [1],
    },
    fuelKey2: {
        owner: 'fuelKeys',
        key: 'fuelKey2',
        label: 'Secondary Fuel Model Key',
        module: 'surface',
        type: 'fuelModelKey',
        values: [1]},

    // WfsFuelMoisture
    moistureDead1h: {
        owner: 'fuelMoisture',
        key: 'moistureDead1h',
        label: 'Dead 1-h Fuel Particle Moisture Fraction',
        module: 'surface',
        type: 'fuelMoisture',
        values: [0.05],
    },
    moistureDead10h: {
        owner: 'fuelMoisture',
        key: 'moistureDead10h',
        label: 'Dead 10-h Fuel Particle Moisture Fraction',
        module: 'surface',
        type: 'fuelMoisture',
        values: [0.07],
    },
    moistureDead100h: {
        owner: 'fuelMoisture',
        key: 'moistureDead100h',
        label: 'Dead 100-hFuel Particle Moisture Fraction',
        module: 'surface',
        type: 'fuelMoisture',
        values: [0.09],
    },
    moistureLiveHerb: {
        owner: 'fuelMoisture',
        key: 'moistureLiveHerb',
        label: 'Live Herb Fuel Particle Moisture Fraction',
        module: 'surface',
        type: 'fuelMoisture',
        values: [0.5],
    },
    moistureLiveStem: {
        owner: 'fuelMoisture',
        key: 'moistureLiveStem',
        label: 'Live Stem Fuel Particle Moisture Fraction',
        module: 'surface',
        type: 'fuelMoisture',
        values: [1.5],
    },
    moistureDeadFuels: {
        owner: 'fuelMoisture',
        key: 'moistureDeadFuels',
        label: 'Dead Fuels Category Moisture Fraction',
        module: 'surface',
        type: 'fuelMoisture',
        values: [0.1],
    },
    moistureLiveFuels: {
        owner: 'fuelMoisture',
        key: 'moistureLiveFuels',
        label: 'Live Fuels Category Moisture Fraction',
        module: 'surface',
        type: 'fuelMoisture',
        values: [3],
    },
    moistureLiveCurable: {
        owner: 'fuelMoisture',
        key: 'moistureLiveCurable',
        label: 'Live Curable Fuel Moisture Fraction',
        module: 'surface',
        type: 'fuelMoisture',
        values: [3],
    },
    noWindSpreadRate: {
        owner: 'fuelIgnition',
        key: 'noWindSpreadRate',
        label: 'No-wind, No-slope Fire Spread Rate',
        module: 'surface',
        type: 'fireSpreadRate',
        values: [0],
    }
}

