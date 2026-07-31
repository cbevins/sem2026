import { WfbxInputs } from '../WfbxInputs.js'
import { WfbxConfigs } from '../WfbxConfigs.js'
import { WfbxModules } from '../WfbxModules.js'
import { WfbxState } from '../WfbxState.js'
import { WfbxScripter } from '../WfbxScripter.js'

const modules = new WfbxModules()
const configs = new WfbxConfigs()
const inputs = new WfbxInputs()
const state = new WfbxState()
const scripter = new WfbxScripter(modules, configs, state, inputs)
scripter.run()
console.log(scripter.logScript())
console.log(scripter.logCallSequence())
