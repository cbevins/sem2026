/**
 * Implementation from CodePen 
 * @param {*} cx 
 * @param {*} cy 
 * @param {*} rx 
 * @param {*} ry 
 * @param {*} rotation 
 * @param {*} degStep 
 * @returns 
 */
export function getPerimeterPointsCodePen(cx, cy, rx, ry, rotation, degStep) {
    const parametricAngle = true
    const inDegrees = true
    const cosRot = Math.cos(rotation)
    const sinRot = Math.sin(rotation)
    const pts = []
    for(let deg = 0; deg <= 360; deg += degStep) {
        pts.push(getPointOnEllipseCodePen(cx, cy, rx, ry, deg,
            rotation, cosRot, sinRot, parametricAngle, inDegrees))
    }
    return pts
}

/**
 * Determines perimeter point coordinates of a (possibly) rotated ellipse
 * at either a parametric or geometric angle 'theta' from its center point.
 * @param {*} cx, cy Ellipse center point coordinates 
 * @param {*} rx, ry Ellipse major and minor semi-axis lengths 
 * @param {*} theta angle from center to perimeter (counter-clockwise from x-axis)
 * @param {*} rotation ellipse rotation in degrees
 * @param {*} cosRot, sinRot cosine and sine of the ellipse rotation angle
 * @param {*} parametricAngle If TRUE, 'theta' is the parametric angle from the
 * ellipse center to its subtending and auxillary circles.  If FALSE, 'theta'
 * is the geometric angle from the ellipse center to the perimeter point.
 * @param {*} inDegrees If TRUE, both 'theta' and 'rotation' are degrees
 * counter-clockwise from the x-axis.  If FALSE, 'theta' and 'rotation' are radians.
 * @returns 
 */
export function getPointOnEllipseCodePen(cx, cy, rx, ry, theta,
        rotation=0, cosRot=1, sinRot=0, parametricAngle = true, inDegrees = true) {
    let {cos, sin, PI, atan, tan} = Math;

    const cosTheta = cos(theta)
    const sinTheta = sin(theta)

    // Convert degrees to radians
    if (inDegrees) {
        theta = (theta * PI) / 180
        rotation = (rotation * PI) / 180
    }
    // reset rotation for circles or 360 degree 
    rotation = (rx !== ry) ? (rotation !== PI * 2 ? rotation : 0) : 0

    // is ellipse
    if (parametricAngle && rx !== ry) {
        // adjust angle for ellipse rotation
        theta = rotation ? theta - rotation : theta

        // Get the parametric angle for the ellipse
        let angleParametric = atan(tan(theta) * (rx / ry))

        // Ensure the parametric angle is in the correct quadrant
        theta = cosTheta < 0 ? angleParametric + PI : angleParametric
    }

    // Calculate the point on the ellipse without rotation
    let x = cx + rx * cosTheta,
        y = cy + ry * sinTheta;
    let pt = {x, y}

    if (rotation) {
        pt.x = cx + (x - cx) * cosRot - (y - cy) * sinRot
        pt.y = cy + (x - cx) * sinRot + (y - cy) * cosRot
    }

    return [pt.x, pt.y]
}
