import {WfbxScripter} from './WfbxScripter.js'
import {BehaveModules, BehaveConfigs, BehaveState, BehaveInputs} from './BehaveModulesConfigsInputs.js'

const scripter = new WfbxScripter(BehaveModules, BehaveConfigs, BehaveState, BehaveInputs)
scripter.run()
console.log(scripter.logScript())
console.log(scripter.logCallSequence())
