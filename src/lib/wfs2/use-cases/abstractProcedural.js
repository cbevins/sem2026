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
    }
    getCuredHerb() { return 0.778 }
    getCuredCheatgrass() { return 0.5 }
    getFuelKey() { return 10 }
    getMoistureDead1h() { return 0.05 }
    getMoistureDead10h() { return 0.07 }
    getMoistureDead100h() { return 0.09 }
    getMoistureLiveHerb() { return 0.5 }
    getMoistureLiveStem() { return 1.5 }
    getMidflameWindSpeed() { return 880 }
    getWindBearing() { return 90 }
    getSlopeRatio() { return 0.25 }
    getAspect() { return 180 }
    getLimitWindFactor() { return true }
    getLimitSpreadRate() { return true }
    getElapsedTime() { return 60 }
    getIgnEast() { return 1000 }
    getIgnNorth() { return 2000 }
    getIgnX() { return 0 }
    getIgnY() { return 0 }
    getBetaFromHead() { return 45 }
    getAirTemp() { return 95 }
    getIncludeVectorFlameLength() { return true }

    runSurface() {
        let fuelKey = this.getFuelKey()
        this.fuelModelPod = Wfs.makeFuelModel(this.fuelCatalog, fuelKey, this.log)
        
        let curedHerb = this.getCuredHerb()
        let curedCheatgrass = this.getCuredCheatgrass()
        this.fuelCuringPod = Wfs.makeFuelCuring(curedHerb,
            [['curedCheatgrass', curedCheatgrass]])
        
        this.fuelBedPod = Wfs.makeFuelBed(this.fuelModelPod, this.fuelCuringPod,
            this.log, this.propsLevel)
            
        let moistureDead1h = this.getMoistureDead1h()
        let moistureDead10h = this.getMoistureDead10h()
        let moistureDead100h = this.getMoistureDead100h()
        let moistureLiveHerb = this.getMoistureLiveHerb()
        let moistureLiveStem = this.getMoistureLiveStem()
        this.fuelMoisturePod = Wfs.makeFuelMoisture(
            moistureDead1h, moistureDead10h, moistureDead100h,
            moistureLiveHerb, moistureLiveStem,
            [['cheatgrass', 0.05]])

        this.fuelIgnitionPod = Wfs.makeFuelIgnition(this.fuelBedPod, this.fuelMoisturePod,
            this.log, this.propsLevel)

        let midflameWindSpeed = this.getMidflameWindSpeed()
        let windBearing = this.getWindBearing()
        let slopeRatio = this.getSlopeRatio()
        let aspect = this.getAspect()
        let limitWindFactor = this.getLimitWindFactor()
        let limitSpreadRate = this.getLimitSpreadRate()

        this.fireBehaviorPod = Wfs.makeFireBehavior(this.fuelBedPod, this.fuelIgnitionPod,
            midflameWindSpeed, windBearing, slopeRatio, aspect,
            limitWindFactor, limitSpreadRate,
            this.log, this.propsLevel)

        this.fireEllipsePod = Wfs.makeFireEllipse(this.fireBehaviorPod,
            this.log, this.propsLevel)

        let elapsedTime = this.getElapsedTime()
        let ignEast = this.getIgnEast()
        let ignNorth = this.getIgnNorth()
        let ignX = this.getIgnX()
        let ignY = this.getIgnY()
        this.fireSizePod = Wfs.makeFireSize(this.fireEllipsePod,
            elapsedTime, ignEast, ignNorth, ignX, ignY,
            this.log, this.propsLevel)

        let betaFromHead = 0
        let includeFlameLength = this.getIncludeVectorFlameLength()
        this.headVector = Wfs.makeBetaVector(this.fireSizePod, betaFromHead, includeFlameLength)
        let airTemp = this.getAirTemp()
        this.headVector.scorchHeight = Wfs.getScorchHeight(this.headVector.firelineIntensity, 
            airTemp, midflameWindSpeed)
        console.log('Head Vector Pod:', this.headVector)
    }
}

const fire = new WfsAbstractProcedural()
fire.runSurface()