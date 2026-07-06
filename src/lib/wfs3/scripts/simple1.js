import {BehaveRules, BehaveConfigs, RulesCompiler, sortedTable } from '../Wfs.js'

const compiler = new RulesCompiler()
// console.log(compiler.getConfigs(BehaveRules))
compiler.compile(BehaveRules, BehaveConfigs, 'primaryFireBehavior')
console.log(compiler.stack)