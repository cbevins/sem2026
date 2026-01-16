export class Units {
    constructor(keys) {
        this.keys = keys
    }
}

export const compass = new Units(['degrees', 'radians'])
export const coordinate = new Units([''])
export const fireDist = new Units(['ft', 'm', 'mi', 'km', 'ch'])
export const fireRos = new Units(['ft/min', 'm/s', 'm/min', 'mi/h', 'km/h', 'ch/h'])
export const fireVhr = new Units(['ratio'])
