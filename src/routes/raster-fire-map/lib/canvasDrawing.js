import { FireRaster } from './FireRaster.js'

// Returns canvas x coordinate (where left is at 0 and right is at 'width')
// and easting is at -width/2 at the left edge and at width/2 at the right edge.
export function canvasX(ctx, easting) {
    return Math.round(easting) + xmid(ctx)
}

// Returns canvas y coordinate (where top is at 0 and bottom is at 'height')
// and northing is at height/2 at top edge and at -height/2 at the bottom edge.
export function canvasY(ctx, northing) {
    return ymid(ctx) - Math.round(northing)
}

export function drawBackground(ctx, style='green') {
    ctx.fillStyle = style
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

export function drawCentralAxis(ctx, style='black') {
    const cx = xmid(ctx)
    const cy = ymid(ctx)
    const {height, width} = ctx.canvas
    strokePath(ctx, style, [[0,cx,0], [1,cx,height], [0,0,cy], [1,width,cy]])
}

export function drawFireRaster(ctx, fireRaster) {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    const d = imageData.data

    for(let i=0; i<fireRaster.data.length; i++) {
        const status = fireRaster.data[i]
        const j = i*4
        if (status === FireRaster.unburned) {      // unburned is green
            d[j+1] = 255
        }
        else if (status === FireRaster.ignited) {  // ignited is red
            d[j] = 255
        }
        else if (status === FireRaster.burned) {   // burned is brown
            d[j] = 150
            d[j+1] = 75
        }
        else if (status === 3) {                // unburnable is black
            d[j] = 0
            d[j+1] = 0
            d[j+2] = 0
        }
        else {                                  // anything else is white (error)
            d[j] = 255
            d[j+1] = 255
            d[j+2] = 255
        }
    }
    ctx.putImageData(imageData, 0, 0)
}

// 'perimeterOffsets' is an array of objects {col, row} offsets from the
// the ignition point as returned by getEllipsePerimeterCells()
export function drawFireletPerimeterCells(ctx, perimeterOffsets, style='red') {
    const cx = xmid(ctx)
    const cy = ymid(ctx)
    ctx.strokeStyle = style
    ctx.beginPath()
    let {col:col0, row:row0} = perimeterOffsets[0]
    ctx.moveTo(cx+col0, cy+row0)
    for(let {col, row} of perimeterOffsets) {
        ctx.lineTo(cx+col, cy+row)
    }
    ctx.lineTo(cx+col0, cy+row0)
    ctx.stroke()
}

export function fillPath(ctx, style, data) {
    ctx.fillStyle = style
    ctx.beginPath()
    trace(ctx, data)
    ctx.fill()
}

export function strokePath(ctx, style, data) {
    ctx.strokeStyle = style
    ctx.beginPath()
    trace(ctx, data)
    ctx.stroke()
}

// 'data' is an array of [cmd, x, y] where cmd=0 is 'MOVE' and cmd=1 is 'LINE'
export function trace(ctx, data) {
    for(let [cmd, x, y] of data) {
        if (cmd) ctx.lineTo(x, y)
        else ctx.moveTo(x, y)
    }
}

// Returns canvas central x pixel
export function xmid(ctx) {
    return Math.trunc(ctx.canvas.width/2)
}

// returns canvas central y pixel
export function ymid(ctx) {
    return Math.trunc(ctx.canvas.height/2)
}
