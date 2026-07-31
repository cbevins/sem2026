// Calculates maximum spotting distance from a burning pile.
export function makeSpotDistanceFromBurningPile(
        downwindCoverHt,    // Downwind tree/vegetation cover height (ft).
        downwindOpenCanopy, // TRUE if downwind canopy is open, FALSE if downwind canopy is closed
        windSpeedAt20Ft,    // Wind speed at 20 ft (ft/min).
        flameHt,            // Burning pile's flame height (ft)
        propsLevel=3)
{
    // Initialize return values
    let firebrandHt = 0
    let criticalHt  = 0
    let flatDistance = 0
    let driftDistance = 0
    let spotDistance  = 0
    let adjustedDownwindCoverHt = downwindCoverHt
    let coverHt = 0

    if (windSpeedAt20Ft > 0 && flameHt > 0) {
        // Determine maximum firebrand height
        firebrandHt = 12.2 * flameHt

        // Minimum valid cover ht used in calculation of flat terrain spotting distance
        criticalHt = (firebrandHt > 0) ? (2.2 * firebrandHt**0.337 - 4.0) : 0

		// Adjust downwind canopy height based upon downwind canopy cover
		// Added in Release6 by Issues #028FAH - Downwind Canopy Open/Closed
		adjustedDownwindCoverHt = downwindOpenCanopy ? 0.5*downwindCoverHt : downwindCoverHt

        // Use maximum of the critical or actual downwind cover ht
        coverHt = Math.max(adjustedDownwindCoverHt, criticalHt)

        // Flat terrain spotting distance
        flatDistance = getSpotDistanceFlatTerrain(firebrandHt, coverHt, windSpeedAt20Ft)

        spotDistance = flatDistance + driftDistance
    }
    let pod = {
        spotDistance,   //Maximum spotting distance over mountainous terrain (ft)
    }
    if (propsLevel > 0) pod = {...pod,
        firebrandHt,    // Initial maximum firebrand height (ft).
        flatDistance,   // Maximum spotting distance over flat terrain (ft)
    }
    if (propsLevel > 1) pod = {...pod,
        downwindCoverHt,    // Downwind tree/vegetation cover height (ft)
        downwindOpenCanopy, // TRUE if downwind canopy is open, FALSE if downwind canopy is closed
        adjustedDownwindCoverHt, // Downwind tree/vegetation cover height (ft)
        criticalHt,         // Minimum valid cover ht (ft)
        coverHt,            // Actual tree/vegetation ht used (ft)
        windSpeedAt20Ft,    // Wind speed at 20 ft (ft/min)
        driftDistance,      // Only used by surface fire for some reason
        flameHt             // Burning pile's flame height (ft)
    }
    return pod
}

