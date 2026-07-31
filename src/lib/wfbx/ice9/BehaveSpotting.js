/*
    - Change all input/output distances from miles to feet
    - Use tree species keys rather than indices
    - Change downwindOpenCanopy to boolean
*/

// Calculates maximum spotting distance from a burning pile.
export function SpotDistanceFromBurningPile(
        location,           // 0=midslope, windward; 1=valley bottom;  2=midslope, leeward; 3=ridge top
        ridgeToValleyDist,  // Horizontal distance from ridge top to valley bottom (ft)
        ridgeToValleyElev,  // Vertical distance from ridge top to valley bottom (ft)
        downwindCoverHt,    // Downwind tree/vegetation cover height (ft).
        downwindOpenCanopy, // TRUE if downwind canopy is open, FALSE if downwind canopy is closed
        windSpeedAt20Ft,    // Wind speed at 20 ft (ft/min).
        flameHt)            // Burning pile's flame height (ft)
{
    // Initialize return values
    let firebrandHt = 0
    let criticalHt  = 0
    let flatDistance = 0
    let spotDistance  = 0

    // Determine maximum firebrand height
    if (windSpeedAt20Ft > 0 && flameHt > 0) {
        // Determine maximum firebrand height
        firebrandHt = 12.2 * flameHt

		// Adjust downwind canopy height based upon downwind canopy cover
		// Added in Release6 by Issues #028FAH - Downwind Canopy Open/Closed
		const adjustedDownwindCoverHt = downwindOpenCanopy ? 0.5*downwindCoverHt : downwindCoverHt

        // Cover ht used in calculation of  flat terrain spotting distance 'flatDist'.
        criticalHt = SpotCriticalCoverHt(firebrandHt, adjustedDownwindCoverHt)
        if (criticalHt > 0) {
            // Flat terrain spotting distance
            flatDistance = SpotDistanceFlatTerrain(firebrandHt, criticalHt, windSpeedAt20Ft)
            // Adjust for mountainous terrain
            spotDistance = SpotDistanceMountainTerrain(flatDistance,
                location, ridgeToValleyDist, ridgeToValleyElev)
        }
    }
    const pod = {
        criticalHt,     // Actual tree/vegetation ht used (ft).
        firebrandHt,    // Initial maximum firebrand height (ft).
        flatDistance,   // Maximum spotting distance over flat terrain (mi)
        spotDistance,   //Maximum spotting distance over mountainous terrain (mi)
        // propsLevel 1
        windSpeedAt20Ft,
        flameHt,
    }
    return pod
}

// Calculates maximum spotting distance from a surface fire.
export function SpotDistanceFromSurfaceFire(
        location,           // 0=midslope, windward; 1=valley bottom;  2=midslope, leeward; 3=ridge top
        ridgeToValleyDist,  // Horizontal distance from ridge top to valley bottom (mi)
        ridgeToValleyElev,  // Vertical distance from ridge top to valley bottom (ft)
        downwindCoverHt,    // Downwind tree/vegetation cover height (ft).
        downwindOpenCanopy, // 1 if downwind canopy is open, 0 if downwind canopy is closed
        windSpeedAt20Ft,    // Wind speed at 20 ft (mi/h).
        flameLength)        // Surface fire flame length (ft)
{
    // Initialize return variables
    let firebrandHt  = 0
    let criticalHt   = 0
    let flatDistance = 0
    let driftDistance= 0
    let spotDistance = 0
    const mph = windSpeedAt20Ft / 88

    // Determine maximum firebrand height
    if (windSpeedAt20Ft > 0 && flameLength > 0) {
        // f is function relating thermal energy to windspeed.
        const f = 322 * Math.pow(( 0.474 * mph), -1.01 )

        // Byram's fireline intensity is derived back from flame length.
        const byrams = Math.pow((flameLength/0.45), (1/0.46))

        // Initial firebrand height (ft).
        firebrandHt = ((f * byrams) > 0) ? (1.055 * Math.sqrt(f * byrams)) : 0

		// Adjust downwind canopy height based upon canopy cover
		// Added in Release6 by Issues #028FAH - Downwind Canopy Open/Closed
		const adjustedDownwindCoverHt = downwindOpenCanopy ? 0.5*downwindCoverHt : downwindCoverHt

        // Cover ht used in calculation of flatDist.
        criticalHt = SpotCriticalCoverHt(firebrandHt, adjustedDownwindCoverHt)
        if (criticalHt > 0) {
            driftDistance = 0.000278 * mph * Math.pow(firebrandHt, 0.643)
            flatDistance = SpotDistanceFlatTerrain(firebrandHt, criticalHt, windSpeedAt20Ft)
                    + driftDistance
            spotDistance = SpotDistanceMountainTerrain(flatDistance,
                location, ridgeToValleyDist, ridgeToValleyElev)
        }
    }
    const pod = {
        criticalHt,     // Actual tree/vegetation ht used (ft).
        firebrandHt,    // Initial maximum firebrand height (ft).
        flatDistance,   // Maximum spotting distance over flat terrain (mi)
        driftDistance,  // Drift distance (mi)
        spotDistance,   //Maximum spotting distance over mountainous terrain (mi)
        // propsLevel 1
        windSpeedAt20Ft,
        flameLength,
    }
    return pod
}

