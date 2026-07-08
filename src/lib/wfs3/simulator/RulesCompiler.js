export class RulesCompiler {
    constructor() {
        this.stack = new Set()
        this.reqInputs = new Set()
        this.reqMethods = new Set()
        this.reqModules = new Set()
    }

    compile(rules, configs, startModule) {
        this.stack = new Set()
        this.reqInputs = new Set()
        this.reqMethods = new Set()
        this.reqModules = new Set()
        this._compile(rules, configs, startModule)
    }

    _compile(rules, configs, moduleKey) {
        this.reqModules.add(moduleKey)
        const block = [true]
        let active = true
        if(!Object.hasOwn(rules, moduleKey))
            throw new Error(`There is no module '${moduleKey}'.`)
        for(let line of rules[moduleKey]) {
            const args = line.split(' ')
            const cmd = args[0]

            // 'if config value' pushes the block stack
            // and if config===value, the block is set active
            // otherwise the block lines are ignored until the enclosing 'endif'
            if (cmd === 'if') {
                const [, cfgKey, cfgVal] = args
                if(!Object.hasOwn(configs, cfgKey))
                    throw new Error(`Module '${moduleKey}' line '${line}' has invalid config key '${cfgKey}'.`)
                active = configs[cfgKey] === cfgVal
                block.push(active)
            }

            // 'endif' pops the block stack
            else if (cmd === 'endif') {
                block.pop()
                active = block[block.length-1]
            }

            // 'call method' calls Function[moduleKey].method()
            else if (cmd === 'call') {
                if (active) {
                    const method = moduleKey + '.' + args[1]
                    this.stack.add(`call ${method}()`)
                    this.reqMethods.add(method)
                }
            }

            // 'input propKey' sets input.propKey
            else if (cmd === 'input') {
                if (active) {
                    this.stack.add(`input ${args[1]}`)
                    this.reqInputs.add(args[1])
                }
            }

            // 'use moduleKey' compiles rules.moduleKey
            else if (cmd === 'use') {
                if (active) {
                    this._compile(rules, configs, args[1])
                }
            }
            
            else {
                throw new Error(`Module '${moduleKey}' has invalid command '${cmd}'.`)
            }
        }
    }

    // Returns all the configurations mentions in rules
    getConfigs(rules) {
        const configSet = new Set()
        for(let module of Object.keys(rules)) {
            for(let line of rules[module]) {
                const [cmd, config, value] = line.split(' ')
                if (cmd === 'if') {
                    configSet.add(`${config} ${value}`)
                }
            }
        }
        return [...configSet].sort()
    }
}