import {
    SpotDistanceFromBurningPile,
    SpotDistanceFromSurfaceFire,
    SpotDistanceFromTorchingTrees,
    SpotSourceLocations,
} from '../Wfbx.js'

const locations = Object.keys(SpotSourceLocations)
const table = []
let ridgeToValleyDist = 2 * 5280    // Horizontal distance from ridge top to valley bottom (ft)
let ridgeToValleyElev = 2000        // Vertical distance from ridge top to valley bottom (ft)

let downwindCoverHt = 50            // Downwind tree/vegetation cover height (ft)
let downwindOpenCanopy = true       // TRUE if downwind canopy is open, FALSE if downwind canopy is closed
let windSpeedAt20Ft = 10 * 88       // Wind speed at 20 ft (ft/min)

const surface = new SpotDistanceFromSurfaceFire()
const pile = new SpotDistanceFromBurningPile()
const trees = new SpotDistanceFromTorchingTrees()

function addSurfaceFireSpotting(flameLength) {
    for(let location of locations) {
        surface.update(downwindCoverHt, downwindOpenCanopy, windSpeedAt20Ft, flameLength)
            .updateTerrainDistance(location, ridgeToValleyDist, ridgeToValleyElev,)
        table.push({type: 'surface', flame: flameLength, location,
            firebrandHt: surface.firebrandHt.toFixed(2),
            driftDist: surface.driftDistance.toFixed(2),
            levelDist: surface.levelDistance.toFixed(2),
            terrainDist: surface.terrainDistance.toFixed(2)})
    }
}

function addBurningPileSpotting(flameHt) {
    for(let location of locations) {
        pile.update(downwindCoverHt, downwindOpenCanopy, windSpeedAt20Ft, flameHt)
            .updateTerrainDistance(location, ridgeToValleyDist, ridgeToValleyElev,)
        table.push({type: 'pile', flame: flameHt, location,
            firebrandHt: pile.firebrandHt.toFixed(2),
            driftDist: pile.driftDistance.toFixed(2),
            levelDist: pile.levelDistance.toFixed(2),
            terrainDist: pile.terrainDistance.toFixed(2)})
    }
}

function addTorchingTreesSpotting(torchingTrees, treeDbh, treeHt, treeSpecies) {
    for(let location of locations) {
        trees.update(downwindCoverHt, downwindOpenCanopy, windSpeedAt20Ft, 
            torchingTrees, treeDbh, treeHt, treeSpecies)
            .updateTerrainDistance(location, ridgeToValleyDist, ridgeToValleyElev,)
        const flame = ''+torchingTrees+' '+treeSpecies+':'+treeDbh+','+treeHt
        table.push({type: 'trees', flame, location,
            firebrandHt: trees.firebrandHt.toFixed(2),
            driftDist: trees.driftDistance.toFixed(2),
            levelDist: trees.levelDistance.toFixed(2),
            terrainDist: trees.terrainDistance.toFixed(2)})
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

console.log(new Date())
console.log('exploreSpotting - simple demo/test of spotting distance from surface fire, burning pile, and torching trees.')
console.table(table)
