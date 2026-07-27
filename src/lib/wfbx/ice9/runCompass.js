const CompassDegrees = {
        n:   0, nne:  22.5, ne:  45, ene:  67.5, e:  90, ese: 112.5, se: 135, sse: 157.5,
        s: 180, ssw: 202.5, sw: 225, wsw: 247.5, w: 270, wnw: 292.5, nw: 315, nnw: 337.5}

function degreesToCompass(degrees) {
    const compass = [
        'n', 'nne', 'ne', 'ene', 'e', 'ese', 'se', 'sse',
        's', 'ssw', 'sw', 'wsw', 'w', 'wnw', 'nw', 'nnw']
    const idx = Math.trunc(((degrees + 11.25)%360) / 22.5)
    return compass[idx]
}

const results = []
for(let degrees=0; degrees<360; degrees+=5) {
    const compass = degreesToCompass(degrees)
    const point = CompassDegrees[compass]
    results.push({degrees, compass, point})
}
console.table(results)