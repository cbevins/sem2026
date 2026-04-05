/**
 * Functions for manipulating Canvas context
 * All functions take a canvas context reference, and not an imageData
 */


export function xmid(ctx) { return Math.trunc(ctx.canvas.width/2) }
export function ymid(ctx) { return Math.trunc(ctx.canvas.height/2) }

export function canvasX(ctx, easting) { return Math.round(easting) + xmid(ctx) }
export function canvasY(ctx, northing) { return ymid(ctx) - Math.round(northing) }

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


// Convenience function for drawing ellipse with a bearing
export function drawEllipse(ctx, cx, cy, rx, ry, bearing, start=0, end=2*Math.PI) {
    const rads = ((90 + bearing) % 360) * Math.PI / 180
    ctx.ellipse(cx, cy, rx, ry, rads, start, end)
}

export function drawFireEllipseScanLines(ctx, fireEllipseScanLines, style='red') {
    ctx.strokeStyle = style
    ctx.beginPath()
    for(let [y, x1, x2] of fireEllipseScanLines.lines) {
        const row = canvasY(ctx, y)
        const col1 = canvasX(ctx, x1) // convert from floating pt to raster
        const col2 = canvasX(ctx, x2)
        ctx.moveTo(col1, row)
        ctx.lineTo(col2, row)
    }
    ctx.stroke()
}

// 'data' is an array of [cmd, x, y] where cmd of 0  is MOVE, 1 is LINE
export function path(ctx, data) {
    for(let [cmd, x, y] of data) {
        if (cmd) ctx.lineTo(x, y)
        else ctx.moveTo(x, y)
    }
}

export function fillPath(ctx, style, data) {
    ctx.fillStyle = style
    ctx.beginPath()
    path(ctx, data)
    ctx.fill()
}

export function strokePath(ctx, style, data) {
    ctx.strokeStyle = style
    ctx.beginPath()
    path(ctx, data)
    ctx.stroke()
}
