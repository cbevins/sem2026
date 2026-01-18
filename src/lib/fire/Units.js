export class Units {
    constructor(label, type, spec={}, uom=null) {
        this.label = label
        this.type = type
        this.uom = uom
        this.spec = spec
    }
}

export const compass = new Units('compass degrees', 'real',
    {min:0, max:360}, ['degrees', 'radians'])

export const geocoord = new Units('geo coordinates', 'real',
    {min:-Infinity, max:Infinity}, [''])

export const fireDist = new Units('fire spread distance', 'real',
    {min:0, max:Infinity}, ['ft', 'm', 'mi', 'km', 'ch'])

export const fireLwr = new Units('ellipse length-to-width ratio', 'real',
    {min:1, max:100}, ['ratio'])

export const fireRos = new Units('fire spread rate', 'real',
    {min:0, max:10000}, ['ft/min', 'm/s', 'm/min', 'mi/h', 'km/h', 'ch/h'])

export const fireTime = new Units('elapsed time since ignition', 'real',
    {min:0, max:60*24*360}, ['min', 'h'])
    
export const fireVhr = new Units('fire vector-to-head ratio', 'real',
    {min:0, max:Infinity}, ['ratio'])