// Calculates maximum spotting distance from a group of torching trees.
const TorchA = [
    [15.7, .451, 12.6, -.256],  //  0 Engelmann spruce
    [15.7, .451, 10.7, -.278],  //  1 Douglas-fir
    [15.7, .451, 10.7, -.278],  //  2 subalpine fir
    [15.7, .451,  6.3, -.249],  //  3 western hemlock
    [12.9, .453, 12.6, -.256],  //  4 ponderosa pine
    [12.9, .453, 12.6, -.256],  //  5 lodgepole pine
    [12.9, .453, 10.7, -.278],  //  6 western white pine
    [16.5, .515, 10.7, -.278],  //  7 grand fir
    [16.5, .515, 10.7, -.278],  //  8 balsam fir
    [2.71, 1.00, 11.9, -.389],  //  9 slash pine
    [2.71, 1.00, 11.9, -.389],  // 10 longleaf pine
    [2.71, 1.00, 7.91, -.344],  // 11 pond pine
    [2.71, 1.00, 7.91, -.344],  // 12 shortleaf pine
    [2.71, 1.00, 13.5, -.544]   // 13 loblolly pine
//  [12.9, .453,  6.3, -.249],  // 14 western larch (guessed)
//  [15.7, .515, 12.6, -.256]   // 15 western red cedar (guessed)
]

const TorchB = [
    [4.24, 0.332],
    [3.64, 0.391],
    [2.78, 0.418],
    [4.70, 0.000]
]

export function SpotDistanceFromTorchingTrees(
        location,           // 0=midslope, windward; 1=valley bottom;  2=midslope, leeward; 3=ridge top
        ridgeToValleyDist,  // Horizontal distance from ridge top to valley bottom (mi)
        ridgeToValleyElev,  // Vertical distance from ridge top to valley bottom (ft)
        downwindCoverHt,    // Downwind tree/vegetation cover height (ft).
        downwindOpenCanopy, // 1 if downwind canopy is open, 0 if downwind canopy is closed
        windSpeedAt20Ft,    // Wind speed at 20 ft (mi/h).
        torchingTrees,      // Number of torching trees.
        treeDbh,            // Tree dbh (in).
        treeHt,             // Tree height (ft).
        treeSpecies)        // Tree species index
{
    // Initialize potential return variables
    let flameRatio = 0
    let flameHt = 0
    let flameDur = 0
    let firebrandHt = 0
    let criticalHt = 0
    let flatDistance = 0
    let spotDistance = 0

    // Determine maximum firebrand height
    if (windSpeedAt20Ft > 0 && treeDbh > 0 && torchingTrees > 0) {
        // Catch species errors.
        if ( treeSpecies < 0 || treeSpecies >= 14 ) {
            return {criticalHt, flameHt, flameDur, flameRatio, firebrandHt, flatDistance, spotDistance,
                torchingTrees, treeDbh, treeHt, treeSpecies}
        }
        // Steady flame height (ft).
        flameHt = TorchA[treeSpecies][0]
             * Math.pow(treeDbh, TorchA[treeSpecies][1])
             * Math.pow(torchingTrees, 0.4)
        flameRatio = (flameHt > 0) ? treeHt / flameHt : 0
        // Steady flame duration.
        flameDur = TorchA[treeSpecies][2]
             * Math.pow(treeDbh, TorchA[treeSpecies][3] )
             * Math.pow(torchingTrees, -0.2)
        let j = 3
        if (flameRatio >= 1) j = 0
        else if (flameRatio >= 0.5) j = 1
        else if (flameDur < 3.5) j = 2
        // Initial firebrand height (ft).
        firebrandHt = TorchB[j][0] * Math.pow(flameDur, TorchB[j][1] ) * flameHt + treeHt/2

		// Adjust downwind canopy height based upon canopy cover
		// Added in Release6 by Issues #028FAH - Downwind Canopy Open/Closed
		const adjustedDownwindCoverHt = downwindOpenCanopy ? 0.5*downwindCoverHt : downwindCoverHt

        // Cover ht used in calculation of flatDist.
        criticalHt = SpotCriticalCoverHt(firebrandHt, adjustedDownwindCoverHt)
        if (criticalHt > 0) {
            flatDistance = SpotDistanceFlatTerrain(firebrandHt, criticalHt, windSpeedAt20Ft)
            spotDistance = SpotDistanceMountainTerrain(flatDistance,
                location, ridgeToValleyDist, ridgeToValleyElev)
        }
    }
    let pod = {
        criticalHt, // Actual tree/vegetation ht used (ft).
        flameHt,    // Steady state flame ht (ft).
        flameDur,   // Flame duration (min)
        flameRatio, // Ratio of tree height to steady flame height (ft/ft).
        firebrandHt, // Initial maximum firebrand height (ft).
        flatDistance, // Maximum spotting distance over flat terrain (mi)
        spotDistance, //Maximum spotting distance over mountainous terrain (mi)

        // propsLevel 1
        windSpeedAt20Ft,    // Wind speed at 20 ft (mi/h).
        torchingTrees,      // Number of torching trees.
        treeDbh,            // Tree dbh (in).
        treeHt,             // Tree height (ft).
        treeSpecies,        // Tree species index
    }
    return pod
}

