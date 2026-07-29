export function makeSpottingSurfaceFire(
        u20,
        fli,
        downWindCoverHt,    // down-wind tree/vegetation cover height
        downWindCanopyIsOpen) { // TRUE if the canopy is 'open'

    let adjustedDownWindCoverHt = downWindCanopyIsOpen ? 0.5 * downWindCoverHt : downWindCoverHt
    let firebrandHt = 0     // firebrand loft height (ft)
    let criticalCoverHt = 0 // minimum value for downwind cover height (ft)
    let appliedCoverHt = 0  // applied value for downwind cover height (ft)
    let firebrandDistance = 0    // firebrand travel distance on flat terrain with no drift (ft)
    let driftDistance = 0   // firebrand drift distance (ft)
    let flatDistance = 0    // spotting distance on flat terrain

    // Surface fire maximum firebrand height (ft)
    if (u20 > 0 && fli > 0) {
        // f is a function relating thermal energy to windspeed.
        const f = 322 * Math.pow(0.474 * (u20 / 88), -1.01)
        firebrandHt = 1.055 * Math.sqrt(f * fli)

        // Minimum value of cover height used to calculate flat terrain spotting distance
        criticalCoverHt = criticalCoverHeight(firebrandHt)
        appliedCoverHt = Math.max(adjustedDownWindCoverHt, criticalCoverHt)

        // Firebrand travel distance over flat terrain (ft)
        firebrandDistance = firebrandDistanceFlatTerrain(u20, firebrandHt, appliedCoverHt)
                
        // Surface fire firebrand down-wind drift distance (ft)
        driftDistance = 5280 * 0.000278 * (u20 / 88) * Math.pow(firebrandHt, 0.643)

        flatDistance = firebrandDistance + driftDistance
    }
    let pod = {
        downWindCoverHt,        // down-wind tree/vegetation cover height
        downWindCanopyIsOpen,   // TRUE if the canopy is 'open'
        adjustedDownWindCoverHt,//
        firebrandHt,            // firebrand loft height (ft)
        criticalCoverHt,        // minimum value for downwind cover height (ft)
        appliedCoverHt,         // applied value for downwind cover height (ft)
        firebrandDistance,      // firebrand travel distance over flat terrain with no drift (ft)
        driftDistance,          // firebrand drift distance (ft)
        flatDistance,           // surface fire spotting distance on flat terrain
    }
    return pod
}

// Calculates minimum value for down-wind tree/vegetation cover height 
// for burning pile and surface fire spotting distances.
export function criticalCoverHeight(firebrandHt) {
    const ht = (firebrandHt > 0) ? 2.2 * firebrandHt**0.337 - 4 : 0
    return ht
}

export function driftDistance(u20, firebrandHt) {
    let dist = 0
    if (u20 > 0 && firebrandHt > 0 )
        dist = 5280 * 0.000278 * (u20 / 88) * firebrandHt**0.643
    return dist
}

// Calculates maximum firebrand travel distance over flat terrain
// for burning piles, torching trees, and surface fires.
export function firebrandDistanceFlatTerrain(u20, firebrandHt, appliedCoverHt) {
    let dist = 0
    if (firebrandHt > 0 && appliedCoverHt > 0) {
        dist = 5280 * 0.000718 * (u20 / 88) * Math.sqrt(appliedCoverHt) *
            (0.362 + (Math.sqrt(firebrandHt / appliedCoverHt) / 2) *
            Math.log(firebrandHt / appliedCoverHt))
    }
    return dist
}

export function spottingDistanceMountainTerrain (
  flatDistFt,       // Maximum spotting distance over flat terrain (ft)
  locationKey,      // midslopeWindward', 'valleyBottom', 'midslopeLeeward', 'ridgetop'
  rvDistFt,         // Horizontal distance from ridge top to valley bottom (ft)
  rvElev) {         // Vertical distance from ridge top to valley bottom (ft)
    const Location = {
        midslopeWindward: { factor: 0, label: 'Midslope, Windward' },
        valleyBottom: { factor: 1, label: 'Valley Bottom' },
        midslopeLeeward: { factor: 2, label: 'Midslope, Leeward' },
        ridgeTop: { factor: 3, label: 'Ridge Top' }
    }

    const flatDist = flatDistFt / 5280
    const rvDist = rvDistFt / 5280
    let mtnDist = flatDist
    if (rvElev > 0 && rvDist > 0) {
        const a1 = flatDist / rvDist
        const b1 = rvElev / (10 * Math.PI) / 1000
        const factor = Location[locationKey].factor
        const f = factor * Math.PI / 2
        let x = a1
        for (let i = 0; i < 6; i++) {
            x = a1 - b1 * (Math.cos(Math.PI * x - f) - Math.cos(f))
        }
        mtnDist = x * rvDist
    }
    return mtnDist * 5280
}