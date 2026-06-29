// In this abstract procedural example, ALL INPUTS are abstracted into server methods
// where they might call other server methods, depending upon configuration.
// For example, getMidflameWind() may call getWindAt20Ft() and getWindReductionFactor(),
// and the later may call getCanopyBaseHeight(), getCanopyHeight(), getCanopyCover(),
// makeFuelCanopy, getFuelBedDepth(), and calcMidflameReduction(), calcMidflameWind()
import * as Wfs from '../src/Wfs.js'

export class WfsAbstractProcedural {
    constructor() {
        this.propsLevel = 2
        this.fuelCatalog = Wfs.makeFuelCatalog()
        this.logger = Wfs.makeLogger()
        this.log = this.logger.log

        this.configs = {
            midflameWindSpeedInput: 'input',    // 'input', 'estimated'
        }
    }
    getInput(key, dfltValue) {
        return dfltValue
    }
    getCuredHerb() { return this.getInput('curedHerb', 0.778) }
    getCuredCheatgrass() { return this.getInput('curedCheatgrass', 0.5) }
    getFuelKey() { return this.getInput('fuelKey', 10) }
    getMoistureDead1h() { return this.getInput('moistureDead1h', 0.05) }
    getMoistureDead10h() { return this.getInput('moistureDead10h', 0.07) }
    getMoistureDead100h() { return this.getInput('moistureDead100h', 0.09) }
    getMoistureLiveHerb() { return this.getInput('moistureLiveHerb', 0.5) }
    getMoistureLiveStem() { return this.getInput('moistureLiveStem', 1.5) }
    getWindBearing() { return this.getInput('windBearing', 90) }
    getSlopeRatio() { return this.getInput('slopeRatio', 0.25) }
    getAspect() { return this.getInput('aspect', 180) }
    getLimitWindFactor() { return this.getInput('limitWindFactor', true) }
    getLimitSpreadRate() { return this.getInput('limitSpreadRate', true) }
    getElapsedTime() { return this.getInput('elapsedTime', 60) }
    getIgnEast() { return this.getInput('ignEast', 1000) }
    getIgnNorth() { return this.getInput('ignNorth', 2000) }
    getIgnX() { return this.getInput('ignX', 0) }
    getIgnY() { return this.getInput('ignY', 0) }
    getBetaFromHead() { return this.getInput('betaFromHead', 45) }
    getAirTemp() { return this.getInput('airTemp', 95) }
    getIncludeVectorFlameLength() { return this.getInput('includeVectorFlameLength', true) }

    getMidflameWindSpeed() {
        let cfg = this.configs.midflameWindSpeedInput
        if (cfg === 'input') {
            return this.getInput('midflameWindSpeed', 0)
        } else if (cfg === 'estimated') {
            const windSpeed20ft = this.getWindSpeed20ft()
            const windReductionFactor = this.getWindReductionFactor()
            return windSpeed20ft * windReductionFactor
        } else {throw new Error(`Invalid 'midflameWindSpeedInput' config '${cfg}'}`)}
    }

    getWindSpeed20ft() {
        let cfg = this.configs.windSpeedInput
        let windSpeed20ft = 0
        if (cfg === '20ft') {
            windSpeed20ft = this.getInput('windSpeed20ft', 0)
        } else if (cfg === '10m') {
            const windSpeed10m = this.getInput('windSpeed10m', 0)
            windSpeed20ft = windSpeed10m / 1.13
        } else {throw new Error(`Invalid 'windSpeedInput' config '${cfg}'}`)}
        return windSpeed20ft
    }

    runSurface() {
        let fuelKey = this.getFuelKey()
        this.fuelModelPod = Wfs.makeFuelModel(
            this.fuelCatalog,
            fuelKey,
            this.log)
        
        let curedHerb = this.getCuredHerb()
        let curedCheatgrass = this.getCuredCheatgrass()
        this.fuelCuringPod = Wfs.makeFuelCuring(
            curedHerb,
            [['curedCheatgrass', curedCheatgrass]])
        
        this.fuelBedPod = Wfs.makeFuelBed(
            this.fuelModelPod,
            this.fuelCuringPod,
            this.log, this.propsLevel)
            
        let moistureDead1h = this.getMoistureDead1h()
        let moistureDead10h = this.getMoistureDead10h()
        let moistureDead100h = this.getMoistureDead100h()
        let moistureLiveHerb = this.getMoistureLiveHerb()
        let moistureLiveStem = this.getMoistureLiveStem()
        this.fuelMoisturePod = Wfs.makeFuelMoisture(
            moistureDead1h,
            moistureDead10h,
            moistureDead100h,
            moistureLiveHerb,
            moistureLiveStem,
            [['cheatgrass', 0.05]])

        this.fuelIgnitionPod = Wfs.makeFuelIgnition(
            this.fuelBedPod,
            this.fuelMoisturePod,
            this.log, this.propsLevel)

        let midflameWindSpeed = this.getMidflameWindSpeed()
        let windBearing = this.getWindBearing()
        let slopeRatio = this.getSlopeRatio()
        let aspect = this.getAspect()
        let limitWindFactor = this.getLimitWindFactor()
        let limitSpreadRate = this.getLimitSpreadRate()

        this.fireBehaviorPod = Wfs.makeFireBehavior(
            this.fuelBedPod,
            this.fuelIgnitionPod,
            midflameWindSpeed,
            windBearing,
            slopeRatio,
            aspect,
            limitWindFactor,
            limitSpreadRate,
            this.log, this.propsLevel)

        this.fireEllipsePod = Wfs.makeFireEllipse(
            this.fireBehaviorPod,
            this.log, this.propsLevel)

        let elapsedTime = this.getElapsedTime()
        let ignEast = this.getIgnEast()
        let ignNorth = this.getIgnNorth()
        let ignX = this.getIgnX()
        let ignY = this.getIgnY()
        this.fireSizePod = Wfs.makeFireSize(
            this.fireEllipsePod,
            elapsedTime,
            ignEast, ignNorth,
            ignX, ignY,
            this.log, this.propsLevel)

        let betaFromHead = 0
        let includeFlameLength = this.getIncludeVectorFlameLength()
        this.headVector = Wfs.makeBetaVector(
            this.fireSizePod,
            betaFromHead,
            includeFlameLength)

        let airTemp = this.getAirTemp()
        this.headVector.scorchHeight = Wfs.getScorchHeight(
            this.headVector.firelineIntensity, 
            airTemp,
            midflameWindSpeed)
        console.log('Head Vector Pod:', this.headVector)
    }
}

const fire = new WfsAbstractProcedural()
fire.runSurface()