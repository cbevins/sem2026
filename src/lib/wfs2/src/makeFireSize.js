// Distance between the *ignition point* and the fire head
// eslint-disable-next-line no-unused-vars
export function makeFireSize(fireEllipse, firePosition, propsLevel=0) {
    // Get required inputs
    let {elapsedTime=1, ignEast=0, ignNorth=0, ignX=0, ignY=0} = firePosition

    // Distance (ft) between the *ignition point* and the fire ellipse head
    const headingDistance = fireEllipse.headingSpreadRate * elapsedTime
    
    // Distance (ft) between the *ignition point* and the fire ellipse back
    const backingDistance = fireEllipse.backingSpreadRate * elapsedTime

    // Major semi-axis length (ft) [aka 'rx']
    const fDistance = fireEllipse.fSpreadRate * elapsedTime

    // Distance (ft) between ignition and center points
    const gDistance = fireEllipse.gSpreadRate * elapsedTime

    // Minor semi-axis length (ft) [aka 'ry']
    const hDistance = fireEllipse.hSpreadRate * elapsedTime

    // Latus rectum semi-chord length (ft)
    const latusRectumDistance = fireEllipse.latusRectumSpreadRate * elapsedTime

    // Total ellipse length (ft)
    const length = fireEllipse.majorExpansionRate * elapsedTime

    // Total ellipse width (ft)
    const width = fireEllipse.minorExpansionRate * elapsedTime
    
    // Ellipse area (ft2)
    const area = (Math.PI * length * width) / 4
    const acres = area / (66*660)

    // Ellipse perimeter length (ft) using Ramanujan's approximation.
    const a = fDistance, b = hDistance
    const h = (a - b)**2 / (a + b)**2
    const perimeter = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))

    // Since getBetaFireVector() cannot be used to determine the center point position,
    // we have to do it hgere manually
    const centerX = ignX + gDistance * fireEllipse.rotationCos
    const centerY = ignY + gDistance * fireEllipse.rotationSin
    const centerE = centerX + ignEast - ignX
    const centerN = centerY + ignNorth - ignY

    let pod = {
        ...fireEllipse,
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
        acres,
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
