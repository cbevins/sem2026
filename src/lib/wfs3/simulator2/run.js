import { Rules } from './Rules.js'
import { RulesCompiler } from './RulesCompiler.js'
import { FullSurfaceConfig } from './Configs.js'
import { sortedTable } from '../Wfs.js'

const compiler = new RulesCompiler()

function showConfigs(rules) {
    sortedTable('ALl Configuration keys and Values Mentioned In Rules',
        compiler.getConfigs(rules))
}

function showInputs(configs) {
    compiler.compile(Rules, configs, 'surfaceFire')
    sortedTable('Required Inputs', [...compiler.reqInputs])
}

function showMethods(configs) {
    compiler.compile(Rules, configs, 'surfaceFire')
    sortedTable('Required Methods', [...compiler.reqMethods].sort())
}

function showStack(configs) {
    compiler.compile(Rules, configs, 'surfaceFire')
    console.table([...compiler.stack])
}

const configs = FullSurfaceConfig
// showConfigs(Rules)
showStack(configs)
showInputs(configs)
// showMethods(configs)