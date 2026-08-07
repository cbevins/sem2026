
//------------------------------------------------------------------------------
/*! \brief Calculates the length of a SQUARE fire safety zone for personnel and equipment.
 *  This is roughly the distance at which the heat flux drops to 7 kW/m2.
 *
 *  \param sepDist  Separation distance (ft)
 *  \param pNumb    Number of people to be sheltered in the safety zone.
 *  \param pArea    Mean area required per person within the safety zone (ft2).
 *  \param eNumb    Number of pieces of heavy equipment
 *                  to be sheltered in the safety zone.
 *  \param eArea    Mean area occupied by each piece of heavy equipment (ft2).
 *
 *  \return Length of a square, cleared safety zone within which people and
 *          equipment are exposed to less than 7 kW/m2 heat flux.
 */
export function getSafetyZoneLength(sepDist, pNumb, pArea, eqNumb, eqArea) {
	const radius = getSafetyZoneRadius(sepDist, pNumb, pArea, eqNumb, eqArea)
	return 2 * radius
}

//------------------------------------------------------------------------------
/* Calculates the radius of a CIRCULAR fire safety zone for personnel and equipment.
 * This is roughly the distance at which the heat flux drops to 7 kW/m2.
 *
 *  \param sepDist  Separation distance (ft)
 *  \param pNumb    Number of people to be sheltered in the safety zone.
 *  \param pArea    Mean area required per person within the safety zone (ft2).
 *  \param eNumb    Number of pieces of heavy equipment
 *                  to be sheltered in the safety zone.
 *  \param eArea    Mean area occupied by each piece of heavy equipment (ft2).
 *
 *  \return Radius of a cleared safety zone within which people and
 *          equipment are exposed to less than 7 kW/m2 heat flux.
 */
export function getSafetyZoneRadius(sepDist, pNumb, pArea, eqNumb, eqArea) {
    // Space needed by firefighters and equipment in core of safety zone
    let coreRadius = (pArea * pNumb + eqNumb * eqArea) / Math.PI
    if (coreRadius > 0)
        coreRadius = Math.sqrt(coreRadius)
    
    // Add 4 times the flame ht to the protected safety zone core
    const fullRadius = sepDist + coreRadius
    return fullRadius
}

//------------------------------------------------------------------------------
/* Calculates the fire safety zone separation distance for personnel and equipment.
 * This is roughly the distance at which the heat flux drops to 7 kW/m2.
 *
 *  \param flameHt  Height of the flame front (ft).
 *  \return Separation distance between the flame front and personnel/equipment
 */
export function getSafetyZoneSeparationDistance(flameHt) {
    return 4 * flameHt
}
