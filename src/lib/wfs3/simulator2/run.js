import { Rules } from './Rules.js'
import { RulesCompiler } from './RulesCompiler.js'
import { FullSurfaceConfig } from './Configs.js'
import { sortedTable } from '../Wfs.js'

const compiler = new RulesCompiler()

function showConfigs(rules) {
    sortedTable('All Configuration keys and Values Mentioned In Rules',
        compiler.getConfigs(rules))
}

function showInputs(configs, startKey) {
    compiler.compile(Rules, configs, startKey)
    sortedTable('Required Inputs', [...compiler.reqInputs])
}

function showMethods(configs, startKey) {
    compiler.compile(Rules, configs, startKey)
    sortedTable('Required Methods', [...compiler.reqMethods].sort())
}

function showStack(configs, startKey) {
    compiler.compile(Rules, configs, startKey)
    console.table([...compiler.stack])
}

function showStateSkeleton(configs, startKey) {
    compiler.compile(Rules, configs, startKey)
    console.log(compiler.getStateSkeleton())
}

const configs = FullSurfaceConfig
const startKey = 'surfaceFire'

// showConfigs(Rules)
showInputs(configs, startKey)
showMethods(configs, startKey)
showStack(configs, startKey)
showStateSkeleton(configs, startKey)