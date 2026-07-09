export function logRuleConfigs(rules) {
    const configs = {}
    for(let key of Object.keys(rules)) {
        for(let line of rules[key]) {
            let [cmd, key, value] = line.split(' ')
            if(cmd==='if' || cmd === 'elseif') {
                if(!Object.hasOwn(configs, key))
                    configs[key] = new Set()
                configs[key].add(value)
            }
        } 
    }
    let str = '\n// All configuration keys and values mentioned in rules:\n'
    str += 'this.configDictionary = {\n'
    const keys = Object.keys(configs)
    for(let key of keys.sort()) {
        const values = "['" + [...configs[key]].join("', '") + "']"
        str += `    ${key}: ${values},\n`
    }
    str += ']\n'
    console.log(str)
}

export function logRuleInputs(rules) {
    const inputs = new Set()
    for(let key of Object.keys(rules)) {
        for(let line of rules[key]) {
            let [cmd, prop] = line.split(' ')
            if(cmd==='each') inputs.add(prop)
        } 
    }
    console.log('\nAll Input Properties Mentioned In Rules:')
    const ar = [...inputs]
    let str = 'this.inputs = {\n'
    for(let prop of ar.sort())
        str += `    ${prop}: [],\n`
    str += '}\n'
    console.log(str)
}

export function logRuleMethods(rules) {
    const methods = new Set()
    for(let key of Object.keys(rules)) {
        for(let line of rules[key]) {
            let [cmd, method] = line.split(' ')
            if(cmd==='call') methods.add(method)
        } 
    }
    let str ='\nAll Methods Mentioned In Rules:'
    str += 'export class State {\n'
    str += '    constructor() {\n'
    str += '        this.fuelCatalog = new FuelCatalog()\n'
    str += '        this.fuelCuring = null\n'
    str += '    }\n'
    const ar = [...methods]
    for(let method of ar.sort()) {
        str +=`    ${method}() {}\n`
    }
    console.log(str)
}
export function logScript(script) {
    const color = {
        each: "\x1b[32m", // green
        call: "\x1b[36m", // cyan
        next: "\x1b[32m", // green
    }
    let idx = 0
    let depth = 0
    let str = '\nExecution Script\n'
    for(let line of script) {
        let [cmd] = line.split(' ')
        if (cmd==='next') depth--
        str += (''+idx++).padStart(2)+' '   // line index
        str += ''.padStart(2*depth)   // indent
        str += color[cmd] + line + "\x1b[0m\n"
        if (cmd==='each') depth++
    }
    str += '\n'
    console.log(str)
}
