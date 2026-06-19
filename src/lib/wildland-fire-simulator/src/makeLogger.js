export function makeLogger(limit=1000, throwOnLimit=true) {
    return new WfsLogger(limit, throwOnLimit)
}

export class WfsLogger {
    constructor(limit=1000, throwOnLimit=true) {
        this.active = true
        this.limit = limit
        this.messages = []
        this.throwOnLimit = throwOnLimit
    }
    log(msg) {
        if (this.active) {
            if (this.messages.length >= this.limit) {
                if (this.throwOnLimit) {
                    throw  new Error(`WfsLogger reached its limit of ${this.limit} messages.`)
                }
                this.messages.push(msg)
            }
        }
    }
    last() {
        const idx = this.messages.length - 1
        return (idx >= 0) ? this.messages[idx] : ''
    }
    length() {
        return this.messages.length
    }
    start() {
        this.active = true
    }
    stop() {
        this.active = false
    }
}