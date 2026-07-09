import { BehavePlusRules } from './BehavePlusRules.js'
import { FullSurfaceConfig } from './Configs.js'
import { ScriptCompiler } from './ScriptCompiler.js'
import { logRuleConfigs, logRuleInputs, logRuleMethods, logScript } from './utils.js'

// logRuleMethods(BehavePlusRules)
// logRuleConfigs(BehavePlusRules)
// logRuleInputs(BehavePlusRules)
const compiler = new ScriptCompiler()
compiler.compile(BehavePlusRules, FullSurfaceConfig, 'surfaceFire')
logScript(compiler.script)