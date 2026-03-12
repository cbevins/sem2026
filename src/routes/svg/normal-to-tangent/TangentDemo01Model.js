import { FireGeometry } from "$lib/index.js"
export class TangentDemo01Model {
    constructor() {
        this.triplets = [
            [{east: 100, north: 100}, {east: 200, north: 100}, {east: 200, north: 200}],
            [{east: 100, north: 400}, {east: 400, north: 200}, {east: 300, north: 200}]
        ]
        this.constructCircularPerim(0, 0, 300, 15)
    }

    constructCircularPerim(ctrEast, ctrNorth, radius, degStep=15) {
        this.circularPerim = []
        this.modifiedPerim = []
        for (let bearing=0; bearing<360; bearing+=degStep) {
            const {east, north} = FireGeometry.vectorEndpoint(
                ctrEast, ctrNorth, bearing, radius)
            this.circularPerim.push({east, north, bearing})
            this.modifiedPerim.push({east, north, bearing})
        }
        const p0 = this.circularPerim[0]
        const p1 = this.circularPerim[1]
        this.spacing = Math.sqrt((p0.east-p1.east)**2+(p0.north-p1.north)**2)
        // console.log('Original perimeter point spacing is', this.spacing)
        this.modifyPerim()
    }

    // Modifies the circular perimeter at specific points
    // to create a perimeter that tests robustness and edge cases
    modifyPerim() {
        this.modifiedPerim[5].east = 100
        this.modifiedPerim[10] = {east: 400, north: -400}
        this.modifiedPerim[15] = {east: -100, north:-100}

        // Create a horizontal segment
        this.modifiedPerim[13].north = this.modifiedPerim[12].north

        // Create a co-linear segment
        this.modifiedPerim[14].north = this.modifiedPerim[12].north
        this.modifiedPerim[21].east = this.modifiedPerim[22].east
        this.modifiedPerim[23].east = this.modifiedPerim[22].east

        // Create a vertical segment
        this.modifiedPerim[19].east = this.modifiedPerim[20].east
    }
}