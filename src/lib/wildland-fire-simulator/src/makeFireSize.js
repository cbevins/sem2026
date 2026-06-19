import { WfsFirePosition } from "./WfsInputs.js"
import { checkInputs, requireInputs } from "./utils.js"

export function makeFireSize(inputs={}, configs={}) {
    // Get applicable input objects
    let {fireEllipse=null, firePosition=null} = inputs

    // Require the fireEllipse object, as it is too complex to be reasonablly defaulted
    fireEllipse = requireInputs('makeFireSize()', fireEllipse, 'fireEllipse')
    
    // Use either the provided firePosition object, or get the standard WfsFireSize object
    firePosition = checkInputs('makeFireSize()', firePosition, 'firePosition', WfsFirePosition, 'WfsFirePosition', configs)

    // Get required firePosition input properties
    const {elapsedTime=1, ignX=0, ignY=0, ignEast=0, ignNorth=0} = firePosition

    // Distance between the *ignition point* and the fire head
    const headingDistance = fireEllipse.headingSpreadRate * elapsedTime
    
    // Distance between the *ignition point* and the fire back
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
