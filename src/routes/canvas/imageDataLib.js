/**
 * Functions for manipulating Canvas imageData
 * All functions take an imageData reference, and not a canvas context
 */

// Returns index offset of [col, row] rgba of Canvas imageData.data
export function rindex(imageData, col, row) {return 4 * (col + row * imageData.width)}
export function gindex(imageData, col, row) {return 1 + 4 * (col + row * imageData.width)}
export function bindex(imageData, col, row) {return 2 + 4 * (col + row * imageData.width)}
export function aindex(imageData, col, row) {return 3 + 4 * (col + row * imageData.width)}

// The following return just the red, green, blue, or alpha value at [col,row]
export function getRed(imageData, col, row) {
    return imageData.data[rindex(imageData, col, row)]
}
export function getGreen(imageData, col, row) {
    return imageData.data[gindex(imageData, col, row)]
}
export function getBlue(imageData, col, row) {
    return imageData.data[bindex(imageData, col, row)]
}
export function getAlpha(imageData, col, row) {
    return imageData.data[aindex(imageData, col, row)]
}
export function getPixel(imageData, col, row) {
    const idx = rindex(imageData, col, row)
    const d = imageData.data
    return [d[idx], d[idx+1], d[idx+2], d[idx+3]]
}

export function rgbaNeighbors(imageData, col, row, radius=1) {
    const hood = []
    for(let r=row-radius; r<=row+radius; r++) {
        const rowPixels = []
        for(let c=col-radius; c<=col+radius; c++) {
            rowPixels.push(getPixel(imageData, col, row))
        }
        hood.push(rowPixels)
    }
    return hood
}

// The following set just the red, green, blue, or alpha value at [col,row]
export function setRed(imageData, col, row, value) {
    imageData.data[rindex(imageData, col, row)] = value
}
export function setGreen(imageData, col, row, value) {
    imageData.data[gindex(imageData, col, row)] = value
}
export function setBlue(imageData, col, row, value) {
    imageData.data[bindex(imageData, col, row)] = value
}
export function setAlpha(imageData, col, row, value) {
    imageData.data[aindex(imageData, col, row)] = value
}
export function setPixel(imageData, col, row, r=0, g=0, b=0, a=255) {
    const idx = rindex(imageData, col, row)
    imageData.data[idx] = r
    imageData.data[idx+1] = g
    imageData.data[idx+2] = b
    imageData.data[idx+3] = a
}
