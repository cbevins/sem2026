import { DataProvider } from '../DataProvider.js'
import { BurnMap } from '../BurnMap.js'

const _gap = {distance:0, angle:0, index:0}
const _scan = {size:0, cells:0, perimeter:0}
const _fire = {label: '', ignEast:0, ignNorth:0, lwr:10, headRos:250,
    bearing:80, elapsed:1, points:[], size:0, perimeter:0,
    gap: {..._gap}, scan: {..._scan}, color: 'yellow'}

const Fires = [
    {..._fire, label: '0', ignEast: -50, ignNorth: 10, lwr:10, headRos:150},
    {..._fire, label: '1a', ignEast: 50, ignNorth: 50, lwr:10, headRos:150},
    {..._fire, label: '1b', ignEast: 100, ignNorth: 20, lwr:10, headRos:150},
    {..._fire, label: '1c', ignEast: 150, ignNorth: 150, lwr:10, headRos:150},
    {..._fire, label: '1d', ignEast: 200, ignNorth: 200, lwr:10, headRos:150},
    {..._fire, label: '1e', ignEast: 250, ignNorth: 250, lwr:10, headRos:150},

    {..._fire, label: '2a', ignEast: 75, ignNorth: -75, lwr:10, headRos:150, color: 'blue'},
    {..._fire, label: '2b', ignEast: 120, ignNorth: -125, lwr:10, headRos:150, color: 'blue'},
    {..._fire, label: '2c', ignEast: 175, ignNorth: -175, lwr:10, headRos:150, color: 'blue'},
    {..._fire, label: '2d', ignEast: 225, ignNorth: -225, lwr:10, headRos:150, color: 'blue'},
    {..._fire, label: '2e', ignEast: 275, ignNorth: -275, lwr:10, headRos:150, color: 'blue'},
    
    {..._fire, label: '3a', ignEast: -50, ignNorth: 10, lwr:10, headRos:150, color: 'cyan'},
    {..._fire, label: '3b', ignEast: -120, ignNorth: -100, lwr:10, headRos:150, color: 'cyan'},
    {..._fire, label: '3c', ignEast: -175, ignNorth: -150, lwr:10, headRos:150, color: 'cyan'},
    {..._fire, label: '3d', ignEast: -225, ignNorth: -200, lwr:10, headRos:150, color: 'cyan'},
    {..._fire, label: '3e', ignEast: -275, ignNorth: -250, lwr:10, headRos:150, color: 'cyan'},
    
    {..._fire, label: '4a', ignEast: -50, ignNorth: 50, lwr:10, headRos:150, color: 'blue'},
    {..._fire, label: '4b', ignEast: -100, ignNorth: 100, lwr:10, headRos:150, color: 'blue'},
    {..._fire, label: '4c', ignEast: -150, ignNorth: 150, lwr:10, headRos:150, color: 'blue'},
    {..._fire, label: '4d', ignEast: -200, ignNorth: 200, lwr:10, headRos:150, color: 'blue'},
    {..._fire, label: '4e', ignEast: -250, ignNorth: 250, lwr:10, headRos:150, color: 'blue'},
]

export class RayCastDataProvider extends DataProvider {
    constructor() { super() }
    
    getBurnCode(col, row, date=null) {
        // if (this.inRect(col, row, 280, 220, 10, 10)) return BurnMap.unburnable
        // if (this.inRect(col, row, 120, 120, 10, 10)) return BurnMap.unburnable
        // if (this.inRect(col, row, 100, 350, 100, 10)) return BurnMap.unburnable
        // if (this.inRect(col, row, 350, 350, 10, 100)) return BurnMap.unburnable
        return BurnMap.burnable
    }
        
    getFires() {
        return Fires
    }

    initBurnMap(burnMap) {
        // Start with grass (featureCode 0) that is unburned (burnCode 0)
        burnMap.fillCodes(1, BurnMap.unburned)
        burnMap.setCodesRect(0, 0, 256, 256, 1, BurnMap.burnable)
        burnMap.setCodesRect(256, 0, 256, 256, 2, BurnMap.burnable)
        burnMap.setCodesRect(0, 256, 256, 256, 3, BurnMap.burnable)
        burnMap.setCodesRect(256, 256, 256, 256, 4, BurnMap.burnable)
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