// Calculates maximum spotting distance from a surface fire.
export function makeSpotDistanceFromSurfaceFire(
        downwindCoverHt,    // Downwind tree/vegetation cover height (ft)
        downwindOpenCanopy, // TRUE if downwind canopy is open, FALSE if downwind canopy is closed
        windSpeedAt20Ft,    // Wind speed at 20 ft (ft/min)
        flameLength,        // Surface fire flame length (ft)
        propsLevel=3)
{
    // Initialize return variables
    let firebrandHt = 0
    let criticalHt  = 0
    let flatDistance = 0
    let driftDistance = 0
    let spotDistance  = 0
    let adjustedDownwindCoverHt = downwindCoverHt
    let coverHt = 0
    const mph = windSpeedAt20Ft / 88

    // Determine maximum firebrand height
    if (windSpeedAt20Ft > 0 && flameLength > 0) {
        // f is function relating thermal energy to windspeed.
        const f = 322 * (0.474 * mph)**-1.01

        // Byram's fireline intensity is derived back from flame length.
        const byrams = (flameLength/0.45)**(1/0.46)

        // Initial firebrand height (ft).
        firebrandHt = ((f * byrams) > 0) ? (1.055 * Math.sqrt(f * byrams)) : 0

        // Minimum valid cover ht used in calculation of flat terrain spotting distance
        criticalHt = (firebrandHt > 0) ? (2.2 * firebrandHt**0.337 - 4.0) : 0

		// Adjust downwind canopy height based upon downwind canopy cover
		// Added in Release6 by Issues #028FAH - Downwind Canopy Open/Closed
		adjustedDownwindCoverHt = downwindOpenCanopy ? 0.5*downwindCoverHt : downwindCoverHt

        // Use maximum of the critical or actual downwind cover ht
        coverHt = Math.max(adjustedDownwindCoverHt, criticalHt)

        if (firebrandHt > 0)
            driftDistance = 5280 * (0.000278 * mph * firebrandHt**0.643)

        flatDistance = getSpotDistanceFlatTerrain(firebrandHt, coverHt, windSpeedAt20Ft)

        spotDistance = flatDistance + driftDistance
    }

    let pod = {
        spotDistance,   //Maximum spotting distance over mountainous terrain (ft)
    }
    if (propsLevel > 0) pod = {...pod,
        firebrandHt,    // Initial maximum firebrand height (ft).
        flatDistance,   // Maximum spotting distance over flat terrain (ft)
        driftDistance,  // Drift distance (ft)
    }
    if (propsLevel > 1) pod = {...pod,
        downwindCoverHt,    // Downwind tree/vegetation cover height (ft)
        downwindOpenCanopy, // TRUE if downwind canopy is open, FALSE if downwind canopy is closed
        adjustedDownwindCoverHt, // Downwind tree/vegetation cover height (ft)
        criticalHt,         // Minimum valid cover ht (ft)
        coverHt,            // Actual tree/vegetation ht used (ft)
        windSpeedAt20Ft,    // Wind speed at 20 ft (ft/min)
        flameLength,        // Surface fire flame length at head (ft)
    }
    return pod
}

// Calculates maximum spotting distance from a group of torching trees.
export const TorchA = {
    ABBA: { common: 'balsam fir', scientific: 'Abies balsamea',
        height: [16.5, 0.515], duration: [10.7, -0.278]},
    ABGR: {common: 'grand fir', scientific: 'Abies grandis',
        height: [16.5, 0.515], duration: [10.7, -0.278]},
    ABLA: {common: 'subalpine fir', scientific: 'Abies lasiocarpa',
        height: [15.7, 0.451], duration: [10.7, -0.278]},
    PICO: {common: 'lodgepole pine', scientific: 'Pinus contorta',
        height: [12.9, 0.453], duration: [12.6, -0.256]},
    PIEC2: {common: 'shortleaf pine', scientific: 'Pinus echinata',
        height: [2.71, 1.0], duration: [7.91, -0.344]},
    PIEL: {common: 'slash pine', scientific: 'Pinus elliottii',
        height: [2.71, 1.0], duration: [11.9, -0.389]},
    PIEN: {common: 'Engelmann spruce', scientific: 'Picea engelmannii',
        height: [15.7, 0.451], duration: [12.6, -0.256]},
    PIMO3: {common: 'western white pine', scientific: 'Pinus monticola',
        height: [12.9, 0.453], duration: [10.7, -0.278]},
    PIPA2: {common: 'longleaf pine', scientific: 'Pinus palustrus',
        height: [2.71, 1.0], duration: [11.9, -0.389]},
    PIPO: {common: 'ponderosa pine', scientific: 'Pinus ponderosa',
        height: [12.9, 0.453], duration: [12.6, -0.256]},
    PISE: {common: 'pond pine', scientific: 'Pinus serotina',
        height: [2.71, 1.0], duration: [7.91, -0.344]},
    PITA: {common: 'loblolly pine', scientific: 'Pinus taeda',
        height: [2.71, 1.0], duration: [13.5, -0.544]},
    PSME: {common: 'Douglas-fir', scientific: 'Pseudotsuga menziesii',
        height: [15.7, 0.451], duration: [10.7, -0.278]},
    TSHE: {common: 'western hemlock', scientific: 'Tsuga heterophylla',
        height: [15.7, 0.451], duration: [6.3, -0.249]},
    // This is an estimated guess,
    // using the height parms used by PICO, PIPO, and PIMO3
    // and the duration parms used by TSHE
    LAOC: {common: 'western larch', scientific: '"Larix occidentalis (guess)',
        height: [12.9, 0.453], duration: [6.3, -0.249]},
    // This is an estimated guess,
    // using the height parms used by ABLA, PIEN, PSME, and TSHE
    // and the duration parms used by PICO, PIEN, and PIPO
    THPL: {scientific: 'Thuja plicata', common: 'western red cedar (guess)',
        height: [15.7, 0.451], duration: [12.6, -0.256]}
}

