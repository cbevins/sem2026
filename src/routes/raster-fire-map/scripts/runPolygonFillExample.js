import { FireMap, polygonFill } from '../index.js'

// Draws ascii pix of a FireMap
function asciiFireMap(fireMap) {
    let hdr1 = '   '
    let hdr2 = '   '
    for(let col=0; col<fireMap.cols; col++) {
        hdr1 += ' '+(Math.trunc(col/10))
        hdr2 += ' '+(col%10)
    }
    hdr1 += '\n'
    hdr2 += '\n'

    let str = '\n\n\n\n' + hdr1 + hdr2
    for(let row=0; row<fireMap.rows; row++) {
        str += (''+row).padStart(3)
        for(let col=0; col<fireMap.cols; col++)
            str += fireMap.get(col, row) ? ' █' : ' .'
        str += (''+row).padStart(3) + '\n'
    }
    return str + hdr1 + hdr2
}

//-------------------------------------------------------------------------------------

// Define a 5-pointed star with center at 50,50
// an outer circle radius of 23 and an inner radius of 9
const star5 = [
    [25, 2], [30, 18], [47, 18], [34, 28], [39, 44],
    [25, 34], [11, 44], [16, 28], [3, 18], [20, 18]
]

//-------------------------------------------------------------------------------------
let fireMap = new FireMap(50, 50)
let t0 = performance.now()
let reps = 10000
for(let i=0; i<reps; i++) {
    polygonFill(fireMap, star5)
}
console.clear()
console.log(asciiFireMap(fireMap))
console.log(`${reps} reps of polygonFill() averaged ${((performance.now() - t0)/reps).toFixed(2)} msec/rep`)
