/**
 * Compiles a fire behavior simulation script from a set of rules and a configurations.
 * The compiled script is subsequently assembled into an execution stack.
 */
export class ScriptCompiler {
    constructor() {
        this.script = new Set()
        this.reqInputs = new Set()
        this.reqMethods = new Set()
        this.nextStack = []
        this.state = {}
    }

    compile(rules, configs, topRuleKey) {
        this.script = new Set()
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
            const [cmd, key, value] = line.split(' ')

            // 'if config value' command always pushes the block stack
            // and if config===value, the block is set active
            // otherwise the block lines are ignored until the enclosing 'endif'
            if (cmd === 'if' || cmd === 'elseif') {
                if(!Object.hasOwn(configs, key))
                    throw new Error(`Rule set '${rulesKey}' line '${line}' has invalid config key '${key}'.`)
                // 'elseif' pops the current block before pushing a new block
                if (cmd === 'elseif')
                    block.pop()
                active = (configs[key] === value)
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

            // 'call method' calls the this.state[method]
            else if (cmd === 'call') {
                if (active) {
                    this.script.add(line)
                    this.reqMethods.add(key)
                }
            }

            // 'each property'
            else if (cmd === 'each') {
                if (active) {
                    if (! this.script.has(line)) {
                        this.script.add(line)
                        this.reqInputs.add(key)
                        this.nextStack.push([key, this.script.size-1])
                    }
                }
            }
            
            // 'apply rulesKey' processes the specified this.rules.rulesKey lines
            else if (cmd === 'apply') {
                if(!Object.hasOwn(rules, key)) {
                    throw new Error(`Rule set '${rulesKey}' line '${line}' references unknown rule '${key}'.`)
                }
                if (key === 'fireVector') {
                    let x = 1
                }
                if (active) {
                    this.#compile(rules, configs, key)
                }
            }

            // 'report tag' where inputKey is some one-word token passed to client
            else if (cmd === 'report') {
                if (active)
                    this.script.add(line)
            }

            else {
                throw new Error(`Rule set '${rulesKey}' has invalid command '${cmd}'.`)
            }
        }
    }
    #unwindNextStack() {
        while(this.nextStack.length) {
            const [key, idx] = this.nextStack.pop()
            this.script.add(`next ${key} ${idx}`)
        }
    }
}