// import {BehaveRules, BehaveConfigs, RulesCompiler, sortedTable } from '../Wfs.js'
// import { FuelCuring } from '../Wfs.js'
import * as Wfs from '../Wfs.js'
import * as Mod from '../Simulator/Modules.js'

function run() {
    const compiler = new Wfs.RulesCompiler()
    // console.log(compiler.getConfigs(BehaveRules))
    compiler.compile(Wfs.BehaveRules, Wfs.BehaveConfigs, 'fireBehaviors')
    console.log(compiler.stack)
    // sortedTable('Required Inputs', [...compiler.reqInputs])
    // Wfs.sortedTable('Required Methods', [...compiler.reqMethods])
    // Wfs.sortedTable('Required Modules', [...compiler.reqModules])
}

function buildState() {
    const state = {}
    for (let modKey of Object.keys(Mod)) {
        state[modKey] = new Mod[modKey]
    }
    return state
}
run()