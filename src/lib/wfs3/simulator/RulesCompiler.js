export class RulesCompiler {
    constructor() {
        this.stack = new Set()
    }

    /**
     * @param {object} rules A rules object
     * @param {*} startModule Starting key of the rules object
     */
    compile(rules, configs, startModule) {
        this.stack = new Set()
        this._compile(rules, configs, startModule)
    }

    _compile(rules, configs, module) {
        const block = [true]
        if(!Object.hasOwn(rules, module))
            throw new Error(`There is no module '${module}'.`)
        for(let line of rules[module]) {
            const args = line.split(' ')
            const cmd = args[0]
            if (cmd === 'if') {
                const [, cfgKey, cfgVal] = args
                if(!Object.hasOwn(configs, cfgKey))
                    throw new Error(`Module '${module}' line '${line}' has invalid config key '${cfgKey}'.`)
                block.push(configs[cfgKey] === cfgVal)
            }
            else if (cmd === 'endif') {
                block.pop()
            }
            else if (cmd === 'call') {
                if (block[block.length-1]) {
                    const who = args[1].split('.')
                    if (who.length < 2)
                        throw new Error(`Module '${module}' line '${line}' must call object.method.`)
                    let [mod, method] = who
                    mod = (mod==='self') ? module : mod
                    this.stack.add(`call ${mod}.${method}()`)
                }
            }
            else if (cmd === 'get') {
                if (block[block.length-1]) {
                    const who = args[1].split('.')
                    if (who.length < 2)
                        throw new Error(`Module '${module}' line '${line}' must get object.prop.`)
                    let [mod, prop, inputKey=''] = who
                    mod = (mod==='self') ? module : mod
                    prop = (prop==='self') ? module : prop
                    if (inputKey==='')  inputKey = prop
                    this.stack.add(`get ${mod}.${prop} from input.${inputKey}`)
                }
            }
            else if (cmd === 'use') {
                if (block[block.length-1]) {
                    this._compile(rules, configs, args[1])
                }
            } else {
                throw new Error(`Module '${module}' has invalid command '${cmd}'.`)
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