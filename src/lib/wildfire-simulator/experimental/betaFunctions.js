/**
 * Finds the intersection of a ray from a focal point with a rotated ellipse's perimeter.
 * 
 * @param {Object} F - The focal point {x, y} (fire ignition point)
 * @param {Object} V - The vector (direction and magnitude) from the focal point {x, y}
 * @param {Object} E - The ellipse center {x, y}
 * @param {number} a - Semi-major axis
 * @param {number} b - Semi-minor axis
 * @param {number} phi - Rotation angle of the ellipse in radians
 * @param {number} focusIndex - Which focus is being used: 1 (for F1) or -1 (for F2)
 * @returns {Object|null} - The intersection point {x, y} or null if no intersection
 */
export function getBetaPerimeter(F, V, E, a, b, rot, focusIndex = 1) {
    const cosRot = Math.cos(rot)
    const sinRot = Math.sin(rot)

    // 1. Shift focal point and vector to be relative to the ellipse center
    // const F_rel = { x: F.x - E.x, y: F.y - E.y }
    
    // 2. Rotate to the ellipse's local coordinate system
    // const F_loc = {
    //     x: F_rel.x * cosRot + F_rel.y * sinRot,
    //     y: -F_rel.x * sinRot + F_rel.y * cosRot
    // };
    
    const V_loc = {
        x: V.x * cosRot + V.y * sinRot,
        y: -V.x * sinRot + V.y * cosRot
    };

    // 3. Compute ellipse properties in the local coordinate space
    const e = Math.sqrt(a * a - b * b); // Linear eccentricity
    const F1_loc = { x: -e, y: 0 };
    const F2_loc = { x: e, y: 0 };
    const F_used = focusIndex === 1 ? F1_loc : F2_loc;

    // 4. Calculate vector angle in local polar coordinates
    const theta = Math.atan2(V_loc.y, V_loc.x);

    // 5. Compute polar radius from the focal point to the ellipse perimeter
    // Formula: r = (a^2 - e^2) / (a + e * cos(theta))
    const numerator = a * a - e * e;
    const denominator = a + e * Math.cos(theta);
    if (Math.abs(denominator) < 1e-10) return null; // Avoid division by zero

    const r = numerator / denominator;

    // 6. Convert polar coordinates to Cartesian in local space
    const P_loc = {
        x: F_used.x + r * Math.cos(theta),
        y: F_used.y + r * Math.sin(theta)
    };

    // 7. Rotate and translate back to world coordinates
    return {
        x: P_loc.x * cosRot - P_loc.y * sinRot + E.x,
        y: P_loc.x * sinRot + P_loc.y * cosRot + E.y
    };
}
