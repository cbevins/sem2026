export function makeFireSize(inputs={}) {
    const {fireShape, elapsedTime, ignitionPoint} = inputs
    const {ignX=0, ignY=0, ignEast=0, ignNorth=0} = ignitionPoint

    // Distance between the *ignition point* and the fire head
    const headingDistance = fireShape.headingSpreadRate * elapsedTime
    
    // Distance between the *ignition point* and the fire back
    const backingDistance = fireShape.backingSpreadRate * elapsedTime

    // Major semi-axis length (ft) [aka 'rx']
    const fDistance = fireShape.fSpreadRate * elapsedTime

    // Distance (ft) between ignition and center points
    const gDistance = fireShape.gSpreadRate * elapsedTime

    // Minor semi-axis length (ft) [aka 'ry']
    const hDistance = fireShape.hSpreadRate * elapsedTime

    // Latus rectum semi-chord length (ft)
    const latusRectumDistance = fireShape.latusRectumSpreadRate * elapsedTime

    // Total ellipse length (ft)
    const length = fireShape.majorExpansionRate * elapsedTime

    // Total ellipse width (ft)
    const width = fireShape.minorExpansionRate * elapsedTime
    
    // Ellipse area (ft2)
    const area = (Math.PI * length * width) / 4

    // Ellipse perimeter length (ft) using Ramanujan's approximation.
    const a = fDistance, b = hDistance
    const h = (a - b)**2 / (a + b)**2
    const perimeter = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))

    // Cannot use getBetaFireVector() for center point position, so do it manually here
    const centerX = ignX + gDistance * fireShape.rotationCos
    const centerY = ignY + gDistance * fireShape.rotationSin
    const centerE = centerX + ignEast - ignX
    const centerN = centerY + ignNorth - ignY

    let pod = {
        bearing: fireShape.bearing,
        headingDistance,
        backingDistance,
        elapsedTime,
        fDistance,
        gDistance,
        hDistance,
        latusRectumDistance,
        length,
        width,
        area,
        perimeter,
        ignEast,
        ignNorth,
        ignX,
        ignY,
        centerX,
        centerY,
        centerE,
        centerN,
    }
    return pod
}
