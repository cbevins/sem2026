import { WfsBuilder } from './WfsBuilder.js'

export class WfsRunner {
    constructor(configs) {
        this.configs = configs
        this.builder = new WfsBuilder()
        this.builder.build(configs)
        // Turn WfsBuilder.stack into an array
        this.stack = [...this.builder.stack]
        this.requiredInputs = this.getSubjects('get')
        this.requiredMethods = this.getSubjects('call')
    }
    
    // inputValues is a flat object like:
    // const inputValue = {
    //     propertyKey: [val0, val1, val2 ...],
    //}
    execute(inputValues={}, callback=null) {
        this.inputValues = inputValues
        this.callback = callback
        const state = {}

        // ensure inputValues has all necessary inputs
        for(let key of this.requiredInputs) {
            if (! Object.hasOwn(inputValues, key))
                throw new Error(`WfsRunner inputValues is missing required property '${key}'.`)
            state[key] = inputValues[key]
        }

        let input = {...inputValues}  // this will be mutated
        let ptr = 0
        const last = this.stack.length - 1
        while(ptr <= last) {
            const [cmd, prop, id=0] = this.stack[ptr].split(' ')
            let msg = ''
            if (cmd === 'get') {
                state[prop] = input[prop].shift()
                msg = `${prop} set to '${state[prop]}'`
                ptr++
            } else if (cmd === 'call') {
                msg = `apply(${prop}, this.state)`
                ptr++
            } else if (cmd === 'store') {
                msg = `apply(callback, this.state)`
                ptr++
            } else if (cmd === 'next') {
                if (input[prop].length) {
                    ptr = id
                    msg = `next ${prop} at ${id}`
                } else {
                    ptr++
                    msg = `done ${prop} at ${id}`
                }
            }
            console.log(msg)
        }
    }

    getSubjects(verb) {
        const found = []
        for(let action of this.stack) {
            const [cmd, subject] = action.split(' ')
            if (cmd === verb)
                found.push(subject)
        }
        return found
    }
}
