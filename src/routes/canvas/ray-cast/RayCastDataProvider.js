import { DataProvider } from '../DataProvider.js'
import { BurnMap } from '../BurnMap.js'

export class RayCastDataProvider extends DataProvider {
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