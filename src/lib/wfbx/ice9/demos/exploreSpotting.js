import {
    makeSpotDistanceFromBurningPile,
    makeSpotDistanceFromSurfaceFire,
    makeSpotDistanceFromTorchingTrees,
    getSpotDistanceMountainTerrain,
    SpotSourceLocations,
} from '../Wfbx.js'

const locations = Object.keys(SpotSourceLocations)
const table = []
let ridgeToValleyDist = 2 * 5280    // Horizontal distance from ridge top to valley bottom (ft)
let ridgeToValleyElev = 2000        // Vertical distance from ridge top to valley bottom (ft)

let downwindCoverHt = 50            // Downwind tree/vegetation cover height (ft)
let downwindOpenCanopy = true       // TRUE if downwind canopy is open, FALSE if downwind canopy is closed
let windSpeedAt20Ft = 10 * 88       // Wind speed at 20 ft (ft/min)

function addSurfaceFireSpotting(flameLength) {
    for(let location of locations) {
        const flat = makeSpotDistanceFromSurfaceFire(downwindCoverHt, downwindOpenCanopy, windSpeedAt20Ft, flameLength)
        const mtn = getSpotDistanceMountainTerrain(flat.flatDistance, location, ridgeToValleyDist, ridgeToValleyElev,)
        table.push({type: 'surface', flame: flameLength, location,
            firebrandHt: flat.firebrandHt.toFixed(2),
            driftDist: flat.driftDistance.toFixed(2),
            flatDist: flat.flatDistance.toFixed(2),
            spotDist: mtn.toFixed(2)})
    }
}

function addBurningPileSpotting(flameHt) {
    for(let location of locations) {
        const flat = makeSpotDistanceFromBurningPile(downwindCoverHt, downwindOpenCanopy, windSpeedAt20Ft, flameHt)
        const mtn = getSpotDistanceMountainTerrain(flat.flatDistance, location, ridgeToValleyDist, ridgeToValleyElev,)
        table.push({type: 'pile', flame: flameHt, location,
            firebrandHt: flat.firebrandHt.toFixed(2),
            driftDist: flat.driftDistance.toFixed(2),
            flatDist: flat.flatDistance.toFixed(2),
            spotDist: mtn.toFixed(2)})
    }
}

function addTorchingTreesSpotting(torchingTrees, treeDbh, treeHt, treeSpecies) {
    for(let location of locations) {
        const flat = makeSpotDistanceFromTorchingTrees(downwindCoverHt, downwindOpenCanopy, windSpeedAt20Ft, 
            torchingTrees, treeDbh, treeHt, treeSpecies)
        const mtn = getSpotDistanceMountainTerrain(flat.flatDistance, location, ridgeToValleyDist, ridgeToValleyElev,)
        const flame = ''+torchingTrees+' '+treeSpecies+':'+treeDbh+','+treeHt
        table.push({type: 'trees', flame, location,
            firebrandHt: flat.firebrandHt.toFixed(2),
            driftDist: flat.driftDistance.toFixed(2),
            flatDist: flat.flatDistance.toFixed(2),
            spotDist: mtn.toFixed(2)})
    }
}

let flameLength = 20
addSurfaceFireSpotting(flameLength)

let flameHt = 20
addBurningPileSpotting(flameHt)

let torchingTrees = 5   // Number of torching trees
let treeDbh = 24        // Tree dbh (in)
let treeHt = 100        // Tree height (ft)
let treeSpecies = 'PSME'     // Tree species index (1=DF, 4=PP)
addTorchingTreesSpotting(torchingTrees, treeDbh, treeHt, treeSpecies)

console.table(table)
