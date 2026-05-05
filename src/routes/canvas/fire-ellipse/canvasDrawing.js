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
    
// 'points' is an array of x and y offsets from the ignition point
// such as returned by getEllipseRasterPerimeterOffsets()
export function drawPerimeterCells(ctx, points, style='red') {
    const cx = xmid(ctx)
    const cy = ymid(ctx)
    ctx.strokeStyle = style
    ctx.beginPath()
    let [x0,y0] = points[0]
    ctx.moveTo(cx+x0, cy-y0)
    for(let [x, y] of points) {
        ctx.lineTo(cx+x, cy-y)
    }
    ctx.lineTo(cx+x0, cy-y0)
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
