import { BehavePlusRules } from './BehavePlusRules.js'
import { BaseConfig } from './Configs.js'
import { ScriptCompiler } from './ScriptCompiler.js'
import { logRuleConfigs, logRuleInputs, logRuleMethods, logScript } from './utils.js'

// logRuleMethods(BehavePlusRules)
// logRuleConfigs(BehavePlusRules)
logRuleInputs(BehavePlusRules)
const compiler = new ScriptCompiler()
compiler.compile(BehavePlusRules, BaseConfig, 'surfaceFire')
// logScript(compiler.script, BaseConfig.summary)