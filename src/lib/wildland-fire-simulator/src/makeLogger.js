export function makeLogger() {
    return new WfsLogger()
}

export class WfsLogger {
    constructor() {
        this.messages = []
    }
    log(msg) {
        this.messages.push(msg)
    }
}