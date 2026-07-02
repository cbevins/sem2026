export const WfsConfigs = {
    surfaceFireModule: 'active',
    surfaceSizeModule: 'active',
    surfaceVectorModule: 'active',
    surfaceActiveCrownFireModule: 'active',
    // stand-alone size module
    sizeModule: 'inactive',
    sizeVectorModule: 'inactive',
    // stand-alone active crown fire
    activeCrownModule: 'inactive',
    // input pre-processors
    fuelCuringInput: 'input',                // 'input' or 'estimated'
    midflameWindSpeedInput: 'estimated',    // 'input', 'estimated'
    midflameWsrfInput: 'estimated',         // 'input', 'estimated'
    moistureDeadFuelsInput: 'life',     // 'particle', 'life'
    moistureLiveFuelsInput: 'life',     // 'particle', 'life'
    slopeDirectionInput: 'upslope',          // 'aspect', 'upslope'
    slopeSteepnessInput: 'degrees',     // 'ratio', 'degrees', or 'map'
    windDirectionInput: 'source',          // 'bearing', 'source'
    windSpeedInput: '10m',                  // '20ft', '10m'
}

export const WfsDependencies = {
    canopyObj: [
        'get canopyHeight',             // sets state.canopyObj.canopyHeight
        'get canopyBase',               // sets state.canopyObj.canopyBase
        'get canopyCover',              // sets state.canopyObj.Cover
        'call canopyProcessor'],        // sets state.canopyObj.fill, ratio, etc
    fireBehaviorObj1: [
        'use fuelIgnitionObj1',
        'use slopeDirectionObj',
        'use windDirectionObj',
        'use slopeSteepnessObj',
        'use midflameWindSpeedObj',
        'call fireBehaviorProcessor'],  // sets state.fireBehaviorObj1
    fuelBedObj1: [
        'use fuelModelObj1',
        'use fuelCuringObj',
        'call fuelBedProcessor'],       // sets state.fuelbedobj1
    fuelCatalogObj: [
        'call fuelCatalogProcessor'],   // sets state.fuelCatalogObj
    fuelCuringObj: [
        'cfg fuelCuringInput input fuelCuringInput',
        'cfg fuelCuringInput estimated fuelCuringEstimated'],
    fuelCuringEstimated: [
        'use moistureLiveFuelObj',
        'call fuelCuringProcessor'],    // sets state.curedHerb
    fuelCuringInput: [
        'get curedHerb',],              // sets state.fuelCuringObj.curedHerb
    fuelIgnitionObj1: [
        'use fuelBedObj1',
        'use moistureLiveFuelObj',
        'use moistureDeadFuelObj',
        'call fuelIgnitionProcessor'],  // sets state.fuelIgnitionObj1
    fuelKey1: [
        'get fuelKey1'],                // sets state.fuelKey1
    fuelModelObj1: [
        'use fuelCatalogObj',
        'use fuelKey1',
        'call fuelModelProcesor'],      // sets state.fuelModelObj1
    midflameWindSpeedObj: [
        'cfg midflameWindSpeedInput input midflameWindSpeedInput',
        'cfg midflameWindSpeedInput estimated midflameWindSpeedEstimated'],
    midflameWindSpeedInput: [
        'get midflameWindSpeed'],       // sets state.midflameWindSpeedObj.midflameWindSpeed
    midflameWindSpeedEstimated: [
        'use midflameWsrf',
        'call midflameWindSpeedProcessor'], // sets state.midflameWindSpeedObj.midflameWindSpeed
    midflameWsrf: [
        'cfg midflameWsrfInput input midflameWsrfInput',
        'cfg midflameWsrfInput estimated midflameWsrfEstimated'],
    midflameWsrfInput: [
        'get midflameWsrf'],            // sets state.midflameWindSpeedObj.midflameWsrf
    midflameWsrfEstimated: [
        'use canopyObj',
        'use fuelBedObj1',
        'call midflameWsrfProcessor'],  // sets state.midflameWindSpeedObj.midflameWsrf
    moistureDeadFuelObj: [
        'cfg moistureDeadFuelsInput particle moistureDeadFuelsParticle',
        'cfg moistureDeadFuelsInput life moistureDeadFuelsLife'],
    moistureDeadFuelsLife: [
        'get moistureDeadFuels',        // sets state.moistureDeadFuelObj.moistureDeadFuels
        'call moistureDeadFuelsProcessor'],  // sets state.moistureDeadFuelObj.moistureDeadFuel1h, etc
    moistureDeadFuelsParticle: [
        'get moistureDead100h',         // sets state.moistureDeadFuelObj.moistureDeadFuel100h, etc
        'get moistureDead10h',          // sets state.moistureDeadFuelObj.moistureDeadFuel10h, etc
        'get moistureDead1h'],          // sets state.moistureDeadFuelObj.moistureDeadFuel1h, etc
    moistureLiveFuelObj: [
        'cfg moistureLiveFuelsInput particle moistureLiveFuelsParticle',
        'cfg moistureLiveFuelsInput life moistureLiveFuelsLife'],
    moistureLiveFuelsLife: [
        'get moistureLiveFuels',        // sets state.moistureLiveFuelObj.moistureLiveFuels
        'call moistureLiveFuelsProcessor'],  // sets state.moistureLiveFuelObj.moistureLiveHerb, etc
    moistureLiveFuelsParticle: [
        'get moistureLiveStem',         // sets state.moistureLiveFuelObj.moistureLiveStem
        'get moistureLiveHerb'],        // sets state.moistureLiveFuelObj.moistureLiveHerb
    slopeDirectionObj: [
        'cfg slopeDirectionInput aspect slopeDirectionAspect',
        'cfg slopeDirectionInput upslope slopeDirectionUpslope'],
    slopeDirectionAspect: [
        'get aspect',                   // sets state.slopeDirectionObj.aspect
        'call aspectProcessor'],        // sets state.slopeDirectionObj.upslope
    slopeDirectionUpslope: [
        'get upslope',                  // sets state.slopeDirectionObj.upslope
        'call upslopeProcessor'],       // sets state.slopeDirectionObj.aspect
    slopeSteepnessObj: [
        'cfg slopeSteepnessInput ratio slopeSteepnessRatio',
        'cfg slopeSteepnessInput degrees slopeSteepnessDegrees',
        'cfg slopeSteepnessInput map slopeMap'],
    slopeSteepnessDegrees: [
        'get slopeDegrees',             // sets state.slopeSteepnessObj.slopeDegrees
        'call slopeDegreesProcessor'],  // sets state.slopeSteepnessObj.slopeRatio
    slopeMap: [
        'get mapScale',                 // sets state.slopeMapObj.mapScale
        'get mapContourInterval',
        'get mapContoursCrossed',
        'get mapDistance',
        'call slopeMapProcessor'],      // sets state.slopeSteepnessObj.slopeRatio, slopeDegrees
    slopeSteepnessRatio: [
        'get slopeRatio',               // sets state.slopeSteepnessObj.slopeRatio
        'call slopeRatioProcessor'],    // sets state.slopeSteepnessObj.slopeDegrees
    windDirectionObj: [
        'cfg windDirectionInput bearingDegrees windDirectionBearingDegrees',
        'cfg windDirectionInput bearingCompass windDirectionBearingCompass',
        'cfg windDirectionInput sourceCompass windDirectionSourceCompass',
        'cfg windDirectionInput sourceDegrees windDirectionSourceDegrees'],
    windDirectionBearingCompass: [],
    windDirectionBearingDegrees: [
        'get windBearing',              // sets state.windDirectionObj.windBearing
        'call windBearingProcessor'],   // sets state.windDirectionObj.windSource
    windDirectionSourceCompass: [],
    windDirectionSourceDegrees: [
        'get windSource',               // sets state.windDirectionObj.windSource
        'call windSourceProcessor'],    // sets state.windDirectionObj.windBearing
    windSpeedObj: [
        'cfg windSpeedInput 20ft windSpeed20ft',
        'cfg windSpeedInput 10m windSpeed10m'],
    windSpeed10m: [
        'get windSpeed10m',             // sets state.windSpeedObj.windSpeed10m
        'call windSpeed10mProcessor'],  // sets state.windSpeedObj.windSpeed20ft
    windSpeed20ft: [
        'get windSpeed20ft',            // sets state.windSpeedObj.windSpeed20ft
        'call windSpeed20ftProcessor'], // sets state.windSpeedObj.windSpeed10m
}

