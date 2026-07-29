import {firebrandDistanceFlatTerrain} from './makeSpottingSurfaceFire.js'

export function makeSpottingBurningPile(u20, downWindCoverHt, flameHt) {

    const firebrandHt = Math.max(0.0, 12.2 * flameHt)

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
        flatDistance,
    }
    return pod
}