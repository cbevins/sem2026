import { FireEllipseMod } from '$lib/fire/ellipse/FireEllipseMod.js'
import { BurnMap } from './BurnMap.js'

export class DataProvider {
    constructor() {}

    getBurnMap(westEdge, northEdge, width, height, scale=1) {
        const burnMap = new BurnMap(westEdge, northEdge, width, height, scale)        
        this.initBurnMap(burnMap)
        return burnMap
    }

    inRect(x, y, x1, y1, width, height) {
        return (x>=x1 && y>=y1 && x<=x1+width && y<=y1+height)
    }

    // Map be re-implemented by derived classes
    initBurnMap(burnMap) {  return burnMap }

    getAspect(easting, northing, date=null) { return 0 }

    getBurnCode(easting, northing, date=null) { return 0 } // 0=unburned
    
    getFeatureCode(easting, northing, date=null) { return 0 }

    getFuelCuring(easting, northing, date=null) { return 0 }

    getFuelModel(easting, northing, date=null) { return 1 }

    getFuelMoistures(easting, northing, date=null) { return 0.1 }

    getSlopeRatio(easting, northing, date=null) { return 0 }

    getMaxSpreadDirection(easting, northing, date=null) { return 0 }

    getMidflameWindSpeed(easting, northing, date=null) { return 0 }

    getSpreadRate(easting, northing, bearing, date=null) { return 100 }

    getWindSpeed(easting, northing, date=null) { return 0 }

    getWindBearing(easting, northing, date=null) { return 0 }
}

export class RaycastDataProvider extends DataProvider {
    constructor() { super() }
    
    getBurnCode(col, row, date=null) {
        if (this.inRect(col, row, 280, 220, 10, 10)) return BurnMap.unburnable
        if (this.inRect(col, row, 120, 120, 10, 10)) return BurnMap.unburnable
        if (this.inRect(col, row, 100, 350, 100, 10)) return BurnMap.unburnable
        if (this.inRect(col, row, 350, 350, 10, 100)) return BurnMap.unburnable
        
        return 0
    }
        
    initBurnMap(burnMap) {
        // Start with grass (featureCode 0) that is unburned (burnCode 0)
        burnMap.fillCodes(1, BurnMap.unburned)
        
        // Add some water features
        burnMap.setCodesRect(280, 220, 10, 10, 0, BurnMap.unburnable)
        burnMap.setCodesRect(120, 120, 10, 10, 0, BurnMap.unburnable)
        burnMap.setCodesRect(100, 350, 100, 10, 0, BurnMap.unburnable)
        burnMap.setCodesRect(350, 350, 10, 100, 0, BurnMap.unburnable)
        // West-side '<''
        burnMap.setCodesLine(100, 256, 150, 206, 0, BurnMap.unburnable)
        burnMap.setCodesLine(100, 256, 150, 306, 0, BurnMap.unburnable)
        // East side '<'
        burnMap.setCodesLine(356, 256, 406, 206, 0, BurnMap.unburnable)
        burnMap.setCodesLine(356, 256, 406, 306, 0, BurnMap.unburnable)
        return burnMap
    }

}