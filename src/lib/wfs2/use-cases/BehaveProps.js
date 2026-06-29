const always = 'always'

export const BehaveConfigs = {
    fireEllipseInput: {value: 'linked', options: ['input', 'linked']},
    fuelBedWsrfInput: {value: 'estimated', options: ['estimated', 'input']},
    fuelCuringInput: {value: 'estimated', options: ['estimated', 'input']},
    midflameWindSpeedInput: {value: 'estimated', options: ['estimated', 'input']},
    midflameWsrfInput: {value: 'estimated', options: ['estimated', 'input']},
    moistureDeadFuelInput: {value: 'particle', options: ['life', 'particle']},
    moistureLiveFuelInput: {value: 'particle', options: ['life', 'particle']},
    overstoryWsrfInput: {value: 'estimated', options: ['estimated', 'input']},
    slopeDirectionInput: {value: 'upslopeDirection', options: ['aspect', 'upslopeDirection',]},
    slopeSteepnessInput: {value: 'slopeDegrees', options: ['slopeDegrees', 'slopeMap', 'slopeRatio']},
    windDirectionInput: {value: 'windSource', options: ['windBearing', 'windSource']},
    windSpeedInput: {value: 'windSpeed10m', options: ['windSpeed20ft', 'windSpeed10m',]},
}