export class WfsBuilder {
    constructor(wfsDependencies, wfsConfigs) {
        this.deps = wfsDependencies
        this.configs = wfsConfigs
        this.validate()
        if (this.messages.length)
            console.log('VALIDATION ERROR:', this.messages)
    }
    validate() {
        this.messages = []
        this.allGetSet = new Set()
        this.allMethodSet = new Set()
        this.useSet = new Set()
        for(let [key, actions] of Object.entries(this.deps)) {
            for(let action of actions) {
                const args = action.split(' ')
                const cmd = args[0]
                if (cmd === 'get') {
                    const prop = args[1]
                    // The 'get' prop does not need a dependency entry
                    this.allGetSet.add(prop)
                } else if (cmd === 'use') {
                    const prop = args[1]
                    if (! Object.hasOwn(this.deps, prop))
                        this.messages.push(`Key '${key}' action '${action}' has invalid reference '${prop}'.`)
                    this.useSet.add(prop)
                    
                } else if (cmd === 'cfg') {
                    const [, cfgKey, , prop] = args
                    if (! Object.hasOwn(this.configs, cfgKey))
                        this.messages.push(`Config '${cfgKey}' is not in the passed wfsCOnfigs object.`)
                    if (! Object.hasOwn(this.deps, prop))
                        this.messages.push(`Key '${key}' action '${action}' has invalid reference '${prop}'.`)
                } else if (cmd === 'call') {
                    const method = args[1]
                    this.allMethodSet.add(method)
                } else throw new Error(`Key ${key} has unknown action command ${cmd}`)
            }
        }
    }

