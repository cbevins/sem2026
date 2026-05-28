export function getPerimeterPointsCodePen(cx, cy, rx, ry, ellipseRotation, degStep) {
    const parametricAngle = true
    const inDegrees = true
    const cosRot = Math.cos(ellipseRotation)
    const sinRot = Math.sin(ellipseRotation)
    const pts = []
    for(let deg = 0; deg <= 360; deg += degStep) {
        pts.push(getPointOnEllipseCodePen(cx, cy, rx, ry, deg,
            ellipseRotation, cosRot, sinRot, parametricAngle, inDegrees))
    }
    return pts
}
        
export function getPointOnEllipseCodePen(cx, cy, rx, ry, angle,
        ellipseRotation, cosRot, sinRot, parametricAngle = true, inDegrees = true) {
    let {cos, sin, PI, atan, tan} = Math;

    // Convert degrees to radians
    angle = inDegrees ? (angle * PI) / 180 : angle;
    ellipseRotation = inDegrees ? (ellipseRotation * PI) / 180 : ellipseRotation;
    // reset rotation for circles or 360 degree 
    ellipseRotation = rx !== ry ? (ellipseRotation !== PI * 2 ? ellipseRotation : 0) : 0;

    // is ellipse
    if (parametricAngle && rx !== ry) {
        // adjust angle for ellipse rotation
        angle = ellipseRotation ? angle - ellipseRotation : angle;

        // Get the parametric angle for the ellipse
        let angleParametric = atan(tan(angle) * (rx / ry));

        // Ensure the parametric angle is in the correct quadrant
        angle = cos(angle) < 0 ? angleParametric + PI : angleParametric;
    }

    // Calculate the point on the ellipse without rotation
    let x = cx + rx * cos(angle),
        y = cy + ry * sin(angle);
    let pt = {x, y}

    if (ellipseRotation) {
        pt.x = cx + (x - cx) * cos(ellipseRotation) - (y - cy) * sin(ellipseRotation)
        pt.y = cy + (x - cx) * sin(ellipseRotation) + (y - cy) * cos(ellipseRotation)
    }

    return [pt.x, pt.y]
}