const TorchB = [
    [4.24, 0.332],
    [3.64, 0.391],
    [2.78, 0.418],
    [4.70, 0.000]
]

export function makeSpotDistanceFromTorchingTrees(
        downwindCoverHt,    // Downwind tree/vegetation cover height (ft)
        downwindOpenCanopy, // 1 if downwind canopy is open, 0 if downwind canopy is closed
        windSpeedAt20Ft,    // Wind speed at 20 ft (ft/min)
        torchingTrees,      // Number of torching trees
        treeDbh,            // Tree dbh (in)
        treeHt,             // Tree height (ft)
        treeSpecies,        // Tree species index
        propsLevel=3)
{
    // Initialize potential return variables
    let flameRatio = 0
    let flameHt = 0
    let flameDur = 0
    let firebrandHt = 0
    let criticalHt = 0
    let flatDistance = 0
    let driftDistance = 0
    let spotDistance = 0
    let adjustedDownwindCoverHt = downwindCoverHt
    let coverHt = 0

    // Determine maximum firebrand height
    if (windSpeedAt20Ft > 0 && treeDbh > 0 && torchingTrees > 0) {
        // Catch species errors.
        if (! Object.hasOwn(TorchA, treeSpecies))
            throw new Error(`SpotDistanceFromTorchingTrees() passed invalid tree species code '${treeSpecies}'.`)

        // Steady flame duration (min)
        const {height, duration} = TorchA[treeSpecies]
        const [durA, durB] = duration
        flameDur = durA * treeDbh**durB * torchingTrees**-0.2

        // Steady flame height (ft)
        const [htA, htB] = height
        flameHt = htA * treeDbh**htB * torchingTrees**0.4
        flameRatio = (flameHt > 0) ? treeHt / flameHt : 0
        
        // Firebrand height depends on flame ratio and duration class
        let j = 3
        if (flameRatio >= 1) j = 0
        else if (flameRatio >= 0.5) j = 1
        else if (flameDur < 3.5) j = 2
        // Initial firebrand height (ft).
        firebrandHt = TorchB[j][0] * Math.pow(flameDur, TorchB[j][1] ) * flameHt + treeHt/2

        // Minimum valid cover ht used in calculation of flat terrain spotting distance
        criticalHt = (firebrandHt > 0) ? (2.2 * firebrandHt**0.337 - 4.0) : 0

		// Adjust downwind canopy height based upon downwind canopy cover
		// Added in Release6 by Issues #028FAH - Downwind Canopy Open/Closed
		adjustedDownwindCoverHt = downwindOpenCanopy ? 0.5*downwindCoverHt : downwindCoverHt

        // Use maximum of the critical or actual downwind cover ht
        coverHt = Math.max(adjustedDownwindCoverHt, criticalHt)

        flatDistance = getSpotDistanceFlatTerrain(firebrandHt, coverHt, windSpeedAt20Ft)

        spotDistance = flatDistance + driftDistance
    }

    let pod = {
        spotDistance,   //Maximum spotting distance over mountainous terrain (ft)
    }
    if (propsLevel > 0) pod = {...pod,
        flameHt,    // Steady state flame ht (ft)
        flameDur,   // Flame duration (min)
        flameRatio, // Ratio of tree height to steady flame height (ft/ft)
        firebrandHt,    // Initial maximum firebrand height (ft).
        flatDistance,   // Maximum spotting distance over flat terrain (ft)
        driftDistance,  // Drift distance (ft)
    }
    if (propsLevel > 1) pod = {...pod,
        downwindCoverHt,    // Downwind tree/vegetation cover height (ft)
        downwindOpenCanopy, // TRUE if downwind canopy is open, FALSE if downwind canopy is closed
        adjustedDownwindCoverHt, // Downwind tree/vegetation cover height (ft)
        criticalHt,         // Minimum valid cover ht (ft)
        coverHt,            // Actual tree/vegetation ht used (ft)
        windSpeedAt20Ft,    // Wind speed at 20 ft (ft/min)
        torchingTrees,      // Number of torching trees
        treeDbh,            // Tree dbh (in)
        treeHt,             // Tree height (ft)
        treeSpecies,        // Tree species index
    }
    return pod
}

