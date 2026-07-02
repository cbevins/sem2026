export const WfsConfigs = {
    // the following must be initialized to 'active' or 'inactive'
    // but may be reasigned to 'linked'
    surfaceFireModule: 'active',
    surfaceSizeModule: 'active',
    surfaceVectorModule: 'active',
    activeCrownFireModule: 'active',

    fuelCuringInput: 'estimated',                // 'input' or 'estimated'
    midflameWindSpeedInput: 'estimated',    // 'input', 'estimated'
    midflameWsrfInput: 'estimated',         // 'input', 'estimated'
    moistureDeadFuelsInput: 'life',     // 'particle', 'life'
    moistureLiveFuelsInput: 'life',     // 'particle', 'life'
    slopeDirectionInput: 'upslope',          // 'aspect', 'upslope'
    slopeSteepnessInput: 'degrees',     // 'ratio', 'degrees', or 'map'
    windDirectionInput: 'source',          // 'bearing', 'source'
    windSpeedInput: '10m',                  // '20ft', '10m'
}

export class WfsStatus {
    constructor() {
        this.ignored = 'ignored'
        this.used = 'used'
        this.estimated = 'estimated'
        this.input = 'input'
        this.active = 'active'
        this.inactive = 'inactive'
        this.linked = 'linked'
    }
    getStatus(config) {
        const status = {
            // modules, both big and small
            canopyModule: this.ignored,

            fuelCatalogModule: this.ignored,
            fuelModelModule: this.ignored,
            fuelCuringModule: this.ignored,
            fuelBedModule: this.ignored,
            fuelIgnitionModule: this.ignored,
            fireBehaviorModule: this.ignored,
            midflameWindSpeedModule: this.ignored,
            midflameWsrfModule: this.ignored,
            fireEllipseModule: this.ignored,
            fireSizeModule: this.ignored,
            fireVectorModule: this.ignored,
            moistureLiveFuelModule: this.ignored,
            moistureDeadFuelModule: this.ignored,

            windSpeedModule: this.ignored,
            windDirectionModule: this.ignored,
            aspectModule: this.ignored,
            slopeModule: this.ignored,
            slopeMapModule: this.ignored,
            observedFireModule: this.ignored,

            // properties that may be used, estimated, and input
            canopyBase: this.ignored,
            canopyCover: this.ignored,
            canopyHeight: this.ignored,

            curedHerb: this.ignored,
            
            fuelKey: this.ignored,

            midflameWindSpeed: this.ignored,
            midflameWsrf: this.ignored,

            moistureDead1h: this.ignored,
            moistureDead10h: this.ignored,
            moistureDead100h: this.ignored,
            moistureDeadFuels: this.ignored,
            moistureLiveHerb: this.ignored,
            moistureLiveStem: this.ignored,
            moistureLiveFuels: this.ignored,

            aspect: this.ignored,
            upslope: this.ignored,

            headingSpreadRate: this.ignored,
            fireBearing: this.ignored,
            lengthWidthRatio: this.ignored,
            flameLength: this.ignored,
            
            slopeDegrees: this.ignored,
            slopeRatio: this.ignored,

            windSpeed10m: this.ignored,
            windSpeed20ft: this.ignored,

            windBearing: this.ignored,
            windSource: this.ignored,
            windCompass: this.ignored,

            // procesor
            curedHerbProcessor: this.ignored,
            windCompassProcessor: this.ignored,
            windSpeed10mProcessor: this.ignored,
            windSourceProcessor: this.ignored,
            slopeDegreesProcessor: this.ignored,
            aspectUpslopeProcessor: this.ignored,
            midflameWindSpeedProcessor: this.ignored,
            midflameWsrfProcessor: this.ignored,
        }

        //-----------------------------------------------------------------
        // 1 Resolve linkages between SURFACE, SIZE, VECTOR, CROWN, etc
        // 'active', 'inactive', and 'linked' status only applies
        // to modules that may be configured to run stand-alone
        //-----------------------------------------------------------------

        if (config.activeCrownFireModule === this.active) {
            if (config.surfaceFireModule === this.active) {
                config.activeCrownFireModule = this.linked
            }
        } 

        if (config.surfaceVectorModule === this.active
                && (config.surfaceSizeModule === this.active
                || config.surfaceFireModule === this.active)) {
            config.surfaceVectorModule = this.linked
        } else if (config.surfaceVectorModule === this.linked
            && config.surfaceSizeModule !== this.active) {
            config.surfaceVectorModule = this.active
        }

        if (config.surfaceSizeModule === this.active
            && config.surfaceFireModule === this.active) {
                config.surfaceSizeModule = this.linked
        } else if (config.surfaceSizeModule === this.linked
            && config.surfaceFireModule !== this.active) {
                config.surfaceSizeModule = this.active
        }

        //-----------------------------------------------------------------
        // 2 Determine required modules ('used' applies only to callable modules)
        //-----------------------------------------------------------------

        let cfg = config.surfaceVectorModule
        if (cfg === this.active || cfg === 'linked') {
            status.fireVectorModule = this.used
            status.fireEllipseModule = this.used
            status.fireSizeModule = this.used
        }

        cfg = config.surfaceSizeModule
        if (cfg === this.active || cfg === this.linked) {
            // May already be in use by VECTOR
            status.fireSizeModule = this.used
            status.fireEllipseModule = this.used
            if(cfg === this.linked) {
                status.surfaceFireModule = this.used
            } else {
                status.observedFireModule = this.used
            }
        }

        cfg = config.activeCrownFireModule
        if (cfg === this.active || cfg === this.linked) {
            status.windSpeedModule = this.used
            status.canopyModule = this.used
            if(cfg === this.linked)
                status.surfaceFireModule = this.used
        }

        // If SURFACE is selected OR in use by SIZE or CROWN links
        if (config.surfaceFireModule === this.active
            || status.surfaceFireModule === this.used) {
            status.fireBehaviorModule = this.used
        }

        //-----------------------------------------------------------
        // Determine edge property status
        if (status.fireSizeModule === this.used) {
            status.fireEllipseModule = this.used
        }
        if (status.observedFireModule === this.used) {
            status.headingSpreadRate = this.input
            status.fireBearing = this.input
            status.lengthWidthRatio = this.input
            status.flameLength = this.input
        }
        if (status.fireBehaviorModule === this.used) {
            status.fuelIgnitionModule = this.used
            status.windDirectionModule = this.used
            status.windSpeedModule = this.used
            status.midflameWindSpeedModule = this.used
            status.slopeModule = this.used
            status.aspectModule = this.used
            status.headingSpreadRate = this.estimated
            status.fireBearing = this.estimated
            status.lengthWidthRatio = this.estimated
            status.flameLength = this.estimated
        }
        if (status.fuelIgnitionModule === this.used) {
            status.fuelBedModule = this.used
            status.moistureLiveFuelModule = this.used
            status.moistureDeadFuelModule = this.used
        }
        if (status.fuelBedModule === this.used) {
            status.fuelModelModule = this.used
            status.fuelCuringModule = this.used
        }
        if (status.fuelModelModule === this.used) {
            status.fuelCatalogModule = this.used
            status.fuelKey = this.input
        }
        if (status.fuelCuringModule === this.used) {
            if (config.fuelCuringInput === this.input) {
                status.curedHerb = this.input
            } else {
                status.curedHerbProcessor = this.used
                status.moistureLiveFuelModule = this.used
                status.curedHerb = this.estimated
            }
        }
        if (status.moistureLiveFuelModule === this.used) {
            if (config.moistureLiveFuelsInput === 'particle') {
                status.moistureLiveHerb = this.input
                status.moistureLiveStem = this.input
            } else {
                status.moistureLiveHerb = this.estimated
                status.moistureLiveStem = this.estimated
                status.moistureLiveFuels= this.input
            }
        }
        if (status.moistureDeadFuelModule === this.used) {
            cfg = config.moistureDeadFuelsInput
            if (cfg === 'particle') {
                status.moistureDead1h = this.input
                status.moistureDead10h = this.input
                status.moistureDead100h = this.input
            } else if (cfg === 'life') {
                status.moistureDead1h = this.estimated
                status.moistureDead10h = this.estimated
                status.moistureDead100h = this.estimated
                status.moistureDeadFuels= this.input
            } else {
                throw new Error(`Invalid config.moistureDeadFuelsInput '${cfg}'.`)
            }
        }
        if (status.midflameWindSpeedModule == this.used) {
            if (config.midflameWindSpeedInput === this.input) {
                status.midflameWindSpeed = this.input
            } else {    // estimated
                status.midflameWindSpeed = this.estimated
                status.midflameWsrfModule = this.used
            }
        }
        if (status.midflameWsrfModule == this.used) {
            if (config.midflameWsrfInput === this.input) {
                status.midflameWsrf = this.input
            } else {    // estimated
                status.midflameWsrf = this.estimated
                status.windSpeedModule = this.used
                status.canopyModule = this.used
                status.fuelModelModule = this.used
            }
        }
        if (status.windSpeedModule === this.used) {
            if(config.windSpeedInput === '10m') {
                status.windSpeed10mProcessor = this.used
                status.windSpeed20ft = this.estimated
                status.windSpeed10m = this.input
            } else {
                status.windSpeed20ft = this.input
            }
        }
        if (status.windDirectionModule === this.used) {
            cfg = config.windDirectionInput
            if( cfg === 'source') {
                status.windSourceProcessor = this.used
                status.windSource = this.input
                status.windBearing = this.estimated
            } else if (cfg === 'compass') {
                status.windCompassProcessor = this.used
                status.windCompass = this.input
                status.windBearing = this.estimated
            } else {
                status.windBearing = this.input
            }
        }
        if (status.slopeModule === this.used) {
            cfg = config.slopeSteepnessInput
            if (cfg === 'degrees') {
                status.slopeDegreesProcessor = this.used
                status.slopeDegrees = this.input
                status.slopeRatio = this.estimated
            } else if (cfg === 'ratio') {
                status.slopeRatio = this.input
            } else if (cfg === 'map') {
                status.slopeMapModule = this.used
                status.slopeRatio = this.estimated
            } else {
                throw new Error(`Invalid config.slopeSteepnessInput '${cfg}'.`)
            }
        }
        if (status.aspectModule === this.used) {
            cfg = config.slopeDirectionInput
            if (cfg === 'aspect') {
                status.aspect = this.input
            } else if (cfg === 'upslope') {
                status.aspectUpslopeProcessor = this.used
                status.upslope = this.input
                status.aspect = this.estimated
            } else {
                throw new Error(`Invalid config.slopeDirectionInput '${cfg}'.`)
            }
        }
        if (status.canopyModule === this.used) {
            status.canopyHeight = this.input
            status.canopyBase = this.input
            status.canopyCover = this.input
        }
        if (status.slopeMapModule === this.used) {
            status.mapScale = this.input
            status.mapContourInterval = this.input
            status.mapContoursCrossed = this.input
            status.mapDistance = this.input
        }
        this.status = status
        this.getSequence(status)
        return status
    }

