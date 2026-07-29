import {firebrandDistanceFlatTerrain} from './makeSpottingSurfaceFire.js'

export const TorchingTreeSpecies = [
    'ABBA',
    'ABGR',
    'ABLA',
    'PICO',
    'PIEC2',
    'PIEL',
    'PIEN',
    'PIMO3',
    'PIPA2',
    'PIPO',
    'PISE',
    'PITA',
    'PSME',
    'TSHE',
    'LAOC',
    'THPL'
]

// Steady flame height and duration parameters by tree species
export const TreeParam = {
    ABBA: {
        common: 'balsam fir',
        scientific: 'Abies balsamea',
        height: [16.5, 0.515],
        duration: [10.7, -0.278]
    },
    ABGR: {
        common: 'grand fir',
        scientific: 'Abies grandis',
        height: [16.5, 0.515],
        duration: [10.7, -0.278]
    },
    ABLA: {
        common: 'subalpine fir',
        scientific: 'Abies lasiocarpa',
        height: [15.7, 0.451],
        duration: [10.7, -0.278]
    },
    PICO: {
        common: 'lodgepole pine',
        scientific: 'Pinus contorta',
        height: [12.9, 0.453],
        duration: [12.6, -0.256]
    },
    PIEC2: {
        common: 'shortleaf pine',
        scientific: 'Pinus echinata',
        height: [2.71, 1.0],
        duration: [7.91, -0.344]
    },
    PIEL: {
        common: 'slash pine',
        scientific: 'Pinus elliottii',
        height: [2.71, 1.0],
        duration: [11.9, -0.389]
    },
    PIEN: {
        common: 'Engelmann spruce',
        scientific: 'Picea engelmannii',
        height: [15.7, 0.451],
        duration: [12.6, -0.256]
    },
    PIMO3: {
        common: 'western white pine',
        scientific: 'Pinus monticola',
        height: [12.9, 0.453],
        duration: [10.7, -0.278]
    },
    PIPA2: {
        common: 'longleaf pine',
        scientific: 'Pinus palustrus',
        height: [2.71, 1.0],
        duration: [11.9, -0.389]
    },
    PIPO: {
        common: 'ponderosa pine',
        scientific: 'Pinus ponderosa',
        height: [12.9, 0.453],
        duration: [12.6, -0.256]
    },
    PISE: {
        common: 'pond pine',
        scientific: 'Pinus serotina',
        height: [2.71, 1.0],
        duration: [7.91, -0.344]
    },
    PITA: {
        common: 'loblolly pine',
        scientific: 'Pinus taeda',
        height: [2.71, 1.0],
        duration: [13.5, -0.544]
    },
    PSME: {
        common: 'Douglas-fir',
        scientific: 'Pseudotsuga menziesii',
        height: [15.7, 0.451],
        duration: [10.7, -0.278]
    },
    TSHE: {
        common: 'western hemlock',
        scientific: 'Tsuga heterophylla',
        height: [15.7, 0.451],
        duration: [6.3, -0.249]
    },
    // This is an estimated guess,
    // using the height parms used by PICO, PIPO, and PIMO3
    // and the duration parms used by TSHE
    LAOC: {
        common: 'western larch',
        scientific: '"Larix occidentalis (guess)',
        height: [12.9, 0.453],
        duration: [6.3, -0.249]
    },
    // This is an estimated guess,
    // using the height parms used by ABLA, PIEN, PSME, and TSHE
    // and the duration parms used by PICO, PIEN, and PIPO
    THPL: {
        scientific: 'Thuja plicata',
        common: 'western red cedar (guess)',
        height: [15.7, 0.451],
        duration: [12.6, -0.256]
    }
}

export function makeSpottingTorchingTrees(u20, downWindCoverHt,
        species, treeHt, dbh, trees=1, propsLevel=0) {
    const {height, duration} = TreeParam[species]

    // Steady state flame duration (min)
    const flameDur = duration[0] * Math.pow(dbh, duration[1]) * Math.pow(trees, -0.2)

    // Steady state flame height (ft)
    const flameHt = height[0] * Math.pow(dbh, height[1]) * Math.pow(trees, 0.4)

    const ratio = flameHt > 0 ? treeHt / flameHt : 0

    let parms = { a: 4.7, b: 0.0 }
    if (ratio >= 1)
        parms = { a: 4.24, b: 0.332 }
    else if (ratio >= 0.5)
        parms = { a: 3.64, b: 0.391 }
    else if (flameDur < 3.5)
        parms = { a: 2.78, b: 0.418 }
    const firebrandHt = parms.a * flameDur**parms.b * flameHt + 0.5 * treeHt

    // Minimum value of cover height used to calculate flat terrain spotting distance
    const criticalCoverHt = 2.2 * firebrandHt**0.337 - 4
    const appliedCoverHt = Math.max(downWindCoverHt, criticalCoverHt)

    // Firebrand travel distance over flat terrain (ft)
    const firebrandDistance = firebrandDistanceFlatTerrain(u20, firebrandHt, appliedCoverHt)
            
    // Surface fire firebrand down-wind drift distance (ft)
    const driftDistance = 5280 * 0.000278 * (u20 / 88) * Math.pow(firebrandHt, 0.643)
    const flatDistance = firebrandDistance + driftDistance

    let pod = {
        firebrandHt,
        criticalCoverHt,
        appliedCoverHt,
        firebrandDistance,
        driftDistance,
        flatDistance
    }
    if (propsLevel > 0) {
        pod.flameDuration = flameDur
        pod.flameHeight = flameHt
    }
    return pod
}
