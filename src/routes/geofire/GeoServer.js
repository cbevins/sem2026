export const FirePacket = {headRos: 25, bearing: 90, lwr: 2}

export class GeoServer {
    constructor() {}
    getFireBehavior(col, row, time) {
        return {...FirePacket}
    }
}