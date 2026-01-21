export class Units {
    constructor(label, type, spec={}, uom=null) {
        this.label = label
        this.type = type
        this.uom = uom
        this.spec = spec
    }
}

export const compass = new Units('compass degrees', 'real',
    {ge:0, lt:360}, ['degrees', 'radians'])

export const fireCoord = new Units('fire ellipse coordinates', 'real',
    {ge:-Infinity, le:Infinity}, [''])

export const fireDist = new Units('fire spread distance', 'real',
    {ge:0, le:Infinity}, ['ft', 'm', 'mi', 'km', 'ch'])

export const fireEccent = new Units('ellipse eccentricity', 'real',
    {ge:0, lt:1}, ['ratio'])

export const fireLwr = new Units('ellipse length-to-width ratio', 'real',
    {ge:1, le:100}, ['ratio'])

export const fireRos = new Units('fire spread rate', 'real',
    {ge:0, le:10000}, ['ft/min', 'm/s', 'm/min', 'mi/h', 'km/h', 'ch/h'])

export const fireTime = new Units('elapsed time since ignition', 'real',
    {ge:0, le:60*24*360}, ['min', 'h'])
    
export const fireVhr = new Units('fire vector-to-head ratio', 'real',
    {ge:0, le:Infinity}, ['ratio'])

export const geoCoord = new Units('geo coordinates', 'real',
    {ge:-Infinity, le:Infinity}, [''])