    #find(status, type) {
        const found = {}
        for(let [key, value] of Object.entries(status)) {
            if (value === type) found[key] = value
        }
        return found
    }
    
    // Returns input properties for 'status' as returned by getStatus()
    getInputs(status=this.status) {
        return this.#find(status, this.input) 
    }

    getProcessors(status=this.status) {
        const found = {}
        for(let [key, value] of Object.entries(status)) {
            if (key.includes('Processor'))
                found[key] = value
        }
        return found
    }

    getModules(status=this.status) {
        const found = {}
        for(let [key, value] of Object.entries(status)) {
            if (key.includes('Module'))
                found[key] = value
        }
        return found
    }

    getProperties(status=this.status) {
        const found = {}
        for(let [key, value] of Object.entries(status)) {
            if (!key.includes('Module') && !key.includes('Processor'))
                found[key] = value
        }
        return found
    }

    // 'set' is an assignment
    // 'calc' is a call to a library function
    // 'input' is a call to the input server
    getSequence(status=this.status) {
        const q = new Set()

        if (status.fuelCatalogModule === this.used) {
            q.add('set fuelCatalog makeFuelCatalog')
        }

        if (status.fuelCuringModule === this.used) {
            if(status.curedHerb === this.input) {
                q.add('get curedHerb')
            } else {
                if(status.moistureLiveFuelModule === this.used) {
                    if (status.moistureLiveFuels === this.input) {
                        q.add('get moistureLiveFuels')
                        q.add('set fuelMoisturePod.moistureLiveHerb moistureLiveHerb')
                        q.add('set fuelMoisturePod.moistureLiveStem moistureLiveStem')
                    } else {
                        q.add('get moistureLiveHerb')
                        q.add('set fuelMoisturePod.moistureLiveHerb moistureLiveHerb')
                    }
                    q.add('calc curedHerb curedHerbProcessor fuelMoisturePod')
                }
            }
            q.add('set fuelCuringPod.curedHerb curedHerb')
        }

        if (status.fuelModelModule === this.used) {
            q.add('get fuelKey')
            q.add('calc fuelModelPod makeFuelModelPod fuelKey')
        }

        if (status.fuelBedModule === this.used) {
            q.add('calc fuelBedPod makeFuelBedPod fuelModelPod fuelCuringPod')
        }

        if(status.moistureLiveFuelModule === this.used) {
            if (status.moistureLiveFuels === this.input) {
                q.add('get moistureLiveFuels')
                q.add('set fuelMoisturePod.moistureLiveHerb moistureLiveHerb')
                q.add('set fuelMoisturePod.moistureLiveStem moistureLiveStem')
            } else {
                q.add('get moistureLiveStem')
                q.add('set fuelMoisturePod.moistureLiveStem moistureLiveStem')
                q.add('get moistureLiveHerb')
                q.add('set fuelMoisturePod.moistureLiveHerb moistureLiveHerb')
            }
        }

        if (status.moistureDeadFuelModel === this.used) {
            if (status.moistureDeadFuels === this.input) {
                q.add('get moistureDeadFuels')
                q.add('set fuelMoisturePod.moistureDead100h moistureDead100h')
                q.add('set fuelMoisturePod.moistureDead10h moistureDead10h')
                q.add('set fuelMoisturePod.moistureDead1h moistureDead1h')
            } else {
                q.add('get moistureDead100h')
                q.add('set fuelMoisturePod.moistureDead100h moistureDead100h')
                q.add('get moistureDead10h')
                q.add('set fuelMoisturePod.moistureDead10h moistureDead10h')
                q.add('get moistureDead1h')
                q.add('set fuelMoisturePod.moistureDead1h moistureDead1h')
            }
        }

        if (status.fuelIgnitionModule === this.used) {
            q.add('calc fuelIgnitionPod makeFuelIgnitionPod fuelBedPod fuelMoisturePod')
        }

        if (status.slopeMapModule === this.used) {
            q.add('get mapScale')
            q.add('set slopeMapPod.mapScale mapScale')
            q.add('get mapContourInterval')
            q.add('set slopeMapPod.mapContourInterval mapContourInterval')
            q.add('get mapContoursCrossed')
            q.add('set slopeMapPod.mapContoursCrossed mapContoursCrossed')
            q.add('get mapDistance')
            q.add('set slopeMapPod.mapDistance mapDistance')
            q.add('calc slopeRatio slopeMapProcessor slopeMapPod')
            q.add('set windSlopePod.slopeRatio')
        }

        if (status.slopeModule === this.used) {
            if (status.slopeRatio === this.input) {
                q.add('get slopeRatio')
            } else if (status.slopeDegrees === this.input) {
                q.add('get slopeDegrees')
                q.add('calc slopeRatio slopeDegreesProcessor slopeDegrees')
            }
            q.add('set windSlopePod.slopeRatio slopeRatio')
        }

        if (status.aspectModule === this.used) {
            if (status.aspect === this.input) {
                q.add('get aspect')
            } else {
                q.add('get upslope')
                q.add('calc aspect aspectUpslopeProcessor upslope')
            }
            q.add('set windSlopePod.aspect aspect')

        }

        if (status.windDirectionModule === this.used) {
            if (status.windBearing === this.input) {
                q.add('get windBearing')
            } else if (status.windSource === this.input) {
                q.add('get windSource')
                q.add('calc windBearing windSourceProcessor windSource')
            } else if (status.windCompassProcessor === this.input) {
                q.add('get windCompass')
                q.add('calc windBearing windCompassProcessor windCompass')
            }
            q.add('set windSlopePod.windBearing windBearing')
        }

        if(status.windSpeedModule === this.used) {
            if (status.windSpeed20ft === this.input) {
                q.add('get windSpeed20ft')
            } else {
                q.add('get windSpeed10m')
                q.add('calc windSpeed20ft windSpeed10mProcessor windSpeed10m')
            }
            q.add('set windSlopePod.windSpeed20ft windSpeed20ft')
        }

        if (status.canopyModule === this.used) {
            q.add('get canopyHeight')
            q.add('set canopyPod.canopyHeight canopyHeight')
            q.add('get canopyBase')
            q.add('set canopyPod.canopyBase canopyBase')
            q.add('get canopyCover')
            q.add('set canopyPod.canopyCover canopyCover')
        }
        if (status.midflameWsrfModule === this.used) {
            if(status.midflameWsrf === this.input) {
                q.add('get midflameWsrf')
            } else {
                q.add('calc midflameWsrf midflameWsrfProcessor canopyPod fuelBedPod')
            }
            q.add('set windSlopePod.midflameWsrf midflameWsrf')
        }

        if (status.midflameWindSpeedModule === this.used) {
            if (status.midflameWindSpeed === this.input) {
                q.add('get midflameWindSpeed')
            } else {
                q.add('calc midflameWindSpeed midflameWindSpeedProcessor windSlopePod')
            }
            q.add('set windSlopePod.midflameWindSpeed midflameWindSpeed')
        }

        if(status.fireBehaviorModule === this.used) {
            q.add('calc fireBehaviorPod makeFireBehavior fuelBedPod fuelIgnitionPod windSlopePod')
        }
        this.queue = q
        return q
    }
    // Returns Javascript for the q
    getScript(queue=this.queue) {
        let script = []
        let loop = []
        let pad = ''
        for(let q of [...queue]) {
            const args = q.split(' ')
            const cmd = args.shift()
            const prop = args.shift()
            if (cmd === 'get') {
                loop.push(prop)
                script.push(`${pad}for (let ${prop} of getInput("${prop}") {`)
                pad = '    '.padStart(4*loop.length)
            } else if (cmd === 'set') {
                const from = args.shift()
                script.push(`${pad}${prop} = ${from}`)
            } else if (cmd === 'calc') {
                const method = args.shift()
                const parms = args.join(',')
                script.push(`${pad}${prop} = ${method}(${parms})`)
            } else throw new Error(`Unknown command '${q}'.`)
        }
        for(let i=loop.length-1; i>=0; i--) {
            pad = '    '.padStart(4*i)
            script.push(`${pad}} // End ${loop[i]}`)
        }
        return script
    }
}
