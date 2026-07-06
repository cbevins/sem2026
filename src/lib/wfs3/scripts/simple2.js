import {BehaveRules2, BehaveConfigs2, RulesCompiler2, sortedTable } from '../Wfs.js'

const compiler = new RulesCompiler2()
// console.log(compiler.getConfigs(BehaveRules))
compiler.compile(BehaveRules2, BehaveConfigs2, 'fireBehavior')
console.log(compiler.stack)