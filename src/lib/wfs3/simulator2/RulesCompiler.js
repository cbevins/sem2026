export class RulesCompiler {
    constructor() {
        this.stack = new Set()
        this.reqInputs = new Set()
        this.reqMethods = new Set()
        this.nextStack = []
    }

    compile(rules, configs, topRuleKey) {
        this.stack = new Set()
        this.reqInputs = new Set()
        this.reqMethods = new Set()
        this.nextStack = []
        this.#compile(rules, configs, topRuleKey)
        this.#unwindNextStack()
    }

    #compile(rules, configs, rulesKey) {
        const block = [true]
        let active = true
        if(!Object.hasOwn(rules, rulesKey))
            throw new Error(`There is no rule with key='${rulesKey}'.`)
        for(let line of rules[rulesKey]) {
            const args = line.split(' ')
            const cmd = args[0]

            // 'if config value' pushes the block stack
            // and if config===value, the block is set active
            // otherwise the block lines are ignored until the enclosing 'endif'
            if (cmd === 'if') {
                const [, cfgKey, cfgVal] = args
                if(!Object.hasOwn(configs, cfgKey))
                    throw new Error(`Rule '${rulesKey}' line '${line}' has invalid config key '${cfgKey}'.`)
                active = configs[cfgKey] === cfgVal
                block.push(active)
            }

            // 'elseif' pops the block stack and pushes a new block
            else if (cmd === 'elseif') {
                const [, cfgKey, cfgVal] = args
                if(!Object.hasOwn(configs, cfgKey))
                    throw new Error(`Rule '${rulesKey}' line '${line}' has invalid config key '${cfgKey}'.`)
                block.pop()
                active = configs[cfgKey] === cfgVal
                block.push(active)
            }

            // 'else' pops the block stack and pushes a new ACTIVE block
            else if (cmd === 'else') {
                block.pop()
                active = true
                block.push(active)
            }

            // 'endif' pops the block stack
            else if (cmd === 'endif') {
                block.pop()
                active = block[block.length-1]
            }

            // 'call object.method'
            else if (cmd === 'call') {
                const [object, method] = args[1].split('.')
                // Test object.method presence and existence here?
                const fullName = `${object}.${method}`
                if (active) {
                    this.stack.add(`call ${fullName}`)
                    this.reqMethods.add(fullName)
                }
            }

            // 'next object.property'
            else if (cmd === 'next') {
                const prop = args[1]
                if (active) {
                    const stackItem = `next ${prop}`
                    if (! this.stack.has(stackItem)) {
                        this.stack.add(stackItem)
                        this.reqInputs.add(prop)
                        this.nextStack.push([prop, this.stack.size-1])
                    }
                }
            }
            
            // 'apply rulesKey' processes the specified rules.rulesKey lines
            else if (cmd === 'apply') {
                const applyKey = args[1]
                if(!Object.hasOwn(rules, applyKey))
                    throw new Error(`Rule '${rulesKey}' line '${line}' references unknown rule '${applyKey}'.`)
                if (active) {
                    this.#compile(rules, configs, applyKey)
                }
            }

            // 'report inputKey' where inputKet is the most recent 'next'
            else if (cmd === 'report') {
                const inputKey = args[1]
                if (active) {
                    this.stack.add(`report ${inputKey}`)
                }
            }

            else {
                throw new Error(`Module '${rulesKey}' has invalid command '${cmd}'.`)
            }
        }
    }
    #unwindNextStack() {
        while(this.nextStack.length) {
            const [key, idx] = this.nextStack.pop()
            this.stack.add(`loop ${key} ${idx}`)
        }
    }

    // Returns all the configurations mentions in rules
    getConfigs(rules) {
        const configSet = new Set()
        for(let rulesKey of Object.keys(rules)) {
            for(let line of rules[rulesKey]) {
                const [cmd, config, value] = line.split(' ')
                if (cmd === 'if' || cmd === 'elseif') {
                    configSet.add(`${config} ${value}`)
                }
            }
        }
        return [...configSet].sort()
    }

    getStateSkeleton() {
        const propSet = new Set()
        for(let item of this.stack) {
            const [cmd, objectProp] = item.split(' ')
            if (cmd === 'call') {
                const keys = objectProp.split('.')
                propSet.add(keys[0])
            } else if (cmd === 'next') {
                const keys = objectProp.split('.')
                propSet.add(keys[0])
            }
        }
        const props = [...propSet].sort()
        const state = {}
        for (let prop of props) {
            state[prop] = {}
        } 
        return state
    }
}