//------------------------------------------------------------------------------
// Shared methods used by all 3: SURFACE, TREES, and PILE
//------------------------------------------------------------------------------

/**
 * Calculates cover height used in spotting distance calculations.
 * @param {float} firebrandHt  Maximum firebrand height (ft)
 * @param {float} downwindCoverHt Mean cover height downwind of source (ft)
 * @returns Cover height (ft) used in calculation of flat terrain spotting distance.
*/
function SpotCriticalCoverHt(firebrandHt, downwindCoverHt) {
    // Minimum value of coverHt used to calculate flatDist using log variation with ht.
    const criticalHt = (firebrandHt > 0) ? (2.2 * firebrandHt**0.337 - 4.0) : 0
    // Cover ht used in calculation of flatDist
    const htUsed = (downwindCoverHt > criticalHt) ? downwindCoverHt : criticalHt
    return htUsed
}

/**
 * Calculates maximum spotting distance over flat terrain (ft)
 * USED BY ALL 3 METHODS: SURFACE, TREES, and PILE
 * @param {*} firebrandHt Maximum firebrand height (ft)
 * @param {*} coverHt Downwind tree/vegetation cover height (ft)
 * @param {*} windSpeedAt20Ft Wind speed at 20 ft (ft/min)
 * @returns Maximum spotting distance over flat terrain (ft) 
 */
function SpotDistanceFlatTerrain(firebrandHt, coverHt, windSpeedAt20Ft) {
    let distance = 0
    // This model uses wind speed in mi/h, not in ft/min
    const mph = windSpeedAt20Ft / 88
    if (coverHt > 0) {
        distance = 0.000718 * mph * Math.sqrt(coverHt)
                 * (0.362 + Math.sqrt(firebrandHt/coverHt) / 2
                 * Math.log(firebrandHt/coverHt))
    }
    return distance * 5280
}

// Calculates maximum spotting distance over mountainous terrain (ft)
// USED BY ALL 3 METHODS: SURFACE, TREES, and PILE
function SpotDistanceMountainTerrain(
    flatDistance,       // Maximum spotting distance over flat terrain (ft)
    location,           // 0=midslope, windward; 1=valley bottom;  2=midslope, leeward; 3=ridge top
    ridgeToValleyDist,  // Horizontal distance from ridge top to valley bottom (ft)
    ridgeToValleyElev)  // Vertical distance from ridge top to valley bottom (ft)
{
    // This model uses flat and ridge-to-valley distances in miles, not ft
    const flatMiles = flatDistance / 5280
    const rvMiles = ridgeToValleyDist / 5280

    let mtnMiles = flatMiles
    if (ridgeToValleyElev > 0 && ridgeToValleyDist > 0) {
        const a1 = flatMiles / rvMiles
        const b1 = ridgeToValleyElev / (10*Math.PI) / 1000
        let x = a1
        for (let i=0; i<6; i++) {
            x = a1 - b1 * (Math.cos(Math.PI * x - location * Math.PI/2)
              - Math.cos(location * Math.PI/2))
        }
        mtnMiles = x * rvMiles
    }
    return mtnMiles * 5280
}
