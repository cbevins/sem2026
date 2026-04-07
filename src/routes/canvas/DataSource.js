/**
 * This is a mock-up data source to provide base layer info on
 * fuels, topography, weather, and fire behavior.
 */
import { BurnMap } from './BurnMap.js'
import { FireEllipseMod } from '$lib/fire/ellipse/FireEllipseMod.js'

export const FeaturePalette = [
    {code: 0, label: 'grass', burnable: true,
        unburned: [0,255,0,255], burning: [255, 0, 0, 255], burned: [150, 75, 0, 255]},
    {code: 1, label: 'water', burnable: false,
        unburned: [0,0,255,255], burning: [0,0,255, 255], burned: [0,0,255,255]},
]

export class DataSource {
    constructor(width, height, featurePalette=FeaturePalette) {
        this.burnMap = new BurnMap(width, height)
        this.featurePalette = featurePalette
        this.initBurnMap()
    }

    // Draws to imageData which MUST BE SAME DIMENSIONS as BurnMap
    drawImageData(ctx) {
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
        const d = imageData.data
        const burnMap = this.burnMap
        for(let j=0; j<burnMap.data.length; j++) {
            const byte = burnMap.data[j]
            const burnCode = byte & 3; // 3 in binary is '00000011
            const featureCode = byte >> 2
            const i = 4*j
            d[i] = 0
            d[i+1] = 0
            d[i+2] = 0
            d[i+3] = 255
            if (burnCode === BurnMap.burning) d[i] = 255   // red
            else if (burnCode === BurnMap.unburned) d[i+1] = 255 // green
            else if (burnCode === BurnMap.unburnable) d[i+2] = 255   // blue
            else if (burnCode === BurnMap.burned) { // brown
                d[i] = 150
                d[i+1] = 75
            }
        }
        ctx.putImageData(imageData, 0, 0)
    }
    
    initBurnMap() {
        // Start with grass (featureCode 0) that is unburned (burnCode 0)
        this.burnMap.data.fill(BurnMap.unburned)
        
        // Add some water features
        this.burnMap.setBurnCodeRect(280, 220, 10, 10, BurnMap.unburnable)
        this.burnMap.setBurnCodeRect(120, 120, 10, 10, BurnMap.unburnable)
        this.burnMap.setBurnCodeRect(100, 350, 100, 10, BurnMap.unburnable)
        this.burnMap.setBurnCodeRect(350, 350, 10, 100, BurnMap.unburnable)
        // West-side '<''
        this.burnMap.setBurnCodeLine(100, 256, 150, 206, BurnMap.unburnable)
        this.burnMap.setBurnCodeLine(100, 256, 150, 306, BurnMap.unburnable)
        // East side '<'
        this.burnMap.setBurnCodeLine(356, 256, 406, 206, BurnMap.unburnable)
        this.burnMap.setBurnCodeLine(356, 256, 406, 306, BurnMap.unburnable)
    }
}