export const BehaveProps = {
    fuelKey1: { producers: [
        {method: 'input', args:[], when: always}
    ]},
    fuelModel: { producers: [
        {method: 'makeFuelModel', args: ['fuelKey1'], when: always}
    ]},

    // Fuel Curing
    curedHerb: { producers: [
        {method: 'input', args: [], when: 'fuelCuringInput=input'},
        {method: 'calcCuredHerb', args: ['moistureLiveHerb'], when: 'fuelCuringInput=estimated'},
    ]},
    curedCheatgrass: { producers: [
        {method: 'input', args: [], when: 'fuelCuringInput=input'},
        {method: 'calcCuredCheatgrass', args: ['moistureLiveHerb'], when: 'fuelCuringInput=estimated'},
    ]},
    fuelCuring: {producers: [
        {method: 'makeFuelCuring', args: ['curedHerb', 'curedCheatgrass'], when: always}
    ]},

    fuelBed: { producers: [
        {method: 'makeFuelBed', args: ['fuelModel', 'fuelCuring'], when: always}
    ]},

    // Fuel Moisture
    moistureDead1h: { producers: [
        {method: 'input', args: [], when: 'moistureDeadFuelInput=particle'},
        {method: 'calcMoistureDead1h', args: ['moistureDeadFuels'], when: 'moistureDeadFuelInput=life'},
    ]},
    moistureDead10h: { producers: [
        {method: 'input', args: [], when: 'moistureDeadFuelInput=particle'},
        {method: 'calcMoistureDead10h', args: ['moistureDeadFuels'], when: 'moistureDeadFuelInput=life'},
    ]},
    moistureDead100h: { producers: [
        {method: 'input', args: [], when: 'moistureDeadFuelInput=particle'},
        {method: 'calcMoistureDead100h', args: ['moistureDeadFuels'], when: 'moistureDeadFuelInput=life'},
    ]},
    moistureDeadDuff: { producers: [
        {method: 'input', args: [], when: 'moistureDeadFuelInput=particle'},
        {method: 'calcMoistureDeadDuff', args: ['moistureDeadFuels'], when: 'moistureDeadFuelInput=life'},
    ]},
    moistureDeadFuels: { producers: [
        {method: 'input', args: [], when: 'moistureDeadFuelInput=life'},
    ]},
    moistureLiveHerb: { producers: [
        {method: 'input', args: [], when: 'moistureLiveFuelInput=particle'},
        {method: 'calcMoistureLiveHerb', args: ['moistureLiveFuels'], when: 'moistureLiveFuelInput=life'},
    ]},
    moistureLiveStem: { producers: [
        {method: 'input', args: [], when: 'moistureLiveFuelInput=particle'},
        {method: 'calcMoistureLiveStem', args: ['moistureLiveFuels'], when: 'moistureLiveFuelInput=life'},
    ]},
    moistureLiveCheatgrass: { producers: [
        {method: 'input', args: [], when: 'moistureLiveFuelInput=particle'},
        {method: 'calcMoistureLiveCheatgrass', args: ['moistureLiveFuels'], when: 'moistureLiveFuelInput=life'},
    ]},
    moistureLiveFuels: { producers: [
        {method: 'input', args: [], when: 'moistureLiveFuelInput=life'},
    ]},
    fuelMoisture: { producers: [
        {method: 'makeFuelMoisture', args: [
            'moistureDead1h', 'moistureDead10h', 'moistureDead100h', 'moistureDeadDuff',
            'moistureLiveHerb', 'moistureLiveStem', 'moistureLiveCheatgrass'],
            when: always}
    ]},

    fuelIgnition: { producers: [
        {method: 'makeFuelIgnition', args: ['fuelBed', 'fuelMoisture'], when: always}
    ]},

    // Ambient wind
    windSpeed10m: { producers: [
        {method: 'input', args: [], when: 'windSpeedInput=windSpeed10m'},
        {method: 'calcWindSpeed10m', args: ['windSpeed20ft'], when: 'windSpeedInput=windSpeed20ft'}
    ]},

    windSpeed20ft: { producers: [
        {method: 'input', args: [], when: 'windSpeedInput=windSpeed20ft'},
        {method: 'calcWindSpeed20ft', args: ['windSpeed10m'], when: 'windSpeedInput=windSpeed10m'}
    ]},
    
    windBearing: { producers: [
        {method: 'input', args: [], when: 'windDirectionInput=windBearing'},
        {method: 'calcWindBearing', args: ['windSource'], when: 'windDirectionInput=windSource'}
    ]},
    
    windSource: { producers: [
        {method: 'input', args: [], when: 'windDirectionInput=windSource'},
        {method: 'calcWindSource', args: ['windBearing'], when: 'windDirectionInput=windBearing'}
    ]},

    // Slope and aspect
    slopeDegrees: { producers: [
        {method: 'input', args: [], when: 'slopeSteepnessInput=slopeDegrees'},
        {method: 'calcSlopeDegrees', args: ['slopeRatio'], when: 'slopeSteepnessInput=slopeRatio'},
        {method: 'calcSlopeDegrees', args: ['slopeRatio'], when: 'slopeSteepnessInput=slopeMap'},
    ]},
    slopeRatio: { producers: [
        {method: 'input', args: [], when: 'slopeSteepnessInput=slopeRatio'},
        {method: 'calcSlopeRatio', args: ['slopeDegrees'], when: 'slopeSteepnessInput=slopeDegrees'},
        {method: 'calcSlopeRatioMap', args: ['slopeMap'], when: 'slopeSteepnessInput=slopeMap'},
    ]},
    
    mapScale: { producers: [{method: 'input', args: [], when: always}]},
    mapContourInterval: { producers: [{method: 'input', args: [], when: always}]},
    mapContoursCrossed: { producers: [{method: 'input', args: [], when: always}]},
    mapDistance: { producers: [{method: 'input', args: [], when: always}]},
    slopeMap: { producers: [
        {method: 'makeSlopeMap', args: [
            'mapScale', 'mapContourInterval', 'mapContoursCrossed', 'mapDistance'], when: always}
    ]},

    aspect: { producers: [
        {method: 'input', args: [], when: 'slopeDirectionInput=aspect'},
        {method: 'calcAspect', args: ['upslopeDirection'], when: 'slopeDirectionInput=upslopeDirection'},
    ]},
    upslopeDirection: { producers: [
        {method: 'input', args: [], when: 'slopeDirectionInput=upslopeDirection'},
        {method: 'calcUpslopeDirection', args: ['aspect'], when: 'slopeDirectionInput=aspect'},
    ]},

    // Midflame wind speed
    midflameWindSpeed: { producers: [
        {method: 'input', args: [], when: 'midflameWindSpeedInput=input'},
        {method: 'calcMidflameWindSpeed',
            args: ['windSpeed20ft', 'midflameWsrf'],
            when: 'midflameWindSpeedInput=estimated'},
    ]},
    midflameWsrf: { producers: [
        {method: 'input', args: [], when: 'midflameWsrfInput=input'},
        {method: 'calcMidflameWsrf',
            args: ['fuelBedWsrf', 'overstoryWsrf'],
            when: 'midflameWsrfInput=estimated'},
    ]},
    fuelBedWsrf: { producers: [
        {method: 'input', args: [], when: 'fuelBedWsrfInput=input'},
        {method: 'calcFuelBedWsrf', args: ['fuelModel'], when: 'fuelBedWsrfInput=estimated'},
    ]},
    overstoryWsrf: { producers: [
        {method: 'input', args: [], when: 'overstoryWsrfInput=input'},
        {method: 'calcOverstoryWsrf', args: ['overstory'], when: 'overstoryWsrfInput=estimated'},
    ]},

    // Overstory
    overstoryHeight: { producers: [{method: 'input', args: [], when: always}]},
    overstoryBase: { producers: [{method: 'input', args: [], when: always}]},
    overstoryCover: { producers: [{method: 'input', args: [], when: always}]},
    overstory: { producers: [
        {method: 'makeOverstory',
            args: ['overstoryBase', 'overstoryHeight', 'overstoryCover'], when: always}
    ]},

    // Estimated fire behavior
    limitWindFactor: { producers: [{method: 'input', args: [], when: always}]},
    limitSpreadRate: { producers: [{method: 'input', args: [], when: always}]},
    fireBehavior: { producers: [
        {method: 'makeFireBehavior', args: ['fuelBed', 'fuelIgnition', 'midflameWindSpeed',
            'windBearing', 'slopeRatio', 'aspect', 'limitWindFactor', 'limitSpreadRate'],
            when: always},
    ]},

    // Observed fire behavior
    headSpreadRate: { producers: [
        {method: 'input', args: [], when: 'fireEllipseInput=input'},
        {method: 'link', args: ['fireBehavior','headingSpreadRate'], when: 'fireEllipseInput=linked'}
    ]},
    lengthWidthRatio: { producers: [
        {method: 'input', args: [], when: 'fireEllipseInput=input'},
        {method: 'link', args: ['fireBehavior','lengthWidthRatio'], when: 'fireEllipseInput=linked'}
    ]},
    headBearing: { producers: [
        {method: 'input', args: [], when: 'fireEllipseInput=input'},
        {method: 'link', args: ['fireBehavior','bearing'], when: 'fireEllipseInput=linked'}
    ]},
    headFlameLength: { producers: [
        {method: 'input', args: [], when: 'fireEllipseInput=input'},
        {method: 'link', args: ['fireBehavior','flameLength'], when: 'fireEllipseInput=linked'}
    ]},
    observedFireBehavior: { producers: [
        {method: 'makeObservedFireBehavior',
            args: ['headSpreadRate', 'headBearing', 'headFlameLength', 'lengthWidthRatio'], when: always},
    ]},

    // Fire ellipse
    fireEllipse: { producers: [
        {method: 'makeFireEllipse', args: ['fireBehavior'], when: 'fireEllipseInput=linked'},
        {method: 'makeFireEllipse', args: ['observedFireBehavior'], when: 'fireEllipseInput=input'},
    ]},
    elapsedTime: { producers: [{method: 'input', args: [], when: always}]},
    ignEast: { producers: [{method: 'input', args: [], when: always}]},
    ignNorth: { producers: [{method: 'input', args: [], when: always}]},
    ignX: { producers: [{method: 'fixed', args: [0], when: always}]},
    ignY: { producers: [{method: 'fixed', args: [0], when: always}]},
    fireSize: { producers: [
        {method: 'makeFireSize',
            args: ['fireEllipse', 'elapsedTime', 'ignEast', 'ignNorth', 'ignX', 'ignY'],
            when: always}
    ]},

    // Fire vectors
    headBeta: { producers: [{method: 'fixed', args: [0], when: always}]},
    headVector: { producers: [
        {method: 'makeBetaVector', args: ['fireSize', 'headBeta'], when: always},
    ]},
    backBeta: { producers: [{method: 'fixed', args: [0], when: always}]},
    backVector: { producers: [
        {method: 'makeBetaVector', args: ['fireSize', 'backBeta'], when: always},
    ]},

    betaFromHead: { producers: [{method: 'input', args: [], when: always}]},
    betaVector: { producers: [
        {method: 'makeBetaVector', args: ['fireSize', 'betaFromHead'], when: always},
    ]},
    beta6Vector: { producers: [
        {method: 'makeBeta6Vector', args: ['fireSize', 'betaFromHead'], when: always},
    ]},

    psiFromHead: { producers: [{method: 'input', args: [], when: always}]},
    psiVector: { producers: [
        {method: 'makePsiVector', args: ['fireSize', 'psiFromHead'], when: always},
    ]},
}
