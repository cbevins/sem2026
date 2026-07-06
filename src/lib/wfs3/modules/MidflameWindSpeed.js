export class MidflameWindSpeed {
    constructor() {
        this.midflameWindSpeed = 0
        this.midflameWrsf = 1
        this.windSpeed20ft = 0
    }
    update(state) {
        this.midflameWsrf = state.midflameWsrf.midflameWsrf
        this.windSpeed20ft = state.windSpeed.windSpeed20ft
        this.midflameWindSpeed = this.windSpeed20ft * this.midflameWrsf
    }
}
