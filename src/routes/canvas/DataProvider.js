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

    // getAspect(easting, northing, date=null) { return 0 }

    // getBurnCode(easting, northing, date=null) { return 0 } // 0=unburned
    
    // getFeatureCode(easting, northing, date=null) { return 0 }

    // getFuelCuring(easting, northing, date=null) { return 0 }

    // getFuelModel(easting, northing, date=null) { return 1 }

    // getFuelMoistures(easting, northing, date=null) { return 0.1 }

    // getSlopeRatio(easting, northing, date=null) { return 0 }

    // getMaxSpreadDirection(easting, northing, date=null) { return 0 }

    // getMidflameWindSpeed(easting, northing, date=null) { return 0 }

    // getSpreadRate(easting, northing, bearing, date=null) { return 100 }

    // getWindSpeed(easting, northing, date=null) { return 0 }

    // getWindBearing(easting, northing, date=null) { return 0 }
}
