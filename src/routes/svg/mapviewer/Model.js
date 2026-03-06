export class Model {
    constructor(rate=0.5, time=1, ignx=0, igny=0) {
        this.rate = rate
        this.time = time
        this.a = rate * time
        this.b = rate * time
        this.ignition = {x: ignx, y: igny}
        this.center = {x: ignx, y: igny}
        this.head = {x: this.a, y: 0}
        this.back = {x: -this.a, y: 0}
    }
}