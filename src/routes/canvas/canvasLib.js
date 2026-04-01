// Convenience function for drawing ellipse with a bearing
export function drawEllipse(ctx, cx, cy, rx, ry, bearing, start=0, end=2*Math.PI) {
    const rads = ((90 + bearing) % 360) * Math.PI / 180
    ctx.ellipse(cx, cy, rx, ry, rads, start, end)
}

// Returns index offset of [col, row] rgba of Canvas imageData.data
export function rindex(imageData, col, row) {return 4 * (col + row * imageData.width)}
export function gindex(imageData, col, row) {return 1 + 4 * (col + row * imageData.width)}
export function bindex(imageData, col, row) {return 2 + 4 * (col + row * imageData.width)}
export function aindex(imageData, col, row) {return 3 + 4 * (col + row * imageData.width)}

// The following return just the red, green, blue, or alpha value at [col,row]
export function rByte(imageData, col, row) {
    return imageData.data[rindex(imageData, col, row)]
}
export function gByte(imageData, col, row) {
    return imageData.data[gindex(imageData, col, row)]
}
export function bByte(imageData, col, row) {
    return imageData.data[bindex(imageData, col, row)]
}
export function aByte(imageData, col, row) {
    return imageData.data[aindex(imageData, col, row)]
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

export function rgbaNeighbors(imageData, col, row, radius=1) {
    const data = imageData.data
    const hood = []
    for(let r=row-radius; r<=row+radius; r++) {
        const ar = []
        for(let c=col-radius; c<=col+radius; c++) {
            const idx = rindex(imageData, c, r)
            ar.push([data[idx],data[idx+1],data[idx+2],data[idx+3]])
        }
        hood.push(ar)
    }
    return hood
}
