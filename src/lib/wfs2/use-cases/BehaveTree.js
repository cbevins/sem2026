import { BehaveConfigs, BehaveProps } from "./BehaveProps.js"

const always = 'always'

export class BehaveTree {
    constructor() {
        // Current configuration (determines which methods are called to update properties)
        this.configs = this.makeConfigs()
        
        // A BehaveProps-like object that contains JUST the method and args 
        // for *all* props under the current configuration
        this.props = {}
        
        // client selected outputs
        this.outputs = ['fireBehavior.headingSpreadRate', 'fireBehavior.bearing']

        // Array of modules that are 'active' because the user has requested
        // one or more of their properties as outputs
        // Generated from this.outputs
        this.selected = []
        
        // Object like this.props, but contains just the active props
        // for the current configuration and selection
        this.active = {}

        // Toplogical order for processing this.active props
        this.topo = new Map()   // recreated by select()

        this.#validate()
        this.configure()    // creates/updates this.props
        this.setOutputs(this.outputs)
    }

    // informational access to all methods mentioned in BehaveProps
    getMethods() {
        const methodSet = new Set()
        for(let [entry] of Object.values(BehaveProps)) {
            for(let {method} of entry.producers) {
                methodSet.add(method)
            }
        }
        return methodSet
    }
    
    // Makes a prototypal configs object from the BehaveConfigs definitions
    makeConfigs() {
        const configs = {}
        for(let [key, entry] of Object.entries(BehaveConfigs))
            configs[key] = entry.value
        return configs
    }

    //--------------------------------------------------------------------------
    // Configuration and topological sorting
    //--------------------------------------------------------------------------

    // Creates a BehaveProps-like structure with JUST the active configs
    configure(newConfigs={}) {
        // 1 - validate the configuration
        const configs = {...this.configs, ...newConfigs}
        for(let [key, value] of Object.entries(configs)) {
            if (! Object.hasOwn(BehaveConfigs, key))
                throw new Error(`Config '${key}' is unknown config.`)
            else if (! BehaveConfigs[key].options.includes(value))
                throw new Error(`Config '${key}' value '${value}' is unknown config value.`)
        }
        this.configs = configs

        // 2 - determine each props producer under this configuration
        this.props = {}
        for(let [key, prop] of Object.entries(BehaveProps)) {
            for(let {method, args, when} of prop.producers) {
                const [cfgKey, value] = when.split('=')
                if (cfgKey === always || configs[cfgKey] === value) {
                    this.props[key] = {method, args, consumers: []}
                    break
                }
            }
        }

        // 3 - determine the consumers of each property
        for(let [key, prop] of Object.entries(this.props)) {
            const {method, args} = prop
            if (method === 'link') {
                const provider = args[0]
                this.props[provider].consumers.push(key)
            }
            else if (prop.method == 'fixed') {
                // 'fixed' args are scalars, not property keys
            }
            else {    
                for(let provider of args) {
                    if (! Object.hasOwn(this.props, provider))
                        throw new Error(`Prop '${key}' consumes unknown provider prop '${provider}' for method '${method}'`)
                    this.props[provider].consumers.push(key)
                }
            }
        }
        this.#dfsSort(this.selected)
    }

    #dfsSort(selected) {
        this.topo = new Map()
        // Start from each selected/active node
        for(const node of selected)
            this.#_dfsSort(node, 0)
    }
    #_dfsSort(node, level) {
        if (! this.topo.has(node))
            this.topo.set(node, level)
        else
            this.topo.set(node, Math.max(level, this.topo.get(node)))

        const {method, args} = this.props[node]
        let neighbors = args
        if (method === 'fixed')
            neighbors = []
        else if (method === 'link')
            neighbors = [args[0]]
        for (const neighbor of neighbors)
            this.#_dfsSort(neighbor, level+1)
    }

    //--------------------------------------------------------------------------
    // Setting outputs and activating properties
    //--------------------------------------------------------------------------
    
    // array like [fireBehavior.headingSpreadRate, fireBehavior.bearing]
    setOutputs(outputs) {
        const selected = new Set()
        this.outputs = outputs
        for(let item of outputs) {
            const [key, prop] = item.split('.')
            selected.add(key)
        }
        this.#activate([...selected])
    }
    
    // Takes list of selected modules and activates all their inputs as well
    #activate(selected) {
        this.selected = selected
        // Copy *selected* props *and* their inputs into this.active
        this.active = {}
        for(let key of this.selected)
            this.#_activate(key)
        this.#dfsSort(this.selected)
    }

    #_activate(key) {
        this.active[key] = this.props[key]
        const {method, args} = this.props[key]
        if (method === 'fixed' || method === 'input') {
            /* nothing */
        } else if (method === 'link') {
            this.#_activate(args[0])
        } else {
            for(let arg of args)
                this.#_activate(arg)
        }
    }
    //--------------------------------------------------------------------------

    // Validates the BehaveProps definitions for key cross-references and configuration values
    #validate() {
        for(let [prop, entry] of Object.entries(BehaveProps)) {
            for(let {method, args, when} of entry.producers) {
                if (method === 'link') {
                    // Do NOT validate the second arg, which is the linked object's property
                    // and unknown to the tree (COULD check it once the object is created)
                    if (! Object.hasOwn(BehaveProps,args[0]))
                        console.log(`Prop '${prop}' method '${method}' arg '${args[0]}' is unknown property.`)
                }
                else if (method === 'fixed') {
                    /* arg could be an object or a scala value */
                }
                else if (method === 'input' && args.length) {
                    console.log(`Prop '${prop}' method '${method}' should not have any arguments.`)
                }
                else {
                    for(let arg of args) {
                        if (! Object.hasOwn(BehaveProps, arg))
                            console.log(`Prop '${prop}' method '${method}' arg '${arg}' is unknown property.`)
                    }
                }
                // Validate all the configuration conditions
                if (when !== always) {
                    const [config, value] = when.split('=')
                    if (! Object.hasOwn(BehaveConfigs, config))
                        console.log(`Prop '${prop}' method '${method}' config '${config}' is unknown config.`)
                    else if (! BehaveConfigs[config].options.includes(value))
                        console.log(`Prop '${prop}' method '${method}' config '${config}' value '${value}' is unknown config value.`)
                }
            }
        }
    }
}

//---------------------------------------------------------------------------

const bp = new BehaveTree()

// UI updates the configuration
let configs = bp.makeConfigs()  // mock config object from UI
console.log(bp.topo)
bp.setOutputs(['fireBehavior.lengthToWidth'])
console.log(bp.outputs)