    // Returns Set() with only 'get' and 'call' instructions
    buildQueue(startKeys) {
        this.q = new Set()
        this.activeGetSet = new Set()
        this.activeMethodSet = new Set()
        this.log = []
        for(let key of startKeys)
            this.build(key)
    }

    build(key, depth=0) {
        let pad = ''.padStart(4*depth)
        this.log.push(`${pad}${key}`)
        pad += '    '
        const actions = this.deps[key]
        for(let action of actions) {
            const args = action.split(' ')
            let cmd = args[0]
            if (cmd === 'call') {
                const method = args[1]
                this.log.push(`${pad}calls ${method}`)
                this.q.add(action)
                this.activeMethodSet.add(method)
            } else if (cmd === 'cfg') {
                const [, cfgKey, cfgVal, prop] = args
                if (this.configs[cfgKey] === cfgVal) {
                    this.log.push(`${pad}${cfgKey} = ${cfgVal}`)
                    this.build(prop, depth+1)
                }
            } else if (cmd === 'get') {
                this.log.push(`${pad}${action}`)
                this.q.add(action)
                this.activeGetSet.add(args[1])
            } else if (cmd === 'use') {
                const prop = args[1]
                this.log.push(`${pad}uses ${prop}`)
                this.build(prop, depth+1)
            }
        }
    }
    buildStack(q=this.q) {
        const stack = []
        const getMap = new Map() // get subject -> stack index
        const getStack = []
        for(let action of [...q]) {
            console.log(action)
            const [cmd, key] = action.split(' ')
            stack.push([cmd, key])
            if (cmd === 'get') {
                getMap.set(key, stack.length-1)
                getStack.push(key)
            }
        }
        // Add looping
        getStack.reverse()
        for(let key of getStack) {
            stack.push(['next', key, getMap.get(key)])
        }
        this.stack = stack
        return stack
    }
}

function sortedTable(title, status) {
    const obj = {}
    const keys = Object.keys(status).sort()
    for(let key of keys)
        obj[key] = status[key]
    console.log(`${title} (${keys.length}):`)
    console.table(obj)
}

console.log(new Date())
const wfs = new WfsBuilder(WfsDependencies, WfsConfigs)
wfs.buildQueue(['fireBehaviorObj1'])
// sortedTable('ALL PROCESSORS:', [...wfs.allMethodSet])
// sortedTable('ALL INPUTS:', [...wfs.allGetSet])
// sortedTable('DEPENDENCY TRACE:', wfs.log)
// sortedTable('PROCESS QUEUE:', [...wfs.q])
// sortedTable('ACTIVE PROCESSORS:', [...wfs.activeMethodSet])
// sortedTable('ACTIVE INPUTS:', [...wfs.activeGetSet])
wfs.buildStack()
sortedTable('COMMAND STACK:', wfs.stack)
