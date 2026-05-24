import { describe, it, expect } from 'vitest'
import { value } from '../matchers.js'
import { AllModules } from '../index.js'
import * as Config from '../../modules4/Configs.js'

expect.extend({ value })

Config.surfaceFire.value = Config.surfaceFire.onefuel
const modules = new AllModules(Config, 'site')
const site = modules.root

//------------------------------------------------------------------------------
// Site destructuring
//------------------------------------------------------------------------------

const {canopy, ignition, map, moisture, surface, terrain, weather} = site

// 'site.surface' SurfaceModule destructuring
const {ellipse, primary, secondary, weighted:wtd} = surface

// 'site.surface.primary' FireCellModule destructuring
const {model, fuel, fire} = primary
const {catalog} = model
const {fuelKey, cured, depth} = catalog
const {dead, live, rxi, sink, source} = fuel

// 'site.moisture' FuelMoistureModule destructuring
const {tl1, tl10, tl100} = moisture.dead
const {herb, stem} = moisture.live

// 'site.terrain' TerrainModule destructuring
const {aspect, elevation, geo, slope, upslope} = terrain
const steepness = slope.ratio

// 'site.weather' WeatherModule destructuring
const {air, ppt, wind} = weather
const windSpeed = wind.speed.at20ft
const windFrom = wind.dir.origin.fromNorth

//------------------------------------------------------------------------------
// DagNode selection, input, update, and results
//------------------------------------------------------------------------------

// Step 1 - select nodes of interest
const dag = modules.dag
for(let mod of [fire, wtd]) {
    dag.select(
        mod.ros, mod.dir.fromUpslope, mod.dir.fromNorth, mod.fli, mod.flame, mod.lwr,
        mod.hpua, mod.midflame, mod.rxi, mod.scorch,
        mod.weff, mod.weffLimit, mod.weffExceeded, mod.wsrf, mod.scorch)
}
dag.select(wtd.rosArith, wtd.rosHarm)

// Step 2 - display (optional) and set input DagNode values
dag.set(fuelKey, '10')
dag.set(tl1, 0.05)
dag.set(tl10, 0.07)
dag.set(tl100, 0.09)
dag.set(herb, 0.5)
dag.set(stem, 1.5)
dag.set(steepness, 0.25)
dag.set(aspect, 180)
dag.set(windFrom, 270)
dag.set(fire.midflame, 880)
dag.set(air.temp, 95)

// Step 3 - Update all the selected DagNode values
dag.updateAll()

// Expected weighted surface results
const xros = 18.551680325448835

// Results from BehavePlus V6
const tests = [
    // Weighted ros results are all the same
    [fire.ros, xros], [wtd.ros, xros], [wtd.rosArith, xros], [wtd.rosHarm, xros],
    // The following 6 nodes are always bound to the primary fuel
    [fire.dir.fromUpslope, 87.573367385837855],  [wtd.dir.fromUpslope, 87.573367385837855], 
    [fire.dir.fromNorth, 87.573367385837855],    [wtd.dir.fromNorth, 87.573367385837855], 
    [fire.lwr, 3.5015680219321221],          [wtd.lwr, 3.5015680219321221], 
    [fire.midflame, 880],                    [wtd.midflame, 880], 
    [fire.weff, 880.55194372010692],         [wtd.weff, 880.55194372010692], 
    [fire.wsrf, 1],                          [wtd.wsrf, 1], 
    [fire.weffLimit, 5215.2258602062057],    [wtd.weffLimit, 5215.2258602062057], 
    [fire.weffExceeded, false],              [wtd.weffExceeded, false], 
    // The following 5 are always bound to the maximum of the 2 fuels
    [fire.rxi, 5794.6954002291168],          [wtd.rxi, 5794.6954002291168],
    [fire.hpua, 1261.1929372603729],         [wtd.hpua, 1261.1929372603729],
    [fire.fli, 389.95413667947145],          [wtd.fli, 389.95413667947145],
    [fire.flame, 6.9996889013229229],        [wtd.flame, 6.9996889013229229],
    [fire.scorch, 39.58018178],              [wtd.scorch, 39.58018178],
]

describe('One fuel model', () => {
    for(let [node, expected] of tests) {
        it(`primary and final weighted results are the same > ${node.key()}`, () => {
            expect(node).value(expected)
        })
    }
})
