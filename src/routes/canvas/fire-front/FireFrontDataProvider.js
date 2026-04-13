import { DataProvider } from '../DataProvider.js'
import { BurnMap } from '../BurnMap.js'

const _gap = {distance:0, angle:0, index:0}
const _scan = {size:0, cells:0, perimeter:0}
const _fire = {label: '', ignEast:0, ignNorth:0, lwr:10, headRos:250,
    bearing:80, elapsed:1, points:[], size:0, perimeter:0,
    gap: {..._gap}, scan: {..._scan}, color: 'yellow'}

// Fire behavior parameters used to create FireEllipseModels
const FireBehavior = [
    {..._fire, label: 'fixed', ignEast: -50, ignNorth: 50, lwr:2, headRos:25},
]

export class FireFrontDataProvider extends DataProvider {
    constructor() { super() }
    
    getBurnCode(col, row, date=null) {
        // if (this.inRect(col, row, 280, 220, 10, 10)) return BurnMap.unburnable
        // if (this.inRect(col, row, 120, 120, 10, 10)) return BurnMap.unburnable
        // if (this.inRect(col, row, 100, 350, 100, 10)) return BurnMap.unburnable
        // if (this.inRect(col, row, 350, 350, 10, 100)) return BurnMap.unburnable
        return BurnMap.burnable
    }

    getFire() { return {...FireBehavior[0]} }
    getFires() { return FireBehavior }

    initBurnMap(burnMap) {
        // Start with grass (featureCode 0) that is unburned (burnCode 0)
        burnMap.fillCodes(1, BurnMap.unburned)
        burnMap.setCodesRect(0, 0, 256, 256, 1, BurnMap.burnable)
        burnMap.setCodesRect(256, 0, 256, 256, 2, BurnMap.burnable)
        burnMap.setCodesRect(0, 256, 256, 256, 3, BurnMap.burnable)
        burnMap.setCodesRect(256, 256, 256, 256, 4, BurnMap.burnable)

        // Set an ignition point
        burnMap.setBurnCode(256, 256, BurnMap.burning)
        return
        
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