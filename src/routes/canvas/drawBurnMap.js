import { BurnMap } from './BurnMap.js'

// Draws to imageData which MUST BE SAME DIMENSIONS as BurnMap
export function drawBurnMap(burnMap, palette, ctx) {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    const d = imageData.data
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