//------------------------------------------------------------------------------
// Shared methods used by all 3: SURFACE, TREES, and PILE
//------------------------------------------------------------------------------

/**
 * Calculates maximum spotting distance over flat terrain (ft)
 * USED BY ALL 3 METHODS: SURFACE, TREES, and PILE
 * @param {*} firebrandHt Maximum firebrand height (ft)
 * @param {*} coverHt Downwind tree/vegetation cover height (ft)
 * @param {*} windSpeedAt20Ft Wind speed at 20 ft (ft/min)
 * @returns Maximum spotting distance over flat terrain (ft) 
 */
function getSpotDistanceFlatTerrain(firebrandHt, coverHt, windSpeedAt20Ft) {
    let distance = 0
    // This model uses wind speed in mi/h, not in ft/min
    const mph = windSpeedAt20Ft / 88
    if (coverHt > 0 && firebrandHt > 0) {
        const ratio = firebrandHt/coverHt
        distance = 0.000718 * mph * Math.sqrt(coverHt)
            * ((0.362 + Math.sqrt(ratio) / 2) * Math.log(ratio))
    }
    return distance * 5280
}

export const SpotSourceLocations = {
    midslopeWindward:   { factor: 0, label: 'Midslope, Windward' },
    valleyBottom:       { factor: 1, label: 'Valley Bottom' },
    midslopeLeeward:    { factor: 2, label: 'Midslope, Leeward' },
    ridgeTop:           { factor: 3, label: 'Ridge Top' }
}

// Calculates maximum spotting distance over mountainous terrain (ft)
// USED BY ALL 3 METHODS: SURFACE, TREES, and PILE
export function getSpotDistanceMountainTerrain(
    flatDistance,       // Maximum spotting distance over flat terrain (ft)
    location,           // 'midslopeWindward', 'valleyBottom', 'midslopeLeeward', or 'ridgeTop'
    ridgeToValleyDist,  // Horizontal distance from ridge top to valley bottom (ft)
    ridgeToValleyElev)  // Vertical distance from ridge top to valley bottom (ft)
{
    if (!Object.hasOwn(SpotSourceLocations, location))
        throw new Error(`getSpotDistanceMountainTerrain() passed invalid location key '${location}'.`)
    
    // This model uses flat and ridge-to-valley distances in miles, not ft
    const flatMiles = flatDistance / 5280
    const rvMiles = ridgeToValleyDist / 5280

    let spotMiles = flatMiles
    if (ridgeToValleyElev > 0 && ridgeToValleyDist > 0) {
        const a1 = flatMiles / rvMiles
        const b1 = ridgeToValleyElev / (10*Math.PI) / 1000
        const factor = SpotSourceLocations[location].factor
        let x = a1
        for (let i=0; i<6; i++) {
            x = a1 - b1 * (Math.cos(Math.PI * x - factor * Math.PI/2)
              - Math.cos(factor * Math.PI/2))
        }
        spotMiles = x * rvMiles
    }
    return spotMiles * 5280
}
