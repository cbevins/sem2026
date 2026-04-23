import { canvasX, canvasY, xmid, ymid, strokePath } from '../canvasLib.js'

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

// 'points' is the array returned by getScanLinesPerimeter()
export function drawPerimeterPts(ctx, points, style='red') {
    ctx.strokeStyle = style
    ctx.beginPath()
    const r = 1
    for(let [east, north] of points) {
        ctx.arc(canvasX(ctx, east), canvasY(ctx, north), r,  0, 2 * Math.PI)
        ctx.arc(canvasX(ctx, east), canvasY(ctx, north), r, 0, 2 * Math.PI)
    }
    ctx.stroke()
}

// 'lines' is an array of horizontal or vertical ellipse scanlines
//  as returned by scanEllipse()
export function drawScanLines(ctx, lines, style='red') {
    ctx.strokeStyle = style
    ctx.beginPath()
    for(let [p1, p2] of lines) {
        ctx.moveTo(canvasX(ctx, p1[0]), canvasY(ctx, p1[1]))
        ctx.lineTo(canvasX(ctx, p2[0]), canvasY(ctx, p2[1]))
    }
    ctx.stroke()
}

// 'lines' is an array of horizontal or vertical ellipse scanlines
//  as returned by scanEllipse()
export function drawScanLineEndPoints(ctx, lines, style='red') {
    ctx.strokeStyle = style
    ctx.beginPath()
    const r = 1
    for(let [p1, p2] of lines) {
        ctx.arc(canvasX(ctx, p1[0]), canvasY(ctx, p1[1]), r,  0, 2 * Math.PI)
        ctx.arc(canvasX(ctx, p2[0]), canvasY(ctx, p2[1]), r, 0, 2 * Math.PI)
    }
    ctx.stroke()
}

