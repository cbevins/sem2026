/**
 * Fire growth model for a simple single-point ignition fire
 * under uniform fuel conditions and no-wind, no-slope.
 * 
 * But it does implement perimeter expansion via Huygen's Principle
 */
export class FireGrowth02Model {
    constructor(radiusInit=200, radiusStep=50, degStep=15, ignEast=0, ignNorth=0) {
        this.ign = {east: ignEast, north: ignNorth}
        this.perims = []                // array of perimeters at each time step
        this.radiusInit = radiusInit    // initial fire radius
        this.radiusStep = radiusStep    // radius increase at each time step
        this.degStep = degStep          // degrees between each perimeter point
        this.initPerims()
    }

    // Adds the next perimeter
    grow(steps=1) {
        for(let i=0; i<steps; i++) {
            const prev = this.perims[this.perims.length-1]
            const next = []
            for (let {east, north, bearing} of prev) {
                const v = this.vectorEndpoint(east, north, bearing, this.radiusStep)
                next.push({east: v.east, north: v.north, bearing})
            }
            this.perims.push(next)
        }
    }

    // Creates the initial perimeter
    initPerims() {
        const perim = []
        for (let bearing=0; bearing<360; bearing+=this.degStep) {
            const {east, north} = this.vectorEndpoint(0, 0, bearing, this.radiusInit)
            perim.push({east, north, bearing})
        }
        this.perims = [perim]
    }

    // Returns {east, north} coordinates of vector at some distance
    vectorEndpoint(easting, northing, bearing, distance) {
        const radians = bearing * Math.PI / 180
        return {
            east: easting + distance * Math.sin(radians),
            north: northing + distance * Math.cos(radians)
        }
    }

}