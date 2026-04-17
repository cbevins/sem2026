// Uses a FireEllipseMod to generate perimeter points at regular theta increments
export function getEllipsePerimeterAtThetas(fireEllipseMod, degStep) {
    const vector = fireEllipseMod.theta
    const pts = []
    for(let deg = 0; deg <= 360; deg += degStep) {
        vector.bearing.set(deg)
        fireEllipseMod.updateAll()
        pts.push([vector.perim.east.get(), vector.perim.north.get(), deg])
    }
    return pts
}